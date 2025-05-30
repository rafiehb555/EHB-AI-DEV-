// DOM Elements
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const servicesList = document.getElementById('services-list');
const serviceDetails = document.getElementById('service-details');
const serviceSearch = document.getElementById('service-search');
const refreshServicesBtn = document.getElementById('refresh-services');
const runHealthCheckBtn = document.getElementById('run-health-check');
const clearLogsBtn = document.getElementById('clear-logs');
const logsContainer = document.getElementById('logs-container');
const overallStatus = document.getElementById('overall-status');
const hubStatus = document.getElementById('hub-status');
const dbStatus = document.getElementById('db-status');
const apiStatus = document.getElementById('api-status');
const frontendStatus = document.getElementById('frontend-status');

// State
let services = [];
let selectedService = null;
let logs = [];
let ws = null;

// Constants
const API_BASE_URL = window.location.origin;
const WS_URL = `ws://${window.location.host}/ws`;

// Initialize the application
function init() {
  connectWebSocket();
  fetchServices();
  setupEventListeners();
  runHealthCheck();
}

// Connect to the WebSocket server
function connectWebSocket() {
  statusIndicator.className = 'connecting';
  statusText.textContent = 'Connecting...';
  
  ws = new WebSocket(WS_URL);
  
  ws.onopen = () => {
    statusIndicator.className = 'connected';
    statusText.textContent = 'Connected';
    addLog('Connected to server', 'info');
  };
  
  ws.onclose = () => {
    statusIndicator.className = 'disconnected';
    statusText.textContent = 'Disconnected';
    addLog('Disconnected from server', 'error');
    setTimeout(connectWebSocket, 5000);
  };
  
  ws.onerror = (error) => {
    addLog(`WebSocket error: ${error.message}`, 'error');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };
}

// Handle WebSocket messages
function handleWebSocketMessage(data) {
  switch (data.type) {
    case 'log':
      addLog(data.message, data.level.toLowerCase());
      break;
    case 'service-update':
      updateService(data.service);
      break;
    case 'service-updated': // Support both formats
      updateService(data.service);
      break;
    case 'health-update':
      updateHealthStatus(data.health);
      break;
    case 'health-check-result': // Support both formats
      updateHealthStatus(data.results);
      break;
    case 'services-list':
      services = data.services;
      renderServicesList();
      break;
    case 'operation-result':
      addLog(`Operation ${data.operation}: ${data.message}`, data.success ? 'info' : 'error');
      // Refresh the services list after an operation
      if (data.success) {
        setTimeout(fetchServices, 1000);
      }
      break;
    case 'connected':
      addLog('Connected to server', 'info');
      break;
    case 'error':
      addLog(`Error: ${data.message}`, 'error');
      break;
    default:
      addLog(`Unknown message type: ${data.type}`, 'warn');
  }
}

// Fetch services from the server
async function fetchServices() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    services = data.services || [];
    renderServicesList();
  } catch (error) {
    addLog(`Failed to fetch services: ${error.message}`, 'error');
  }
}

// Render the services list
function renderServicesList() {
  if (services.length === 0) {
    servicesList.innerHTML = '<div class="empty">No services found</div>';
    return;
  }
  
  const searchTerm = serviceSearch.value.toLowerCase().trim();
  const filteredServices = searchTerm 
    ? (services || []).filter(service => service.name.toLowerCase().includes(searchTerm))
    : services;
  
  if (filteredServices.length === 0) {
    servicesList.innerHTML = '<div class="empty">No matching services found</div>';
    return;
  }
  
  servicesList.inne(filteredServices || []).map((ces || []).map(service => {
    const isSelected = selectedService && selectedService.id === service.id;
    return `
      <div class="service-item ${isSelected ? 'selected' : ''}" data-id="${service.id}">
        <div class="service-name">
          <i class="fas ${getServiceIcon(service.type)}"></i>
          ${service.name}
        </div>
        <div class="service-status status ${service.status.toLowerCase()}">${service.status}</div>
      </div>
    `;
  }).join('');
  
  // Add click event listeners
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      const serviceId = item.getAttribute('data-id');
      const service = services.find(s => s.id === serviceId);
      selectService(service);
    });
  });
}

// Select a service and show its details
function selectService(service) {
  selectedService = service;
  
  // Update selected class
  document.querySelectorAll('.service-item').forEach(item => {
    item.classList.remove('selected');
    if (item.getAttribute('data-id') === service.id) {
      item.classList.add('selected');
    }
  });
  
  // Render service details
  renderServiceDetails(service);
}

