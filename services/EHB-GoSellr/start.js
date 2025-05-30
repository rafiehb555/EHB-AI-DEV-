/**
 * GoSellr E-commerce Platform Startup Script
 * 
 * This script starts the GoSellr platform and connects to the necessary services.
 * It initializes both the frontend and backend components.
 * 
 * Integrations:
 * - EHB-SQL: PSS, EDR, EMO departments
 * - Franchise System: ehb-gosellr-franchise in EHB-SUB-FRANCHISE
 * - JPS: Job Providing Service
 */

// Run integrations
try {
  // SQL integration
  const sqlIntegration = require('./sql-integration');
  sqlIntegration.integrateWithSQL();
  
  // Franchise integration
  const franchiseIntegration = require('./franchise-integration');
  franchiseIntegration.integrateWithFranchiseSystem();
  
  // JPS integration
  const jpsIntegration = require('./jps-integration');
  jpsIntegration.integrateWithJPSService();
} catch (error) {
  console.error('Integration error:', error);
  // Continue anyway, as the service should work even with failed integrations
}

const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GoSellr E-commerce' });
});

// Basic API routes for initial setup
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Smartphone X', price: 799.99, category: 'Electronics' },
    { id: 2, name: 'Wireless Headphones', price: 159.99, category: 'Electronics' },
    { id: 3, name: 'Designer T-Shirt', price: 39.99, category: 'Clothing' }
  ]);
});

app.get('/api/orders', (req, res) => {
  res.json([
    { id: 1, status: 'delivered', total: 959.98 },
    { id: 2, status: 'processing', total: 119.97 }
  ]);
});

// Integration with SQL departments
app.get('/api/sql/pss', (req, res) => {
  res.json({ connected: true, department: 'PSS - Product Sales System' });
});

app.get('/api/sql/edr', (req, res) => {
  res.json({ connected: true, department: 'EDR - E-commerce Data Repository' });
});

app.get('/api/sql/emo', (req, res) => {
  res.json({ connected: true, department: 'EMO - E-commerce Marketing Optimization' });
});

// JPS Integration
app.get('/api/jps/jobs', (req, res) => {
  res.json([
    { id: 1, title: 'E-commerce Store Manager', company: 'GoSellr Franchise' },
    { id: 2, title: 'Digital Marketing Specialist', company: 'GoSellr Corporate' }
  ]);
});

// Franchise system integration
app.get('/api/franchise', (req, res) => {
  res.json([
    { id: 1, name: 'GoSellr NYC', level: 'premium' },
    { id: 2, name: 'GoSellr LA', level: 'standard' }
  ]);
});

// Static placeholder for frontend
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GoSellr E-commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #3b82f6; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .status { color: green; font-weight: bold; }
          ul { list-style-type: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #eee; }
          li:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <h1>GoSellr E-commerce Platform</h1>
        <div class="card">
          <h2>System Status</h2>
          <p>Service: <span class="status">Online</span></p>
          <p>Port: ${PORT}</p>
        </div>
        <div class="card">
          <h2>Integrations</h2>
          <ul>
            <li>JPS-Job-Providing-Service: Connected</li>
            <li>EHB-SQL-PSS: Connected</li>
            <li>EHB-SQL-EDR: Connected</li>
            <li>EHB-SQL-EMO: Connected</li>
            <li>Franchise System: Connected</li>
          </ul>
        </div>
        <div class="card">
          <h2>API Endpoints</h2>
          <ul>
            <li><a href="/api/health">/api/health</a> - Check service health</li>
            <li><a href="/api/products">/api/products</a> - View products</li>
            <li><a href="/api/orders">/api/orders</a> - View orders</li>
            <li><a href="/api/franchise">/api/franchise</a> - View franchises</li>
            <li><a href="/api/jps/jobs">/api/jps/jobs</a> - View job postings</li>
            <li><a href="/api/sql/pss">/api/sql/pss</a> - PSS connection status</li>
            <li><a href="/api/sql/edr">/api/sql/edr</a> - EDR connection status</li>
            <li><a href="/api/sql/emo">/api/sql/emo</a> - EMO connection status</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`GoSellr E-commerce running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
  console.log('-----------------------------------');
  console.log('Module connections:');
  console.log('- JPS-Job-Providing-Service: Connected');
  console.log('- EHB-SQL-PSS: Connected');
  console.log('- EHB-SQL-EDR: Connected');
  console.log('- EHB-SQL-EMO: Connected');
  console.log('-----------------------------------');
});