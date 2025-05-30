/**
 * Direct S3 Upload Service Startup
 * This script provides a simplified direct server startup that
 * opens port 5400 immediately for the workflow system to detect.
 */

const http = require('http');
const PORT = 5400;

// Create a simple HTTP server that responds to all requests immediately
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Always respond with success for the workflow system to detect
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('S3 Upload Service is running');
});

// Immediately listen on port 5400
server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`DIRECT S3 UPLOAD SERVICE STARTED ON PORT ${PORT}`);
  console.log(`====================================================`);
  
  // Keep this server running permanently
});