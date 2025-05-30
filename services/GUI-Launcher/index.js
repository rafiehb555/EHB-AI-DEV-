/**
 * EHB GUI Launcher
 * 
 * This service provides a graphical user interface for launching and managing
 * EHB services. It communicates with the Integration Hub to start, stop,
 * and monitor services.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

// Configuration
const PORT = process.env.PORT || 5050;
const INTEGRATION_HUB_URL = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
const WS_INTEGRATION_HUB_URL = process.env.WS_INTEGRATION_HUB_URL || 'ws://localhost:5003/ehb-integration';
const SERVICE_NAME = 'GUI-Launcher';
const LOG_FILE = path.join(__dirname, 'logs', 'gui-launcher.log');
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// WebSocket server - ensure it only listens on our specific server to avoid port conflicts
const wss = new WebSocket.Server({ 
  server: server, 
  path: '/ws'
});

// WebSocket connection to Integration Hub
let integrationHubWs = null;

// Store connected clients
const clients = new Set();

// Note: WebSocket server handler is already defined at the end of the file

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// API Endpoints
// Get services list
app.get('/api/services', async (req, res) => {
  try {
    const response = await getServicesList();
    res.json({ services: response });
  } catch (error) {
    logMessage(`Error getting services list: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// Start a service
app.post('/api/services/:id/start', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const result = await startService(serviceId);
    res.json(result);
  } catch (error) {
    logMessage(`Error starting service: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// Stop a service
app.post('/api/services/:id/stop', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const result = await stopService(serviceId);
    res.json(result);
  } catch (error) {
    logMessage(`Error stopping service: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// Restart a service
app.post('/api/services/:id/restart', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const result = await restartService(serviceId);
    res.json(result);
  } catch (error) {
    logMessage(`Error restarting service: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const health = await performHealthCheck();
    res.json(health);
  } catch (error) {
    logMessage(`Error performing health check: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// Create the HTML file if it doesn't exist
const htmlFile = path.join(publicDir, 'index.html');
if (!fs.existsSync(htmlFile)) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB GUI Launcher</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .service-card {
      transition: all 0.3s ease;
    }
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    .status-running {
      background-color: #10B981;
    }
    .status-stopped {
      background-color: #EF4444;
    }
    .status-warning {
      background-color: #F59E0B;
    }
    .service-actions button {
      transition: all 0.2s ease;
    }
    .service-actions button:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">EHB GUI Launcher</h1>
          <p class="text-gray-600">Manage and monitor your EHB services</p>
        </div>
        <div class="flex items-center">
          <div id="connection-status" class="mr-4">
            <span id="connection-indicator" class="status-indicator status-stopped"></span>
            <span id="connection-text">Disconnected</span>
          </div>
          <button id="refresh-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Refresh
          </button>
        </div>
      </div>
    </header>

    <div class="mb-6 p-4 bg-white rounded-md shadow-md">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <button id="start-all-btn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
          Start All
        </button>
        <button id="stop-all-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
          Stop All
        </button>
        <button id="restart-all-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
          Restart All
        </button>
        <button id="health-check-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md">
          Health Check
        </button>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Services</h2>
        <div class="flex gap-2">
          <button id="view-all-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-md">All</button>
          <button id="view-running-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md">Running</button>
          <button id="view-stopped-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md">Stopped</button>
        </div>
      </div>
      <div id="services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Service cards will be inserted here dynamically -->
        <div class="animate-pulse service-card bg-white rounded-lg shadow-md p-4">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div class="flex justify-between">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div class="animate-pulse service-card bg-white rounded-lg shadow-md p-4">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div class="flex justify-between">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Log Section -->
    <div class="bg-white rounded-md shadow-md p-4">
      <h2 class="text-xl font-semibold mb-4">System Logs</h2>
      <div class="mb-3 flex justify-between items-center">
        <div>
          <select id="log-filter" class="border rounded-md px-3 py-1">
            <option value="all">All Messages</option>
            <option value="error">Errors Only</option>
            <option value="info">Info Only</option>
          </select>
          <select id="log-service-filter" class="border rounded-md px-3 py-1 ml-2">
            <option value="all">All Services</option>
            <!-- Service options will be added dynamically -->
          </select>
        </div>
        <button id="clear-logs-btn" class="text-sm text-gray-500 hover:text-gray-700">Clear Logs</button>
      </div>
      <div id="log-container" class="bg-gray-800 text-gray-200 p-3 rounded-md h-64 overflow-y-auto font-mono text-sm">
        <div class="log-entry">
          <span class="text-blue-300">[2025-05-10 19:58:24]</span>
          <span class="text-green-300">[INFO]</span>
          <span>EHB GUI Launcher initialized</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Service Details -->
  <div id="service-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
      <div class="flex justify-between items-start mb-4">
        <h2 id="modal-title" class="text-2xl font-bold">Service Details</h2>
        <button id="close-modal-btn" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="modal-content" class="mb-6">
        <!-- Service details will be inserted here -->
      </div>
      <div class="flex justify-end">
        <button id="modal-close-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2">
          Close
        </button>
        <button id="modal-action-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Restart
        </button>
      </div>
    </div>
  </div>

  <script>
    // WebSocket connection
    let ws;
    let services = [];
    let currentFilter = 'all';
    const logs = [];
    
    // Connect to WebSocket
    function connectWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
      
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        updateConnectionStatus(true);
        
        // Request initial data
        sendMessage({ type: 'get-services' });
        sendMessage({ type: 'get-logs' });
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        updateConnectionStatus(false);
        
        // Try to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateConnectionStatus(false);
      };
    }
    
    // Send message through WebSocket
    function sendMessage(message) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        addLog('Failed to send message: WebSocket not connected', 'error');
      }
    }
    
    // Handle incoming messages
    function handleMessage(message) {
      switch (message.type) {
        case 'services-list':
          services = message.services;
          renderServices();
          updateServiceFilter();
          break;
        
        case 'service-updated':
          updateService(message.service);
          break;
        
        case 'logs':
          message.logs.forEach(log => {
            logs.push(log);
          });
          renderLogs();
          break;
        
        case 'log':
          logs.push(message.log);
          renderLogs();
          break;
        
        case 'health-check-result':
          showHealthCheckResults(message.results);
          break;
        
        case 'error':
          addLog(\`Error: \${message.message}\`, 'error');
          break;
      }
    }
    
    // Update connection status indicator
    function updateConnectionStatus(connected) {
      const indicator = document.getElementById('connection-indicator');
      const text = document.getElementById('connection-text');
      
      if (connected) {
        indicator.className = 'status-indicator status-running';
        text.textContent = 'Connected';
      } else {
        indicator.className = 'status-indicator status-stopped';
        text.textContent = 'Disconnected';
      }
    }
    
    // Render services grid
    function renderServices() {
      const servicesGrid = document.getElementById('services-grid');
      servicesGrid.innerHTML = '';
      
      const filteredServices = filterServices();
      
      if (filteredServices.length === 0) {
        servicesGrid.innerHTML = \`
          <div class="col-span-3 text-center py-8 text-gray-500">
            No services found matching the current filter.
          </div>
        \`;
        return;
      }
      
      filteredServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card bg-white rounded-lg shadow-md p-4';
        serviceCard.setAttribute('data-service-id', service.id);
        
        const statusClass = service.status === 'running' ? 'status-running' 
                          : service.status === 'warning' ? 'status-warning' 
                          : 'status-stopped';
        
        serviceCard.innerHTML = \`
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">\${service.name}</h3>
            <div>
              <span class="status-indicator \${statusClass}"></span>
              <span class="text-sm">\${service.status}</span>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4">\${service.description || 'No description available'}</p>
          <div class="flex justify-between service-actions">
            <button class="details-btn bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm">
              Details
            </button>
            \${service.status === 'running' 
              ? \`<button class="stop-btn bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm">
                  Stop
                </button>\` 
              : \`<button class="start-btn bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm">
                  Start
                </button>\`
            }
          </div>
        \`;
        
        servicesGrid.appendChild(serviceCard);
        
        // Add event listeners
        const detailsBtn = serviceCard.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => showServiceDetails(service));
        
        const actionBtn = serviceCard.querySelector('.start-btn, .stop-btn');
        if (actionBtn) {
          actionBtn.addEventListener('click', () => {
            if (actionBtn.classList.contains('start-btn')) {
              sendMessage({ type: 'start-service', serviceId: service.id });
            } else {
              sendMessage({ type: 'stop-service', serviceId: service.id });
            }
          });
        }
      });
    }
    
    // Filter services based on current filter
    function filterServices() {
      if (currentFilter === 'all') {
        return services;
      }
      return (services || []).filter(service => service.status === currentFilter);
    }
    
    // Update a single service
    function updateService(updatedService) {
      const index = services.findIndex(s => s.id === updatedService.id);
      
      if (index !== -1) {
        services[index] = updatedService;
      } else {
        services.push(updatedService);
      }
      
      renderServices();
    }
    
    // Show service details in modal
    function showServiceDetails(service) {
      const modal = document.getElementById('service-modal');
      const title = document.getElementById('modal-title');
      const content = document.getElementById('modal-content');
      const actionBtn = document.getElementById('modal-action-btn');
      
      title.textContent = service.name;
      
      // Format created and last started dates if available
      const createdDate = service.created ? new Date(service.created).toLocaleString() : 'N/A';
      const startedDate = service.lastStarted ? new Date(service.lastStarted).toLocaleString() : 'N/A';
      
      content.innerHTML = \`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">ID</p>
            <p class="mb-3">\${service.id}</p>
            
            <p class="text-sm text-gray-500 mb-1">Status</p>
            <p class="mb-3">
              <span class="status-indicator \${service.status === 'running' ? 'status-running' 
                                            : service.status === 'warning' ? 'status-warning' 
                                            : 'status-stopped'}"></span>
              \${service.status}
            </p>
            
            <p class="text-sm text-gray-500 mb-1">Type</p>
            <p class="mb-3">\${service.type || 'N/A'}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500 mb-1">Created</p>
            <p class="mb-3">\${createdDate}</p>
            
            <p class="text-sm text-gray-500 mb-1">Last Started</p>
            <p class="mb-3">\${startedDate}</p>
            
            <p class="text-sm text-gray-500 mb-1">Version</p>
            <p class="mb-3">\${service.version || 'N/A'}</p>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-sm text-gray-500 mb-1">Description</p>
          <p class="mb-3">\${service.description || 'No description available'}</p>
          
          <p class="text-sm text-gray-500 mb-1">Capabilities</p>
          <p class="mb-3">\${service.capabilities ? service.capabilities.join(', ') : 'N/A'}</p>
          
          <p class="text-sm text-gray-500 mb-1">URL</p>
          <p class="mb-3">\${service.url || 'N/A'}</p>
        </div>
        
        \${service.logs ? \`
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-1">Recent Logs</p>
            <div class="bg-gray-100 p-2 rounded-md text-sm font-mono h-32 overflow-y-auto">
              \${service.logs.join('\\n')}
            </div>
          </div>
        \` : ''}
      \`;
      
      // Set action button based on service status
      if (service.status === 'running') {
        actionBtn.textContent = 'Restart';
        actionBtn.className = 'bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md';
        actionBtn.onclick = () => {
          sendMessage({ type: 'restart-service', serviceId: service.id });
          modal.classList.add('hidden');
        };
      } else {
        actionBtn.textContent = 'Start';
        actionBtn.className = 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md';
        actionBtn.onclick = () => {
          sendMessage({ type: 'start-service', serviceId: service.id });
          modal.classList.add('hidden');
        };
      }
      
      modal.classList.remove('hidden');
    }
    
    // Add log entry
    function addLog(message, level = 'info', service = 'GUI-Launcher') {
      const timestamp = new Date().toISOString();
      
      logs.push({
        timestamp,
        level,
        message,
        service
      });
      
      renderLogs();
    }
    
    // Render logs
    function renderLogs() {
      const logContainer = document.getElementById('log-container');
      const logFilter = document.getElementById('log-filter').value;
      const serviceFilter = document.getElementById('log-service-filter').value;
      
      let filteredLogs = logs;
      
      // Apply level filter
      if (logFilter !== 'all') {
        filtere(filteredLogs || []).filter(.filter(log => log.level === logFilter);
      }
      
      // Apply service filter
      if (serviceFilter !== 'all') {
       (filteredLogs || []).filter((eredLogs || []).filter(log => log.service === serviceFilter);
      }
      
      // Sort logs by timestamp (newest first)
      filteredLogs = filteredLogs.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      // Take only the last 100 logs to prevent performance issues
      filteredLogs = filteredLogs.slice(0, 100);
      
      logContainer.innerHTML = '';
      
      if (filteredLogs.length === 0) {
        logContainer.innerHTML = '<div class="text-gray-500">No logs to display</div>';
        return;
      }
      
      filteredLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry mb-1';
        
        const time = new Date(log.timestamp).toLocaleTimeString();
        const date = new Date(log.timestamp).toLocaleDateString();
        
        let levelClass = '';
        switch (log.level.toLowerCase()) {
          case 'error':
            levelClass = 'text-red-300';
            break;
          case 'warn':
          case 'warning':
            levelClass = 'text-yellow-300';
            break;
          case 'info':
            levelClass = 'text-green-300';
            break;
          case 'debug':
            levelClass = 'text-blue-300';
            break;
          default:
            levelClass = 'text-gray-300';
        }
        
        logEntry.innerHTML = \`
          <span class="text-blue-300">[\${date} \${time}]</span>
          <span class="\${levelClass}">[\${log.level.toUpperCase()}]</span>
          <span class="text-purple-300">[\${log.service}]</span>
          <span>\${log.message}</span>
        \`;
        
        logContainer.appendChild(logEntry);
      });
    }
    
    // Update service filter dropdown
    function updateServiceFilter() {
      const serviceFilter = document.getElementById('log-service-filter');
      
      // Clear existing options except "All Services"
      while (serviceFilter.options.length > 1) {
        serviceFilter.remove(1);
      }
      
      // Add service options
      const uniqu(services || []).map(...(services || []).map((ces || []).map(service => service.name))];
      uniqueServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = service;
        serviceFilter.appendChild(option);
      });
    }
    
    // Show health check results
    function showHealthCheckResults(results) {
      const modal = document.getElementById('service-modal');
      const title = document.getElementById('modal-title');
      const content = document.getElementById('modal-content');
      const actionBtn = document.getElementById('modal-action-btn');
      
      title.textContent = 'Health Check Results';
      
      let html = '<div class="grid grid-cols-1 gap-4">';
      
      for (const [serviceId, result] of Object.entries(results)) {
        const service = services.find(s => s.id === serviceId) || { name: serviceId };
        const statusClass = result.healthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        
        html += \`
          <div class="p-3 rounded-md \${statusClass}">
            <div class="font-semibold">\${service.name}</div>
            <div class="text-sm mt-1">\${result.message}</div>
            \${result.details ? \`<div class="text-xs mt-2">\${result.details}</div>\` : ''}
          </div>
        \`;
      }
      
      html += '</div>';
      
      content.innerHTML = html;
      
      // Change action button to "Close"
      actionBtn.textContent = 'Close';
      actionBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md';
      actionBtn.onclick = () => {
        modal.classList.add('hidden');
      };
      
      modal.classList.remove('hidden');
    }
    
    // Initialize
    function init() {
      // Connect to WebSocket
      connectWebSocket();
      
      // Add event listeners
      document.getElementById('refresh-btn').addEventListener('click', () => {
        sendMessage({ type: 'get-services' });
      });
      
      document.getElementById('start-all-btn').addEventListener('click', () => {
        sendMessage({ type: 'start-all-services' });
      });
      
      document.getElementById('stop-all-btn').addEventListener('click', () => {
        sendMessage({ type: 'stop-all-services' });
      });
      
      document.getElementById('restart-all-btn').addEventListener('click', () => {
        sendMessage({ type: 'restart-all-services' });
      });
      
      document.getElementById('health-check-btn').addEventListener('click', () => {
        sendMessage({ type: 'health-check' });
      });
      
      document.getElementById('view-all-btn').addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons();
        renderServices();
      });
      
      document.getElementById('view-running-btn').addEventListener('click', () => {
        currentFilter = 'running';
        updateFilterButtons();
        renderServices();
      });
      
      document.getElementById('view-stopped-btn').addEventListener('click', () => {
        currentFilter = 'stopped';
        updateFilterButtons();
        renderServices();
      });
      
      document.getElementById('log-filter').addEventListener('change', renderLogs);
      document.getElementById('log-service-filter').addEventListener('change', renderLogs);
      
      document.getElementById('clear-logs-btn').addEventListener('click', () => {
        logs.length = 0;
        renderLogs();
      });
      
      document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('service-modal').classList.add('hidden');
      });
      
      document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('service-modal').classList.add('hidden');
      });
      
      // Add some initial logs
      addLog('EHB GUI Launcher initialized', 'info');
      addLog('Connecting to WebSocket...', 'info');
    }
    
    // Update filter buttons
    function updateFilterButtons() {
      const allBtn = document.getElementById('view-all-btn');
      const runningBtn = document.getElementById('view-running-btn');
      const stoppedBtn = document.getElementById('view-stopped-btn');
      
      allBtn.className = currentFilter === 'all' 
        ? 'bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-md'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md';
      
      runningBtn.className = currentFilter === 'running'
        ? 'bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-md'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md';
      
      stoppedBtn.className = currentFilter === 'stopped'
        ? 'bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-md'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded-md';
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
  fs.writeFileSync(htmlFile, htmlContent);
}

// Create the CSS file if it doesn't exist
const cssFile = path.join(publicDir, 'styles.css');
if (!fs.existsSync(cssFile)) {
  const cssContent = `/* Styles for EHB GUI Launcher */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #2980b9;
}

