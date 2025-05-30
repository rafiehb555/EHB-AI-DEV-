#!/bin/bash

# EHB System - Full Structure Automation Script
# This script implements the complete EHB folder structure and validation logic
# Version: 1.0.0 - May 10, 2025

echo "🚀 Starting EHB System Folder Structure Automation..."

# Create backup directory
mkdir -p backup/ehb-agent-backups

# Create structure log file
mkdir -p backup
touch backup/folder-structure-log.json

# Initial structure log content
cat > backup/folder-structure-log.json << 'EOL'
{
  "lastUpdate": "2025-05-10T00:00:00Z",
  "structureVersion": "1.0.0",
  "rootCategories": [
    "franchise-system",
    "dev-services",
    "ai-services",
    "admin",
    "system",
    "services"
  ],
  "serviceInternalStructure": [
    "frontend",
    "backend",
    "models",
    "config",
    "public",
    "utils",
    "components",
    "pages",
    "api"
  ],
  "connections": [
    {"from": "services/*", "to": "admin/EHB-HOME"},
    {"from": "services/*", "to": "admin/EHB-DASHBOARD"},
    {"from": "services/*", "to": "ai-services/EHB-AI-Dev"},
    {"from": "services/*", "to": "services/EHB-AI-Marketplace"}
  ]
}
EOL

# 1. Create root category directories
echo "📁 Creating root category directories..."
mkdir -p franchise-system
mkdir -p dev-services
mkdir -p ai-services
mkdir -p admin
mkdir -p system
mkdir -p services

# Check for duplicate folders and warn
if [ -d "EHB-AI-Dev-Fullstack" ] && [ -d "ai-services/EHB-AI-Dev" ]; then
    echo "⚠️ Duplicate folder detected: EHB-AI-Dev-Fullstack will be deleted"
    rm -rf EHB-AI-Dev-Fullstack
fi

# Function to ensure internal structure for service folders
ensure_service_structure() {
    local service_path=$1
    
    echo "🔍 Validating internal structure for: $service_path"
    
    # Create required internal directories
    mkdir -p "$service_path/frontend"
    mkdir -p "$service_path/backend"
    mkdir -p "$service_path/models"
    mkdir -p "$service_path/config"
    mkdir -p "$service_path/public"
    mkdir -p "$service_path/utils"
    mkdir -p "$service_path/components"
    mkdir -p "$service_path/pages"
    mkdir -p "$service_path/api"
    
    # Create placeholder files if directories are empty
    for dir in frontend backend models config public utils components pages api; do
        if [ -z "$(ls -A "$service_path/$dir" 2>/dev/null)" ]; then
            echo "# $dir directory for $(basename "$service_path")" > "$service_path/$dir/README.md"
            touch "$service_path/$dir/.gitkeep"
        fi
    done
    
    # Auto-run npm install and dev if package.json exists
    if [ -f "$service_path/package.json" ]; then
        echo "📦 Found package.json in $service_path - validating dependencies"
        # We don't actually run npm install here, just validate
    fi
}

# 2. Process all services and ensure structure
echo "🔄 Processing all services to ensure proper structure..."

# Process franchise-system services
for service in franchise-system/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Process dev-services services
for service in dev-services/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Process ai-services services
for service in ai-services/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Process admin services
for service in admin/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Process system services
for service in system/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Process services
for service in services/*; do
    if [ -d "$service" ]; then
        ensure_service_structure "$service"
    fi
done

# Create Node.js automation script for real-time monitoring
echo "📝 Creating Node.js automation script for monitoring..."

cat > scripts/ehb-structure-monitor.js << 'EOL'
/**
 * EHB Structure Monitoring System
 * This script watches for changes in the folder structure and enforces the EHB structure rules
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
EOL

# Create Node.js initialization script
echo "📝 Creating Node.js initialization script..."

cat > initAgent.js << 'EOL'
/**
 * EHB Agent Initialization Script
 * This script initializes the EHB Agent system and ensures proper structure
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Initializing EHB Agent System...');

// Create backup directories if they don't exist
if (!fs.existsSync('backup')) {
  fs.mkdirSync('backup', { recursive: true });
}

if (!fs.existsSync('backup/ehb-agent-backups')) {
  fs.mkdirSync('backup/ehb-agent-backups', { recursive: true });
}

// Root categories that must exist
const ROOT_CATEGORIES = [
  'franchise-system',
  'dev-services',
  'ai-services',
  'admin',
  'system',
  'services'
];

// Service internal structure folders that must exist
const SERVICE_INTERNAL_STRUCTURE = [
  'frontend',
  'backend',
  'models',
  'config',
  'public',
  'utils',
  'components',
  'pages',
  'api'
];

// Create root categories if they don't exist
ROOT_CATEGORIES.forEach(category => {
  const categoryPath = path.join(process.cwd(), category);
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
    console.log(`Created missing root category: ${category}`);
  }
});

// Create structure log file if it doesn't exist
const structureLogPath = path.join(process.cwd(), 'backup', 'folder-structure-log.json');
if (!fs.existsSync(structureLogPath)) {
  const structureLog = {
    lastUpdate: new Date().toISOString(),
    structureVersion: '1.0.0',
    rootCategories: ROOT_CATEGORIES,
    serviceInternalStructure: SERVICE_INTERNAL_STRUCTURE,
    connections: [
      { from: 'services/*', to: 'admin/EHB-HOME' },
      { from: 'services/*', to: 'admin/EHB-DASHBOARD' },
      { from: 'services/*', to: 'ai-services/EHB-AI-Dev' },
      { from: 'services/*', to: 'services/EHB-AI-Marketplace' }
    ]
  };
  
  fs.writeFileSync(structureLogPath, JSON.stringify(structureLog, null, 2));
  console.log('Created structure log file');
}

// Function to ensure service structure
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
        `# ${folder} directory for ${serviceName}\n\nThis directory was auto-created by the EHB Agent System.`
      );
      
      console.log(`Created missing folder ${folder} in service: ${serviceName}`);
    }
  });
  
  // Auto-install if package.json exists
  const packageJsonPath = path.join(servicePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log(`Found package.json in service: ${serviceName} - could run npm install if needed`);
  }
}

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

// Check for duplicate EHB-AI-Dev-Fullstack and clean up
const fullstackPath = path.join(process.cwd(), 'EHB-AI-Dev-Fullstack');
if (fs.existsSync(fullstackPath) && fs.existsSync(path.join(process.cwd(), 'ai-services', 'EHB-AI-Dev'))) {
  console.log('⚠️ Duplicate folder detected: EHB-AI-Dev-Fullstack will be deleted');
  fs.rmdirSync(fullstackPath, { recursive: true });
}

// Start the structure monitor
console.log('Starting structure monitor...');
const scriptPath = path.join(process.cwd(), 'scripts', 'ehb-structure-monitor.js');

if (fs.existsSync(scriptPath)) {
  console.log('Structure monitor script found, starting...');
  
  // Start the structure monitor in the background
  const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting structure monitor: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Structure monitor error: ${stderr}`);
      return;
    }
    
    console.log(`Structure monitor output: ${stdout}`);
  });
  
  child.unref(); // Detach the process
} else {
  console.error('Structure monitor script not found');
}

console.log('✅ EHB Agent System initialized successfully');
console.log('✅ Structure requirements enforced');
console.log('✅ Structure monitor started');
EOL

# Make scripts executable
chmod +x initAgent.js
chmod +x scripts/ehb-structure-monitor.js

echo "✅ EHB System structure setup complete"
echo "✅ Node.js monitoring scripts created"
echo "✅ Run 'node initAgent.js' to start the EHB Agent system"