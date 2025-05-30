/**
 * Redirect script for Developer Portal
 * This script redirects to the EHB-Developer-Portal UI in the admin folder
 */

const http = require('http');

// Create a simple redirect server
const server = http.createServer((req, res) => {
  res.writeHead(302, {
    'Location': 'http://localhost:5010' + req.url
  });
  res.end();
});

// Start the server
const PORT = 4010;
server.listen(PORT, () => {
  console.log('======================================');
  console.log('===== DEVELOPER PORTAL REDIRECTOR ====');
  console.log('Redirecting all traffic to Developer Portal UI');
  console.log(`Running on port ${PORT}`);
  console.log('======================================');
});