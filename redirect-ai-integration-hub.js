/**
 * AI Integration Hub Static Server
 * 
 * This script provides a simple HTTP server for the AI Integration Hub
 * without any dependencies on path-to-regexp or http-proxy-middleware.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 4200;
const PUBLIC_DIR = path.join(__dirname, 'services/SOT-Technologies/EHB-AI-Dev/ai-integration-hub/public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// MIME types for common file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

// Configuration for proxy to the real API server
const API_SERVER_HOST = 'localhost';
const API_SERVER_PORT = 5150;

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle API requests by proxying to the real API server
  if (req.url && req.url.startsWith('/api/')) {
    const options = {
      hostname: API_SERVER_HOST,
      port: API_SERVER_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${API_SERVER_HOST}:${API_SERVER_PORT}`
      }
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      console.error(`Proxy request error: ${err.message}`);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Bad Gateway', 
        message: 'Error connecting to API server',
        details: err.message 
      }));
    });
    
    req.pipe(proxyReq);
    return;
  }
  
  // Handle static file requests
  let filePath = PUBLIC_DIR + (req.url === '/' ? '/index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, serve index.html for SPA routing
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    
    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file: ' + err.code);
        return;
      }
      
      res.setHeader('Content-Type', contentType);
      res.writeHead(200);
      res.end(content, 'utf-8');
    });
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log('======================================');
  console.log('===== AI INTEGRATION HUB SERVER =====');
  console.log('Serving AI Integration Hub static files');
  console.log(`Running on port ${PORT}`);
  console.log('======================================');
});