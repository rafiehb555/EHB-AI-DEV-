/**
 * Replit URL Redirector
 * 
 * This script creates a proxy server that redirects the Replit web view
 * directly to the EHB-HOME service running on port 5005.
 * 
 * Note: Replit's webview uses port 443, which will be forwarded to this script.
 */

const http = require('http');

// Target service: EHB-HOME running on port 5005
const TARGET_HOST = 'localhost';
const TARGET_PORT = 5005;

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  
  // Set up the request options for proxying
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  console.log(`[${new Date().toISOString()}] Forwarding to EHB-HOME at ${TARGET_HOST}:${TARGET_PORT}${req.url}`);
  
  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  // Handle errors in the proxy request
  proxyReq.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Proxy request error:`, err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Proxy Error: ${err.message}`);
  });
  
  // Pipe the original request to the proxy request
  req.pipe(proxyReq);
});

// Start the server on port 5000
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================`);
  console.log(`REPLIT WEB VIEW REDIRECTOR`);
  console.log(`===================================`);
  console.log(`Listening on port ${PORT}`);
  console.log(`Forwarding all traffic to EHB-HOME at ${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`===================================`);
});

// Handle server errors
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err);
});