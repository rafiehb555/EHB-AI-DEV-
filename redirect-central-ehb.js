/**
 * Enhanced Central EHB Redirection Script
 * 
 * This script intelligently routes users to different EHB services based on URL path.
 * It serves as the central gateway to all EHB ecosystem components.
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Define service endpoints
const services = {
  home: 'http://localhost:5005',        // EHB-HOME
  api: 'http://localhost:5001',         // Backend API
  admin: 'http://localhost:5000',       // Admin Panel
  gosellr: 'http://localhost:5002',     // GoSellr
  'dev-portal': 'http://localhost:5010', // Developer Portal
  'ai-core': 'http://localhost:5120',   // AI Agent Core
  playground: 'http://localhost:5050',  // Interactive Playground
  lang: 'http://localhost:5100',        // LangChain Service
  agent: 'http://localhost:5200'        // Agent Dashboard
};

// Create HTML index page showing all services
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EHB Central Gateway</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #2c3e50; }
      .service-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
      .service-card h3 { margin-top: 0; }
      .service-card a { display: inline-block; background: #3498db; color: white; padding: 8px 15px; 
                        text-decoration: none; border-radius: 4px; margin-top: 10px; }
      .service-card a:hover { background: #2980b9; }
    </style>
  </head>
  <body>
    <h1>EHB Enterprise System - Central Gateway</h1>
    <p>Welcome to the EHB Enterprise System. Select a service to access:</p>
    <div class="services">
      <div class="service-card">
        <h3>EHB Home Dashboard</h3>
        <p>The main dashboard for the EHB Enterprise System</p>
        <a href="/home">Access EHB Home</a>
      </div>
      <div class="service-card">
        <h3>Admin Panel</h3>
        <p>Administrative controls for the EHB system</p>
        <a href="/admin">Access Admin Panel</a>
      </div>
      <div class="service-card">
        <h3>AI Agent Core</h3>
        <p>Advanced AI capabilities for enterprise automation</p>
        <a href="/ai-core">Access AI Core</a>
      </div>
      <div class="service-card">
        <h3>Developer Portal</h3>
        <p>Resources and tools for developers</p>
        <a href="/dev-portal">Access Developer Portal</a>
      </div>
      <div class="service-card">
        <h3>GoSellr Platform</h3>
        <p>E-commerce management system</p>
        <a href="/gosellr">Access GoSellr</a>
      </div>
      <div class="service-card">
        <h3>Interactive Playground</h3>
        <p>Test and experiment with EHB components</p>
        <a href="/playground">Access Playground</a>
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Set up specific service routes with proxying
Object.entries(services).forEach(([path, target]) => {
  try {
    // Special handling for root path
    if (path === 'home') {
      app.get('/home', (req, res) => {
        res.redirect(target);
      });
    } else {
      // For all other services, set up a proxy
      app.use(`/${path}`, (req, res, next) => {
        console.log(`Routing request to ${path} service at ${target}`);
        
        // Always proxy all services including AI-Core
        try {
          const proxy = createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^/${path}`]: '' },
            ws: true, // Enable WebSocket support
            onError: (err, req, res) => {
              console.error(`Proxy error for ${path}: ${err.message}`);
              res.status(502).send(`<h1>Service Unavailable</h1><p>The ${path} service is currently unavailable.</p><p><a href="/">Return to Central Gateway</a></p>`);
            }
          });
          
          return proxy(req, res, next);
        } catch (err) {
          console.error(`Error proxying to ${path}: ${err.message}`);
          res.redirect(target);
        }
      });
    }
  } catch (err) {
    console.error(`Error setting up route for ${path}: ${err.message}`);
  }
});

// Fallback middleware - redirect to EHB-HOME for any unmatched routes
app.use((req, res) => {
  console.log(`Unmatched route ${req.path}, redirecting to EHB-HOME`);
  res.redirect(services.home);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error in request handling: ${err.message}`);
  res.status(500).send(`<h1>Server Error</h1><p>${err.message}</p><p><a href="/">Return to Central Gateway</a></p>`);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================`);
  console.log(`===== EHB CENTRAL REDIRECTOR ========`);
  console.log(`Intelligent routing to EHB services`);
  console.log(`Root server running on port ${PORT}`);
  console.log(`======================================`);
  console.log(`Available services:`);
  Object.entries(services).forEach(([path, target]) => {
    console.log(`- ${path}: ${target}`);
  });
  console.log(`======================================`);
});