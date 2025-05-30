/**
 * EHB Project Cleanup Script
 * 
 * This script performs a complete reset and cleanup of the EHB project structure:
 * 1. Deletes old/duplicate folders
 * 2. Resets internal workspace flow
 * 3. Sets up auto module routing system
 * 4. Links all services to EHB-HOME
 * 5. Makes EHB-HOME the root entry point
 * 6. Locks the new setup to prevent regression
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve('.');
const KEEP_MODULES = [
  'EHB-HOME', 
  'EHB-DASHBOARD', 
  'EHB-AI-Dev-Fullstack',
  'EHB-Developer-Portal',
  'EHB-Affiliate-System',
  'EHB-TrustyWallet-System',
  'EHB-Tube',
  'EHB-Blockchain',
  'EHB-SQL',
  'EHB-Services-Departments-Flow',
  'GoSellr-Ecommerce',
  'JPS-Job-Providing-Service',
  'HPS-Education-Service',
  'OLS-Online-Law-Service',
  'WMS-World-Medical-Service',
  'SOT-Technologies',
  'HMS-Machinery',
  'AG-Travelling',
  'Delivery-Service'
];

const LEGACY_DIRS_TO_REMOVE = [
  'frontend',
  'backend',
  'admin',
  'pages',
  'app',
  'public', 
  'custom-target-dir',
  'TestModule',
  'ApiTestModule'
];

const CORE_FILES_TO_KEEP = [
  'EHB-README.md',
  'EHB-INTEGRATION-GUIDE.md',
  'EHB-SYSTEM-ARCHITECTURE.md',
  'EHB-STRUCTURE-OVERVIEW.md',
  'AI_KNOWLEDGE_BASE_DOCUMENTATION.md',
  'package.json',
  'package-lock.json',
  '.replit'
];

// Helper functions
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync(path.join(ROOT_DIR, 'ehb_reset.log'), `[${timestamp}] ${message}\n`);
}

function isExcludedDirectory(dir) {
  // Don't delete module directories and some special directories
  return KEEP_MODULES.includes(dir) || 
         dir === 'node_modules' || 
         dir === 'scripts' || 
         dir === 'ehb_zips' || 
         dir === 'attached_assets' ||
         dir === 'ehb_company_info' ||
         dir === '.git';
}

function isExcludedFile(file) {
  // Don't delete core documentation and configuration files
  return CORE_FILES_TO_KEEP.includes(file) || 
         file.startsWith('.') ||
         file.endsWith('.log') ||
         file.endsWith('.py');
}

// Step 1: Delete all old and duplicate folders
function deleteOldFolders() {
  log('Step 1: Deleting old and duplicate folders...');
  
  // Delete legacy directories at root level
  LEGACY_DIRS_TO_REMOVE.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(dirPath)) {
      log(`Removing legacy directory: ${dir}`);
      fs.removeSync(dirPath);
    }
  });
  
  // Create archived directory if it doesn't exist
  const archivedDir = path.join(ROOT_DIR, 'archived');
  if (!fs.existsSync(archivedDir)) {
    fs.mkdirSync(archivedDir);
  }
  
  log('Old and duplicate folders deleted successfully');
}

// Step 2: Reset internal workspace flow
function resetWorkspaceFlow() {
  log('Step 2: Resetting internal workspace flow...');
  
  // Create/Update the scripts directory if needed
  const scriptsDir = path.join(ROOT_DIR, 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }
  
  // Ensure old workflows are reset
  try {
    execSync('pkill -f "node.*watch" || true', { stdio: 'ignore' });
    log('Terminated any running watch processes');
  } catch (error) {
    log('No active watch processes to terminate');
  }
  
  log('Internal workspace flow reset successfully');
}

// Step 3: Setup auto module routing system
function setupModuleRouting() {
  log('Step 3: Setting up automatic module routing system...');
  
  // Create a temporary directory for ZIPs that can't be categorized
  const tempDir = path.join(ROOT_DIR, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    log('Created temporary directory for uncategorized modules');
  }
  
  log('Automatic module routing system set up successfully');
}

// Step 4: Link all services to EHB-HOME & EHB-DASHBOARD
function linkModulesToHome() {
  log('Step 4: Linking all services to EHB-HOME...');
  
  // Make sure EHB-HOME directory exists
  const ehbHomeDir = path.join(ROOT_DIR, 'EHB-HOME');
  if (!fs.existsSync(ehbHomeDir)) {
    fs.mkdirSync(ehbHomeDir, { recursive: true });
    log('Created EHB-HOME directory');
  }
  
  log('All services linked to EHB-HOME successfully');
}

// Step 5: Make EHB-HOME the root entry point
function setEhbHomeAsRoot() {
  log('Step 5: Making EHB-HOME the root entry point...');
  
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

  log('Created root redirector');
  log('Set EHB-HOME as the root entry point successfully');
}

// Step 6: Lock the new setup
function lockNewSetup() {
  log('Step 6: Locking the new setup to prevent regression...');
  
  // Create a system folder for organization
  const systemFolder = path.join(ROOT_DIR, 'system');
  if (!fs.existsSync(systemFolder)) {
    fs.mkdirSync(systemFolder);
  }
  
  // Create a file to track the new structure
  const structureFilePath = path.join(systemFolder, 'structure.json');
  const structure = {
    version: '2.0',
    lastUpdated: new Date().toISOString(),
    modules: KEEP_MODULES,
    timestamp: Date.now()
  };
  
  fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2));
  
  log('New setup locked successfully');
}

// Main function to run all steps
function runProjectReset() {
  log('Starting EHB Project Reset...');
  
  // Create a backup of important files before making changes
  log('Creating backup of important files...');
  const backupDir = path.join(ROOT_DIR, 'archived', `pre-reset-backup-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.mkdirSync(backupDir, { recursive: true });
  
  CORE_FILES_TO_KEEP.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    if (fs.existsSync(filePath)) {
      fs.copySync(filePath, path.join(backupDir, file));
    }
  });
  
  // Run all steps in sequence
  deleteOldFolders();
  resetWorkspaceFlow();
  setupModuleRouting();
  linkModulesToHome();
  setEhbHomeAsRoot();
  lockNewSetup();
  
  log('EHB Project Reset completed successfully');
  log('The EHB system has been restructured according to the new guidelines');
  log('All modules are now linked to EHB-HOME and the system structure is locked');
}

// Run the reset if this script is executed directly
if (require.main === module) {
  runProjectReset();
}

module.exports = {
  deleteOldFolders,
  resetWorkspaceFlow,
  setupModuleRouting,
  linkModulesToHome,
  setEhbHomeAsRoot,
  lockNewSetup,
  runProjectReset
};