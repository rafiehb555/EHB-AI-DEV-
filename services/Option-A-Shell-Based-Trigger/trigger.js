#!/usr/bin/env node

/**
 * EHB Shell-Based Trigger
 * 
 * This script provides a command-line interface for triggering EHB workflows,
 * monitoring services, and automating common tasks. It connects to the
 * Integration Hub to perform operations and retrieve status information.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const readline = require('readline');
const { exec } = require('child_process');
const colors = require('colors');

// Configuration
const INTEGRATION_HUB_URL = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
const WS_INTEGRATION_HUB_URL = process.env.WS_INTEGRATION_HUB_URL || 'ws://localhost:5003/ehb-integration';
const SERVICE_NAME = 'EHB-Shell-Trigger';
const LOG_FILE = path.join(__dirname, 'logs', 'shell-trigger.log');
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Color configuration
colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
  header: ['cyan', 'bold'],
  highlight: ['magenta', 'bold'],
  success: ['green', 'bold']
});

// WebSocket connection to Integration Hub
let wsConnection = null;

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'EHB> '.green.bold
});

/**
 * Log a message to console and file
 * @param {string} message Message to log
 * @param {string} level Log level
 */
function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  
  // Console output - only if not in interactive mode
  if (!global.interactiveMode) {
    switch (level.toUpperCase()) {
      case 'ERROR':
        console.log(colors.error(logEntry));
        break;
      case 'WARN':
      case 'WARNING':
        console.log(colors.warn(logEntry));
        break;
      case 'INFO':
        console.log(colors.info(logEntry));
        break;
      case 'DEBUG':
        console.log(colors.debug(logEntry));
        break;
      default:
        console.log(logEntry);
    }
  }
  
  // File output
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error(colors.error(`Failed to write to log file: ${error.message}`));
  }
}

/**
 * Connect to Integration Hub WebSocket
 */
function connectWebSocket() {
  if (wsConnection) {
    wsConnection.terminate();
  }
  
  try {
    wsConnection = new WebSocket(`${WS_INTEGRATION_HUB_URL}?module=${SERVICE_NAME}`);
    
    wsConnection.on('open', () => {
      logMessage('Connected to Integration Hub WebSocket');
      
      // Send registration message
      sendWebSocketMessage({
        type: 'register',
        module: {
          name: SERVICE_NAME,
          type: 'system-service',
          url: INTEGRATION_HUB_URL,
          capabilities: ['shell-trigger', 'command-line'],
          description: 'Shell-based trigger for EHB services',
          version: '1.0.0'
        }
      });
    });
    
    wsConnection.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        handleWebSocketMessage(message);
      } catch (error) {
        logMessage(`Error parsing WebSocket message: ${error.message}`, 'ERROR');
      }
    });
    
    wsConnection.on('close', () => {
      logMessage('WebSocket connection closed, will attempt to reconnect in 5 seconds', 'WARN');
      setTimeout(connectWebSocket, 5000);
    });
    
    wsConnection.on('error', (error) => {
      logMessage(`WebSocket error: ${error.message}`, 'ERROR');
    });
  } catch (error) {
    logMessage(`Error connecting to WebSocket: ${error.message}`, 'ERROR');
    setTimeout(connectWebSocket, 5000);
  }
}

/**
 * Send a message through the WebSocket connection
 * @param {Object} message Message object
 */
function sendWebSocketMessage(message) {
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify(message));
  } else {
    logMessage('Cannot send WebSocket message: connection not open', 'WARN');
  }
}

/**
 * Handle a message received from the WebSocket
 * @param {Object} message Message object
 */
function handleWebSocketMessage(message) {
  switch (message.type) {
    case 'registered':
      logMessage(`Successfully registered with Integration Hub as module ${message.moduleId || SERVICE_NAME}`);
      break;
    
    case 'notification':
      printNotification(message);
      break;
    
    case 'service-update':
      if (global.monitoringServices) {
        printServiceUpdate(message.service);
      }
      break;
    
    case 'error':
      printError(message.message);
      break;
    
    default:
      logMessage(`Unknown message type: ${message.type}`, 'WARN');
  }
}

