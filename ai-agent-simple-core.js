/**
 * AI Agent Simple Core
 * 
 * This is a minimal implementation of the AI Agent Core service
 * that is guaranteed to start and respond to basic requests.
 * It's designed to allow other services to connect without errors.
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

// Create Express app
const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for registered agents
const agents = {};

// Root endpoint shows service status
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>AI Agent Simple Core</title></head>
      <body>
        <h1>AI Agent Simple Core</h1>
        <p>Status: Running</p>
        <p>Registered Agents: ${Object.keys(agents).length}</p>
        <p>This is a simplified implementation of the AI Agent Core.</p>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'AI Agent Simple Core is running',
    timestamp: new Date().toISOString()
  });
});

// API endpoint for agent registration
app.post('/register', (req, res) => {
  try {
    const { agentId, name, capabilities, source } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: 'Agent ID is required'
      });
    }
    
    agents[agentId] = {
      id: agentId,
      name: name || 'Unnamed Agent',
      capabilities: capabilities || [],
      source: source || 'unknown',
      status: 'registered',
      registered: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };
    
    console.log(`Agent registered: ${agentId} (${name || 'Unnamed Agent'})`);
    
    return res.status(200).json({
      success: true,
      agentId,
      message: 'Agent registered successfully'
    });
  } catch (error) {
    console.error('Error registering agent:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Function to handle agent heartbeat
function handleHeartbeat(req, res) {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: 'Agent ID is required'
      });
    }
    
    processHeartbeat(agentId, res);
  } catch (error) {
    console.error('Error processing heartbeat:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Process the heartbeat and update agent status
function processHeartbeat(agentId, res) {
  if (!agents[agentId]) {
    // Auto-register new agent if it doesn't exist
    agents[agentId] = {
      id: agentId,
      name: 'Auto-registered Agent',
      capabilities: [],
      source: 'heartbeat',
      status: 'active',
      registered: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };
    console.log(`Agent auto-registered: ${agentId}`);
  } else {
    // Update existing agent's last seen time
    agents[agentId].lastSeen = new Date().toISOString();
    agents[agentId].status = 'active';
  }
  
  return res.status(200).json({
    success: true,
    agentId,
    status: 'active',
    message: 'Heartbeat received'
  });
}

// API endpoint for agent heartbeat
app.post('/heartbeat', handleHeartbeat);

// Get all registered agents
app.get('/agents', (req, res) => {
  return res.status(200).json({
    success: true,
    count: Object.keys(agents).length,
    agents: agents
  });
});

// Get specific agent by ID
app.get('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  
  if (!agents[agentId]) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
  
  return res.status(200).json({
    success: true,
    agent: agents[agentId]
  });
});

// API endpoint for system status
function handleStatus(req, res) {
  const activeAgents = Object.values(agents).filter(agent => 
    agent.status === 'active' && 
    new Date(agent.lastSeen) > new Date(Date.now() - 30000) // Active in the last 30 seconds
  );
  
  return res.status(200).json({
    success: true,
    status: 'running',
    version: '1.0.0-simple',
    uptime: process.uptime(),
    agentCount: Object.keys(agents).length,
    activeAgents: activeAgents.length,
    timestamp: new Date().toISOString()
  });
}

// API endpoint for system status
app.get('/status', handleStatus);

// Support both /api prefixed routes for compatibility
app.post('/api/register', (req, res) => handleRegister(req, res));
app.post('/api/heartbeat', (req, res) => handleHeartbeat(req, res));
app.get('/api/agents', (req, res) => handleAgentsList(req, res));
app.get('/api/status', (req, res) => handleStatus(req, res));

// Handle agent registration
function handleRegister(req, res) {
  const { agentId, name, capabilities, source } = req.body;
  
  if (!agentId) {
    return res.status(400).json({
      success: false,
      error: 'Agent ID is required'
    });
  }
  
  agents[agentId] = {
    id: agentId,
    name: name || 'Unnamed Agent',
    capabilities: capabilities || [],
    source: source || 'unknown',
    status: 'registered',
    registered: new Date().toISOString(),
    lastSeen: new Date().toISOString()
  };
  
  console.log(`Agent registered: ${agentId} (${name || 'Unnamed Agent'})`);
  
  return res.status(200).json({
    success: true,
    agentId,
    message: 'Agent registered successfully'
  });
}

// Handle listing all agents
function handleAgentsList(req, res) {
  return res.status(200).json({
    success: true,
    count: Object.keys(agents).length,
    agents: agents
  });
}

// Create HTTP server
const PORT = 5128;
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Agent Simple Core running on port ${PORT}`);
  console.log(`Server is accessible at http://0.0.0.0:${PORT}`);
  console.log(`This core provides a simple API for agent registration and heartbeat`);
});