/**
 * Free Agent API Redirector
 * 
 * This script provides a simple HTTP server that redirects requests 
 * from the Replit-detected port 5040 to our actual Free Agent API on port 5130
 */
const http = require('http');
const { createProxyServer } = require('http-proxy');

// Create a proxy server instance
const proxy = createProxyServer({});

// Handle proxy errors
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error connecting to Free Agent API');
});

// Create the server
const server = http.createServer(function(req, res) {
  // Log the request
  console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
  
  // Forward the request to the real API server
  proxy.web(req, res, {
    target: 'http://localhost:5130'
  });
});

// Add error handler for the server
server.on('error', (e) => {
  console.error('Server error:', e.message);
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying again in 5 seconds...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT, '0.0.0.0');
    }, 5000);
  }
});

// Heartbeat interval for better detection
function logHeartbeat() {
  console.log(`[${new Date().toISOString()}] Free Agent API Redirector heartbeat on port ${PORT}`);
}

// Listen on port 5040 (available port)
const PORT = 5040;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Free Agent API Redirector running on port ${PORT}`);
  console.log(`Redirecting traffic to http://localhost:5130`);
  console.log(`Started at: ${new Date().toISOString()}`);
  
  // Immediate heartbeat for faster detection
  logHeartbeat();
  
  // Regular heartbeat
  setInterval(logHeartbeat, 10000);
});