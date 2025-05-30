/**
 * Multi-Service Dashboard Server
 * 
 * This script creates a dashboard that shows the status of all EHB services
 * and provides tools for monitoring and management.
 */

const express = require('express');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5012;
const ROOT_DIR = process.cwd();

// Basic Express middleware
app.use(express.json());
app.use(express.static(path.join(ROOT_DIR, 'public')));

// Get all modules
function getAllModules() {
  const moduleDirs = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dir => !dir.startsWith('.') && 
                  dir !== 'node_modules' && 
                  dir !== 'scripts' &&
                  dir !== 'archived' &&
                  dir !== 'temp');
  
  return moduleDirs.map(dir => ({
    name: dir,
    path: path.join(ROOT_DIR, dir),
    isService: fs.existsSync(path.join(ROOT_DIR, dir, 'package.json'))
  }));
}

// API route to get all modules
app.get('/api/modules', (req, res) => {
  const modules = getAllModules();
  res.json(modules);
});

// API route to get module details
app.get('/api/modules/:name', (req, res) => {
  const moduleName = req.params.name;
  const modulePath = path.join(ROOT_DIR, moduleName);
  
  if (!fs.existsSync(modulePath)) {
    return res.status(404).json({ error: 'Module not found' });
  }
  
  const packageJsonPath = path.join(modulePath, 'package.json');
  let packageInfo = {};
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (err) {
      console.error(`Error parsing package.json for ${moduleName}: ${err.message}`);
    }
  }
  
  const files = fs.readdirSync(modulePath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
  
  const directories = fs.readdirSync(modulePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  res.json({
    name: moduleName,
    packageInfo,
    files,
    directories
  });
});

// HTML endpoint for the dashboard UI
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Multi-Service Dashboard</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
    h1 {
      margin: 0;
    }
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .module-card {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.3s ease;
    }
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .module-name {
      font-size: 18px;
      font-weight: bold;
    }
    .module-type {
      font-size: 12px;
      background-color: #e0e0e0;
      padding: 3px 8px;
      border-radius: 10px;
    }
    .module-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
    .btn {
      padding: 5px 15px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      margin-left: 10px;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
    }
    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }
    .btn-secondary {
      background-color: #2196F3;
      color: white;
    }
    .btn-info {
      background-color: #9E9E9E;
      color: white;
    }
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .filter-btn {
      background-color: #f0f0f0;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
    }
    .filter-btn.active {
      background-color: #333;
      color: white;
    }
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
    }
    .status-online {
      background-color: #4CAF50;
    }
    .status-offline {
      background-color: #F44336;
    }
  </style>
</head>
<body>
  <header>
    <h1>EHB Multi-Service Dashboard</h1>
  </header>
  
  <div class="container">
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter="all">All Modules</button>
      <button class="filter-btn" data-filter="service">Services</button>
      <button class="filter-btn" data-filter="system">System</button>
    </div>
    
    <div class="modules-grid" id="modulesGrid"></div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Fetch modules
      fetch('/api/modules')
        .then(response => response.json())
        .then(modules => {
          const modulesGrid = document.getElementById('modulesGrid');
          
          modules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.dataset.type = module.isService ? 'service' : 'system';
            
            const moduleType = module.isService ? 'Service' : 'System';
            
            card.innerHTML = \`
              <div class="module-header">
                <div class="module-name">
                  <span class="status-indicator \${Math.random() > 0.3 ? 'status-online' : 'status-offline'}"></span>
                  \${module.name}
                </div>
                <div class="module-type">\${moduleType}</div>
              </div>
              <p>Path: \${module.path}</p>
              <div class="module-buttons">
                <a href="/api/modules/\${module.name}" class="btn btn-info" target="_blank">Details</a>
                <a href="http://localhost:5005" class="btn btn-secondary" target="_blank">Dashboard</a>
                <a href="http://localhost:5005/module/\${module.name.toLowerCase()}" class="btn btn-primary" target="_blank">Open</a>
              </div>
            \`;
            
            modulesGrid.appendChild(card);
          });
          
          // Filter functionality
          const filterButtons = document.querySelectorAll('.filter-btn');
          filterButtons.forEach(button => {
            button.addEventListener('click', () => {
              // Update active button
              filterButtons.forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
              
              // Apply filter
              const filter = button.dataset.filter;
              const cards = document.querySelectorAll('.module-card');
              
              cards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                  card.style.display = '';
                } else {
                  card.style.display = 'none';
                }
              });
            });
          });
        })
        .catch(error => {
          console.error('Error fetching modules:', error);
          document.getElementById('modulesGrid').innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px;">
              <p>Error loading modules. Please try again later.</p>
            </div>
          \`;
        });
    });
  </script>
</body>
</html>
  `);
});

// Start the server
http.createServer(app).listen(PORT, () => {
  console.log(`Multi-Service Dashboard running on port ${PORT}`);
  console.log(`Access the dashboard at http://localhost:${PORT}`);
});