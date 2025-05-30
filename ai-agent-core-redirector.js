/**
 * AI Agent Core Redirector
 *
 * Redirects traffic from Replit-visible port 5128 → internal services
 * Acts as a stub for AI Agent Core when it's not available
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple in-memory state
const state = {
  agents: {},
  startTime: new Date(),
  heartbeats: {}
};

// Root endpoint
app.get('/', (req, res) => {
  res.send('AI Agent Core Redirector is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/healthz', (req, res) => {
  res.send('OK');
});

// AI core info
app.get('/ai-core', (req, res) => {
  const uptime = Math.floor((new Date() - state.startTime) / 1000);
  
  res.json({
    status: 'ok',
    uptime: `${uptime} seconds`,
    message: 'AI Agent Core Redirector is running',
    version: '1.0.0',
    registered_agents: Object.keys(state.agents),
    timestamp: new Date().toISOString()
  });
});

// Agent registration
app.post('/api/register', (req, res) => {
  try {
    const { agentId, name, version, type } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: agentId'
      });
    }
    
    state.agents[agentId] = {
      name: name || agentId,
      version: version || '1.0.0',
      type: type || 'unknown',
      registered: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };
    
    console.log(`Agent registered: ${agentId}`);
    
    res.json({
      status: 'success',
      message: 'Agent registered successfully',
      agentId: agentId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Registration endpoints (both with and without /api prefix)
app.post('/register', (req, res) => {
  req.url = '/api/register';
  app.handle(req, res);
});

// Heartbeat endpoint
app.post('/api/heartbeat', (req, res) => {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: agentId'
      });
    }
    
    if (!state.agents[agentId]) {
      return res.status(404).json({
        status: 'error',
        message: `Agent not found: ${agentId}. Please register first.`
      });
    }
    
    state.agents[agentId].lastSeen = new Date().toISOString();
    state.heartbeats[agentId] = (state.heartbeats[agentId] || 0) + 1;
    
    res.json({
      status: 'success',
      message: 'Heartbeat received',
      heartbeats: state.heartbeats[agentId]
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Heartbeat endpoint without /api prefix
app.post('/heartbeat', (req, res) => {
  req.url = '/api/heartbeat';
  app.handle(req, res);
});

// List all agents
app.get('/api/agents', (req, res) => {
  res.json({
    status: 'success',
    count: Object.keys(state.agents).length,
    agents: state.agents
  });
});

// List all agents without /api prefix
app.get('/agents', (req, res) => {
  req.url = '/api/agents';
  app.handle(req, res);
});

// Create HTTP server
const server = http.createServer(app);

// Start the server on port 5130 (use a different port to avoid conflicts)
const PORT = 5130;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Agent Core Redirector running on port ${PORT}`);
  console.log(`This redirector provides minimal functionality to allow dependent services to operate`);
});