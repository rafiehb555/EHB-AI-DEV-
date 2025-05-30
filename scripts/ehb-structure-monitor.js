/**
 * EHB Structure Monitoring System
 * This script watches for changes in the folder structure and enforces the EHB structure rules
 * Version: 1.0.0 - May 10, 2025
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');

// Load structure configuration
const structureConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../backup/folder-structure-log.json'), 'utf8'));

// Root categories that must exist
const ROOT_CATEGORIES = structureConfig.rootCategories;

// Service internal structure folders that must exist
const SERVICE_INTERNAL_STRUCTURE = structureConfig.serviceInternalStructure;

// WebSocket server for real-time sync
let wss;
try {
  wss = new WebSocket.Server({ port: 8080 });
  console.log('WebSocket server started on port 8080');
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        
        if (data.type === 'structure_check') {
          checkStructure();
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
  });
} catch (error) {
  console.error('Error starting WebSocket server:', error);
}

// Broadcast structure changes to all clients
function broadcastStructureChange(data) {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Ensure all root categories exist
function ensureRootCategories() {
  ROOT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(process.cwd(), category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`Created missing root category: ${category}`);
      broadcastStructureChange({
        type: 'category_created',
        category
      });
    }
  });
}

// Ensure service internal structure
function ensureServiceStructure(servicePath) {
  if (!fs.existsSync(servicePath) || !fs.statSync(servicePath).isDirectory()) {
    return;
  }
  
  const serviceName = path.basename(servicePath);
  console.log(`Checking structure for service: ${serviceName}`);
  
  SERVICE_INTERNAL_STRUCTURE.forEach(folder => {
    const folderPath = path.join(servicePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      
      // Create README.md file in the folder
      fs.writeFileSync(
        path.join(folderPath, 'README.md'),
        `# ${folder} directory for ${serviceName}\n\nThis directory was auto-created by the EHB Structure Monitoring System.`
      );
      
      console.log(`Created missing folder ${folder} in service: ${serviceName}`);
      broadcastStructureChange({
        type: 'folder_created',
        service: serviceName,
        folder
      });
    }
  });
  
  // Auto-install if package.json exists
  const packageJsonPath = path.join(servicePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log(`Found package.json in service: ${serviceName} - could run npm install if needed`);
  }
}

// Check and enforce structure across all services
function checkStructure() {
  console.log('Checking EHB structure...');
  
  // Ensure root categories
  ensureRootCategories();
  
  // Process all service directories across categories
  ROOT_CATEGORIES.forEach(category => {
    const categoryPath = path.join(process.cwd(), category);
    if (fs.existsSync(categoryPath)) {
      fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(categoryPath, dirent.name))
        .forEach(servicePath => {
          ensureServiceStructure(servicePath);
        });
    }
  });
  
  // Update structure log with timestamp
  const structureLog = JSON.parse(fs.readFileSync(path.join(__dirname, '../backup/folder-structure-log.json'), 'utf8'));
  structureLog.lastUpdate = new Date().toISOString();
  fs.writeFileSync(
    path.join(__dirname, '../backup/folder-structure-log.json'),
    JSON.stringify(structureLog, null, 2)
  );
  
  console.log('Structure check complete');
  broadcastStructureChange({
    type: 'structure_check_complete',
    timestamp: new Date().toISOString()
  });
}

// Watch for directory changes
function startWatcher() {
  const watcher = chokidar.watch(process.cwd(), {
    ignored: [
      /node_modules/,
      /.git/,
      /.next/,
      /backup\/ehb-agent-backups/
    ],
    persistent: true,
    ignoreInitial: true,
    depth: 3
  });
  
  console.log('Starting file system watcher...');
  
  watcher
    .on('addDir', path => {
      console.log(`Directory created: ${path}`);
      
      // Check if this is a service directory
      ROOT_CATEGORIES.forEach(category => {
        const categoryPath = `${process.cwd()}/${category}`;
        if (path.startsWith(categoryPath) && path !== categoryPath) {
          const relativePath = path.substring(process.cwd().length + 1);
          const parts = relativePath.split('/');
          
          // If this is a direct child of a category, treat it as a service
          if (parts.length === 2) {
            console.log(`New service detected: ${parts[1]} in category ${parts[0]}`);
            ensureServiceStructure(path);
          }
        }
      });
    })
    .on('unlinkDir', path => {
      console.log(`Directory removed: ${path}`);
    })
    .on('error', error => {
      console.error(`Watcher error: ${error}`);
    });
  
  console.log('File system watcher started');
}

// Main function
async function main() {
  try {
    // Initial structure check
    checkStructure();
    
    // Start the file system watcher
    startWatcher();
    
    // Schedule periodic structure checks
    setInterval(checkStructure, 3600000); // Check every hour
    
    console.log('EHB Structure Monitoring System is now running');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();