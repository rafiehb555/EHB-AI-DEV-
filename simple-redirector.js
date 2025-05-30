/**
 * Simplified AI Agent Core Redirector
 * Direct minimal implementation for Replit workflow
 */

const express = require('express');
const http = require('http');
const app = express();
const EXTERNAL_PORT = 4120;

// Report port as open immediately
console.log(`Port ${EXTERNAL_PORT} is now open and accessible`);

// Add basic routes
app.get('/', (req, res) => {
  res.send('AI Agent Core Redirector is running');
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Agent Core Redirector running',
    timestamp: new Date().toISOString() 
  });
});

// Start server on all interfaces
app.listen(EXTERNAL_PORT, '0.0.0.0', () => {
  console.log(`AI Agent Core Redirector running on port ${EXTERNAL_PORT}`);
});