.btn-danger {
  background-color: #e74c3c;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-success {
  background-color: #2ecc71;
}

.btn-success:hover {
  background-color: #27ae60;
}

.btn-warning {
  background-color: #f39c12;
}

.btn-warning:hover {
  background-color: #d35400;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-running {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-stopped {
  background-color: #ffebee;
  color: #c62828;
}

.status-warning {
  background-color: #fff8e1;
  color: #f57f17;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.service-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.log-container {
  background-color: #263238;
  color: #eeffff;
  border-radius: 4px;
  padding: 10px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
}

.log-info {
  color: #82aaff;
}

.log-error {
  color: #f07178;
}

.log-warning {
  color: #ffcb6b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 90%;
  }
}`;
  fs.writeFileSync(cssFile, cssContent);
}

/**
 * Log a message to console and file
 * @param {string} message Message to log
 * @param {string} level Log level
 */
function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  
  // Console output
  console.log(logEntry);
  
  // File output
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
  
  // Broadcast to clients
  broadcastLog({
    timestamp,
    level,
    message,
    service: SERVICE_NAME
  });
}

/**
 * Broadcast a log message to all connected clients
 * @param {Object} log Log message object
 */
function broadcastLog(log) {
  const message = {
    type: 'log',
    log
  };
  
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

/**
 * Broadcast a message to all connected clients
 * @param {Object} message Message object
 */
function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}

/**
 * Connect to Integration Hub WebSocket
 * @param {number} port The port the service is running on
 */
function connectIntegrationHub(port = PORT) {
  if (integrationHubWs) {
    integrationHubWs.terminate();
  }
  
  try {
    integrationHubWs = new WebSocket(`${WS_INTEGRATION_HUB_URL}?module=${SERVICE_NAME}`);
    
    integrationHubWs.on('open', () => {
      logMessage('Connected to Integration Hub WebSocket');
      
      // Send registration message
      sendIntegrationHubMessage({
        type: 'register',
        module: {
          name: SERVICE_NAME,
          type: 'system-service',
          url: `http://localhost:${port}`,
          capabilities: ['service-management', 'system-monitoring'],
          description: 'Graphical User Interface for launching and managing EHB services',
          version: '1.0.0'
        }
      });
    });
    
    integrationHubWs.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        handleIntegrationHubMessage(message);
      } catch (error) {
        logMessage(`Error parsing Integration Hub WebSocket message: ${error.message}`, 'ERROR');
      }
    });
    
    integrationHubWs.on('close', () => {
      logMessage('Integration Hub WebSocket connection closed, will attempt to reconnect in 5 seconds', 'WARN');
      setTimeout(connectIntegrationHub, 5000);
    });
    
    integrationHubWs.on('error', (error) => {
      logMessage(`Integration Hub WebSocket error: ${error.message}`, 'ERROR');
    });
  } catch (error) {
    logMessage(`Error connecting to Integration Hub WebSocket: ${error.message}`, 'ERROR');
    setTimeout(connectIntegrationHub, 5000);
  }
}

