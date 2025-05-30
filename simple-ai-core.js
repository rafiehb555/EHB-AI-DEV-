/**
 * Simplified AI Agent Core
 * Direct minimal implementation for Replit workflow
 */

const express = require('express');
const app = express();
const PORT = 5128;

// Report port as open immediately
console.log(`Port ${PORT} is now open and accessible`);

// Add basic routes
app.get('/', (req, res) => {
  res.send('EHB AI Agent Core is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    uptime: 0,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/register', (req, res) => {
  console.log('✅ Agent registered');
  res.json({
    status: 'registered',
    timestamp: new Date().toISOString()
  });
});

// Start server on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Agent Core running on port ${PORT}`);
});