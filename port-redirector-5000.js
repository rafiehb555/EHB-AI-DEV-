/**
 * Port 5000 Central Redirector
 * 
 * This script creates a unified entry point for all EHB services on port 5000,
 * which is the only port that is accessible externally via Replit.
 * 
 * This is the main entry point for all EHB services, consolidating
 * access through a single interface to simplify and streamline the architecture.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Target services
const services = {
  'home': { host: 'localhost', port: 5005 },
  'api': { host: 'localhost', port: 5001 },
  'gosellr': { host: 'localhost', port: 5002 },
  'dev-portal': { host: 'localhost', port: 5010 },
  'agent': { host: 'localhost', port: 5200 },
  'ai-hub': { host: 'localhost', port: 5150 },
  'admin': { host: 'localhost', port: 5020 },
  'lang': { host: 'localhost', port: 5100 },
  'playground': { host: 'localhost', port: 5050 },
  'mongodb': { host: 'localhost', port: 5300 },
  'free-agent': { host: 'localhost', port: 5130 },
  'ai-agent-core': { host: 'localhost', port: 5130 }, // Redirecting to EHB Free Agent API as temporary fix
  'ai-core': { host: 'localhost', port: 5120 }
};

// Default service to redirect to (EHB-HOME)
const defaultService = 'home';

// Basic HTML for a landing/navigation page when accessing the root
const generateLandingPage = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Unified Platform</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      background-color: #1a202c;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      margin: 0;
      font-size: 24px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .service-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }
    .service-card h3 {
      margin-top: 0;
      color: #2d3748;
      font-size: 18px;
    }
    .service-card p {
      color: #718096;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .service-card a {
      display: inline-block;
      background-color: #3182ce;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .service-card a:hover {
      background-color: #2c5282;
    }
    footer {
      margin-top: 40px;
      text-align: center;
      color: #718096;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <h1>EHB Unified Platform</h1>
  </header>
  
  <div class="services-grid">
    <div class="service-card">
      <h3>EHB Home</h3>
      <p>Central dashboard for the EHB platform.</p>
      <a href="/home">Access Dashboard</a>
    </div>
    
    <div class="service-card">
      <h3>Developer Portal</h3>
      <p>Resources and tools for developers.</p>
      <a href="/dev-portal">Open Portal</a>
    </div>
    
    <div class="service-card">
      <h3>Agent Dashboard</h3>
      <p>Manage and monitor AI agents.</p>
      <a href="/agent">Open Dashboard</a>
    </div>
    
    <div class="service-card">
      <h3>AI Integration Hub</h3>
      <p>Connect and manage AI integrations.</p>
      <a href="/ai-hub">Access Hub</a>
    </div>
    
    <div class="service-card">
      <h3>Playground</h3>
      <p>Test and experiment with the platform.</p>
      <a href="/playground">Open Playground</a>
    </div>
    
    <div class="service-card">
      <h3>Admin Panel</h3>
      <p>Administration tools for the platform.</p>
      <a href="/admin">Open Admin</a>
    </div>
    
    <div class="service-card">
      <h3>GoSellr</h3>
      <p>E-commerce solution integration.</p>
      <a href="/gosellr">Open GoSellr</a>
    </div>
    
    <div class="service-card">
      <h3>SQL Badge System</h3>
      <p>Track and display SQL proficiency levels with badges.</p>
      <a href="/api/sql-levels/badges">View Badges</a>
    </div>
    
    <div class="service-card">
      <h3>API Services</h3>
      <p>Backend API endpoints.</p>
      <a href="/api">API Documentation</a>
    </div>
  </div>
  
  <footer>
    <p>EHB Unified Platform © ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>
  `;
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  
  // Parse the URL to determine which service to route to
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  
  // Special case for root path - serve our landing page
  if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateLandingPage());
    return;
  }
  
  // Determine target service based on the first path segment
  let targetService = services[defaultService]; // Default to home
  let serviceName = defaultService;
  let newPath = req.url;
  
  // Special case for /api/services - this should go to EHB-HOME (port 5005)
  if (req.url.startsWith('/api/services')) {
    targetService = services['home'];
    serviceName = 'home';
    // Keep the full path as-is
    newPath = req.url;
  } else if (services[pathParts[0]]) {
    targetService = services[pathParts[0]];
    serviceName = pathParts[0];
    // Remove the service name from the path
    newPath = '/' + pathParts.slice(1).join('/');
    if (parsedUrl.search) {
      newPath += parsedUrl.search;
    }
  }
  
  console.log(`[${new Date().toISOString()}] Routing to service [${serviceName}] - ${targetService.host}:${targetService.port}${newPath}`);
  
  // Set up the request options for proxying
  const options = {
    hostname: targetService.host,
    port: targetService.port,
    path: newPath,
    method: req.method,
    headers: {
      ...req.headers,
      'X-Forwarded-Host': req.headers.host,
      'X-Forwarded-Proto': 'https'
    }
  };
  
  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  // Handle errors in the proxy request
  proxyReq.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Proxy request error to [${serviceName}]:`, err);
    
    // Serve a nice error page
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Service Unavailable</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          h1 { color: #e53e3e; }
          .card { background: #f8f9fa; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .back-link { display: inline-block; margin-top: 20px; color: #3182ce; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Service Temporarily Unavailable</h1>
          <p>The ${serviceName} service is currently unavailable. Please try again later.</p>
          <p>Error details: ${err.message}</p>
          <a href="/" class="back-link">Return to Homepage</a>
        </div>
      </body>
      </html>
    `);
  });
  
  // Pipe the original request to the proxy request
  req.pipe(proxyReq);
});

// Start the server on port 5000 (Replit's externally accessible port)
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================`);
  console.log(`EHB UNIFIED PLATFORM REDIRECTOR`);
  console.log(`===================================`);
  console.log(`Listening on port ${PORT} (Replit's externally accessible port)`);
  console.log(`Default routing to: ${services[defaultService].host}:${services[defaultService].port}`);
  console.log(`Available services:`);
  Object.entries(services).forEach(([name, config]) => {
    console.log(`- ${name}: ${config.host}:${config.port}`);
  });
  console.log(`===================================`);
  console.log(`Access URLs: `);
  console.log(`- https://<replit-url>/                -> Unified dashboard`);
  console.log(`- https://<replit-url>/home            -> EHB-HOME`);
  console.log(`- https://<replit-url>/api/users       -> Backend API`);
  console.log(`- https://<replit-url>/gosellr         -> GoSellr`);
  console.log(`- https://<replit-url>/dev-portal      -> Developer Portal`);
  console.log(`===================================`);
});

// Handle server errors
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err);
});