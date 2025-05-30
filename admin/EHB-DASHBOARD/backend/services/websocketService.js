const WebSocket = require('ws');

/**
 * WebSocket Service for handling real-time notifications
 */
class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map client connections to user IDs
    this.initialized = false;
  }

  /**
   * Initialize the WebSocket server
   * @param {Object} server - HTTP server instance
   */
  initialize(server) {
    if (this.initialized) {
      console.log('[WebSocket] Service already initialized');
      return;
    }

    // Create WebSocket server with error handling
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      clientTracking: true,
      handleProtocols: true
    });

    this.wss.on('error', (error) => {
      console.error('[WebSocket] Server error:', error);
    });

    // Handle connection events
    this.wss.on('connection', (ws, req) => {
      console.log('[WebSocket] Client connected');

      // Handle messages from clients
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);

          // Handle different message types
          switch (data.type) {
            case 'register':
              this.registerClient(ws, data.userId);
              break;
            case 'ping':
              ws.send(JSON.stringify({ type: 'pong' }));
              break;
            default:
              console.log(`[WebSocket] Unknown message type: ${data.type}`);
          }
        } catch (error) {
          console.error('[WebSocket] Error processing message:', error);
        }
      });

      // Handle disconnections
      ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
        this.removeClient(ws);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('[WebSocket] Connection error:', error);
        this.removeClient(ws);
      });

      // Send initial connection message
      ws.send(JSON.stringify({ type: 'connected' }));
    });

    console.log('[WebSocket] Service initialized');

    // Wait for server to be listening before logging port info
    if (server.address()) {
      console.log(`WebSocket server running on ws://localhost:${server.address().port}/ws`);
    } else {
      console.log('WebSocket server running (port not yet available)');
      // Listen for when the server starts listening
      server.on('listening', () => {
        console.log(`WebSocket server running on ws://localhost:${server.address().port}/ws`);
      });
    }

    this.initialized = true;
  }

  /**
   * Register a client with a user ID
   * @param {WebSocket} ws - WebSocket connection
   * @param {string} userId - User ID
   */
  registerClient(ws, userId) {
    if (!userId) {
      console.error('[WebSocket] No user ID provided for registration');
      return;
    }

    console.log(`[WebSocket] Registering client for user ${userId}`);
    this.clients.set(ws, userId);

    // Send confirmation
    ws.send(JSON.stringify({
      type: 'registered',
      userId
    }));
  }

  /**
   * Remove a client connection
   * @param {WebSocket} ws - WebSocket connection
   */
  removeClient(ws) {
    if (this.clients.has(ws)) {
      const userId = this.clients.get(ws);
      console.log(`[WebSocket] Removing client for user ${userId}`);
      this.clients.delete(ws);
    }
  }

  /**
   * Send a notification to a specific user
   * @param {string} userId - User ID
   * @param {Object} notification - Notification data
   */
  sendNotification(userId, notification) {
    if (!this.initialized || !this.wss) {
      console.error('[WebSocket] Service not initialized');
      return;
    }

    console.log(`[WebSocket] Sending notification to user ${userId}`);

    // Find all connections for this user
    for (const [client, clientUserId] of this.clients.entries()) {
      if (clientUserId === userId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'notification',
          notification
        }));
      }
    }
  }

  /**
   * Broadcast a message to all connected clients
   * @param {Object} data - Data to broadcast
   */
  broadcast(data) {
    if (!this.initialized || !this.wss) {
      console.error('[WebSocket] Service not initialized');
      return;
    }

    console.log('[WebSocket] Broadcasting message to all clients');

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = new WebSocketService();