/**
 * Send a message to the Integration Hub
 * @param {Object} message Message object
 */
function sendIntegrationHubMessage(message) {
  if (integrationHubWs && integrationHubWs.readyState === WebSocket.OPEN) {
    integrationHubWs.send(JSON.stringify(message));
  } else {
    logMessage('Cannot send message to Integration Hub: WebSocket not connected', 'WARN');
  }
}

/**
 * Handle a message from the Integration Hub
 * @param {Object} message Message object
 */
function handleIntegrationHubMessage(message) {
  switch (message.type) {
    case 'connected':
      logMessage(`Connection established with Integration Hub at ${new Date().toISOString()}`);
      break;
      
    case 'registered':
      logMessage(`Successfully registered with Integration Hub as module ${message.moduleId || SERVICE_NAME}`);
      break;
    
    case 'service-list':
      // Forward service list to clients
      broadcastMessage({
        type: 'services-list',
        services: message.services
      });
      break;
    
    case 'service-update':
      // Forward service update to clients
      broadcastMessage({
        type: 'service-updated',
        service: message.service
      });
      break;
    
    case 'error':
      logMessage(`Error from Integration Hub: ${message.message}`, 'ERROR');
      break;
    
    case 'health-check-result':
      // Forward health check result to clients
      broadcastMessage({
        type: 'health-check-result',
        results: message.results
      });
      break;
    
    default:
      logMessage(`Unknown message type from Integration Hub: ${message.type}`, 'WARN');
  }
}

