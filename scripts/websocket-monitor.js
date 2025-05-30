/**
 * EHB WebSocket Connection Monitor and Auto-Fix
 * 
 * This script monitors all WebSocket connections in the EHB system and automatically
 * fixes connection issues when they occur. It provides a centralized solution for
 * handling WebSocket connectivity problems across all services.
 * 
 * Features:
 * - Monitors connection status of all WebSocket clients
 * - Automatically retries failed connections with exponential backoff
 * - Detects and resolves common WebSocket issues (port conflicts, timeouts, etc.)
 * - Logs connection status and recovery attempts
 * - Provides a standardized interface for WebSocket connections
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const { exec } = require('child_process');

// Configuration
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'websocket-monitor.log');
const CONFIG_FILE = path.join(__dirname, 'websocket-config.json');
const CHECK_INTERVAL = 30000; // Check connections every 30 seconds
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // Start with 5 seconds delay
const INTEGRATION_HUB_URL = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
const WS_INTEGRATION_HUB_URL = process.env.WS_INTEGRATION_HUB_URL || 'ws://localhost:5003/ehb-integration';

// WebSocket is already imported at the top of the file, don't redeclare it

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// WebSocket connections registry
const connections = new Map();
const connectionStatus = new Map();

/**
 * Log a message to console and file
 * @param {string} message Message to log
 * @param {string} level Log level
 */
