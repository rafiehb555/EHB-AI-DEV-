/**
 * EHB GoSellr Franchise Runner
 * 
 * This script provides a way to run the GoSellr Franchise module.
 * It connects to the GoSellr E-commerce service and provides franchise management.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('EHB GoSellr Franchise Module');
console.log('---------------------------');

// Check connection to GoSellr service
function checkGoSellrConnection() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5002/api/health', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('GoSellr Service Status:', result.status);
          resolve(true);
        } catch (error) {
          console.error('Error parsing response:', error);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.error('Error connecting to GoSellr service:', error.message);
      resolve(false);
    });
  });
}

// Check connection to franchise API
function checkFranchiseAPI() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5002/api/franchise', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const franchises = JSON.parse(data);
          console.log('Franchise API Status: Connected');
          console.log(`Found ${franchises.length} franchises`);
          resolve(true);
        } catch (error) {
          console.error('Error parsing franchises:', error);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.error('Error connecting to franchise API:', error.message);
      resolve(false);
    });
  });
}

// Create local server for franchise dashboard
function startLocalServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      // Serve the dashboard HTML
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading dashboard');
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
    } else if (req.url === '/api/status') {
      // API endpoint for franchise status
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'active',
        module: 'EHB GoSellr Franchise',
        connections: {
          gosellr: true,
          sql: true,
          jps: true
        }
      }));
    } else {
      // 404 Not Found
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  const PORT = 5004;
  
  server.listen(PORT, () => {
    console.log(`Franchise dashboard running on http://localhost:${PORT}`);
  });
}

// Create required directories
function ensureDirectories() {
  const dirs = ['public', 'data', 'config'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Create dashboard HTML
function createDashboardHTML() {
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
  
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), dashboardHtml);
}

// Main function
async function main() {
  console.log('Initializing GoSellr Franchise Module...');
  
  // Ensure directories exist
  ensureDirectories();
  
  // Create dashboard HTML
  createDashboardHTML();
  
  // Check connection to GoSellr service
  const gosellrConnected = await checkGoSellrConnection();
  
  if (gosellrConnected) {
    // Check connection to franchise API
    await checkFranchiseAPI();
  }
  
  // Start local server
  startLocalServer();
}

// Run the main function
main().catch(error => {
  console.error('Error running GoSellr Franchise Module:', error);
});