/**
 * Register with Integration Hub API
 */
async function registerWithIntegrationHub() {
  try {
    logMessage('Registering with Integration Hub...');
    
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/register`, {
      name: SERVICE_NAME,
      url: INTEGRATION_HUB_URL,
      type: 'system-service',
      capabilities: ['shell-trigger', 'command-line'],
      description: 'Shell-based trigger for EHB services',
      version: '1.0.0'
    });
    
    logMessage(`Registered with Integration Hub: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    logMessage(`Failed to register with Integration Hub: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Get services list from Integration Hub
 */
async function getServicesList() {
  try {
    const response = await axios.get(`${INTEGRATION_HUB_URL}/api/modules`);
    return response.data;
  } catch (error) {
    logMessage(`Failed to get services list: ${error.message}`, 'ERROR');
    return {};
  }
}

/**
 * Start a service
 * @param {string} serviceName Service name
 */
async function startService(serviceName) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/start`, {
      name: serviceName
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to start service ${serviceName}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

/**
 * Stop a service
 * @param {string} serviceName Service name
 */
async function stopService(serviceName) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/stop`, {
      name: serviceName
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to stop service ${serviceName}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

/**
 * Restart a service
 * @param {string} serviceName Service name
 */
async function restartService(serviceName) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/restart`, {
      name: serviceName
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to restart service ${serviceName}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

/**
 * Get service status
 * @param {string} serviceName Service name
 */
async function getServiceStatus(serviceName) {
  try {
    const services = await getServicesList();
    return services[serviceName] || { name: serviceName, status: 'unknown' };
  } catch (error) {
    logMessage(`Failed to get service status for ${serviceName}: ${error.message}`, 'ERROR');
    return { name: serviceName, status: 'error', error: error.message };
  }
}

/**
 * Run health check
 */
async function runHealthCheck() {
  try {
    const response = await axios.get(`${INTEGRATION_HUB_URL}/health`);
    return response.data;
  } catch (error) {
    logMessage(`Failed to run health check: ${error.message}`, 'ERROR');
    return { status: 'error', message: error.message };
  }
}

/**
 * Print notification
 * @param {Object} notification Notification object
 */
function printNotification(notification) {
  console.log('\n' + colors.cyan('===== NOTIFICATION ====='));
  console.log(colors.cyan(`From: ${notification.source}`));
  console.log(colors.cyan(`Type: ${notification.notificationType}`));
  console.log(colors.cyan(`Time: ${new Date(notification.timestamp).toLocaleString()}`));
  console.log(colors.cyan('Message:'));
  console.log(colors.white(`  ${notification.message}`));
  console.log(colors.cyan('=======================') + '\n');
  
  rl.prompt();
}

/**
 * Print service update
 * @param {Object} service Service object
 */
function printServiceUpdate(service) {
  const status = service.status === 'running' ? colors.green(service.status) 
               : service.status === 'warning' ? colors.yellow(service.status) 
               : colors.red(service.status);
  
  console.log('\n' + colors.cyan(`Service update: ${service.name} is now ${status}`));
  rl.prompt();
}

/**
 * Print error message
 * @param {string} message Error message
 */
function printError(message) {
  console.log('\n' + colors.red(`ERROR: ${message}`));
  rl.prompt();
}

/**
 * Start interactive shell
 */
function startInteractiveShell() {
  global.interactiveMode = true;
  global.monitoringServices = false;
  
  console.log(colors.header('\n================================================='));
  console.log(colors.header('  EHB Shell-Based Trigger - Interactive Mode'));
  console.log(colors.header('=================================================\n'));
  console.log(colors.info('Type "help" for a list of available commands.'));
  console.log(colors.info('Press Ctrl+C or type "exit" to quit.\n'));
  
  rl.prompt();
  
  rl.on('line', async (line) => {
    const input = line.trim();
    const args = input.split(' ');
    const command = args.shift();
    
    switch (command.toLowerCase()) {
      case 'help':
        showHelp();
        break;
      
      case 'list':
        await listServices();
        break;
      
      case 'start':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing service name. Usage: start <service_name>'));
        } else {
          await startServiceCommand(args[0]);
        }
        break;
      
      case 'stop':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing service name. Usage: stop <service_name>'));
        } else {
          await stopServiceCommand(args[0]);
        }
        break;
      
      case 'restart':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing service name. Usage: restart <service_name>'));
        } else {
          await restartServiceCommand(args[0]);
        }
        break;
      
      case 'status':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing service name. Usage: status <service_name>'));
        } else {
          await getServiceStatusCommand(args[0]);
        }
        break;
      
      case 'monitor':
        toggleMonitorMode();
        break;
      
      case 'health':
        await runHealthCheckCommand();
        break;
      
      case 'fix':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing error type or service name. Usage: fix <error_type> or fix <service_name>'));
        } else {
          await fixErrorCommand(args[0]);
        }
        break;
      
      case 'exec':
        const shellCommand = args.join(' ');
        if (!shellCommand) {
          console.log(colors.error('Error: Missing shell command. Usage: exec <shell_command>'));
        } else {
          await executeShellCommand(shellCommand);
        }
        break;
      
      case 'logs':
        if (args.length === 0) {
          console.log(colors.error('Error: Missing service name. Usage: logs <service_name>'));
        } else {
          await viewServiceLogs(args[0]);
        }
        break;
      
      case 'clear':
        console.clear();
        break;
      
      case 'exit':
      case 'quit':
        console.log(colors.info('Exiting...'));
        process.exit(0);
        break;
      
      case '':
        // Empty command, do nothing
        break;
      
      default:
        console.log(colors.error(`Unknown command: ${command}. Type "help" for a list of available commands.`));
    }
    
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log(colors.info('\nExiting...'));
    process.exit(0);
  });
}

