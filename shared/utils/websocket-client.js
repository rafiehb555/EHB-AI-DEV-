/**
 * EHB Standardized WebSocket Client
 * 
 * This module provides a standardized way to create and manage WebSocket connections
 * across all EHB services. It includes auto-recovery, reconnection, and consistent
 * message handling.
 */

const WebSocket = require('ws');
const EventEmitter = require('events');

class EHBWebSocketClient extends EventEmitter {
  /**
   * Create a new WebSocket client with automatic reconnection
   * @param {string} url WebSocket server URL
   * @param {Object} options Configuration options
   */
  constructor(url, options = {}) {
    super();
    
    this.url = url;
    this.options = Object.assign({
      reconnect: true,
      maxReconnectAttempts: 10,
      reconnectInterval: 5000,
      reconnectDecay: 1.5,
      timeout: 30000,
      debug: false,
      moduleName: 'UnknownModule',
      moduleType: 'system-service',
      moduleUrl: null,
      capabilities: [],
      description: 'EHB Service',
      version: '1.0.0'
    }, options);
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.lastMessageTime = Date.now();
    this.isAlive = false;
    this.isRegistered = false;
    
    // Connect immediately unless specified
    if (!options.delayConnect) {
      this.connect();
    }
  }
  
  /**
   * Log a debug message
   * @param {string} message Message to log
   * @param {string} level Log level
   */
  log(message, level = 'INFO') {
    if (this.options.debug || level !== 'DEBUG') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level}] [${this.options.moduleName}] ${message}`);
      this.emit('log', { message, level, timestamp });
    }
  }
  
  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.log('Connection already exists, closing before reconnecting');
      this.close();
    }
    
    this.log(`Connecting to WebSocket server at ${this.url}`);
    
    try {
      // Extract query parameters from URL if present
      const urlObj = new URL(this.url);
      if (!urlObj.searchParams.has('module') && this.options.moduleName) {
        urlObj.searchParams.append('module', this.options.moduleName);
      }
      
      // Create WebSocket connection
      this.ws = new WebSocket(urlObj.toString());
      
      // Set timeout for initial connection
      const connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          this.log('Connection timeout, closing socket', 'WARN');
          this.ws.terminate();
        }
      }, this.options.timeout);
      
      // Connection opened
      this.ws.on('open', () => {
        clearTimeout(connectionTimeout);
        this.isAlive = true;
        this.reconnectAttempts = 0;
        this.lastMessageTime = Date.now();
        
        this.log('WebSocket connection established');
        this.emit('open');
        
        // Register with server if connecting to Integration Hub
        if (this.url.includes('ehb-integration') && !this.isRegistered) {
          this.register();
        }
        
        // Start heartbeat
        this.startHeartbeat();
      });
      
      // Message received
      this.ws.on('message', (data) => {
        this.lastMessageTime = Date.now();
        
        try {
          const message = JSON.parse(data);
          
          if (this.options.debug) {
            this.log(`Received message: ${JSON.stringify(message)}`, 'DEBUG');
          }
          
          // Handle standard message types
          switch (message.type) {
            case 'connected':
              this.log('Received connection confirmation');
              this.emit('connected');
              break;
              
            case 'registered':
              this.log(`Successfully registered as module ${message.moduleId || this.options.moduleName}`);
              this.isRegistered = true;
              this.emit('registered', message);
              break;
              
            case 'error':
              this.log(`Error from server: ${message.message}`, 'ERROR');
              this.emit('serverError', message);
              break;
              
            case 'service-update':
            case 'service-updated':
              this.emit('serviceUpdate', message.service);
              break;
              
            case 'health-check-result':
              this.emit('healthCheck', message.results);
              break;
              
            default:
              // Forward all other messages to listeners
              this.emit('message', message);
          }
        } catch (error) {
          this.log(`Error parsing message: ${error.message}`, 'ERROR');
          this.emit('error', new Error(`Failed to parse message: ${error.message}`));
        }
      });
      
      // Connection closed
      this.ws.on('close', (code, reason) => {
        this.isAlive = false;
        clearTimeout(this.heartbeatTimer);
        
        this.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason || 'No reason provided'}`, 'WARN');
        this.emit('close', { code, reason });
        
        if (this.options.reconnect) {
          this.scheduleReconnect();
        }
      });
      
      // Error occurred
      this.ws.on('error', (error) => {
        this.log(`WebSocket error: ${error.message}`, 'ERROR');
        this.emit('error', error);
      });
      
      // Handle pong responses
      this.ws.on('pong', () => {
        this.isAlive = true;
      });
      
    } catch (error) {
      this.log(`Failed to create WebSocket connection: ${error.message}`, 'ERROR');
      this.emit('error', error);
      
      if (this.options.reconnect) {
        this.scheduleReconnect();
      }
    }
  }
  
  /**
   * Register with the Integration Hub
   */
  register() {
    const serviceUrl = this.options.moduleUrl || 
                      `http://localhost:${this.options.port || '5001'}`;
    
    const registrationMessage = {
      type: 'register',
      module: {
        name: this.options.moduleName,
        type: this.options.moduleType,
        url: serviceUrl,
        capabilities: this.options.capabilities,
        description: this.options.description,
        version: this.options.version
      }
    };
    
    this.send(registrationMessage);
  }
  
  /**
   * Start the heartbeat mechanism
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (!this.isAlive) {
        this.log('Heartbeat failed, terminating connection', 'WARN');
        this.ws.terminate();
        return;
      }
      
      this.isAlive = false;
      
      try {
        this.ws.ping();
      } catch (error) {
        this.log(`Error sending ping: ${error.message}`, 'ERROR');
        this.ws.terminate();
      }
      
      // Check for inactivity timeout
      const inactiveTime = Date.now() - this.lastMessageTime;
      if (inactiveTime > this.options.timeout * 2) {
        this.log(`Connection inactive for ${inactiveTime}ms, terminating`, 'WARN');
        this.ws.terminate();
      }
    }, this.options.timeout);
  }
  
  /**
   * Schedule reconnection attempt
   */
  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.log(`Maximum reconnection attempts (${this.options.maxReconnectAttempts}) reached`, 'ERROR');
      this.emit('reconnectFailed');
      return;
    }
    
    const delay = this.options.reconnectInterval * Math.pow(this.options.reconnectDecay, this.reconnectAttempts);
    this.reconnectAttempts++;
    
    this.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`, 'INFO');
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  /**
   * Send a message to the WebSocket server
   * @param {Object|string} message Message to send
   * @returns {boolean} Whether the message was sent
   */
  send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: connection not open', 'WARN');
      return false;
    }
    
    try {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      this.ws.send(data);
      return true;
    } catch (error) {
      this.log(`Error sending message: ${error.message}`, 'ERROR');
      this.emit('error', error);
      return false;
    }
  }
  
  /**
   * Close the WebSocket connection
   * @param {number} code Close code
   * @param {string} reason Close reason
   */
  close(code = 1000, reason = 'Client closing connection') {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.close(code, reason);
        } else {
          this.ws.terminate();
        }
      } catch (error) {
        this.log(`Error closing connection: ${error.message}`, 'ERROR');
      }
    }
  }
  
  /**
   * Check if the connection is open
   * @returns {boolean} Whether the connection is open
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
  
  /**
   * Get the current connection state
   * @returns {string} Connection state
   */
  getState() {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
}

module.exports = EHBWebSocketClient;