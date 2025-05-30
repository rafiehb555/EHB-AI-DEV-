/**
 * EHB Project Cleanup - Step 5: Make EHB-HOME the Root Entry Point
 */

const fs = require('fs-extra');
const path = require('path');

// Configuration
const ROOT_DIR = path.resolve('.');

// Helper functions
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync(path.join(ROOT_DIR, 'ehb_reset.log'), `[${timestamp}] ${message}\n`);
}

// Create root redirector
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Enterprise System</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      background-color: #f5f5f5;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
    .redirect-message {
      max-width: 600px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background-color: #4a70d8;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #3a5db8;
    }
  </style>
  <script>
    // Redirect to EHB-HOME after a brief delay
    setTimeout(function() {
      window.location.href = 'http://localhost:5005';
    }, 2000);
  </script>
</head>
<body>
  <div class="redirect-message">
    <h1>EHB Enterprise System</h1>
    <p>Redirecting to the EHB-HOME dashboard...</p>
    <a href="http://localhost:5005" class="button">Go Now</a>
  </div>
</body>
</html>`);
log('Created root redirector HTML');

// Create a simple server to serve the redirect page
const serverPath = path.join(ROOT_DIR, 'server.js');
fs.writeFileSync(serverPath, `/**
 * EHB Root Server
 * 
 * This simple server redirects users to the EHB-HOME dashboard.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes redirect to EHB-HOME
app.get('*', (req, res) => {
  res.redirect('http://localhost:5005');
});

// Start the server
app.listen(PORT, () => {
  console.log(\`EHB Root Server running on port \${PORT}\`);
  console.log(\`Visit http://localhost:\${PORT} to be redirected to EHB-HOME\`);
});`);
log('Created root redirector server');

// Create a system folder for organization
const systemFolder = path.join(ROOT_DIR, 'system');
if (!fs.existsSync(systemFolder)) {
  fs.mkdirSync(systemFolder);
  log('Created system folder');
}

// Create a file to track the new structure
const structureFilePath = path.join(systemFolder, 'structure.json');
const structure = {
  version: '2.0',
  lastUpdated: new Date().toISOString(),
  rootEntryPoint: 'EHB-HOME',
  homePort: 5005,
  timestamp: Date.now()
};

fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2));
log('Created structure tracking file');

log('Step 5: Set EHB-HOME as the root entry point successfully');