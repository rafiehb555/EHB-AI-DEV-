/**
 * EHB Test Service
 * 
 * This is a sample service module for testing the EHB Agent Installer.
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>EHB Test Service</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #3b82f6;
          }
          .status {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .success {
            color: #10b981;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>EHB Test Service</h1>
        <p>This is a sample service module for testing the EHB Agent Installer.</p>
        
        <div class="status">
          <p><span class="success">✓</span> Service installed successfully</p>
          <p><span class="success">✓</span> Registered with Developer Portal</p>
        </div>
        
        <h2>API Endpoints</h2>
        <ul>
          <li><code>GET /api/status</code> - Check service status</li>
          <li><code>GET /api/info</code> - Get service information</li>
        </ul>
      </body>
    </html>
  `);
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'running', uptime: process.uptime() });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'EHB-Test-Service',
    version: '1.0.0',
    description: 'Sample service for testing EHB Agent Installer',
    installedAt: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test Service running on port ${PORT}`);
});