/**
 * Port Forwarding Service for EHB Free Agent API
 * 
 * This service creates a proxy that forwards requests from port 5030 to the 
 * actual EHB Free Agent API running on port 5130
 */
const http = require('http');
const { createProxyServer } = require('http-proxy');

// Create a proxy server instance
const proxy = createProxyServer({});

// Create the server
const server = http.createServer(function(req, res) {
  // Handle health checks without forwarding
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Port Forwarding Service',
      target: 'http://localhost:5130',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Log the request 
  console.log(`[${new Date().toISOString()}] Forwarding: ${req.method} ${req.url}`);
  
  // Forward the request to the real API server
  proxy.web(req, res, { 
    target: 'http://localhost:5130',
    changeOrigin: true
  });
});

// Handle proxy errors
proxy.on('error', function(err, req, res) {
  console.error(`[${new Date().toISOString()}] Proxy error:`, err);
  res.writeHead(502, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({
    error: 'Bad Gateway',
    message: 'Error connecting to Free Agent API',
    timestamp: new Date().toISOString()
  }));
});

// Add error handler for the server
server.on('error', (e) => {
  console.error(`[${new Date().toISOString()}] Server error:`, e.message);
  if (e.code === 'EADDRINUSE') {
    console.error(`Port 5040 is already in use. Trying again in 5 seconds...`);
    setTimeout(() => {
      server.close();
      server.listen(5040, '0.0.0.0');
    }, 5000);
  }
});

// Listen on port 5040 (available port)
const PORT = 5040;
server.listen(PORT, '0.0.0.0', () => {
  console.log('======================================');
  console.log('=== PORT FORWARDING SERVICE ACTIVE ===');
  console.log('======================================');
  console.log(`Forwarding port ${PORT} to http://localhost:5130`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`Started at: ${new Date().toISOString()}`);
  
  // Regular heartbeat for Replit workflow monitoring
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Port forwarding service active on port ${PORT}`);
  }, 5000);
});