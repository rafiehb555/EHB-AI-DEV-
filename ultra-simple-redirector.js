/**
 * Ultra Simplified AI Agent Core Redirector
 * Absolute minimum implementation for Replit workflow
 */

const http = require('http');
const PORT = 4120;

// Create the simplest possible HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('AI Agent Core Redirector is running');
});

// Start the server immediately
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ultra Simple AI Agent Core Redirector running on port ${PORT}`);
  console.log(`Port ${PORT} is now open and accessible`);
});