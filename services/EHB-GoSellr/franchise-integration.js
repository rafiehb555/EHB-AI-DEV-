/**
 * Franchise System Integration for GoSellr
 * 
 * This script connects GoSellr with the EHB franchise system,
 * specifically with the ehb-gosellr-franchise in EHB-SUB-FRANCHISE.
 */

const fs = require('fs');
const path = require('path');

// Franchise system paths
const franchisePaths = {
  root: path.join(__dirname, '..', '..', 'system', 'franchise-system'),
  sub: path.join(__dirname, '..', '..', 'system', 'franchise-system', 'EHB-SUB-FRANCHISE'),
  gosellr: path.join(__dirname, '..', '..', 'system', 'franchise-system', 'EHB-SUB-FRANCHISE', 'ehb-gosellr-franchise')
};

// Connection status
const connections = {
  root: false,
  sub: false,
  gosellr: false
};

// Check franchise system paths
function checkFranchisePaths() {
  for (const [key, franchisePath] of Object.entries(franchisePaths)) {
    if (fs.existsSync(franchisePath)) {
      connections[key] = true;
      console.log(`Connected to franchise system (${key}) successfully`);
    } else {
      console.log(`Warning: Franchise system path (${key}) not found at ${franchisePath}`);
    }
  }
}

// Create franchise integration files
function createFranchiseIntegration() {
  // Only proceed if the gosellr franchise path exists
  if (!connections.gosellr) {
    console.log('Cannot create integration: GoSellr franchise path not found');
    return false;
  }
  
  try {
    // Create data directory if it doesn't exist
    const dataPath = path.join(franchisePaths.gosellr, 'data');
    
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    
    // Create integration information file
    const integrationInfo = {
      service: 'GoSellr E-commerce',
      integration_date: new Date().toISOString(),
      status: 'active',
      features: [
        'Franchise management',
        'Franchise analytics',
        'Commission tracking',
        'Franchise support system'
      ]
    };
    
    fs.writeFileSync(
      path.join(dataPath, 'integration-info.json'),
      JSON.stringify(integrationInfo, null, 2)
    );
    
    // Create sample franchise data
    const franchiseData = [
      {
        id: 1,
        name: 'GoSellr NYC',
        owner: 'John Smith',
        location: 'New York, NY',
        level: 'premium',
        monthly_sales: 45750,
        commission_rate: 12.5,
        status: 'active'
      },
      {
        id: 2,
        name: 'GoSellr LA',
        owner: 'Emily Johnson',
        location: 'Los Angeles, CA',
        level: 'standard',
        monthly_sales: 32450,
        commission_rate: 10.0,
        status: 'active'
      },
      {
        id: 3,
        name: 'GoSellr Chicago',
        owner: 'Michael Williams',
        location: 'Chicago, IL',
        level: 'basic',
        monthly_sales: 18750,
        commission_rate: 8.5,
        status: 'active'
      }
    ];
    
    fs.writeFileSync(
      path.join(dataPath, 'franchises.json'),
      JSON.stringify(franchiseData, null, 2)
    );
    
    // Create backend integration files if backend directory exists
    const backendPath = path.join(franchisePaths.gosellr, 'backend');
    
    if (fs.existsSync(backendPath)) {
      const apiPath = path.join(backendPath, 'api');
      
      if (!fs.existsSync(apiPath)) {
        fs.mkdirSync(apiPath, { recursive: true });
      }
      
      const apiInfo = {
        base_url: 'http://localhost:5002/api',
        endpoints: [
          { 
            path: '/franchise', 
            method: 'GET', 
            description: 'Get all franchises' 
          },
          { 
            path: '/franchise/:id', 
            method: 'GET', 
            description: 'Get franchise by ID' 
          },
          { 
            path: '/franchise/:id/analytics', 
            method: 'GET', 
            description: 'Get franchise analytics' 
          }
        ],
        authentication: 'JWT token required for all endpoints'
      };
      
      fs.writeFileSync(
        path.join(apiPath, 'gosellr-api.json'),
        JSON.stringify(apiInfo, null, 2)
      );
    }
    
    console.log('Created franchise integration files');
    return true;
  } catch (error) {
    console.error('Error creating franchise integration files:', error);
    return false;
  }
}

