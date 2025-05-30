/**
 * EHB AI Agent Service
 * 
 * A minimal implementation of the AI Agent service
 * that can handle registration and heartbeat requests.
 */

const express = require('express');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory agent storage
const agents = {};

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>EHB AI Agent Service</title></head>
      <body>
        <h1>EHB AI Agent Service</h1>
        <p>Status: Running</p>
        <p>Registered Agents: ${Object.keys(agents).length}</p>
      </body>
    </html>
  `);
});

// API endpoints
app.post('/register', (req, res) => {
  const { agentId, name, type } = req.body;
  
  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }
  
  agents[agentId] = {
    name: name || 'Unnamed Agent',
    type: type || 'Generic',
    registeredAt: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString()
  };
  
  console.log(`Agent registered: ${agentId}`);
  
  res.json({ success: true, agentId });
});

app.post('/heartbeat', (req, res) => {
  const { agentId } = req.body;
  
  if (!agentId) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }
  
  if (!agents[agentId]) {
    agents[agentId] = {
      name: 'Dynamic Agent',
      type: 'Auto-registered',
      registeredAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString()
    };
    console.log(`Agent auto-registered during heartbeat: ${agentId}`);
  } else {
    agents[agentId].lastHeartbeat = new Date().toISOString();
  }
  
  res.json({ success: true });
});

app.get('/agents', (req, res) => {
  res.json({ agents });
});

// Compatibility with the API prefix
app.post('/api/register', (req, res) => {
  req.url = '/register';
  app.handle(req, res);
});

app.post('/api/heartbeat', (req, res) => {
  req.url = '/heartbeat';
  app.handle(req, res);
});

app.get('/api/agents', (req, res) => {
  req.url = '/agents';
  app.handle(req, res);
});

// Start the server
const PORT = 5131;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`EHB AI Agent Service running on port ${PORT}`);
  console.log(`Server is ready at http://0.0.0.0:${PORT}`);
});