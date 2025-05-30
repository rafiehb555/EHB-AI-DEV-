/**
 * EHB Developer Portal - Main Entry Point
 * 
 * This file bootstraps the EHB Developer Portal service.
 * It initializes the necessary components for documentation management,
 * system monitoring, and developer resources.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { initializeDeveloperPortal } = require('./register-in-integration-hub');
const { updateDocumentation } = require('./scripts/update-documentation');
const { updateStatus } = require('./scripts/update-status');
const moduleIntegrationClient = require('./services/moduleIntegrationClient');

// Configuration
const PORT = process.env.PORT || 5000;
const INTEGRATION_HUB_URL = 'http://localhost:5003';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static documentation files
app.use('/docs', express.static(path.join(__dirname, 'Backend-Routes')));
app.use('/services', express.static(path.join(__dirname, 'Service-Tree')));
app.use('/status', express.static(path.join(__dirname, 'Frontend-Logs')));
app.use('/db', express.static(path.join(__dirname, 'DB-Status')));
app.use('/setup', express.static(path.join(__dirname, 'Developer-Setup-Guide')));

// Root endpoint - Documentation index
app.get('/', (req, res) => {
  const content = fs.readFileSync(path.join(__dirname, 'README.txt'), 'utf8');
  
  // Try to get last update time from status summary file
  let lastUpdateTime = 'Not available';
  try {
    if (fs.existsSync(path.join(__dirname, 'Frontend-Logs', 'status-summary.md'))) {
      const statusContent = fs.readFileSync(path.join(__dirname, 'Frontend-Logs', 'status-summary.md'), 'utf8');
      const match = statusContent.match(/\*\*Generated:\*\* (.*)/);
      if (match && match[1]) {
        lastUpdateTime = new Date(match[1]).toLocaleString();
      }
    }
  } catch (error) {
    console.error('Error reading status summary:', error);
  }
  
  res.send(`
    <html>
      <head>
        <title>EHB Developer Portal</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #0066cc; }
          h2 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
          .section { margin-bottom: 30px; }
          ul { padding-left: 20px; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .status-bar { background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .status-indicator { font-weight: bold; }
          .update-button { background-color: #0066cc; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
          .update-button:hover { background-color: #0055aa; }
        </style>
      </head>
      <body>
        <h1>EHB Developer Portal</h1>
        
        <div class="status-bar">
          <div>
            <strong>Integration Hub:</strong> <span id="hub-status">Checking...</span>
          </div>
          <div>
            <strong>Last Updated:</strong> ${lastUpdateTime}
          </div>
          <div>
            <button class="update-button" id="update-button" onclick="triggerUpdate()">Update Now</button>
          </div>
        </div>
        
        <pre>${content}</pre>
        
        <div class="section">
          <h2>Documentation Sections</h2>
          <ul>
            <li><a href="/docs/api-documentation.md">API Documentation</a></li>
            <li><a href="/services/service-structure.md">Service Structure</a></li>
            <li><a href="/status/build-status.md">Frontend Status</a></li>
            <li><a href="/db/database-status.md">Database Status</a></li>
            <li><a href="/setup/setup-guide.md">Developer Setup Guide</a></li>
          </ul>
        </div>
        
        <div class="section">
          <h2>System Status</h2>
          <p>Check the <a href="/status/status-summary.md">system status summary</a> for an overview of all components.</p>
          <ul>
            <li><a href="/status/build-status.md">Frontend Status</a></li>
            <li><a href="/status/backend-status.md">Backend Status</a></li>
            <li><a href="/status/integration-hub-status.md">Integration Hub Status</a></li>
            <li><a href="/status/database-status.md">Database Status</a></li>
          </ul>
        </div>
        
        <script>
          // Fetch Integration Hub status
          fetch('/api/hub-status')
            .then(response => response.json())
            .then(data => {
              document.getElementById('hub-status').innerHTML = 
                data.online 
                  ? '<span style="color: green;">✅ Online</span>' 
                  : '<span style="color: red;">❌ Offline</span>';
            })
            .catch(error => {
              document.getElementById('hub-status').innerHTML = 
                '<span style="color: red;">❌ Error connecting to Integration Hub</span>';
            });
            
          // Function to trigger manual update
          function triggerUpdate() {
            const button = document.getElementById('update-button');
            button.disabled = true;
            button.textContent = 'Updating...';
            
            fetch('/api/trigger-update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Update completed successfully. Refreshing page...');
                window.location.reload();
              } else {
                alert('Update failed: ' + data.error);
                button.disabled = false;
                button.textContent = 'Update Now';
              }
            })
            .catch(error => {
              alert('Error triggering update: ' + error.message);
              button.disabled = false;
              button.textContent = 'Update Now';
            });
          }
        </script>
      </body>
    </html>
  `);
});

// API Endpoints

// Check Integration Hub status
app.get('/api/hub-status', async (req, res) => {
  try {
    const response = await axios.get(`${INTEGRATION_HUB_URL}/api/health`, { timeout: 3000 });
    res.json({ online: response.status === 200, data: response.data });
  } catch (error) {
    res.json({ online: false, error: error.message });
  }
});

// Update documentation from a module
app.post('/api/update-docs', (req, res) => {
  const { section, filename, content } = req.body;
  
  if (!section || !filename || !content) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields (section, filename, content)' 
    });
  }
  
  try {
    const sectionPath = path.join(__dirname, section);
    
    // Ensure the section directory exists
    if (!fs.existsSync(sectionPath)) {
      fs.mkdirSync(sectionPath, { recursive: true });
    }
    
    const filePath = path.join(sectionPath, filename);
    fs.writeFileSync(filePath, content);
    
    res.json({ 
      success: true, 
      message: `Documentation updated: ${section}/${filename}` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: `Failed to update documentation: ${error.message}` 
    });
  }
});

// Endpoint to manually trigger documentation update
app.post('/api/trigger-update', async (req, res) => {
  try {
    console.log('Manual update triggered');
    
    // Run documentation updates
    const docsResult = await updateDocumentation();
    
    // Run status updates
    const statusResult = await updateStatus();
    
    res.json({
      success: true,
      documentation: docsResult ? 'Updated successfully' : 'Update failed',
      status: statusResult ? 'Updated successfully' : 'Update failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to trigger update: ${error.message}`
    });
  }
});

// Start the server
async function startServer() {
  try {
    console.log('Initializing EHB Developer Portal...');

    // First register with the Integration Hub
    const registrationResult = await initializeDeveloperPortal();
    
    if (!registrationResult) {
      console.warn('Warning: Failed to register with Integration Hub. Continuing anyway...');
    }
    
    // Initialize Module Integration Client for direct module communication
    try {
      await moduleIntegrationClient.initialize();
      console.log('Module Integration Client initialized successfully');
      
      // Setup event listeners for document updates
      moduleIntegrationClient.on('documentation-update', (data) => {
        console.log('Received documentation update via Module Integration:', data.section || 'unknown section');
        updateDocumentation().catch(err => {
          console.error('Error processing documentation update:', err);
        });
      });
      
      // Setup event listeners for module registration events
      moduleIntegrationClient.on('module-update', (data) => {
        console.log('Received module update via Module Integration:', data.module || 'unknown module');
        updateStatus().catch(err => {
          console.error('Error processing module update:', err);
        });
      });
    } catch (moduleError) {
      console.warn('Warning: Failed to initialize Module Integration Client:', moduleError.message);
    }
    
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`EHB Developer Portal running on port ${PORT}`);
      console.log(`Access the documentation at http://localhost:${PORT}`);
    });
    
    // Run initial documentation and status updates
    console.log('Running initial documentation and status updates...');
    try {
      await updateDocumentation();
      await updateStatus();
      console.log('Initial updates completed successfully');
    } catch (updateError) {
      console.error('Error during initial updates:', updateError);
    }
    
    // Schedule periodic documentation updates (every 30 minutes)
    cron.schedule('*/30 * * * *', async () => {
      console.log('Running scheduled documentation update...');
      try {
        await updateDocumentation();
        console.log('Documentation update completed');
      } catch (error) {
        console.error('Scheduled documentation update failed:', error);
      }
    });
    
    // Schedule periodic status updates (every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running scheduled status update...');
      try {
        await updateStatus();
        console.log('Status update completed');
      } catch (error) {
        console.error('Scheduled status update failed:', error);
      }
    });
    
    return server;
  } catch (error) {
    console.error('Failed to start the Developer Portal:', error);
    process.exit(1);
  }
}

// Bootstrap the application
if (require.main === module) {
  startServer();
}

module.exports = app;