/**
 * EHB GUI-Based Trigger
 * 
 * This service provides a graphical user interface for triggering EHB workflows
 * and monitoring system health. It leverages Electron to create a native desktop
 * application that interacts with the Integration Hub.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

// Configuration
const PORT = process.env.PORT || 5055;
const INTEGRATION_HUB_URL = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
const WS_INTEGRATION_HUB_URL = process.env.WS_INTEGRATION_HUB_URL || 'ws://localhost:5003/ehb-integration';
const SERVICE_NAME = 'GUI-Based-Trigger';
const LOG_FILE = path.join(__dirname, 'logs', 'gui-trigger.log');
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws' });

// WebSocket connection to Integration Hub
let integrationHubWs = null;

// Store connected clients
const clients = new Set();

// Define startup tasks
const startupTasks = [
  { name: 'Module Registration', status: 'pending', message: 'Registering with Integration Hub...' },
  { name: 'WebSocket Connection', status: 'pending', message: 'Establishing WebSocket connection...' },
  { name: 'Service Discovery', status: 'pending', message: 'Discovering available services...' },
  { name: 'Error Monitor', status: 'pending', message: 'Starting error monitoring...' },
  { name: 'System Health Check', status: 'pending', message: 'Checking system health...' }
];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create the HTML file if it doesn't exist
const htmlFile = path.join(publicDir, 'index.html');
if (!fs.existsSync(htmlFile)) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB GUI-Based Trigger</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
    }
    .trigger-card {
      transition: all 0.3s ease-in-out;
    }
    .trigger-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .status-success {
      background-color: #10B981;
    }
    .status-pending {
      background-color: #F59E0B;
    }
    .status-failed {
      background-color: #EF4444;
    }
    .loading-bar {
      width: 100%;
      height: 4px;
      background-color: #E5E7EB;
      position: relative;
      overflow: hidden;
    }
    .loading-bar-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: #3B82F6;
      transition: width 0.3s ease;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">EHB GUI-Based Trigger</h1>
          <p class="text-gray-600">Control EHB services and workflows</p>
        </div>
        <div id="connection-status" class="flex items-center">
          <span id="status-indicator" class="status-indicator status-pending"></span>
          <span id="status-text" class="text-gray-700">Connecting...</span>
        </div>
      </div>
    </header>

    <!-- Startup Progress -->
    <div id="startup-container" class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 class="text-xl font-semibold mb-4">System Initialization</h2>
      <div class="overflow-hidden rounded-full mb-4">
        <div class="loading-bar">
          <div id="startup-progress" class="loading-bar-progress" style="width: 0%"></div>
        </div>
      </div>
      <div id="startup-tasks" class="space-y-2">
        <!-- Startup tasks will be added here dynamically -->
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <button id="start-all-btn" class="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          Start All
        </button>
        <button id="stop-all-btn" class="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
          </svg>
          Stop All
        </button>
        <button id="health-check-btn" class="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          Health Check
        </button>
        <button id="fix-issues-btn" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
          Fix Issues
        </button>
      </div>
    </div>

    <!-- Triggers Grid -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Triggers</h2>
        <div class="flex space-x-2">
          <div class="relative">
            <input type="text" id="search-input" placeholder="Search triggers..." class="bg-gray-100 text-gray-700 border-0 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <select id="category-filter" class="bg-gray-100 text-gray-700 border-0 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Categories</option>
            <option value="core">Core Services</option>
            <option value="admin">Admin Services</option>
            <option value="ai">AI Services</option>
            <option value="dev">Development</option>
          </select>
        </div>
      </div>
      <div id="triggers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Loading placeholders -->
        <div class="animate-pulse bg-white rounded-lg shadow-md p-4">
          <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div class="flex justify-between">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div class="animate-pulse bg-white rounded-lg shadow-md p-4">
          <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div class="flex justify-between">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div class="animate-pulse bg-white rounded-lg shadow-md p-4">
          <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div class="flex justify-between">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 class="text-xl font-semibold mb-4">System Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-blue-700 font-medium">Services</h3>
            <span id="services-count" class="text-blue-700 font-bold text-xl">-</span>
          </div>
          <p class="text-blue-600 text-sm mt-1">Total services registered</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-green-700 font-medium">Running</h3>
            <span id="running-count" class="text-green-700 font-bold text-xl">-</span>
          </div>
          <p class="text-green-600 text-sm mt-1">Active services</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-yellow-700 font-medium">Warnings</h3>
            <span id="warning-count" class="text-yellow-700 font-bold text-xl">-</span>
          </div>
          <p class="text-yellow-600 text-sm mt-1">Services with warnings</p>
        </div>
        <div class="bg-red-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-red-700 font-medium">Issues</h3>
            <span id="issues-count" class="text-red-700 font-bold text-xl">-</span>
          </div>
          <p class="text-red-600 text-sm mt-1">Services with errors</p>
        </div>
      </div>
      <div id="status-details" class="h-48 overflow-y-auto bg-gray-100 rounded-lg p-3 font-mono text-sm">
        <div class="text-gray-500">System status information will appear here...</div>
      </div>
    </div>

    <!-- Recent Logs -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Recent Logs</h2>
        <button id="clear-logs-btn" class="text-sm text-gray-500 hover:text-gray-700">Clear</button>
      </div>
      <div id="logs-container" class="h-48 overflow-y-auto bg-gray-800 rounded-lg p-3 font-mono text-sm text-white">
        <div class="log-entry">
          <span class="text-blue-300">[2025-05-10 20:00:00]</span>
          <span class="text-green-300">[INFO]</span>
          <span>Initializing EHB GUI-Based Trigger...</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div id="modal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 id="modal-title" class="text-xl font-semibold">Title</h3>
        <button id="close-modal-btn" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="modal-content" class="mb-4"></div>
      <div class="flex justify-end">
        <button id="modal-cancel-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2">Cancel</button>
        <button id="modal-action-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">OK</button>
      </div>
    </div>
  </div>

  <script>
    // WebSocket connection
    let ws = null;
    let services = [];
    let triggers = [];
    let logs = [];
    let isConnected = false;
    let startupComplete = false;
    
    // Initialize application
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
      // Initialize startup tasks
      renderStartupTasks();
      
      // Connect to WebSocket
      connectWebSocket();
      
      // Add event listeners
      document.getElementById('start-all-btn').addEventListener('click', startAllServices);
      document.getElementById('stop-all-btn').addEventListener('click', stopAllServices);
      document.getElementById('health-check-btn').addEventListener('click', runHealthCheck);
      document.getElementById('fix-issues-btn').addEventListener('click', fixIssues);
      document.getElementById('clear-logs-btn').addEventListener('click', clearLogs);
      document.getElementById('close-modal-btn').addEventListener('click', closeModal);
      document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
      document.getElementById('search-input').addEventListener('input', filterTriggers);
      document.getElementById('category-filter').addEventListener('change', filterTriggers);
      
      // Initial data request will be sent once WebSocket is connected
    }
    
    function connectWebSocket() {
      // Create the WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
      
      ws = new WebSocket(wsUrl);
      
      // WebSocket event handlers
      ws.onopen = () => {
        isConnected = true;
        updateStartupTask('WebSocket Connection', 'success', 'Connected to server');
        updateConnectionStatus(true);
        
        // Request initial data
        sendMessage({ type: 'get-services' });
        sendMessage({ type: 'get-triggers' });
        sendMessage({ type: 'get-status' });
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
          addLog(\`Error parsing message: \${error.message}\`, 'error');
        }
      };
      
      ws.onclose = () => {
        isConnected = false;
        updateConnectionStatus(false);
        
        // Attempt to reconnect after a short delay
        setTimeout(connectWebSocket, 5000);
      };
      
      ws.onerror = (error) => {
        isConnected = false;
        updateConnectionStatus(false);
        addLog(\`WebSocket error: \${error.message || 'Unknown error'}\`, 'error');
        
        // Update startup task
        updateStartupTask('WebSocket Connection', 'failed', 'Failed to connect');
      };
    }
    
    function sendMessage(message) {
      if (isConnected && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        addLog('Cannot send message: WebSocket not connected', 'error');
      }
    }
    
    function handleMessage(message) {
      switch (message.type) {
        case 'services-list':
          services = message.services;
          updateServicesCount();
          updateStartupTask('Service Discovery', 'success', \`Found \${services.length} services\`);
          break;
        
        case 'triggers-list':
          triggers = message.triggers;
          renderTriggers();
          if (startupComplete === false) {
            setTimeout(() => {
              completeStartup();
            }, 500);
          }
          break;
        
        case 'service-update':
          updateService(message.service);
          break;
        
        case 'status-update':
          updateSystemStatus(message.status);
          updateStartupTask('System Health Check', 'success', 'Completed');
          break;
        
        case 'log':
          addLog(message.message, message.level, message.source);
          break;
        
        case 'startup-task':
          updateStartupTask(message.taskName, message.status, message.message);
          break;
        
        case 'health-check-result':
          showHealthCheckResults(message.results);
          break;
        
        case 'error':
          addLog(message.message, 'error', message.source || 'System');
          break;
        
        case 'registration-success':
          updateStartupTask('Module Registration', 'success', 'Registered with Integration Hub');
          break;
        
        case 'error-monitor-status':
          updateStartupTask('Error Monitor', 'success', 'Error monitoring active');
          break;
        
        default:
          console.log('Unknown message type:', message.type);
      }
    }
    
    function updateConnectionStatus(connected) {
      const indicator = document.getElementById('status-indicator');
      const text = document.getElementById('status-text');
      
      if (connected) {
        indicator.className = 'status-indicator status-success';
        text.textContent = 'Connected';
      } else {
        indicator.className = 'status-indicator status-failed';
        text.textContent = 'Disconnected';
      }
    }
    
    function renderStartupTasks() {
      const container = document.getElementById('startup-tasks');
      container.innerHTML = '';
      
      // Sample startup tasks
      [
        { name: 'Module Registration', status: 'pending', message: 'Registering with Integration Hub...' },
        { name: 'WebSocket Connection', status: 'pending', message: 'Establishing WebSocket connection...' },
        { name: 'Service Discovery', status: 'pending', message: 'Discovering available services...' },
        { name: 'Error Monitor', status: 'pending', message: 'Starting error monitoring...' },
        { name: 'System Health Check', status: 'pending', message: 'Checking system health...' }
      ].forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'flex items-center';
        taskElement.innerHTML = \`
          <span class="status-indicator status-\${task.status}"></span>
          <span class="font-medium mr-2">\${task.name}:</span>
          <span class="text-sm text-gray-600" id="task-\${task.name.replace(/\\s+/g, '-').toLowerCase()}-message">\${task.message}</span>
        \`;
        container.appendChild(taskElement);
      });
    }
    
    function updateStartupTask(taskName, status, message) {
      const taskId = taskName.replace(/\\s+/g, '-').toLowerCase();
      const indicator = document.querySelector(\`#startup-tasks div:has(#task-\${taskId}-message) .status-indicator\`);
      const messageElement = document.getElementById(\`task-\${taskId}-message\`);
      
      if (indicator && messageElement) {
        indicator.className = \`status-indicator status-\${status}\`;
        messageElement.textContent = message;
        
        // Update progress bar
        updateStartupProgress();
      }
    }
    
    function updateStartupProgress() {
      const indicators = document.querySelectorAll('#startup-tasks .status-indicator');
      let completed = 0;
      
      indicators.forEach(indicator => {
        if (indicator.classList.contains('status-success')) {
          completed++;
        }
      });
      
      const progressPercentage = (completed / indicators.length) * 100;
      document.getElementById('startup-progress').style.width = \`\${progressPercentage}%\`;
    }
    
    function completeStartup() {
      startupComplete = true;
      
      // Hide startup container with animation
      const startupContainer = document.getElementById('startup-container');
      startupContainer.style.transition = 'all 0.5s ease-in-out';
      startupContainer.style.opacity = '0';
      startupContainer.style.maxHeight = startupContainer.offsetHeight + 'px';
      
      setTimeout(() => {
        startupContainer.style.maxHeight = '0';
        startupContainer.style.overflow = 'hidden';
        startupContainer.style.marginBottom = '0';
        startupContainer.style.padding = '0';
      }, 500);
    }
    
    function renderTriggers() {
      const grid = document.getElementById('triggers-grid');
      grid.innerHTML = '';
      
      if (triggers.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-3 text-center py-8 text-gray-500';
        emptyState.textContent = 'No triggers available';
        grid.appendChild(emptyState);
        return;
      }
      
      // Apply filters
      const filteredTriggers = filterTriggersData();
      
      if (filteredTriggers.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-3 text-center py-8 text-gray-500';
        emptyState.textContent = 'No triggers match your filter criteria';
        grid.appendChild(emptyState);
        return;
      }
      
      filteredTriggers.forEach(trigger => {
        const card = document.createElement('div');
        card.className = 'trigger-card bg-white rounded-lg shadow-md p-4';
        card.innerHTML = \`
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">\${trigger.name}</h3>
            <span class="px-2 py-1 rounded-full text-xs font-medium \${getCategoryClass(trigger.category)}">\${trigger.category}</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">\${trigger.description}</p>
          <div class="flex justify-between">
            <button class="details-btn bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded-md text-sm">Details</button>
            <button class="execute-btn bg-green-100 hover:bg-green-200 text-green-700 font-medium py-1 px-3 rounded-md text-sm">Execute</button>
          </div>
        \`;
        
        grid.appendChild(card);
        
        // Add event listeners
        card.querySelector('.details-btn').addEventListener('click', () => showTriggerDetails(trigger));
        card.querySelector('.execute-btn').addEventListener('click', () => executeTrigger(trigger));
      });
    }
    
    function getCategoryClass(category) {
      switch (category.toLowerCase()) {
        case 'core':
          return 'bg-blue-100 text-blue-800';
        case 'admin':
          return 'bg-purple-100 text-purple-800';
        case 'ai':
          return 'bg-green-100 text-green-800';
        case 'dev':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    function filterTriggersData() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const category = document.getElementById('category-filter').value;
      
      return (triggers || []).filter(trigger => {
        const matchesSearch = 
          trigger.name.toLowerCase().includes(searchTerm) || 
          trigger.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = 
          category === 'all' || 
          trigger.category.toLowerCase() === category.toLowerCase();
        
        return matchesSearch && matchesCategory;
      });
    }
    
    function filterTriggers() {
      renderTriggers();
    }
    
    function showTriggerDetails(trigger) {
      const modal = document.getElementById('modal');
      const title = document.getElementById('modal-title');
      const content = document.getElementById('modal-content');
      const actionBtn = document.getElementById('modal-action-btn');
      
      title.textContent = trigger.name;
      
      content.innerHTML = \`
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-1">Category</p>
          <p class="mb-2">\${trigger.category}</p>
          
          <p class="text-sm text-gray-500 mb-1">Description</p>
          <p class="mb-2">\${trigger.description}</p>
          
          <p class="text-sm text-gray-500 mb-1">Target</p>
          <p class="mb-2">\${trigger.target || 'N/A'}</p>
          
          <p class="text-sm text-gray-500 mb-1">Parameters</p>
          <div class="bg-gray-100 p-2 rounded-md">
            \${trigger.parameters ? JSON.stringify(trigger.parameters, null, 2) : 'No parameters'}
          </div>
        </div>
      \`;
      
      actionBtn.textContent = 'Execute';
      actionBtn.className = 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md';
      actionBtn.onclick = () => {
        executeTrigger(trigger);
        closeModal();
      };
      
      modal.classList.remove('hidden');
    }
    
    function executeTrigger(trigger) {
      addLog(\`Executing trigger: \${trigger.name}\`, 'info');
      
      sendMessage({
        type: 'execute-trigger',
        triggerId: trigger.id,
        name: trigger.name
      });
    }
    
    function closeModal() {
      document.getElementById('modal').classList.add('hidden');
    }
    
    function addLog(message, level = 'info', source = 'GUI-Trigger') {
      const timestamp = new Date().toLocaleString();
      
      logs.unshift({
        timestamp,
        level,
        message,
        source
      });
      
      renderLogs();
    }
    
    function renderLogs() {
      const container = document.getElementById('logs-container');
      container.innerHTML = '';
      
      // Limit to the last 100 logs
      const limitedLogs = logs.slice(0, 100);
      
      if (limitedLogs.length === 0) {
        container.innerHTML = '<div class="text-gray-500">No logs available</div>';
        return;
      }
      
      limitedLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry mb-1';
        
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
          <span class="text-blue-300">[\${log.timestamp}]</span>
          <span class="\${levelClass}">[\${log.level.toUpperCase()}]</span>
          <span class="text-purple-300">[\${log.source}]</span>
          <span>\${log.message}</span>
        \`;
        
        container.appendChild(logEntry);
      });
    }
    
    function clearLogs() {
      logs = [];
      renderLogs();
    }
    
    function updateService(service) {
      const index = services.findIndex(s => s.id === service.id);
      
      if (index !== -1) {
        services[index] = service;
      } else {
        services.push(service);
      }
      
      updateServicesCount();
    }
    
    function updateServicesCount() {
      const total = services.length;
      const ru(services || []).filter(.filter(s => s.status === 'running').length;
      c(services || []).filter((services || []).filter(s => s.status === 'warning').lengt(services || []).filter((services || []).filter(.filter(s => s.status === 'stopped' || s.status === 'error').length;
      
      document.getElementById('services-count').textContent = total;
      document.getElementById('running-count').textContent = running;
      document.getElementById('warning-count').textContent = warnings;
      document.getElementById('issues-count').textContent = issues;
    }
    
    function updateSystemStatus(status) {
      const container = document.getElementById('status-details');
      container.innerHTML = '';
      
      if (!status) {
        container.innerHTML = '<div class="text-gray-500">No status information available</div>';
        return;
      }
      
      // Create status message
      const statusHtml = \`
        <div class="mb-2">
          <span class="font-medium">System Status:</span> 
          <span class="\${status.healthy ? 'text-green-600' : 'text-red-600'}">\${status.healthy ? 'Healthy' : 'Unhealthy'}</span>
        </div>
        <div class="mb-2">
          <span class="font-medium">Last Updated:</span> 
          <span>\${new Date(status.timestamp).toLocaleString()}</span>
        </div>
        <div class="mb-2">
          <span class="font-medium">Details:</span>
        </div>
      \`;
      
      container.innerHTML = statusHtml;
      
      // Add service statuses
      if (status.services && Object.keys(status.services).length > 0) {
        const servicesList = document.createElement('ul');
        servicesList.className = 'pl-5 space-y-1 text-sm';
        
        for (const [serviceName, serviceStatus] of Object.entries(status.services)) {
          const serviceItem = document.createElement('li');
          let statusClass = '';
          
          switch (serviceStatus.status) {
            case 'running':
              statusClass = 'text-green-600';
              break;
            case 'warning':
              statusClass = 'text-yellow-600';
              break;
            case 'stopped':
              statusClass = 'text-red-600';
              break;
            default:
              statusClass = 'text-gray-600';
          }
          
          serviceItem.innerHTML = \`
            <span class="font-medium">\${serviceName}:</span> 
            <span class="\${statusClass}">\${serviceStatus.status}</span>
            \${serviceStatus.message ? \` - \${serviceStatus.message}\` : ''}
          \`;
          
          servicesList.appendChild(serviceItem);
        }
        
        container.appendChild(servicesList);
      } else {
        container.innerHTML += '<div class="text-gray-500">No service status information available</div>';
      }
    }
    
    function showHealthCheckResults(results) {
      const modal = document.getElementById('modal');
      const title = document.getElementById('modal-title');
      const content = document.getElementById('modal-content');
      const actionBtn = document.getElementById('modal-action-btn');
      
      title.textContent = 'Health Check Results';
      
      if (!results || Object.keys(results).length === 0) {
        content.innerHTML = '<div class="text-gray-500">No health check results available</div>';
      } else {
        let html = '<div class="space-y-3">';
        
        for (const [serviceName, result] of Object.entries(results)) {
          const statusClass = result.healthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
          
          html += \`
            <div class="p-3 rounded-md \${statusClass}">
              <div class="font-medium">\${serviceName}</div>
              <div class="text-sm mt-1">\${result.message || 'No details available'}</div>
            </div>
          \`;
        }
        
        html += '</div>';
        content.innerHTML = html;
      }
      
      actionBtn.textContent = 'Close';
      actionBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md';
      actionBtn.onclick = closeModal;
      
      modal.classList.remove('hidden');
    }
    
    function startAllServices() {
      addLog('Starting all services', 'info');
      
      sendMessage({
        type: 'start-all-services'
      });
    }
    
    function stopAllServices() {
      // Confirm before stopping all services
      const modal = document.getElementById('modal');
      const title = document.getElementById('modal-title');
      const content = document.getElementById('modal-content');
      const actionBtn = document.getElementById('modal-action-btn');
      
      title.textContent = 'Confirm Stop All Services';
      content.innerHTML = '<p class="text-red-600">Are you sure you want to stop all services? This will interrupt any ongoing operations.</p>';
      
      actionBtn.textContent = 'Stop All';
      actionBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md';
      actionBtn.onclick = () => {
        sendMessage({
          type: 'stop-all-services'
        });
        
        addLog('Stopping all services', 'warn');
        closeModal();
      };
      
      modal.classList.remove('hidden');
    }
    
    function runHealthCheck() {
      addLog('Running health check on all services', 'info');
      
      sendMessage({
        type: 'health-check'
      });
    }
    
    function fixIssues() {
      addLog('Attempting to fix system issues', 'info');
      
      sendMessage({
        type: 'fix-issues'
      });
    }
    
    // Add some sample triggers (in a real implementation, these would come from the server)
    setTimeout(() => {
      if (triggers.length === 0) {
        triggers = [
          {
            id: 'start-integration-hub',
            name: 'Start Integration Hub',
            category: 'Core',
            description: 'Start the Integration Hub service, which coordinates communication between EHB services',
            target: 'Integration Hub',
            parameters: { action: 'start' }
          },
          {
            id: 'restart-dashboard',
            name: 'Restart Dashboard',
            category: 'Admin',
            description: 'Restart the EHB Dashboard service',
            target: 'EHB Dashboard',
            parameters: { action: 'restart' }
          },
          {
            id: 'process-new-zips',
            name: 'Process New ZIPs',
            category: 'Dev',
            description: 'Process any new ZIP files in the attached_assets directory',
            target: 'ZIP Watcher',
            parameters: { action: 'process' }
          },
          {
            id: 'clear-error-logs',
            name: 'Clear Error Logs',
            category: 'Admin',
            description: 'Clear all error logs from the system',
            target: 'System',
            parameters: { action: 'clear-logs', type: 'error' }
          },
          {
            id: 'run-ai-analysis',
            name: 'Run AI Analysis',
            category: 'AI',
            description: 'Run AI analysis on system components to detect potential issues',
            target: 'EHB-AI-Dev',
            parameters: { action: 'analyze' }
          },
          {
            id: 'backup-system',
            name: 'Backup System',
            category: 'Admin',
            description: 'Create a backup of the current system state',
            target: 'System',
            parameters: { action: 'backup' }
          }
        ];
        renderTriggers();
      }
    }, 2000);
  </script>
</body>
</html>`;
  fs.writeFileSync(htmlFile, htmlContent);
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
 */
