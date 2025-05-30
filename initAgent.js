/**
 * EHB Agent Initialization Script
 * This script initializes the EHB Agent system and ensures proper structure
 * Version: 1.0.0 - May 10, 2025
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

console.log('🚀 Initializing EHB Agent System...');

// Create backup directories if they don't exist
if (!fs.existsSync('backup')) {
  fs.mkdirSync('backup', { recursive: true });
}

if (!fs.existsSync('backup/ehb-agent-backups')) {
  fs.mkdirSync('backup/ehb-agent-backups', { recursive: true });
}

// Ensure scripts directory exists
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts', { recursive: true });
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
  
  // Check for package.json
  const packageJsonPath = path.join(servicePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log(`Found package.json in service: ${serviceName}`);
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(servicePath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`node_modules not found in ${serviceName}, suggesting npm install`);
      // We don't auto-run npm install, just log the suggestion
    }
  }
}

// Create node event watcher for changes
function createMonitorScript() {
  const monitorScriptPath = path.join(process.cwd(), 'scripts', 'ehb-structure-monitor.js');
  
  if (!fs.existsSync(monitorScriptPath)) {
    const monitorScript = `/**
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
      console.log(\`Created missing root category: \${category}\`);
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
  console.log(\`Checking structure for service: \${serviceName}\`);
  
  SERVICE_INTERNAL_STRUCTURE.forEach(folder => {
    const folderPath = path.join(servicePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      
      // Create README.md file in the folder
      fs.writeFileSync(
        path.join(folderPath, 'README.md'),
        \`# \${folder} directory for \${serviceName}\\n\\nThis directory was auto-created by the EHB Structure Monitoring System.\`
      );
      
      console.log(\`Created missing folder \${folder} in service: \${serviceName}\`);
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
    console.log(\`Found package.json in service: \${serviceName} - could run npm install if needed\`);
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
      /backup\\/ehb-agent-backups/
    ],
    persistent: true,
    ignoreInitial: true,
    depth: 3
  });
  
  console.log('Starting file system watcher...');
  
  watcher
    .on('addDir', path => {
      console.log(\`Directory created: \${path}\`);
      
      // Check if this is a service directory
      ROOT_CATEGORIES.forEach(category => {
        const categoryPath = \`\${process.cwd()}/\${category}\`;
        if (path.startsWith(categoryPath) && path !== categoryPath) {
          const relativePath = path.substring(process.cwd().length + 1);
          const parts = relativePath.split('/');
          
          // If this is a direct child of a category, treat it as a service
          if (parts.length === 2) {
            console.log(\`New service detected: \${parts[1]} in category \${parts[0]}\`);
            ensureServiceStructure(path);
          }
        }
      });
    })
    .on('unlinkDir', path => {
      console.log(\`Directory removed: \${path}\`);
    })
    .on('error', error => {
      console.error(\`Watcher error: \${error}\`);
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

main();`;
    
    fs.writeFileSync(monitorScriptPath, monitorScript);
    console.log('Created structure monitor script');
  }
}

// Create workflow management script
function createWorkflowScript() {
  const workflowScriptPath = path.join(process.cwd(), 'scripts', 'ehb-workflow-manager.js');
  
  if (!fs.existsSync(workflowScriptPath)) {
    const workflowScript = `/**
 * EHB Workflow Manager
 * This script manages the workflows for the EHB system
 * Version: 1.0.0 - May 10, 2025
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Default workflow configurations
const DEFAULT_WORKFLOWS = [
  {
    name: 'Backend Server',
    command: 'cd admin/EHB-DASHBOARD/backend && node server.js',
    description: 'Runs the EHB Dashboard backend server'
  },
  {
    name: 'Frontend Server',
    command: 'cd admin/EHB-DASHBOARD && npm run dev',
    description: 'Runs the EHB Dashboard frontend server'
  },
  {
    name: 'Integration Hub',
    command: 'cd ai-services/EHB-AI-Dev && node index.js',
    description: 'Runs the Integration Hub for cross-service communication'
  },
  {
    name: 'Developer Portal',
    command: 'cd admin/EHB-Developer-Portal && PORT=5000 node index.js',
    description: 'Runs the Developer Portal for documentation and tools'
  },
  {
    name: 'JPS Affiliate Service',
    command: 'cd services/JPS-Job-Providing-Service && PORT=5000 node backend/server.js',
    description: 'Runs the Job Providing Service'
  },
  {
    name: 'EHB Home',
    command: 'cd admin/EHB-HOME && npm run dev',
    description: 'Runs the EHB Home module, the central dashboard'
  },
  {
    name: 'ZIP Watcher',
    command: 'node scripts/watch-assets.js',
    description: 'Monitors for new assets and ZIP files'
  },
  {
    name: 'Dev Agent System',
    command: 'node scripts/dev-agent-workflow.js',
    description: 'Runs the AI-powered developer agent system'
  },
  {
    name: 'Multi Service Dashboard',
    command: 'node scripts/multi-service-dashboard-server.js',
    description: 'Runs the multi-service monitoring dashboard'
  },
  {
    name: 'EHB Home Integrator',
    command: 'node scripts/ehb-home-integrator.js',
    description: 'Integrates all services with EHB Home module'
  }
];

// Create workflows directory if it doesn't exist
const workflowsDir = path.join(__dirname, 'workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

// Save default workflows
const workflowsPath = path.join(workflowsDir, 'workflows.json');
if (!fs.existsSync(workflowsPath)) {
  fs.writeFileSync(workflowsPath, JSON.stringify({ workflows: DEFAULT_WORKFLOWS }, null, 2));
  console.log('Created default workflows configuration');
}

// Function to start a workflow
function startWorkflow(workflow) {
  console.log(\`Starting workflow: \${workflow.name}\`);
  
  const [cmd, ...args] = workflow.command.split(' ');
  const proc = spawn(cmd, args, {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  proc.on('exit', (code) => {
    console.log(\`Workflow \${workflow.name} exited with code \${code}\`);
    
    // Auto-restart on crash after a delay
    setTimeout(() => {
      console.log(\`Automatically restarting workflow: \${workflow.name}\`);
      startWorkflow(workflow);
    }, 5000);
  });
  
  return proc;
}

// Function to start all workflows
function startAllWorkflows() {
  const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8')).workflows;
  const processes = {};
  
  workflows.forEach(workflow => {
    processes[workflow.name] = startWorkflow(workflow);
  });
  
  return processes;
}

// Export functions
module.exports = {
  startWorkflow,
  startAllWorkflows,
  DEFAULT_WORKFLOWS
};

// If this script is run directly, start all workflows
if (require.main === module) {
  console.log('Starting all workflows...');
  const processes = startAllWorkflows();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down all workflows...');
    
    Object.keys(processes).forEach(name => {
      console.log(\`Terminating workflow: \${name}\`);
      processes[name].kill();
    });
    
    setTimeout(() => {
      console.log('All workflows terminated. Exiting...');
      process.exit(0);
    }, 2000);
  });
}`;
    
    fs.writeFileSync(workflowScriptPath, workflowScript);
    console.log('Created workflow manager script');
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
  // Use try-catch in case there's an error deleting
  try {
    fs.rmdirSync(fullstackPath, { recursive: true });
  } catch (error) {
    console.error(`Error deleting duplicate folder: ${error.message}`);
  }
}

// Create monitoring and workflow scripts
createMonitorScript();
createWorkflowScript();

// Check if required packages are installed
try {
  require('chokidar');
  require('ws');
} catch (error) {
  console.log('⚠️ Required packages not found, installing chokidar and ws...');
  
  // Install required packages
  exec('npm install chokidar ws --save', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing packages: ${error.message}`);
      return;
    }
    
    console.log('Required packages installed successfully');
    console.log('✅ EHB Agent System initialized successfully');
  });
} finally {
  console.log('✅ Structure requirements enforced');
  console.log('✅ Monitoring scripts created');
  console.log('✅ Run "node scripts/ehb-structure-monitor.js" to start the structure monitor');
  console.log('✅ Run "node scripts/ehb-workflow-manager.js" to start all workflows');
}