// Create a local franchise repository in the GoSellr system
function createLocalFranchiseRepository() {
  const franchisePath = path.join(__dirname, 'franchise');
  
  // Ensure the franchise directory exists
  if (!fs.existsSync(franchisePath)) {
    fs.mkdirSync(franchisePath, { recursive: true });
  }
  
  // Create a sub-dashboard directory
  const dashboardPath = path.join(franchisePath, 'sub-dashboard');
  
  if (!fs.existsSync(dashboardPath)) {
    fs.mkdirSync(dashboardPath, { recursive: true });
  }
  
  // Create a dashboard placeholder HTML file
  const dashboardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GoSellr Franchise Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { color: #3b82f6; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .status { color: green; font-weight: bold; }
    .franchise-list { list-style-type: none; padding: 0; }
    .franchise-item { padding: 12px; border: 1px solid #eee; margin-bottom: 10px; border-radius: 4px; }
    .franchise-name { font-weight: bold; font-size: 18px; }
    .franchise-details { display: flex; gap: 20px; margin-top: 10px; }
    .franchise-details div { flex: 1; }
    .label { color: #666; font-size: 12px; }
    .value { font-weight: bold; font-size: 16px; }
  </style>
</head>
<body>
  <h1>GoSellr Franchise Dashboard</h1>
  
  <div class="card">
    <h2>Franchise System Status</h2>
    <p>System Status: <span class="status">Connected</span></p>
    <p>Integration: Active with EHB-SUB-FRANCHISE</p>
  </div>
  
  <div class="card">
    <h2>Your Franchises</h2>
    <div class="franchise-list">
      <div class="franchise-item">
        <div class="franchise-name">GoSellr NYC</div>
        <div class="franchise-details">
          <div>
            <div class="label">Monthly Sales</div>
            <div class="value">$45,750</div>
          </div>
          <div>
            <div class="label">Commission Rate</div>
            <div class="value">12.5%</div>
          </div>
          <div>
            <div class="label">Status</div>
            <div class="value">Active</div>
          </div>
        </div>
      </div>
      
      <div class="franchise-item">
        <div class="franchise-name">GoSellr LA</div>
        <div class="franchise-details">
          <div>
            <div class="label">Monthly Sales</div>
            <div class="value">$32,450</div>
          </div>
          <div>
            <div class="label">Commission Rate</div>
            <div class="value">10.0%</div>
          </div>
          <div>
            <div class="label">Status</div>
            <div class="value">Active</div>
          </div>
        </div>
      </div>
      
      <div class="franchise-item">
        <div class="franchise-name">GoSellr Chicago</div>
        <div class="franchise-details">
          <div>
            <div class="label">Monthly Sales</div>
            <div class="value">$18,750</div>
          </div>
          <div>
            <div class="label">Commission Rate</div>
            <div class="value">8.5%</div>
          </div>
          <div>
            <div class="label">Status</div>
            <div class="value">Active</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <h2>System Links</h2>
    <ul>
      <li><a href="#">Franchise Management</a></li>
      <li><a href="#">Sales Reports</a></li>
      <li><a href="#">Inventory Management</a></li>
      <li><a href="#">Customer Support</a></li>
      <li><a href="#">Marketing Tools</a></li>
    </ul>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(dashboardPath, 'index.html'), dashboardHtml);
  
  // Create a configuration file linking to the ehb-gosellr-franchise folder
  const config = {
    name: 'GoSellr Franchise System',
    version: '1.0.0',
    integration_path: connections.gosellr ? franchisePaths.gosellr : null,
    status: connections.gosellr ? 'connected' : 'disconnected',
    last_sync: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(franchisePath, 'config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('Created local franchise repository');
}

// Main function
function integrateWithFranchiseSystem() {
  console.log('Starting franchise system integration...');
  
  // Check franchise paths
  checkFranchisePaths();
  
  // Create franchise integration
  const integrationSuccess = createFranchiseIntegration();
  
  // Create local franchise repository
  createLocalFranchiseRepository();
  
  console.log('Franchise system integration complete', 
    integrationSuccess ? 'successfully' : 'with some issues');
  
  return connections;
}

// Run the integration
if (require.main === module) {
  const results = integrateWithFranchiseSystem();
  console.log('Integration results:', results);
}

module.exports = {
  integrateWithFranchiseSystem,
  checkFranchisePaths,
  connections
};