/**
 * Show help message
 */
function showHelp() {
  console.log(colors.header('\nAvailable Commands:'));
  console.log(colors.info('  help              ') + 'Show this help message');
  console.log(colors.info('  list              ') + 'List all services');
  console.log(colors.info('  start <service>   ') + 'Start a service');
  console.log(colors.info('  stop <service>    ') + 'Stop a service');
  console.log(colors.info('  restart <service> ') + 'Restart a service');
  console.log(colors.info('  status <service>  ') + 'Get service status');
  console.log(colors.info('  monitor           ') + 'Toggle monitoring mode');
  console.log(colors.info('  health            ') + 'Run health check on all services');
  console.log(colors.info('  fix <error>       ') + 'Attempt to fix an error');
  console.log(colors.info('  exec <command>    ') + 'Execute a shell command');
  console.log(colors.info('  logs <service>    ') + 'View logs for a service');
  console.log(colors.info('  clear             ') + 'Clear the screen');
  console.log(colors.info('  exit              ') + 'Exit the shell');
}

/**
 * List services
 */
async function listServices() {
  try {
    console.log(colors.header('\nFetching services...'));
    
    const services = await getServicesList();
    
    if (Object.keys(services).length === 0) {
      console.log(colors.warn('No services found.'));
      return;
    }
    
    console.log(colors.header('\nServices:'));
    console.log(colors.header('  Name                     Type            Status   '));
    console.log(colors.header('  ------------------------ --------------- ---------'));
    
    Object.values(services).forEach(service => {
      const name = service.name.padEnd(24);
      const type = (service.type || 'unknown').padEnd(15);
      
      let status;
      switch (service.status) {
        case 'running':
          status = colors.green('running  ');
          break;
        case 'warning':
          status = colors.yellow('warning  ');
          break;
        case 'stopped':
          status = colors.red('stopped  ');
          break;
        default:
          status = colors.gray('unknown  ');
      }
      
      console.log(`  ${name} ${type} ${status}`);
    });
    
    console.log('');
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Start service command
 * @param {string} serviceName Service name
 */
async function startServiceCommand(serviceName) {
  console.log(colors.header(`\nStarting service ${serviceName}...`));
  
  try {
    const result = await startService(serviceName);
    
    if (result.success) {
      console.log(colors.success(`Service ${serviceName} started successfully.`));
    } else {
      console.log(colors.error(`Failed to start service ${serviceName}: ${result.message}`));
    }
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Stop service command
 * @param {string} serviceName Service name
 */
async function stopServiceCommand(serviceName) {
  console.log(colors.header(`\nStopping service ${serviceName}...`));
  
  try {
    const result = await stopService(serviceName);
    
    if (result.success) {
      console.log(colors.success(`Service ${serviceName} stopped successfully.`));
    } else {
      console.log(colors.error(`Failed to stop service ${serviceName}: ${result.message}`));
    }
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Restart service command
 * @param {string} serviceName Service name
 */
async function restartServiceCommand(serviceName) {
  console.log(colors.header(`\nRestarting service ${serviceName}...`));
  
  try {
    const result = await restartService(serviceName);
    
    if (result.success) {
      console.log(colors.success(`Service ${serviceName} restarted successfully.`));
    } else {
      console.log(colors.error(`Failed to restart service ${serviceName}: ${result.message}`));
    }
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Get service status command
 * @param {string} serviceName Service name
 */
async function getServiceStatusCommand(serviceName) {
  console.log(colors.header(`\nGetting status for service ${serviceName}...`));
  
  try {
    const service = await getServiceStatus(serviceName);
    
    console.log(colors.header('\nService Details:'));
    
    if (service.status === 'unknown') {
      console.log(colors.warn(`Service ${serviceName} not found.`));
      return;
    }
    
    if (service.error) {
      console.log(colors.error(`Error: ${service.error}`));
      return;
    }
    
    console.log(colors.info(`  Name:        ${service.name}`));
    console.log(colors.info(`  Type:        ${service.type || 'unknown'}`));
    
    let status;
    switch (service.status) {
      case 'running':
        status = colors.green(service.status);
        break;
      case 'warning':
        status = colors.yellow(service.status);
        break;
      case 'stopped':
        status = colors.red(service.status);
        break;
      default:
        status = colors.gray(service.status);
    }
    
    console.log(colors.info(`  Status:      ${status}`));
    console.log(colors.info(`  Version:     ${service.version || 'unknown'}`));
    console.log(colors.info(`  Description: ${service.description || 'No description available'}`));
    
    if (service.capabilities && service.capabilities.length > 0) {
      console.log(colors.info(`  Capabilities: ${service.capabilities.join(', ')}`));
    }
    
    if (service.url) {
      console.log(colors.info(`  URL:         ${service.url}`));
    }
    
    console.log('');
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Toggle monitor mode
 */
function toggleMonitorMode() {
  global.monitoringServices = !global.monitoringServices;
  
  if (global.monitoringServices) {
    console.log(colors.success('\nMonitoring services. You will receive real-time updates.'));
    console.log(colors.info('Press Enter or type "monitor" again to exit monitoring mode.\n'));
  } else {
    console.log(colors.info('\nExited monitoring mode.\n'));
  }
}

/**
 * Run health check command
 */
async function runHealthCheckCommand() {
  console.log(colors.header('\nRunning health check on all services...'));
  
  try {
    const results = await runHealthCheck();
    
    console.log(colors.header('\nHealth Check Results:'));
    
    if (results.status === 'error') {
      console.log(colors.error(`Error: ${results.message}`));
      return;
    }
    
    for (const [serviceName, result] of Object.entries(results)) {
      let status;
      
      if (result.healthy) {
        status = colors.green('HEALTHY');
      } else {
        status = colors.red('UNHEALTHY');
      }
      
      console.log(`  ${serviceName.padEnd(24)} ${status} ${result.message || ''}`);
    }
    
    console.log('');
  } catch (error) {
    console.log(colors.error(`Error: ${error.message}`));
  }
}

/**
 * Fix error command
 * @param {string} errorTypeOrServiceName Error type or service name
 */
async function fixErrorCommand(errorTypeOrServiceName) {
  console.log(colors.header(`\nAttempting to fix ${errorTypeOrServiceName}...`));
  
  // Check if it's a service name
  const service = await getServiceStatus(errorTypeOrServiceName);
  
  if (service.status !== 'unknown') {
    // It's a service name
    console.log(colors.info(`Attempting to fix service ${errorTypeOrServiceName}...`));
    
    if (service.status === 'stopped') {
      console.log(colors.info(`Service ${errorTypeOrServiceName} is stopped. Attempting to start it...`));
      await startServiceCommand(errorTypeOrServiceName);
    } else if (service.status === 'warning') {
      console.log(colors.info(`Service ${errorTypeOrServiceName} has warnings. Attempting to restart it...`));
      await restartServiceCommand(errorTypeOrServiceName);
    } else if (service.status === 'running') {
      console.log(colors.info(`Service ${errorTypeOrServiceName} is already running.`));
    } else {
      console.log(colors.warn(`Unknown status ${service.status} for service ${errorTypeOrServiceName}.`));
    }
    
    return;
  }
  
  // It's an error type
  switch (errorTypeOrServiceName.toLowerCase()) {
    case 'mongodb':
    case 'mongo':
      console.log(colors.info('Attempting to fix MongoDB connection issues...'));
      console.log(colors.info('Checking MongoDB status...'));
      
      console.log(colors.warn('MongoDB connection issues usually require manual intervention.'));
      console.log(colors.info('Recommendations:'));
      console.log(colors.info('1. Check if MongoDB credentials are correct in environment variables'));
      console.log(colors.info('2. Verify MongoDB service is running'));
      console.log(colors.info('3. Check network connectivity to MongoDB server'));
      break;
    
    case 'econnrefused':
      console.log(colors.info('Attempting to fix connection refused errors...'));
      console.log(colors.info('This issue typically occurs when a service is not running or a port is already in use.'));
      console.log(colors.info('Restarting Integration Hub...'));
      
      await restartServiceCommand('Integration Hub');
      break;
    
    case 'websocket':
      console.log(colors.info('Attempting to fix WebSocket issues...'));
      console.log(colors.info('Restarting Integration Hub...'));
      
      await restartServiceCommand('Integration Hub');
      break;
    
    case 'all':
      console.log(colors.info('Attempting to fix all services...'));
      console.log(colors.info('Restarting Integration Hub...'));
      
      await restartServiceCommand('Integration Hub');
      
      console.log(colors.info('Restarting other services...'));
      
      const services = await getServicesList();
      
      for (const service of Object.values(services)) {
        if (service.name !== 'Integration Hub' && service.status !== 'running') {
          await restartServiceCommand(service.name);
        }
      }
      
      break;
    
    default:
      console.log(colors.warn(`Unknown error type or service: ${errorTypeOrServiceName}`));
      console.log(colors.info('Available error types: mongodb, econnrefused, websocket, all'));
  }
}

/**
 * Execute shell command
 * @param {string} command Shell command
 */
async function executeShellCommand(command) {
  console.log(colors.header(`\nExecuting command: ${command}`));
  
  try {
    const { stdout, stderr } = await execPromise(command);
    
    if (stdout) {
      console.log(colors.info('\nOutput:'));
      console.log(stdout);
    }
    
    if (stderr) {
      console.log(colors.error('\nError:'));
      console.log(stderr);
    }
  } catch (error) {
    console.log(colors.error(`\nError: ${error.message}`));
    
    if (error.stdout) {
      console.log(colors.info('\nOutput:'));
      console.log(error.stdout);
    }
    
    if (error.stderr) {
      console.log(colors.error('\nError:'));
      console.log(error.stderr);
    }
  }
}

/**
 * View service logs
 * @param {string} serviceName Service name
 */
async function viewServiceLogs(serviceName) {
  console.log(colors.header(`\nViewing logs for service ${serviceName}...`));
  
  // Define possible log paths
  const logPaths = [
    path.join(__dirname, '..', '..', 'logs', `${serviceName.toLowerCase()}.log`),
    path.join(__dirname, '..', '..', 'logs', `${serviceName}.log`),
    path.join(__dirname, '..', '..', serviceName, 'logs', 'service.log'),
    path.join(__dirname, '..', '..', 'admin', serviceName, 'logs', 'service.log'),
    path.join(__dirname, '..', '..', 'services', serviceName, 'logs', 'service.log'),
    path.join(__dirname, '..', '..', 'ai-services', serviceName, 'logs', 'service.log')
  ];
  
  // Try each log path
  let logFound = false;
  
  for (const logPath of logPaths) {
    if (fs.existsSync(logPath)) {
      logFound = true;
      
      try {
        // Read last 20 lines of the log file
        const { stdout } = await execPromise(`tail -n 20 "${logPath}"`);
        
        console.log(colors.info(`\nLast 20 lines from ${logPath}:`));
        console.log(stdout);
      } catch (error) {
        console.log(colors.error(`\nError reading log file ${logPath}: ${error.message}`));
      }
      
      break;
    }
  }
  
  if (!logFound) {
    console.log(colors.warn(`No log file found for service ${serviceName}.`));
  }
}

/**
 * Execute promise-based shell command
 * @param {string} command Shell command
 * @returns {Promise<{stdout: string, stderr: string}>} Promise with stdout and stderr
 */
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Process command line arguments
 */
function processCommandLineArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // No arguments, start interactive shell
    startInteractiveShell();
    return;
  }
  
  // Process arguments
  const command = args[0];
  
  switch (command) {
    case 'list':
      getServicesList().then(services => {
        console.log(colors.header('\nServices:'));
        
        if (Object.keys(services).length === 0) {
          console.log(colors.warn('No services found.'));
          return;
        }
        
        Object.values(services).forEach(service => {
          const status = service.status === 'running' ? colors.green(service.status) 
                       : service.status === 'warning' ? colors.yellow(service.status) 
                       : colors.red(service.status);
          
          console.log(`  ${service.name} (${service.type || 'unknown'}): ${status}`);
        });
        
        console.log('');
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
      });
      break;
    
    case 'start':
      if (args.length < 2) {
        console.log(colors.error('Error: Missing service name. Usage: start <service_name>'));
        process.exit(1);
      }
      
      startService(args[1]).then(result => {
        if (result.success) {
          console.log(colors.success(`Service ${args[1]} started successfully.`));
        } else {
          console.log(colors.error(`Failed to start service ${args[1]}: ${result.message}`));
          process.exit(1);
        }
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'stop':
      if (args.length < 2) {
        console.log(colors.error('Error: Missing service name. Usage: stop <service_name>'));
        process.exit(1);
      }
      
      stopService(args[1]).then(result => {
        if (result.success) {
          console.log(colors.success(`Service ${args[1]} stopped successfully.`));
        } else {
          console.log(colors.error(`Failed to stop service ${args[1]}: ${result.message}`));
          process.exit(1);
        }
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'restart':
      if (args.length < 2) {
        console.log(colors.error('Error: Missing service name. Usage: restart <service_name>'));
        process.exit(1);
      }
      
      restartService(args[1]).then(result => {
        if (result.success) {
          console.log(colors.success(`Service ${args[1]} restarted successfully.`));
        } else {
          console.log(colors.error(`Failed to restart service ${args[1]}: ${result.message}`));
          process.exit(1);
        }
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'status':
      if (args.length < 2) {
        console.log(colors.error('Error: Missing service name. Usage: status <service_name>'));
        process.exit(1);
      }
      
      getServiceStatus(args[1]).then(service => {
        console.log(colors.header('\nService Details:'));
        
        if (service.status === 'unknown') {
          console.log(colors.warn(`Service ${args[1]} not found.`));
          process.exit(1);
          return;
        }
        
        if (service.error) {
          console.log(colors.error(`Error: ${service.error}`));
          process.exit(1);
          return;
        }
        
        console.log(colors.info(`  Name:        ${service.name}`));
        console.log(colors.info(`  Type:        ${service.type || 'unknown'}`));
        
        const status = service.status === 'running' ? colors.green(service.status) 
                     : service.status === 'warning' ? colors.yellow(service.status) 
                     : colors.red(service.status);
        
        console.log(colors.info(`  Status:      ${status}`));
        console.log(colors.info(`  Version:     ${service.version || 'unknown'}`));
        console.log(colors.info(`  Description: ${service.description || 'No description available'}`));
        
        if (service.capabilities && service.capabilities.length > 0) {
          console.log(colors.info(`  Capabilities: ${service.capabilities.join(', ')}`));
        }
        
        if (service.url) {
          console.log(colors.info(`  URL:         ${service.url}`));
        }
        
        console.log('');
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'health':
      runHealthCheck().then(results => {
        console.log(colors.header('\nHealth Check Results:'));
        
        if (results.status === 'error') {
          console.log(colors.error(`Error: ${results.message}`));
          process.exit(1);
          return;
        }
        
        for (const [serviceName, result] of Object.entries(results)) {
          const status = result.healthy ? colors.green('HEALTHY') : colors.red('UNHEALTHY');
          console.log(`  ${serviceName.padEnd(24)} ${status} ${result.message || ''}`);
        }
        
        console.log('');
      }).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'fix':
      if (args.length < 2) {
        console.log(colors.error('Error: Missing error type or service name. Usage: fix <error_type> or fix <service_name>'));
        process.exit(1);
      }
      
      fixErrorCommand(args[1]).catch(error => {
        console.log(colors.error(`Error: ${error.message}`));
        process.exit(1);
      });
      break;
    
    case 'interactive':
    case 'shell':
      startInteractiveShell();
      break;
    
    case 'help':
      console.log(colors.header('\nEHB Shell-Based Trigger - Command Line Usage:'));
      console.log(colors.info('  node trigger.js list              ') + 'List all services');
      console.log(colors.info('  node trigger.js start <service>   ') + 'Start a service');
      console.log(colors.info('  node trigger.js stop <service>    ') + 'Stop a service');
      console.log(colors.info('  node trigger.js restart <service> ') + 'Restart a service');
      console.log(colors.info('  node trigger.js status <service>  ') + 'Get service status');
      console.log(colors.info('  node trigger.js health            ') + 'Run health check on all services');
      console.log(colors.info('  node trigger.js fix <error>       ') + 'Attempt to fix an error');
      console.log(colors.info('  node trigger.js shell             ') + 'Start interactive shell');
      console.log(colors.info('  node trigger.js help              ') + 'Show this help message\n');
      break;
    
    default:
      console.log(colors.error(`Unknown command: ${command}. Type "node trigger.js help" for a list of available commands.`));
      process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  logMessage(`Starting ${SERVICE_NAME}...`);
  
  // Register with Integration Hub
  await registerWithIntegrationHub();
  
  // Connect to Integration Hub WebSocket
  connectWebSocket();
  
  // Process command line arguments
  processCommandLineArgs();
}

// Start the service
main().catch(error => {
  logMessage(`Failed to initialize service: ${error.message}`, 'ERROR');
  console.error(colors.error(`Failed to initialize service: ${error.message}`));
  process.exit(1);
});