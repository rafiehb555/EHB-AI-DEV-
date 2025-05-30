/**
 * EHB-HOME Main Redirector
 * 
 * This script redirects all root traffic to the EHB-HOME module
 * which serves as the central entry point for all EHB services.
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({});

// Handle proxy errors
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: Could not connect to EHB-HOME service.');
});

// Create the server that will handle the redirects
const server = http.createServer(function(req, res) {
  // Log the incoming request
  console.log(`${new Date().toISOString()} - Request for ${req.url}`);
  
  // Redirect to the EHB-HOME service on port 5005
  proxy.web(req, res, { target: 'http://localhost:5005' });
});

// Listen on port 3003
const PORT = 3003;
server.listen(PORT, function() {
  console.log(`EHB-HOME Main Redirector running on port ${PORT}`);
  console.log(`All traffic will be redirected to EHB-HOME service on port 5005`);
});

// Periodically check if the EHB-HOME service is running
setInterval(function() {
  const http = require('http');
  const req = http.get('http://localhost:5005/health', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`EHB-HOME service health check: ${res.statusCode}`);
    });
  }).on('error', (err) => {
    console.log(`EHB-HOME service health check failed: ${err.message}`);
  });
  req.end();
}, 30000); // Check every 30 seconds