function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}`;
  
  console.log(logEntry);
  
  try {
    // Ensure log directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    // Append to log file
    fs.appendFileSync(LOG_FILE, logEntry + '\n');
    
    // For critical errors, also log to central error log
    if (level === 'ERROR' || level === 'CRITICAL') {
      const centralErrorLog = path.join(LOG_DIR, 'websocket-errors.log');
      const detailedErrorLog = `[${timestamp}] [${level}] ${message}\n`;
      fs.appendFileSync(centralErrorLog, detailedErrorLog);
    }
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

/**
 * Create a monitored WebSocket connection
 * @param {string} url WebSocket URL
 * @param {string} serviceName Service name
 * @param {Object} options Connection options
 * @returns {WebSocket} WebSocket connection
 */
function createMonitoredConnection(url, serviceName, options = {}) {
  logMessage(`Creating monitored WebSocket connection for ${serviceName} to ${url}`);
  
  let retryCount = 0;
  let ws = null;
  
  const connect = () => {
    try {
      ws = new WebSocket(url, options);
      
      ws.on('open', () => {
        logMessage(`WebSocket connection established for ${serviceName}`);
        connectionStatus.set(serviceName, {
          status: 'connected',
          lastConnected: new Date().toISOString(),
          retries: retryCount,
          url: url
        });
        retryCount = 0;
        
        // Send registration message if this is Integration Hub connection
        if (url.includes('ehb-integration')) {
          ws.send(JSON.stringify({
            type: 'register',
            module: {
              name: serviceName,
              type: options.type || 'system-service',
              url: options.serviceUrl || `http://localhost:${options.port || '5000'}`,
              capabilities: options.capabilities || ['websocket'],
              description: options.description || `${serviceName} service`,
              version: options.version || '1.0.0'
            }
          }));
        }
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          
          // Handle standard message types
          switch (message.type) {
            case 'connected':
              logMessage(`Connection confirmation received for ${serviceName}`);
              break;
              
            case 'registered':
              logMessage(`Successfully registered ${serviceName} with Integration Hub`);
              break;
              
            case 'error':
              logMessage(`Error from server for ${serviceName}: ${message.message}`, 'ERROR');
              break;
              
            default:
              if (options.messageHandler) {
                options.messageHandler(message);
              }
          }
        } catch (error) {
          logMessage(`Error parsing WebSocket message for ${serviceName}: ${error.message}`, 'ERROR');
        }
      });
      
      ws.on('close', () => {
        logMessage(`WebSocket connection closed for ${serviceName}`, 'WARN');
        connectionStatus.set(serviceName, {
          status: 'disconnected',
          lastDisconnected: new Date().toISOString(),
          url: url
        });
        
        // Auto reconnect with exponential backoff
        if (retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount);
          retryCount++;
          logMessage(`Reconnecting ${serviceName} in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`, 'INFO');
          setTimeout(connect, delay);
        } else {
          logMessage(`Max retries (${MAX_RETRIES}) reached for ${serviceName}. Scheduling health check.`, 'ERROR');
          setTimeout(checkServiceHealth, 60000, serviceName);
        }
      });
      
      ws.on('error', (error) => {
        logMessage(`WebSocket error for ${serviceName}: ${error.message}`, 'ERROR');
        
        // Update connection status
        connectionStatus.set(serviceName, {
          status: 'error',
          lastError: new Date().toISOString(),
          errorMessage: error.message,
          errorCode: error.code || 'UNKNOWN',
          url: url,
          retries: retryCount
        });
        
        // Log error details to JSON file for analysis
        try {
          const errorsLogDir = path.join(LOG_DIR, 'websocket-errors');
          if (!fs.existsSync(errorsLogDir)) {
            fs.mkdirSync(errorsLogDir, { recursive: true });
          }
          
          const errorsLogFile = path.join(errorsLogDir, `${serviceName}-errors.json`);
          let errors = [];
          
          // Read existing error log if available
          if (fs.existsSync(errorsLogFile)) {
            try {
              errors = JSON.parse(fs.readFileSync(errorsLogFile, 'utf8'));
            } catch (e) {
              // Start fresh if file is corrupted
              errors = [];
            }
          }
          
          // Add new error and save (keep last 10 errors)
          errors.push({
            timestamp: new Date().toISOString(),
            error: error.message,
            code: error.code,
            url,
            retryCount
          });
          
          if (errors.length > 10) errors = errors.slice(-10);
          fs.writeFileSync(errorsLogFile, JSON.stringify(errors, null, 2));
        } catch (logError) {
          console.error(`Failed to log error details: ${logError.message}`);
        }
        
        // Check for common error types and try to fix them
        if (error.code === 'ECONNREFUSED') {
          logMessage(`Connection refused for ${serviceName}. The server might not be running.`, 'ERROR');
          checkServiceHealth(serviceName);
        } else if (error.code === 'ETIMEDOUT') {
          logMessage(`Connection timed out for ${serviceName}. Network issue or server overloaded.`, 'ERROR');
          setTimeout(() => reconnectService(serviceName), 5000);
        } else if (error.code === 'ECONNRESET') {
          logMessage(`Connection reset for ${serviceName}. Server might have restarted.`, 'ERROR');
          setTimeout(() => reconnectService(serviceName), 2000);
        }
      });
      
      connections.set(serviceName, ws);
      return ws;
    } catch (error) {
      logMessage(`Failed to create WebSocket connection for ${serviceName}: ${error.message}`, 'ERROR');
      return null;
    }
  };
  
  return connect();
}

/**
 * Check if a service is healthy and restart if needed
 * @param {string} serviceName Service name
 */