// Render the details of a selected service
function renderServiceDetails(service) {
  serviceDetails.innerHTML = `
    <div class="service-detail-content">
      <div class="service-header">
        <h3 class="service-title">${service.name}</h3>
        <div class="service-actions">
          ${service.status === 'STOPPED' 
            ? `<button class="action-button primary-button start-service" data-id="${service.id}">Start</button>` 
            : `<button class="action-button danger-button stop-service" data-id="${service.id}">Stop</button>`}
          <button class="action-button secondary-button restart-service" data-id="${service.id}">Restart</button>
        </div>
      </div>
      
      <dl class="service-info">
        <dt>Type:</dt>
        <dd>${service.type}</dd>
        <dt>Status:</dt>
        <dd><span class="status ${service.status.toLowerCase()}">${service.status}</span></dd>
        <dt>URL:</dt>
        <dd><a href="${service.url}" target="_blank">${service.url}</a></dd>
        <dt>Version:</dt>
        <dd>${service.version || 'N/A'}</dd>
        <dt>Capabilities:</dt>
        <dd>${service.capabilities ? service.capabilities.join(', ') : 'None'}</dd>
      </dl>
      
      ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
      
      ${service.endpoints && service.endpoints.length ? `
        <div class="service-endpoints">
          <h3>Endpoints</(service.endpoints || (e.endpoints || []).map((nts || []).map(endpoint => `
            <div class="endpoint-item">
              <span class="endpoint-method">${endpoint.method}</span>
              <span class="endpoint-url">${endpoint.path}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  
  // Add event listeners for service actions
  const startBtn = serviceDetails.querySelector('.start-service');
  if (startBtn) {
    startBtn.addEventListener('click', () => startService(service.id));
  }
  
  const stopBtn = serviceDetails.querySelector('.stop-service');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => stopService(service.id));
  }
  
  const restartBtn = serviceDetails.querySelector('.restart-service');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => restartService(service.id));
  }
}

// Start a service
async function startService(serviceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}/start`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    addLog(`Started service: ${data.name}`, 'info');
    fetchServices();
  } catch (error) {
    addLog(`Failed to start service: ${error.message}`, 'error');
  }
}

// Stop a service
async function stopService(serviceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}/stop`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    addLog(`Stopped service: ${data.name}`, 'info');
    fetchServices();
  } catch (error) {
    addLog(`Failed to stop service: ${error.message}`, 'error');
  }
}

// Restart a service
async function restartService(serviceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}/restart`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    addLog(`Restarted service: ${data.name}`, 'info');
    fetchServices();
  } catch (error) {
    addLog(`Failed to restart service: ${error.message}`, 'error');
  }
}

// Run a health check
async function runHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    updateHealthStatus(data);
    addLog('Health check completed', 'info');
  } catch (error) {
    addLog(`Failed to run health check: ${error.message}`, 'error');
    updateHealthStatus({
      status: 'error',
      details: {
        integrationHub: { status: 'unknown' },
        database: { status: 'unknown' },
        api: { status: 'unknown' },
        frontend: { status: 'unknown' }
      }
    });
  }
}

// Update health status displays
function updateHealthStatus(health) {
  overallStatus.textContent = health.status.charAt(0).toUpperCase() + health.status.slice(1);
  overallStatus.className = `status ${health.status.toLowerCase()}`;
  
  const details = health.details || {};
  
  updateStatusElement(hubStatus, details.integrationHub ? details.integrationHub.status : 'unknown');
  updateStatusElement(dbStatus, details.database ? details.database.status : 'unknown');
  updateStatusElement(apiStatus, details.api ? details.api.status : 'unknown');
  updateStatusElement(frontendStatus, details.frontend ? details.frontend.status : 'unknown');
}

// Update a status element
function updateStatusElement(element, status) {
  element.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  element.className = `status ${status.toLowerCase()}`;
}

// Update a service in the list
function updateService(updatedService) {
  const index = services.findIndex(s => s.id === updatedService.id);
  if (index >= 0) {
    services[index] = updatedService;
  } else {
    services.push(updatedService);
  }
  
  renderServicesList();
  
  // If this is the selected service, update the details view
  if (selectedService && selectedService.id === updatedService.id) {
    selectedService = updatedService;
    renderServiceDetails(updatedService);
  }
}

// Add a log entry
function addLog(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const log = { timestamp, message, level };
  logs.push(log);
  
  // Keep only the latest 100 logs
  if (logs.length > 100) {
    logs.shift();
  }
  
  renderLogs();
}

// Render the logs
function renderLogs() {
  lo(logs || []).map(logs || []).map(logs || []).map((ogs || []).map(log => {
    const time = new Date(log.timestamp).toLocaleTimeString();
    return `
      <div class="log-entry">
        <span class="log-time">${time}</span>
        <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
        <span class="log-message">${log.message}</span>
      </div>
    `;
  }).join('');
  
  // Scroll to the bottom
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Set up event listeners
function setupEventListeners() {
  // Refresh services button
  refreshServicesBtn.addEventListener('click', fetchServices);
  
  // Run health check button
  runHealthCheckBtn.addEventListener('click', runHealthCheck);
  
  // Clear logs button
  clearLogsBtn.addEventListener('click', () => {
    logs = [];
    renderLogs();
    addLog('Logs cleared', 'info');
  });
  
  // Service search input
  serviceSearch.addEventListener('input', renderServicesList);
}

// Helper function to get an icon for a service type
function getServiceIcon(type) {
  const icons = {
    'system-service': 'fa-cogs',
    'core-service': 'fa-microchip',
    'api-service': 'fa-exchange-alt',
    'frontend-service': 'fa-desktop',
    'backend-service': 'fa-server',
    'database-service': 'fa-database',
    'ai-service': 'fa-robot'
  };
  
  return icons[type] || 'fa-cube';
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);