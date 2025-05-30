const express = require('express');
const app = express();

// Load other required modules
const integrationService = require('./integrations');

// Initialize core systems
async function initializeSystems() {
  console.log('EHB-HOME: Running system integration...');
  console.log('EHB-HOME: Starting full integration process...');
  
  // Run the integration process
  const results = integrationService.runFullIntegration();
  
  // Display connection status
  console.log('======================================');
  console.log('Connected components:');
  console.log('SQLDEPARTMENTS:');
  console.log(`- PSS: ${integrationService.connections.sqlDepartments.pss ? 'connected' : 'disconnected'}`);
  console.log(`- EDR: ${integrationService.connections.sqlDepartments.edr ? 'connected' : 'disconnected'}`);
  console.log(`- EMO: ${integrationService.connections.sqlDepartments.emo ? 'connected' : 'disconnected'}`);
  console.log('SERVICES:');
  console.log(`- GOSELLR: ${integrationService.connections.services.gosellr ? 'connected' : 'disconnected'}`);
  console.log(`- JPS: ${integrationService.connections.services.jps ? 'connected' : 'disconnected'}`);
  console.log('SYSTEM:');
  console.log(`- BLOCKCHAIN: ${integrationService.connections.system.blockchain ? 'connected' : 'disconnected'}`);
  console.log(`- FRANCHISE: ${integrationService.connections.system.franchise ? 'connected' : 'disconnected'}`);
  console.log('ADMIN:');
  console.log(`- ADMINPANEL: ${integrationService.connections.admin.adminPanel ? 'connected' : 'disconnected'}`);
  console.log(`- DASHBOARD: ${integrationService.connections.admin.dashboard ? 'connected' : 'disconnected'}`);
  console.log(`- WALLET: ${integrationService.connections.admin.wallet ? 'connected' : 'disconnected'}`);
  console.log('EHB-HOME is fully operational.');
  
  console.log('EHB-HOME: Integration complete');
  return results;
}

// Create API routes
app.get('/api/services', (req, res) => {
  try {
    const dataPath = require('path').join(__dirname, 'data', 'cards', 'service-cards.json');
    const serviceData = require('fs').existsSync(dataPath) 
      ? JSON.parse(require('fs').readFileSync(dataPath, 'utf8')) 
      : [];
    
    res.json({ 
      success: true, 
      services: serviceData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve services data',
      message: err.message
    });
  }
});

app.get('/api/featured/gosellr', (req, res) => {
  try {
    const dataPath = require('path').join(__dirname, 'data', 'cards', 'featured', 'gosellr-card.json');
    const gosellrData = require('fs').existsSync(dataPath) 
      ? JSON.parse(require('fs').readFileSync(dataPath, 'utf8')) 
      : null;
    
    if (!gosellrData) {
      return res.status(404).json({
        success: false,
        error: 'GoSellr featured data not found'
      });
    }
    
    res.json({ 
      success: true, 
      service: gosellrData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve GoSellr featured data',
      message: err.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'EHB-HOME', timestamp: new Date().toISOString() });
});

// Serve static content
app.use(express.static('public'));

// Catch-all route to serve index.html for client-side routing
app.get('/', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

// Define specific routes
app.get('/services', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, '0.0.0.0', async () => {
  console.log('======================================');
  console.log('===== EHB-HOME SERVICE STARTED ======');
  console.log(`Access at: http://0.0.0.0:${PORT}`);
  console.log('======================================');

  await initializeSystems();
});