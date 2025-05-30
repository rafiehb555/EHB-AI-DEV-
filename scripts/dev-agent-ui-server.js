/**
 * EHB Dev Agent UI Server
 * 
 * This script serves the Dev Agent UI on a specified port.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.DEV_AGENT_UI_PORT || 5011;

// Create Express app
const app = express();

// Serve static files from the ui directory
app.use(express.static(path.join(__dirname, 'dev-agent-ui')));

// Serve the UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dev-agent-ui', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`EHB Dev Agent UI running on port ${PORT}`);
  console.log(`Access the UI at http://localhost:${PORT}`);
});