/**
 * Module Integration Client for Developer Portal
 * 
 * Client service to communicate with the EHB Integration Hub's Module Integration Service.
 * Allows the Developer Portal to send and receive data from other modules in the EHB ecosystem.
 */

const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');

class ModuleIntegrationClient extends EventEmitter {
  constructor() {
    super();
    this.moduleName = 'DeveloperPortal';
    this.integrationHubUrl = 'http://localhost:5003'; // Integration Hub URL
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.isConnected = false;
    this.handlersByType = new Map();
    
    // Register default handlers
    this.registerHandler('document', this.handleDocumentData.bind(this));
    this.registerHandler('notification', this.handleNotificationData.bind(this));
    this.registerHandler('module-registration', this.handleModuleRegistration.bind(this));
  }

  /**
   * Initialize the client and connect to the Module Integration Service
   * @param {Object} options - Configuration options
   * @returns {Promise<boolean>} - Whether initialization was successful
   */
  async initialize(options = {}) {
    try {
      console.log('Initializing Module Integration Client...');
      
      if (options.moduleName) {
        this.moduleName = options.moduleName;
      }
      
      if (options.integrationHubUrl) {
        this.integrationHubUrl = options.integrationHubUrl;
      }
      
      // Register this module with the Integration Hub
      const registered = await this.registerModule();
      
      if (!registered) {
        console.error('Failed to register with Integration Hub');
        return false;
      }
      
      // Connect to WebSocket server for real-time communication
      this.connectWebSocket();
      
      return true;
    } catch (error) {
      console.error('Error initializing Module Integration Client:', error);
      return false;
    }
  }

  /**
   * Register this module with the Integration Hub
   * @returns {Promise<boolean>} - Whether registration was successful
   */
  async registerModule() {
    try {
      console.log(`Registering ${this.moduleName} with Integration Hub...`);
      
      const response = await axios.post(`${this.integrationHubUrl}/api/module-integration/modules/register`, {
        name: this.moduleName,
        baseUrl: `http://localhost:5000`, // Developer Portal URL
        dataTypes: ['document', 'notification']
      });
      
      if (response.data.success) {
        console.log(`Successfully registered ${this.moduleName} with Integration Hub`);
        return true;
      } else {
        console.error(`Failed to register ${this.moduleName} with Integration Hub:`, response.data);
        return false;
      }
    } catch (error) {
      console.error(`Error registering ${this.moduleName} with Integration Hub:`, error.message);
      return false;
    }
  }

  /**
   * Connect to the WebSocket server for real-time communication
   */
  connectWebSocket() {
    try {
      const wsUrl = `ws://localhost:8050/ehb-integration?module=${this.moduleName}`;
      console.log(`Connecting to Integration Hub WebSocket: ${wsUrl}`);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.on('open', () => {
        console.log('Connected to Integration Hub WebSocket');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send a hello message to confirm connection
        this.sendData({
          type: 'connection',
          status: 'connected',
          module: this.moduleName,
          timestamp: new Date().toISOString()
        });
      });
      
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleIncomingData(message);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });
      
