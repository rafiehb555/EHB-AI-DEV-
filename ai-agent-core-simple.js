/**
 * Ultra Simple AI Agent Core Server
 * Minimal implementation for basic agent registration and heartbeat
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const http = require('http');

// Create Express application
const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());

// Simple state storage
const agents = {};
const startTime = Date.now();

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root endpoint with info
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>AI Agent Core</title></head>
    <body>
      <h1>AI Agent Core</h1>
      <p>Status: Running</p>
      <p>Uptime: ${Math.floor((Date.now() - startTime) / 1000)} seconds</p>
      <p>Registered Agents: ${Object.keys(agents).length}</p>
    </body>
    </html>
  `);
});

// Agent registration endpoint
app.post('/register', (req, res) => {
  const { agentId, name, capabilities } = req.body;
  
  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }
  
  agents[agentId] = {
    id: agentId,
    name: name || 'Unnamed Agent',
    capabilities: capabilities || [],
    registeredAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  
  console.log(`Agent registered: ${agentId}`);
  
  res.status(200).json({
    success: true,
    agentId,
    message: 'Agent registered successfully'
  });
});

// Heartbeat endpoint
app.post('/heartbeat', (req, res) => {
  const { agentId } = req.body;
  
  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }
  
  if (!agents[agentId]) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  agents[agentId].lastActive = new Date().toISOString();
  
  res.status(200).json({
    success: true,
    message: 'Heartbeat received'
  });
});

// List all registered agents
app.get('/agents', (req, res) => {
  res.status(200).json({
    count: Object.keys(agents).length,
    agents
  });
});

// For compatibility with existing API
app.post('/api/register', (req, res) => {
  // Forward to the new endpoint
  req.url = '/register';
  app.handle(req, res);
});

app.post('/api/heartbeat', (req, res) => {
  // Forward to the new endpoint
  req.url = '/heartbeat';
  app.handle(req, res);
});

app.get('/api/agents', (req, res) => {
  // Forward to the new endpoint
  req.url = '/agents';
  app.handle(req, res);
});

// Create HTTP server
const PORT = process.env.PORT || 5128;
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Agent Core server running on port ${PORT}`);
  console.log('Server is ready to accept connections');
});

// Handle errors
server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    
    // Try to exit gracefully
    process.exit(1);
  }
});

// Exit handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});