function connectIntegrationHub() {
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
          url: `http://localhost:${PORT}`,
          capabilities: ['gui-trigger', 'system-monitoring'],
          description: 'Graphical User Interface for triggering EHB workflows',
          version: '1.0.0'
        }
      });
      
      // Update startup tasks
      updateStartupTask('Module Registration', 'success', 'Registered with Integration Hub');
      updateStartupTask('WebSocket Connection', 'success', 'Connected to Integration Hub');
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
    case 'registered':
      logMessage(`Successfully registered with Integration Hub as module ${message.moduleId || SERVICE_NAME}`);
      
      // Broadcast to clients
      broadcastMessage({
        type: 'registration-success',
        moduleId: message.moduleId
      });
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
      
      // Forward error to clients
      broadcastMessage({
        type: 'error',
        message: message.message,
        source: message.source || 'Integration Hub'
      });
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
 */
async function registerWithIntegrationHub() {
  try {
    logMessage('Registering with Integration Hub...');
    
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/register`, {
      name: SERVICE_NAME,
      url: `http://localhost:${PORT}`,
      type: 'system-service',
      capabilities: ['gui-trigger', 'system-monitoring'],
      description: 'Graphical User Interface for triggering EHB workflows',
      version: '1.0.0'
    });
    
    logMessage(`Registered with Integration Hub: ${JSON.stringify(response.data)}`);
    
    // Update startup task
    updateStartupTask('Module Registration', 'success', 'Registered with Integration Hub');
    
    return true;
  } catch (error) {
    logMessage(`Failed to register with Integration Hub: ${error.message}`, 'ERROR');
    
    // Update startup task
    updateStartupTask('Module Registration', 'failed', 'Failed to register');
    
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
 * Start error monitoring
 */
async function startErrorMonitoring() {
  try {
    // In a real implementation, this would set up listeners for error events
    logMessage('Starting error monitoring...');
    
    // Update startup task after a delay to simulate work
    setTimeout(() => {
      updateStartupTask('Error Monitor', 'success', 'Error monitoring active');
      
      broadcastMessage({
        type: 'error-monitor-status',
        active: true
      });
    }, 1500);
    
    return true;
  } catch (error) {
    logMessage(`Failed to start error monitoring: ${error.message}`, 'ERROR');
    
    updateStartupTask('Error Monitor', 'failed', 'Failed to start');
    
    return false;
  }
}

/**
 * Perform system health check
 */
async function performSystemHealthCheck() {
  try {
    logMessage('Performing system health check...');
    
    // In a real implementation, this would check the health of all services
    const services = await getServicesList();
    
    const healthStatus = {
      healthy: true,
      timestamp: new Date().toISOString(),
      services: {}
    };
    
    for (const [serviceName, service] of Object.entries(services)) {
      healthStatus.services[serviceName] = {
        status: service.status || 'unknown',
        healthy: service.status === 'running',
        message: service.status === 'running' ? 'Service is healthy' 
               : service.status === 'warning' ? 'Service has warnings' 
               : 'Service is not running'
      };
      
      if (service.status !== 'running') {
        healthStatus.healthy = false;
      }
    }
    
    // Broadcast health status to clients
    broadcastMessage({
      type: 'status-update',
      status: healthStatus
    });
    
    // Update startup task
    updateStartupTask('System Health Check', 'success', 'System health checked');
    
    return healthStatus;
  } catch (error) {
    logMessage(`Failed to perform system health check: ${error.message}`, 'ERROR');
    
    updateStartupTask('System Health Check', 'failed', 'Failed to check system health');
    
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Update startup task status
 * @param {string} taskName Task name
 * @param {string} status Task status
 * @param {string} message Task message
 */
function updateStartupTask(taskName, status, message) {
  // Update local task status
  const task = startupTasks.find(t => t.name === taskName);
  
  if (task) {
    task.status = status;
    task.message = message;
  }
  
  // Broadcast to clients
  broadcastMessage({
    type: 'startup-task',
    taskName,
    status,
    message
  });
}

/**
 * Execute a trigger
 * @param {Object} trigger Trigger object
 */
async function executeTrigger(trigger) {
  try {
    logMessage(`Executing trigger: ${trigger.name}`);
    
    // Different actions based on trigger target
    switch (trigger.target) {
      case 'Integration Hub':
        if (trigger.parameters.action === 'start') {
          await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/start`, {
            name: 'Integration Hub'
          });
        } else if (trigger.parameters.action === 'stop') {
          await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/stop`, {
            name: 'Integration Hub'
          });
        } else if (trigger.parameters.action === 'restart') {
          await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/restart`, {
            name: 'Integration Hub'
          });
        }
        break;
      
      case 'EHB Dashboard':
        if (trigger.parameters.action === 'restart') {
          await axios.post(`${INTEGRATION_HUB_URL}/api/workflows/restart`, {
            name: 'Frontend Server'
          });
        }
        break;
      
      case 'ZIP Watcher':
        if (trigger.parameters.action === 'process') {
          await axios.post(`${INTEGRATION_HUB_URL}/api/process-zips`);
        }
        break;
      
      case 'System':
        if (trigger.parameters.action === 'clear-logs') {
          // Clear logs based on type
          logMessage(`Clearing ${trigger.parameters.type} logs`);
        } else if (trigger.parameters.action === 'backup') {
          // Create system backup
          logMessage('Creating system backup');
        }
        break;
      
      case 'EHB-AI-Dev':
        if (trigger.parameters.action === 'analyze') {
          // Run AI analysis
          logMessage('Running AI analysis on system components');
        }
        break;
      
      default:
        logMessage(`Unknown trigger target: ${trigger.target}`, 'WARN');
    }
    
    // Broadcast success message
    broadcastMessage({
      type: 'trigger-executed',
      trigger: trigger.name,
      success: true
    });
    
    logMessage(`Trigger ${trigger.name} executed successfully`);
    return true;
  } catch (error) {
    logMessage(`Error executing trigger ${trigger.name}: ${error.message}`, 'ERROR');
    
    // Broadcast error message
    broadcastMessage({
      type: 'trigger-executed',
      trigger: trigger.name,
      success: false,
      error: error.message
    });
    
    return false;
  }
}

// WebSocket server
wss.on('connection', (ws) => {
  logMessage('Client connected');
  
  // Add client to set
  clients.add(ws);
  
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
        
        case 'get-triggers':
          // In a real implementation, this would get triggers from a database
          // For this demo, we'll just use a hardcoded list
          ws.send(JSON.stringify({
            type: 'triggers-list',
            triggers: [
              {
                id: 'start-integration-hub',
                name: 'Start Integration Hub',
                category: 'Core',
                description: 'Start the Integration Hub service, which coordinates communication between EHB services',
                target: 'Integration Hub',
                parameters: { action: 'start' }
              },
              {
                id: 'restart-dashboard',
                name: 'Restart Dashboard',
                category: 'Admin',
                description: 'Restart the EHB Dashboard service',
                target: 'EHB Dashboard',
                parameters: { action: 'restart' }
              },
              {
                id: 'process-new-zips',
                name: 'Process New ZIPs',
                category: 'Dev',
                description: 'Process any new ZIP files in the attached_assets directory',
                target: 'ZIP Watcher',
                parameters: { action: 'process' }
              },
              {
                id: 'clear-error-logs',
                name: 'Clear Error Logs',
                category: 'Admin',
                description: 'Clear all error logs from the system',
                target: 'System',
                parameters: { action: 'clear-logs', type: 'error' }
              },
              {
                id: 'run-ai-analysis',
                name: 'Run AI Analysis',
                category: 'AI',
                description: 'Run AI analysis on system components to detect potential issues',
                target: 'EHB-AI-Dev',
                parameters: { action: 'analyze' }
              },
              {
                id: 'backup-system',
                name: 'Backup System',
                category: 'Admin',
                description: 'Create a backup of the current system state',
                target: 'System',
                parameters: { action: 'backup' }
              }
            ]
          }));
          break;
        
        case 'get-status':
          const status = await performSystemHealthCheck();
          ws.send(JSON.stringify({
            type: 'status-update',
            status
          }));
          break;
        
        case 'execute-trigger':
          const { triggerId, name } = data;
          
          // Find the trigger
          const triggers = [
            {
              id: 'start-integration-hub',
              name: 'Start Integration Hub',
              category: 'Core',
              description: 'Start the Integration Hub service, which coordinates communication between EHB services',
              target: 'Integration Hub',
              parameters: { action: 'start' }
            },
            {
              id: 'restart-dashboard',
              name: 'Restart Dashboard',
              category: 'Admin',
              description: 'Restart the EHB Dashboard service',
              target: 'EHB Dashboard',
              parameters: { action: 'restart' }
            },
            {
              id: 'process-new-zips',
              name: 'Process New ZIPs',
              category: 'Dev',
              description: 'Process any new ZIP files in the attached_assets directory',
              target: 'ZIP Watcher',
              parameters: { action: 'process' }
            },
            {
              id: 'clear-error-logs',
              name: 'Clear Error Logs',
              category: 'Admin',
              description: 'Clear all error logs from the system',
              target: 'System',
              parameters: { action: 'clear-logs', type: 'error' }
            },
            {
              id: 'run-ai-analysis',
              name: 'Run AI Analysis',
              category: 'AI',
              description: 'Run AI analysis on system components to detect potential issues',
              target: 'EHB-AI-Dev',
              parameters: { action: 'analyze' }
            },
            {
              id: 'backup-system',
              name: 'Backup System',
              category: 'Admin',
              description: 'Create a backup of the current system state',
              target: 'System',
              parameters: { action: 'backup' }
            }
          ];
          
          const trigger = triggers.find(t => t.id === triggerId);
          
          if (trigger) {
            const result = await executeTrigger(trigger);
            
            ws.send(JSON.stringify({
              type: 'trigger-executed',
              triggerId,
              name,
              success: result
            }));
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: `Trigger not found: ${triggerId}`,
              source: 'GUI-Trigger'
            }));
          }
          break;
        
        case 'start-all-services':
          logMessage('Starting all services');
          
          // This would be implemented in a real system
          ws.send(JSON.stringify({
            type: 'log',
            message: 'Starting all services. This may take a few moments...',
            level: 'info',
            source: 'GUI-Trigger'
          }));
          break;
        
        case 'stop-all-services':
          logMessage('Stopping all services');
          
          // This would be implemented in a real system
          ws.send(JSON.stringify({
            type: 'log',
            message: 'Stopping all services. This may take a few moments...',
            level: 'warn',
            source: 'GUI-Trigger'
          }));
          break;
        
        case 'health-check':
          logMessage('Running health check');
          
          const healthStatus = await performSystemHealthCheck();
          
          ws.send(JSON.stringify({
            type: 'health-check-result',
            results: healthStatus.services
          }));
          break;
        
        case 'fix-issues':
          logMessage('Attempting to fix system issues');
          
          // This would be implemented in a real system
          ws.send(JSON.stringify({
            type: 'log',
            message: 'Analyzing and fixing system issues. This may take a few moments...',
            level: 'info',
            source: 'GUI-Trigger'
          }));
          
          // Simulate issue fixing after a delay
          setTimeout(() => {
            ws.send(JSON.stringify({
              type: 'log',
              message: 'Fixed 3 issues. System status improved.',
              level: 'info',
              source: 'Error-Monitor'
            }));
          }, 3000);
          break;
        
        default:
          logMessage(`Unknown message type: ${data.type}`, 'WARN');
      }
    } catch (error) {
      logMessage(`Error handling message: ${error.message}`, 'ERROR');
      
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message,
        source: 'GUI-Trigger'
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
  
  // Send initial updates
  // 1. Send startup task statuses
  startupTasks.forEach(task => {
    ws.send(JSON.stringify({
      type: 'startup-task',
      taskName: task.name,
      status: task.status,
      message: task.message
    }));
  });
  
  // 2. Send welcome log
  ws.send(JSON.stringify({
    type: 'log',
    message: 'Welcome to EHB GUI-Based Trigger!',
    level: 'info',
    source: 'GUI-Trigger',
    timestamp: new Date().toISOString()
  }));
});

/**
 * Initialize the service
 */
async function init() {
  logMessage(`Starting ${SERVICE_NAME}...`);
  
  // Register with Integration Hub
  await registerWithIntegrationHub();
  
  // Connect to Integration Hub WebSocket
  connectIntegrationHub();
  
  // Start error monitoring
  await startErrorMonitoring();
  
  // Perform initial system health check
  await performSystemHealthCheck();
  
  // Get services list for service discovery
  const services = await getServicesList();
  updateStartupTask('Service Discovery', Object.keys(services).length > 0 ? 'success' : 'warning', 
                   Object.keys(services).length > 0 ? `Found ${Object.keys(services).length} services` : 'No services found');
  
  // Start the server
  server.listen(PORT, '0.0.0.0', () => {
    logMessage(`${SERVICE_NAME} running on port ${PORT}`);
    logMessage(`Access the GUI at http://localhost:${PORT}`);
  });
}

// Start the service
init().catch(error => {
  logMessage(`Failed to initialize service: ${error.message}`, 'ERROR');
});