      this.ws.on('close', () => {
        console.log('Integration Hub WebSocket connection closed');
        this.isConnected = false;
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 30000);
          this.reconnectTimeout = setTimeout(() => this.connectWebSocket(), delay);
        } else {
          console.log('Max reconnect attempts reached. Giving up.');
        }
      });
      
      this.ws.on('error', (error) => {
        console.error('Integration Hub WebSocket error:', error);
      });
    } catch (error) {
      console.error('Error connecting to Integration Hub WebSocket:', error);
    }
  }

  /**
   * Send data to other modules via the Integration Hub
   * @param {Object} data - Data to send
   * @returns {Promise<boolean>} - Whether the data was sent successfully
   */
  async sendData(data) {
    // Add source module if not already present
    if (!data.sourceModule) {
      data.sourceModule = this.moduleName;
    }
    
    // Add timestamp if not already present
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    // Try WebSocket first if connected
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        console.log(`Sent ${data.type} data via WebSocket`);
        return true;
      } catch (error) {
        console.error('Error sending data via WebSocket:', error);
        // Fall back to HTTP API
      }
    }
    
    // Use HTTP API if WebSocket failed or not connected
    return this.sendDataViaApi(data);
  }

  /**
   * Send data via HTTP API when WebSocket is not available
   * @param {Object} data - Data to send
   * @returns {Promise<boolean>} - Whether the data was sent successfully
   */
  async sendDataViaApi(data) {
    try {
      const response = await axios.post(`${this.integrationHubUrl}/api/module-integration/data/broadcast`, {
        data,
        excludeModule: this.moduleName // Don't send the data back to this module
      });
      
      console.log(`Sent ${data.type} data via HTTP API`);
      return response.data.success;
    } catch (error) {
      console.error('Error sending data via HTTP API:', error.message);
      return false;
    }
  }

  /**
   * Register a handler for a specific data type
   * @param {string} dataType - Type of data to handle
   * @param {Function} handler - Handler function
   */
  registerHandler(dataType, handler) {
    this.handlersByType.set(dataType, handler);
  }

  /**
   * Handle incoming data from the Integration Hub
   * @param {Object} data - Received data
   */
  handleIncomingData(data) {
    const { type, sourceModule } = data;
    
    if (!type) {
      console.error('Received data without type:', data);
      return;
    }
    
    console.log(`Received ${type} data from ${sourceModule || 'unknown module'}`);
    
    // Use specific handler if available
    if (this.handlersByType.has(type)) {
      const handler = this.handlersByType.get(type);
      handler(data);
    }
    
    // Emit event for any listeners
    this.emit('data', data);
    this.emit(type, data);
  }

  /**
   * Handle document data from other modules
   * @param {Object} data - Document data
   */
  handleDocumentData(data) {
    console.log('Processing document data:', data.action || 'update');
    
    // Handle documentation updates
    if (data.documentation) {
      this.emit('documentation-update', data);
    }
    
    // Emit specific document events
    if (data.action) {
      this.emit(`document.${data.action}`, data);
    }
  }

  /**
   * Handle notification data from other modules
   * @param {Object} data - Notification data
   */
  handleNotificationData(data) {
    console.log('Processing notification data:', data.action || 'new');
    
    // Emit specific notification events
    if (data.action) {
      this.emit(`notification.${data.action}`, data);
    }
  }

  /**
   * Handle module registration data
   * @param {Object} data - Module registration data
   */
  handleModuleRegistration(data) {
    console.log('Processing module registration data:', data.module || 'unknown module');
    
    this.emit('module-update', data);
  }

  /**
   * Get a list of all registered modules from the Integration Hub
   * @returns {Promise<Array>} - List of modules
   */
  async getModules() {
    try {
      const response = await axios.get(`${this.integrationHubUrl}/api/module-integration/modules`);
      return response.data.modules || [];
    } catch (error) {
      console.error('Error getting modules from Integration Hub:', error.message);
      return [];
    }
  }

  /**
   * Broadcast document data to all modules that can handle it
   * @param {Object} documentData - Document data to broadcast
   * @returns {Promise<boolean>} - Whether the data was broadcast successfully
   */
  async broadcastDocumentData(documentData) {
    return this.sendData({
      type: 'document',
      ...documentData
    });
  }

  /**
   * Broadcast notification data to all modules that can handle it
   * @param {Object} notificationData - Notification data to broadcast
   * @returns {Promise<boolean>} - Whether the data was broadcast successfully
   */
  async broadcastNotificationData(notificationData) {
    return this.sendData({
      type: 'notification',
      ...notificationData
    });
  }

  /**
   * Clean up resources used by this client
   */
  cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.removeAllListeners();
    this.isConnected = false;
    console.log('Module Integration Client cleaned up');
  }
}

// Create and export a singleton instance
const moduleIntegrationClient = new ModuleIntegrationClient();
module.exports = moduleIntegrationClient;