async function checkServiceHealth(serviceName) {
  logMessage(`Checking health for service: ${serviceName}`, 'INFO');
  
  // Get connection info for this service from the registry
  const connectionInfo = connections.get(serviceName) ? { 
    url: connections.get(serviceName)._url || connections.get(serviceName).url, 
    options: {}
  } : null;
  if (!connectionInfo) {
    logMessage(`No connection info found for ${serviceName}, cannot check health`, 'ERROR');
    return;
  }
  
  // Extract service base URL from WebSocket URL or connection options
  let serviceUrl = '';
  let servicePort = '';
  
  // Try to determine service URL from the WebSocket URL first
  try {
    // Convert WebSocket URL to corresponding HTTP URL for health checks
    const wsUrl = connectionInfo.url;
    if (wsUrl) {
      // Replace ws:// with http:// and wss:// with https://
      const httpUrl = wsUrl.replace(/^ws:\/\//i, 'http://').replace(/^wss:\/\//i, 'https://');
      // Extract hostname and port
      const urlParts = new URL(httpUrl);
      // Remove WebSocket path if present and use base URL
      serviceUrl = `${urlParts.protocol}//${urlParts.hostname}${urlParts.port ? ':' + urlParts.port : ''}`;
      servicePort = urlParts.port || (urlParts.protocol === 'https:' ? '443' : '80');
    }
  } catch (error) {
    logMessage(`Error extracting service URL from WebSocket URL: ${error.message}`, 'WARN');
  }
  
  // Fallback to options if available
  if (!serviceUrl && connectionInfo.options) {
    if (connectionInfo.options.serviceUrl) {
      serviceUrl = connectionInfo.options.serviceUrl;
      try {
        const urlParts = new URL(serviceUrl);
        servicePort = urlParts.port || (urlParts.protocol === 'https:' ? '443' : '80');
      } catch (error) {
        logMessage(`Error parsing service URL from options: ${error.message}`, 'WARN');
      }
    } else if (connectionInfo.options.port) {
      servicePort = connectionInfo.options.port;
      serviceUrl = `http://localhost:${servicePort}`;
    }
  }
  
  // If we still don't have a service URL, try to infer it from the connection name
  if (!serviceUrl) {
    // Map common service names to their known ports
    const knownServicePorts = {
      'EHB-HOME': 5005,
      'EHB-DASHBOARD': 5006,
      'EHB-DASHBOARD-Backend': 5001,
      'EHB-Developer-Portal': 5000,
      'EHB-AI-Dev': 5003,
      'Integration-Hub': 5003,
      'GUI-Launcher': 5050,
      'JPS-Affiliate-Service': 5000
    };
    
    if (knownServicePorts[serviceName]) {
      servicePort = knownServicePorts[serviceName];
      serviceUrl = `http://localhost:${servicePort}`;
    }
  }
  
  // Create a health check record for logging
  const healthCheckRecord = {
    timestamp: new Date().toISOString(),
    service: serviceName,
    serviceUrl: serviceUrl,
    wsUrl: connectionInfo.url,
    actions: []
  };
  
  try {
    // First try to check service health via Integration Hub
    logMessage(`Checking ${serviceName} status via Integration Hub`);
    let hubCheckSuccess = false;
    
    try {
      const response = await axios.get(`${INTEGRATION_HUB_URL}/api/services/${serviceName}/status`, { 
        timeout: 3000 
      });
      
      hubCheckSuccess = true;
      healthCheckRecord.integrationHubCheck = {
        success: true,
        status: response.data.status
      };
      healthCheckRecord.actions.push('hub-check-success');
      
      if (response.data.status === 'running') {
        logMessage(`Service ${serviceName} is running according to Integration Hub. Reconnecting WebSocket.`);
        healthCheckRecord.actions.push('reconnect-ws');
        reconnectService(serviceName);
      } else {
        logMessage(`Service ${serviceName} is not running according to Integration Hub. Attempting restart.`);
        healthCheckRecord.actions.push('restart-service');
        restartService(serviceName);
      }
    } catch (hubError) {
      healthCheckRecord.integrationHubCheck = {
        success: false,
        error: hubError.message
      };
      healthCheckRecord.actions.push('hub-check-failed');
      logMessage(`Integration Hub status check failed for ${serviceName}: ${hubError.message}`, 'WARN');
    }
    
    // If Integration Hub check didn't succeed, try direct checks
    if (!hubCheckSuccess && serviceUrl) {
      logMessage(`Attempting direct health check for ${serviceName} at ${serviceUrl}`);
      healthCheckRecord.actions.push('direct-check-attempt');
      
      // Try common health endpoint patterns
      const healthEndpoints = [
        `${serviceUrl}/health`, 
        `${serviceUrl}/api/health`,
        `${serviceUrl}/status`,
        `${serviceUrl}/api/status`,
        `${serviceUrl}/`
      ];
      
      let directCheckSuccess = false;
      const directCheckResults = [];
      
      for (const endpoint of healthEndpoints) {
        try {
          const response = await axios.get(endpoint, { timeout: 2000 });
          directCheckResults.push({
            endpoint,
            success: response.status >= 200 && response.status < 500,
            status: response.status
          });
          
          if (response.status >= 200 && response.status < 500) {
            directCheckSuccess = true;
            healthCheckRecord.actions.push('direct-check-success');
            logMessage(`Service ${serviceName} is reachable at ${endpoint}. Reconnecting WebSocket.`);
            reconnectService(serviceName);
            break;
          }
        } catch (endpointError) {
          directCheckResults.push({
            endpoint,
            success: false,
            error: endpointError.message
          });
        }
      }
      
      healthCheckRecord.directCheck = {
        success: directCheckSuccess,
        results: directCheckResults
      };
      
      if (!directCheckSuccess) {
        healthCheckRecord.actions.push('direct-check-failed');
        logMessage(`Service ${serviceName} appears to be down (all direct checks failed). Attempting to restart.`, 'ERROR');
        restartService(serviceName);
      }
    }
    
    // Log the health check record
    try {
      const healthCheckDir = path.join(LOG_DIR, 'health-checks');
      if (!fs.existsSync(healthCheckDir)) {
        fs.mkdirSync(healthCheckDir, { recursive: true });
      }
      
      const healthCheckFile = path.join(healthCheckDir, `${serviceName}-health-checks.json`);
      let healthChecks = [];
      
      // Read existing health checks if available
      if (fs.existsSync(healthCheckFile)) {
        try {
          healthChecks = JSON.parse(fs.readFileSync(healthCheckFile, 'utf8'));
        } catch (e) {
          healthChecks = [];
        }
      }
      
      // Add new health check and save (keep last 10 checks)
      healthChecks.push(healthCheckRecord);
      if (healthChecks.length > 10) healthChecks = healthChecks.slice(-10);
      
      fs.writeFileSync(healthCheckFile, JSON.stringify(healthChecks, null, 2));
    } catch (logError) {
      logMessage(`Failed to log health check record: ${logError.message}`, 'ERROR');
    }
  } catch (error) {
    logMessage(`Error during health check for ${serviceName}: ${error.message}`, 'ERROR');
    
    // Last resort fallback - try to restart service
    healthCheckRecord.actions.push('error-during-health-check');
    healthCheckRecord.actions.push('fallback-restart');
    restartService(serviceName);
  }
}

/**
 * Restart a service via Replit workflow or API
 * @param {string} serviceName Service name
 */
function restartService(serviceName) {
  logMessage(`Attempting to restart service: ${serviceName}`);
  
  // Try the API method first as it's more reliable in this environment
  try {
    axios.post(`${INTEGRATION_HUB_URL}/api/workflows/restart`, { name: serviceName })
      .then(() => {
        logMessage(`Restarted ${serviceName} successfully via Integration Hub API`);
      })
      .catch((err) => {
        logMessage(`Failed to restart ${serviceName} via API: ${err.message}`, 'ERROR');
        
        // Fall back to replit-workflows if available
        exec(`replit-workflows restart ${serviceName}`, (error, stdout, stderr) => {
          if (error) {
            logMessage(`Failed to restart ${serviceName} using both methods`, 'ERROR');
          } else {
            logMessage(`Restarted ${serviceName} successfully via replit-workflows command`);
          }
        });
      });
  } catch (err) {
    logMessage(`Error attempting to restart ${serviceName}: ${err.message}`, 'ERROR');
  }
}

/**
 * Reconnect a service's WebSocket
 * @param {string} serviceName Service name
 */
function reconnectService(serviceName) {
  const connectionInfo = connectionStatus.get(serviceName);
  
  if (!connectionInfo) {
    logMessage(`No connection info found for ${serviceName}`, 'ERROR');
    return;
  }
  
  logMessage(`Reconnecting WebSocket for ${serviceName} to ${connectionInfo.url}`);
  
  // Close existing connection if any
  const existingConnection = connections.get(serviceName);
  if (existingConnection) {
    try {
      existingConnection.terminate();
    } catch (error) {
      // Ignore errors when terminating
    }
  }
  
  // Create new connection
  createMonitoredConnection(connectionInfo.url, serviceName, connectionInfo.options);
}

/**
 * Check all WebSocket connections
 */
function checkAllConnections() {
  logMessage('Checking all WebSocket connections');
  
  // Create a status report for logging and potential dashboard display
  const statusReport = {
    timestamp: new Date().toISOString(),
    totalServices: connectionStatus.size,
    connectedServices: 0,
    disconnectedServices: 0,
    errorServices: 0,
    serviceStatuses: []
  };
  
  // Check each connection and take appropriate action
  connectionStatus.forEach((status, serviceName) => {
    // Add to status report
    statusReport.serviceStatuses.push({
      name: serviceName,
      status: status.status,
      lastEvent: status.status === 'connected' ? status.lastConnected : 
                (status.status === 'error' ? status.lastError : status.lastDisconnected),
      retries: status.retries || 0,
      url: status.url
    });
    
    // Update counters
    if (status.status === 'connected') {
      statusReport.connectedServices++;
    } else if (status.status === 'error') {
      statusReport.errorServices++;
    } else {
      statusReport.disconnectedServices++;
    }
    
    // Handle non-connected services
    if (status.status !== 'connected') {
      logMessage(`Found non-connected service: ${serviceName} (Status: ${status.status})`, 'WARN');
      
      // Check if WebSocket object exists and is in correct state
      const ws = connections.get(serviceName);
      if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        // Check if connection is actually active despite the status
        try {
          ws.send(JSON.stringify({ type: 'ping' }));
          logMessage(`Sent ping to ${serviceName} to verify connection status`);
        } catch (error) {
          logMessage(`Failed to send ping to ${serviceName}: ${error.message}`, 'ERROR');
          // Connection is definitely broken, reconnect
          reconnectService(serviceName);
        }
      } else {
        // Connection doesn't exist or is closed, reconnect
        reconnectService(serviceName);
      }
    }
  });
  
  // Log connection status report (useful for monitoring)
  try {
    const reportDir = path.join(LOG_DIR, 'status-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportFile = path.join(reportDir, 'websocket-status.json');
    fs.writeFileSync(reportFile, JSON.stringify(statusReport, null, 2));
    
    // Log summary
    logMessage(`WebSocket Status Summary: Connected: ${statusReport.connectedServices}/${statusReport.totalServices}, Errors: ${statusReport.errorServices}, Disconnected: ${statusReport.disconnectedServices}`);
  } catch (error) {
    logMessage(`Failed to write status report: ${error.message}`, 'ERROR');
  }
}

/**
 * Register a service with WebSocket monitor
 * @param {string} serviceName Service name
 * @param {string} wsUrl WebSocket URL
 * @param {Object} options Connection options
 */
function registerService(serviceName, wsUrl, options = {}) {
  logMessage(`Registering service: ${serviceName} with URL: ${wsUrl}`);
  
  // Set initial connection status
  connectionStatus.set(serviceName, {
    status: 'initializing',
    url: wsUrl,
    options: options,
    registered: new Date().toISOString(),
    reconnectCount: 0,
    lastReconnect: null,
    lastActive: null
  });
  
  // Create the WebSocket connection
  createMonitoredConnection(wsUrl, serviceName, options);
  
  // Generate or update documentation for this service
  try {
    const docsDir = path.join(LOG_DIR, 'documentation');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Create a service registry documentation file
    const serviceRegistryFile = path.join(docsDir, 'services-registry.json');
    let registry = {};
    
    // Read existing registry if available
    if (fs.existsSync(serviceRegistryFile)) {
      try {
        registry = JSON.parse(fs.readFileSync(serviceRegistryFile, 'utf8'));
      } catch (e) {
        registry = {};
      }
    }
    
    // Extract possible HTTP service URL from WebSocket URL
    let serviceUrl = '';
    try {
      const httpUrl = wsUrl.replace(/^ws:\/\//i, 'http://').replace(/^wss:\/\//i, 'https://');
      const urlParts = new URL(httpUrl);
      serviceUrl = `${urlParts.protocol}//${urlParts.hostname}${urlParts.port ? ':' + urlParts.port : ''}`;
    } catch (error) {
      // Ignore URL parsing errors
    }
    
    // Update or add service information
    registry[serviceName] = {
      name: serviceName,
      websocketUrl: wsUrl,
      serviceUrl: serviceUrl || options.serviceUrl || null,
      status: 'registered',
      registeredAt: new Date().toISOString(),
      description: options.description || `WebSocket-enabled service for ${serviceName}`,
      capabilities: options.capabilities || ['websocket'],
      monitored: true,
      autoReconnect: true,
      maxRetries: MAX_RETRIES,
      retryDelay: RETRY_DELAY
    };
    
    // Save updated registry
    fs.writeFileSync(serviceRegistryFile, JSON.stringify(registry, null, 2));
    
    // Create or update a human-readable Markdown documentation file
    const markdownDocsFile = path.join(docsDir, 'websocket-services.md');
    let markdownContent = '# EHB System WebSocket Services\n\n';
    markdownContent += 'This document provides information about WebSocket-enabled services in the EHB system.\n';
    markdownContent += 'The services listed below are automatically monitored and recovered in case of connectivity issues.\n\n';
    
    markdownContent += '## Monitored Services\n\n';
    
    Object.values(registry).forEach(service => {
      markdownContent += `### ${service.name}\n\n`;
      markdownContent += `**WebSocket URL:** \`${service.websocketUrl}\`\n\n`;
      
      if (service.serviceUrl) {
        markdownContent += `**Service URL:** \`${service.serviceUrl}\`\n\n`;
      }
      
      markdownContent += `**Description:** ${service.description}\n\n`;
      markdownContent += `**Capabilities:** ${service.capabilities.join(', ')}\n\n`;
      markdownContent += `**Registered:** ${service.registeredAt}\n\n`;
      markdownContent += `**Auto-Reconnect:** ${service.autoReconnect ? 'Enabled' : 'Disabled'}\n\n`;
      markdownContent += '---\n\n';
    });
    
    markdownContent += '## WebSocket Connection Guide\n\n';
    markdownContent += 'To connect to any of these WebSocket services, use the following code examples:\n\n';
    
    markdownContent += '### Node.js Example\n\n';
    markdownContent += '```javascript\n';
    markdownContent += 'const WebSocket = require(\'ws\');\n\n';
    markdownContent += '// Replace with actual service WebSocket URL\n';
    markdownContent += 'const ws = new WebSocket(\'ws://localhost:PORT/path\');\n\n';
    markdownContent += 'ws.on(\'open\', function open() {\n';
    markdownContent += '  console.log(\'Connected to WebSocket\');\n';
    markdownContent += '  ws.send(JSON.stringify({ type: \'register\', module: { name: \'MyModule\' } }));\n';
    markdownContent += '});\n\n';
    markdownContent += 'ws.on(\'message\', function incoming(data) {\n';
    markdownContent += '  const message = JSON.parse(data);\n';
    markdownContent += '  console.log(\'Received message:\', message);\n';
    markdownContent += '});\n';
    markdownContent += '```\n\n';
    
    markdownContent += '### Browser Example\n\n';
    markdownContent += '```javascript\n';
    markdownContent += '// Determine correct WebSocket protocol (ws:// or wss://) based on HTTP/HTTPS\n';
    markdownContent += 'const protocol = window.location.protocol === \'https:\' ? \'wss:\' : \'ws:\';\n';
    markdownContent += 'const wsUrl = `${protocol}//${window.location.host}/ws-path`;\n\n';
    markdownContent += 'const socket = new WebSocket(wsUrl);\n\n';
    markdownContent += 'socket.onopen = () => {\n';
    markdownContent += '  console.log(\'Connected to WebSocket\');\n';
    markdownContent += '  socket.send(JSON.stringify({ type: \'register\', clientId: \'browser-client\' }));\n';
    markdownContent += '};\n\n';
    markdownContent += 'socket.onmessage = (event) => {\n';
    markdownContent += '  const message = JSON.parse(event.data);\n';
    markdownContent += '  console.log(\'Received message:\', message);\n';
    markdownContent += '};\n';
    markdownContent += '```\n\n';
    
    markdownContent += '## Monitoring and Recovery\n\n';
    markdownContent += 'All WebSocket connections are automatically monitored by the WebSocket Monitor service. ';
    markdownContent += 'If a connection is lost, the system will attempt to reconnect with a progressive backoff strategy. ';
    markdownContent += 'If reconnection fails after multiple attempts, the system will attempt to restart the service.\n\n';
    
    markdownContent += '## Health Checks\n\n';
    markdownContent += 'Health check records are stored in the `logs/health-checks` directory for each service, ';
    markdownContent += 'providing a history of connection status and recovery attempts.\n';
    
    fs.writeFileSync(markdownDocsFile, markdownContent);
    
    logMessage(`Updated WebSocket services documentation`);
  } catch (error) {
    logMessage(`Error generating documentation: ${error.message}`, 'ERROR');
  }
}

/**
 * Initialize services from config or defaults
 */
function initializeServices() {
  logMessage('Initializing WebSocket monitoring for services');
  
  // Load config if exists
  let services = [];
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      if (configData && configData.services && Array.isArray(configData.services)) {
        services = configData.services;
        logMessage(`Loaded configuration for ${services.length} services`);
      } else {
        logMessage('Config file does not contain a valid services array', 'WARN');
      }
    } catch (error) {
      logMessage(`Error loading config: ${error.message}`, 'ERROR');
    }
  }
  
  // If no services from config, use defaults
  if (services.length === 0) {
    logMessage('No valid services found in config, using default services');
    services = [
      { 
        name: 'GUI-Launcher',
        url: WS_INTEGRATION_HUB_URL,
        options: {
          type: 'system-service',
          serviceUrl: 'http://localhost:5050',
          capabilities: ['service-management', 'system-monitoring'],
          description: 'GUI Launcher for managing EHB services',
          port: 5050
        }
      },
      {
        name: 'EHB-AI-Dev',
        url: WS_INTEGRATION_HUB_URL,
        options: {
          type: 'core-service',
          serviceUrl: 'http://localhost:5003',
          capabilities: ['ai', 'integration', 'management'],
          description: 'Core AI and integration service for EHB system',
          port: 5003
        }
      }
    ];
  }
  
  // Register all services
  services.forEach(service => {
    registerService(service.name, service.url, service.options);
  });
}

/**
 * Start the WebSocket monitor
 */
function startMonitor() {
  logMessage('Starting WebSocket Connection Monitor');
  
  // Initialize services
  initializeServices();
  
  // Schedule regular checks
  setInterval(checkAllConnections, CHECK_INTERVAL);
  
  logMessage('WebSocket Connection Monitor started successfully');
}

// Start the monitor
startMonitor();

// Export functions for use by other modules
module.exports = {
  registerService,
  reconnectService,
  checkServiceHealth,
  createMonitoredConnection
};