/**
 * Alternative Central Redirector
 * 
 * This script creates a central redirector that forwards requests 
 * to all the various EHB services based on URL path.
 */

const http = require('http');
const url = require('url');

// Target services
const services = {
  'home': { host: 'localhost', port: 5005 },
  'api': { host: 'localhost', port: 5001 },
  'gosellr': { host: 'localhost', port: 5002 },
  'dev-portal': { host: 'localhost', port: 5010 },
  'agent': { host: 'localhost', port: 5200 },
  'ai-hub': { host: 'localhost', port: 5150 },
  'admin': { host: 'localhost', port: 5020 },
  'lang': { host: 'localhost', port: 5100 },
  'playground': { host: 'localhost', port: 5050 },
  'mongodb': { host: 'localhost', port: 5300 },
  'free-agent': { host: 'localhost', port: 5130 },
  'jps': { host: 'localhost', port: 5000 }
};

// Default service to redirect to
const defaultService = 'home';

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  
  // Parse the URL to determine which service to route to
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  
  // Determine target service based on the first path segment
  let targetService = services[defaultService];
  let serviceName = defaultService;
  
  if (pathParts.length > 0 && services[pathParts[0]]) {
    targetService = services[pathParts[0]];
    serviceName = pathParts[0];
    // Remove the service name from the path
    req.url = '/' + pathParts.slice(1).join('/');
    if (parsedUrl.search) {
      req.url += parsedUrl.search;
    }
  }
  
  console.log(`[${new Date().toISOString()}] Routing to service [${serviceName}] - ${targetService.host}:${targetService.port}${req.url}`);
  
  // Set up the request options for proxying
  const options = {
    hostname: targetService.host,
    port: targetService.port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  // Handle errors in the proxy request
  proxyReq.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Proxy request error to [${serviceName}]:`, err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Proxy Error connecting to ${serviceName}: ${err.message}`);
  });
  
  // Pipe the original request to the proxy request
  req.pipe(proxyReq);
});

// Start the server
const PORT = 5060; // Changed to 5060 since 5050 is in use
server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================`);
  console.log(`EHB ALTERNATIVE CENTRAL REDIRECTOR`);
  console.log(`===================================`);
  console.log(`Listening on port ${PORT}`);
  console.log(`Default routing to: ${services[defaultService].host}:${services[defaultService].port}`);
  console.log(`Available services:`);
  Object.entries(services).forEach(([name, config]) => {
    console.log(`- ${name}: ${config.host}:${config.port}`);
  });
  console.log(`===================================`);
  console.log(`Examples: `);
  console.log(`- http://localhost:${PORT}/             -> EHB-HOME`);
  console.log(`- http://localhost:${PORT}/api/users    -> Backend API`);
  console.log(`- http://localhost:${PORT}/gosellr      -> GoSellr`);
  console.log(`- http://localhost:${PORT}/dev-portal   -> Developer Portal`);
  console.log(`===================================`);
});

// Handle server errors
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err);
});