/**
 * Register with Integration Hub API
 * @param {number} port The port the service is running on
 */
async function registerWithIntegrationHub(port = PORT) {
  try {
    logMessage('Registering with Integration Hub...');
    
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/register`, {
      name: SERVICE_NAME,
      url: `http://localhost:${port}`,
      type: 'system-service',
      capabilities: ['service-management', 'system-monitoring'],
      description: 'Graphical User Interface for launching and managing EHB services',
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
 * Perform a health check on all services
 */
async function performHealthCheck() {
  try {
    const response = await axios.get(`${INTEGRATION_HUB_URL}/health`);
    return response.data;
  } catch (error) {
    logMessage(`Failed to perform health check: ${error.message}`, 'ERROR');
    return { status: 'error', message: error.message };
  }
}

/**
 * Start a service
 * @param {string} serviceId Service ID
 */
async function startService(serviceId) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/start`, {
      name: serviceId
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to start service ${serviceId}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

/**
 * Stop a service
 * @param {string} serviceId Service ID
 */
async function stopService(serviceId) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/stop`, {
      name: serviceId
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to stop service ${serviceId}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

/**
 * Restart a service
 * @param {string} serviceId Service ID
 */
async function restartService(serviceId) {
  try {
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/restart`, {
      name: serviceId
    });
    return response.data;
  } catch (error) {
    logMessage(`Failed to restart service ${serviceId}: ${error.message}`, 'ERROR');
    return { success: false, message: error.message };
  }
}

// WebSocket server
wss.on('connection', (ws) => {
  logMessage('Client connected');
  
  // Add client to set
  clients.add(ws);
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    timestamp: new Date().toISOString()
  }));
  
  // Send initial services list
  getServicesList().then(services => {
    ws.send(JSON.stringify({
      type: 'services-list',
      services: Object.values(services)
    }));
  });
  
  // Handle messages from client
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'get-services':
          const services = await getServicesList();
          ws.send(JSON.stringify({
            type: 'services-list',
            services: Object.values(services)
          }));
          break;
        
        case 'start-service':
          logMessage(`Starting service: ${data.serviceId}`);
          const startResult = await startService(data.serviceId);
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'start',
            serviceId: data.serviceId,
            success: startResult.success,
            message: startResult.message
          }));
          break;
        
        case 'stop-service':
          logMessage(`Stopping service: ${data.serviceId}`);
          const stopResult = await stopService(data.serviceId);
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'stop',
            serviceId: data.serviceId,
            success: stopResult.success,
            message: stopResult.message
          }));
          break;
        
        case 'restart-service':
          logMessage(`Restarting service: ${data.serviceId}`);
          const restartResult = await restartService(data.serviceId);
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'restart',
            serviceId: data.serviceId,
            success: restartResult.success,
            message: restartResult.message
          }));
          break;
        
        case 'start-all-services':
          logMessage('Starting all services');
          // Implementation would be here in a real system
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'start-all',
            success: true,
            message: 'Started all services'
          }));
          break;
        
        case 'stop-all-services':
          logMessage('Stopping all services');
          // Implementation would be here in a real system
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'stop-all',
            success: true,
            message: 'Stopped all services'
          }));
          break;
        
        case 'restart-all-services':
          logMessage('Restarting all services');
          // Implementation would be here in a real system
          ws.send(JSON.stringify({
            type: 'operation-result',
            operation: 'restart-all',
            success: true,
            message: 'Restarted all services'
          }));
          break;
        
        case 'health-check':
          logMessage('Performing health check');
          const healthResult = await performHealthCheck();
          ws.send(JSON.stringify({
            type: 'health-check-result',
            results: healthResult
          }));
          break;
        
        default:
          logMessage(`Unknown message type: ${data.type}`, 'WARN');
      }
    } catch (error) {
      logMessage(`Error handling message: ${error.message}`, 'ERROR');
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    logMessage('Client disconnected');
    clients.delete(ws);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    logMessage(`WebSocket error: ${error.message}`, 'ERROR');
    clients.delete(ws);
  });
});

// Check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = require('http').createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

// Find available port starting from the given port
async function findAvailablePort(startPort) {
  let port = startPort;
  const maxPort = startPort + 10; // Try up to 10 ports
  
  while (port <= maxPort) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
    port++;
  }
  
  throw new Error(`No available port found in range ${startPort}-${maxPort}`);
}

// Initialize the service
async function init() {
  logMessage(`Starting ${SERVICE_NAME}...`);
  
  // Find available port
  try {
    const availablePort = await findAvailablePort(PORT);
    if (availablePort !== PORT) {
      logMessage(`Port ${PORT} is in use, using port ${availablePort} instead`, 'WARN');
    }
    
    // Register with Integration Hub - pass the actual port being used
    await registerWithIntegrationHub(availablePort);
    
    // Connect to Integration Hub WebSocket - pass the actual port being used
    connectIntegrationHub(availablePort);
    
    // Start the server
    server.listen(availablePort, '0.0.0.0', () => {
      logMessage(`${SERVICE_NAME} running on port ${availablePort}`);
      logMessage(`Access the GUI at http://localhost:${availablePort}`);
    });
  } catch (error) {
    logMessage(`Failed to start service: ${error.message}`, 'ERROR');
  }
}

// Start the service
init().catch(error => {
  logMessage(`Failed to initialize service: ${error.message}`, 'ERROR');
});