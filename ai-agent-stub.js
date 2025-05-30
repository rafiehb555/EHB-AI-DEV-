/**
 * AI Agent Core Stub
 * This is a simple stub server to simulate the AI Agent Core
 * for services that need to connect to it.
 */

const http = require('http');
const PORT = 5128;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Received request: ${req.method} ${req.url}`);
  
  // Handle API endpoints
  if (req.url.startsWith('/api/register')) {
    // Handle agent registration
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log(`Agent registration payload: ${body}`);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Agent registered successfully',
        agent_id: 'stub-' + Date.now(),
        status: 'connected'
      }));
    });
  }
  else if (req.url.startsWith('/api/heartbeat')) {
    // Handle heartbeat
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }));
  }
  else if (req.url.startsWith('/api/task')) {
    // Handle task creation or retrieval
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      success: true,
      tasks: []
    }));
  }
  else {
    // Default response for other requests
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      name: 'AI Agent Core Stub',
      version: '1.0.0',
      status: 'running'
    }));
  }
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Agent Core Stub running on port ${PORT}`);
  console.log(`This stub provides minimal functionality to allow dependent services to operate`);
});