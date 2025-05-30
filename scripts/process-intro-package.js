/**
 * EHB System Intro Package Processor
 * 
 * This script takes the extracted EHB-System-Intro-Package and moves
 * its contents to the appropriate locations in the EHB system structure.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const EXTRACT_DIRECTORY = path.join(process.cwd(), 'temp_extract');
const LOG_FILE = path.join(process.cwd(), 'logs', 'integration.log');

/**
 * Log a message with timestamp
 * @param {string} message 
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Console output
  console.log(logEntry);
  
  // File output
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

/**
 * Copy a directory recursively
 * @param {string} source 
 * @param {string} target 
 */
function copyDirectoryRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    logMessage(`Created directory: ${target}`);
  }
  
  const items = fs.readdirSync(source);
  
  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      logMessage(`Copied file: ${targetPath}`);
    }
  });
}

/**
 * Install a package if it's not already installed
 * @param {string} packageName 
 */
function installPackage(packageName) {
  try {
    require.resolve(packageName);
    logMessage(`Package ${packageName} is already installed`);
    return Promise.resolve();
  } catch (error) {
    logMessage(`Installing package ${packageName}...`);
    
    return new Promise((resolve, reject) => {
      exec(`npm install ${packageName}`, (error, stdout, stderr) => {
        if (error) {
          logMessage(`Failed to install ${packageName}: ${error.message}`);
          reject(error);
          return;
        }
        
        logMessage(`Package ${packageName} installed successfully`);
        resolve();
      });
    });
  }
}

/**
 * Process the EHB-AI-Dev-Phase-1 folder
 */
function processAIDevPhase1() {
  logMessage('Processing EHB-AI-Dev-Phase-1 folder');
  
  const sourcePath = path.join(EXTRACT_DIRECTORY, 'EHB-AI-Dev-Phase-1');
  const targetPath = path.join(process.cwd(), 'ai-services', 'EHB-AI-Dev');
  
  if (!fs.existsSync(sourcePath)) {
    logMessage(`Source directory not found: ${sourcePath}`);
    return;
  }
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    logMessage(`Created target directory: ${targetPath}`);
  }
  
  // Process each phase subfolder
  fs.readdirSync(sourcePath).forEach(item => {
    const sourceItemPath = path.join(sourcePath, item);
    
    if (fs.statSync(sourceItemPath).isDirectory()) {
      // Check if the directory follows a phase naming convention (e.g., frontend-phase1)
      const phaseMatch = item.match(/^(.+)-phase(\d+)$/);
      
      if (phaseMatch) {
        const baseDir = phaseMatch[1]; // e.g., 'frontend'
        const phaseDirPath = path.join(targetPath, baseDir);
        
        if (!fs.existsSync(phaseDirPath)) {
          fs.mkdirSync(phaseDirPath, { recursive: true });
          logMessage(`Created directory: ${phaseDirPath}`);
        }
        
        // Copy contents recursively
        copyDirectoryRecursive(sourceItemPath, phaseDirPath);
        logMessage(`Copied phased directory ${item} to ${phaseDirPath}`);
      } else {
        // Non-standard directory, copy as is
        const targetItemPath = path.join(targetPath, item);
        copyDirectoryRecursive(sourceItemPath, targetItemPath);
      }
    } else if (!item.includes('README')) {
      // Copy file (skip README)
      const targetItemPath = path.join(targetPath, item);
      fs.copyFileSync(sourceItemPath, targetItemPath);
      logMessage(`Copied file: ${targetItemPath}`);
    }
  });
  
  logMessage('EHB-AI-Dev-Phase-1 processed successfully');
}

/**
 * Process the Phase 5 folder
 */
function processPhase5() {
  logMessage('Processing Phase 5 folder');
  
  const sourcePath = path.join(EXTRACT_DIRECTORY, 'phase5', 'EHB-AI-Dev-Phase-5');
  const targetPath = path.join(process.cwd(), 'ai-services', 'EHB-AI-Dev');
  
  if (!fs.existsSync(sourcePath)) {
    logMessage(`Source directory not found: ${sourcePath}`);
    return;
  }
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    logMessage(`Created target directory: ${targetPath}`);
  }
  
  // Process each phase subfolder
  fs.readdirSync(sourcePath).forEach(item => {
    const sourceItemPath = path.join(sourcePath, item);
    
    if (fs.statSync(sourceItemPath).isDirectory()) {
      // Check if the directory follows a phase naming convention (e.g., frontend-phase5)
      const phaseMatch = item.match(/^(.+)-phase(\d+)$/);
      
      if (phaseMatch) {
        const baseDir = phaseMatch[1]; // e.g., 'frontend'
        const phaseDirPath = path.join(targetPath, baseDir);
        
        if (!fs.existsSync(phaseDirPath)) {
          fs.mkdirSync(phaseDirPath, { recursive: true });
          logMessage(`Created directory: ${phaseDirPath}`);
        }
        
        // Copy contents recursively
        copyDirectoryRecursive(sourceItemPath, phaseDirPath);
        logMessage(`Copied phased directory ${item} to ${phaseDirPath}`);
      } else {
        // Non-standard directory, copy as is
        const targetItemPath = path.join(targetPath, item);
        copyDirectoryRecursive(sourceItemPath, targetItemPath);
      }
    } else if (!item.includes('README')) {
      // Copy file (skip README)
      const targetItemPath = path.join(targetPath, item);
      fs.copyFileSync(sourceItemPath, targetItemPath);
      logMessage(`Copied file: ${targetItemPath}`);
    }
  });
  
  logMessage('Phase 5 processed successfully');
}

/**
 * Create system rulebook
 */
function createSystemRulebook() {
  logMessage('Creating system rulebook');
  
  const rulebookPath = path.join(process.cwd(), 'system', 'rules', 'EHB-System-Development-Rules.txt');
  
  const rulebookContent = `
📘 EHB SYSTEM DEVELOPMENT RULES
===============================

These rules must be followed for all EHB system development.

🏗️ File Structure
----------------
1. Each service should follow the standard EHB directory structure:
   - frontend/    - Next.js UI
   - backend/     - Express.js API
   - models/      - Database models
   - config/      - Configuration files
   - public/      - Static assets
   - utils/       - Utility functions
   - components/  - UI components (React)
   - pages/       - Next.js pages
   - api/         - API route handlers

2. All modules must auto-register with the Integration Hub.

3. Naming conventions must be consistent:
   - React components: PascalCase
   - Files: kebab-case
   - Functions: camelCase
   - Constants: UPPER_SNAKE_CASE

🔗 Integration Rules
------------------
1. All modules must register with /ai-services/EHB-AI-Dev.

2. New modules must be displayed in both:
   - /admin/EHB-HOME (user cards)
   - /admin/EHB-DASHBOARD (admin view)

3. Services must communicate via the Integration Hub APIs.

4. WebSocket notifications must use the central notification system.

⚙️ Development Rules
------------------
1. All code must be properly commented.

2. Error handling is mandatory for all API endpoints.

3. Environment variables must be used for all sensitive information.

4. AI features must have fallbacks for cases where API keys are missing.

5. All frontend changes must be responsive for mobile devices.

🔒 Security Rules
---------------
1. All API endpoints must validate input data.

2. JWT authentication must be used for protected routes.

3. Database queries must be parameterized to prevent injection.

4. File uploads must be validated for size and type.

5. All passwords must be hashed before storage.

📱 User Experience Rules
---------------------
1. All user actions must provide feedback (loading states, success/error messages).

2. Forms must include validation with clear error messages.

3. The UI must follow the EHB design system (colors, spacing, typography).

4. Performance optimization is required (code splitting, lazy loading).

5. Accessibility standards must be followed.
`;
  
  // Write rulebook file
  fs.writeFileSync(rulebookPath, rulebookContent);
  logMessage(`Created system rulebook: ${rulebookPath}`);
}

/**
 * Update package.json with required packages
 */
async function updatePackageJson() {
  logMessage('Updating package.json with required packages');
  
  // Packages to install
  const packages = [
    'adm-zip', 
    'express',
    'mongoose',
    'jsonwebtoken',
    'dotenv',
    'axios',
    'ws',
    'socket.io',
    'next',
    'react',
    'react-dom',
    'tailwindcss',
    'autoprefixer',
    'postcss',
    'chokidar'
  ];
  
  // Install each package
  for (const pkg of packages) {
    try {
      await installPackage(pkg);
    } catch (error) {
      logMessage(`Failed to install ${pkg}: ${error.message}`);
    }
  }
  
  logMessage('Package.json updated successfully');
}

/**
 * Create development workflow scripts
 */
function createWorkflowScripts() {
  logMessage('Creating development workflow scripts');
  
  const devAgentWorkflowPath = path.join(process.cwd(), 'scripts', 'dev-agent-workflow.js');
  
  const devAgentWorkflowContent = `/**
 * EHB Development Agent Workflow
 * 
 * This script manages the development workflow for the EHB system,
 * automating tasks like code generation, documentation, and testing.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Configuration
const API_PORT = 5010;
const UI_PORT = 5011;
const LOG_FILE = path.join(process.cwd(), 'logs', 'dev_agent.log');

/**
 * Log a message with timestamp
 * @param {string} message 
 * @param {string} level 
 */
function logMessage(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = \`[\${timestamp}] [\${level}] \${message}\\n\`;
  
  // Console output
  console.log(logEntry);
  
  // File output
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error(\`Failed to write to log file: \${error.message}\`);
  }
}

/**
 * Initialize task queue
 * @returns {Array} Task queue
 */
function initTaskQueue() {
  const queuePath = path.join(process.cwd(), 'system', 'dev_agent_queue.json');
  
  if (fs.existsSync(queuePath)) {
    try {
      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      logMessage(\`Loaded existing task queue with \${queue.length} tasks\`);
      return queue;
    } catch (error) {
      logMessage(\`Error loading task queue: \${error.message}\`, 'ERROR');
    }
  }
  
  logMessage('No existing task queue found, starting with empty queue');
  return [];
}

/**
 * Save task queue
 * @param {Array} queue 
 */
function saveTaskQueue(queue) {
  const queuePath = path.join(process.cwd(), 'system', 'dev_agent_queue.json');
  
  try {
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    logMessage(\`Saved task queue with \${queue.length} tasks\`);
  } catch (error) {
    logMessage(\`Error saving task queue: \${error.message}\`, 'ERROR');
  }
}

/**
 * Start the development agent
 */
function startDevAgent() {
  logMessage('Starting EHB Auto Development Agent');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Initialize task queue
  const taskQueue = initTaskQueue();
  
  // Add a sample task if queue is empty
  if (taskQueue.length === 0) {
    taskQueue.push({
      id: 'task-' + Date.now(),
      type: 'code-generation',
      name: 'Create EHB Structure Monitor',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high',
      description: 'Create a structure monitoring service that checks the EHB folder structure for consistency and automatically fixes issues.'
    });
    
    saveTaskQueue(taskQueue);
  }
  
  logMessage('Auto Development Agent started successfully');
  
  return {
    taskQueue
  };
}

/**
 * Start the API server
 * @param {Object} agent 
 */
function startApiServer(agent) {
  const app = express();
  const server = http.createServer(app);
  
  // Middleware
  app.use(express.json());
  
  // Routes
  app.get('/api/tasks', (req, res) => {
    res.json(agent.taskQueue);
  });
  
  app.post('/api/tasks', (req, res) => {
    const task = {
      id: 'task-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };
    
    agent.taskQueue.push(task);
    saveTaskQueue(agent.taskQueue);
    
    res.status(201).json(task);
  });
  
  app.get('/api/tasks/:id', (req, res) => {
    const task = agent.taskQueue.find(t => t.id === req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  });
  
  app.put('/api/tasks/:id', (req, res) => {
    const index = agent.taskQueue.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    agent.taskQueue[index] = {
      ...agent.taskQueue[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    saveTaskQueue(agent.taskQueue);
    
    res.json(agent.taskQueue[index]);
  });
  
  app.delete('/api/tasks/:id', (req, res) => {
    const index = agent.taskQueue.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = agent.taskQueue[index];
    agent.taskQueue.splice(index, 1);
    saveTaskQueue(agent.taskQueue);
    
    res.json(task);
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    logMessage(\`API error: \${err.message}\`, 'ERROR');
    res.status(500).json({ error: err.message });
  });
  
  // Start server
  server.listen(API_PORT, () => {
    logMessage(\`EHB API Development Agent running on port \${API_PORT}\`);
    logMessage(\`API available at http://localhost:\${API_PORT}/api\`);
    
    try {
      require('replit-workflows').register('Dev Agent API', \`node \${__filename}\`);
    } catch (error) {
      logMessage(\`Could not register as a workflow: \${error.message}\`);
    }
  });
}

/**
 * Start the UI server
 */
function startUiServer() {
  const app = express();
  const server = http.createServer(app);
  
  // Serve static files
  app.use(express.static(path.join(__dirname, 'dev_agent_ui')));
  
  // Serve UI
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dev_agent_ui', 'index.html'));
  });
  
  // Start server
  server.listen(UI_PORT, () => {
    logMessage(\`EHB Dev Agent UI running on port \${UI_PORT}\`);
    logMessage(\`Access the UI at http://localhost:\${UI_PORT}\`);
    
    try {
      require('replit-workflows').register('Dev Agent UI', \`node \${__filename}\`);
    } catch (error) {
      // Already registered above, just ignore
    }
  });
}

/**
 * Main function
 */
function main() {
  console.log('Starting EHB Auto Development Agent system...');
  
  // Start the development agent
  const agent = startDevAgent();
  console.log('Auto Development Agent started');
  
  // Start the API server
  startApiServer(agent);
  console.log('API server started on port ' + API_PORT);
  
  // Start the UI server
  startUiServer();
  console.log('UI server started on port ' + UI_PORT);
  
  console.log('EHB Auto Development Agent system is now running');
  console.log('- Agent: Running in background');
  console.log(\`- API: http://localhost:\${API_PORT}/api\`);
  console.log(\`- UI: http://localhost:\${UI_PORT}\`);
  console.log('Access the UI to start developing multiple services simultaneously');
}

// Run the main function
main();`;
  
  const multiServiceDashboardPath = path.join(process.cwd(), 'scripts', 'multi-service-dashboard-server.js');
  
  const multiServiceDashboardContent = `/**
 * EHB Multi-Service Dashboard
 * 
 * This script creates a dashboard for monitoring and managing multiple EHB services.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = 5012;

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send(\`
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
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        .services {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .service-card {
          background-color: #f9f9f9;
          border-radius: 5px;
          padding: 15px;
          border: 1px solid #ddd;
        }
        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .service-title {
          font-weight: bold;
          font-size: 1.2em;
          margin: 0;
        }
        .status {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .status.running {
          background-color: #4caf50;
        }
        .status.stopped {
          background-color: #f44336;
        }
        .service-actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }
        .service-actions button {
          padding: 5px 10px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          background-color: #4285f4;
          color: white;
        }
        .service-actions button:hover {
          background-color: #3367d6;
        }
        .service-details {
          margin-top: 10px;
          font-size: 0.9em;
        }
        .service-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .service-info .label {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>EHB Multi-Service Dashboard</h1>
        <div class="services" id="services-container">
          <!-- Services will be populated here -->
          <div class="service-card">
            <div class="service-header">
              <h3 class="service-title">EHB Dashboard</h3>
              <span class="status running" title="Running"></span>
            </div>
            <div class="service-details">
              <div class="service-info">
                <span class="label">Port:</span>
                <span>5006</span>
              </div>
              <div class="service-info">
                <span class="label">Status:</span>
                <span>Running</span>
              </div>
              <div class="service-info">
                <span class="label">URL:</span>
                <span><a href="http://localhost:5006" target="_blank">http://localhost:5006</a></span>
              </div>
            </div>
            <div class="service-actions">
              <button>View Logs</button>
              <button>Restart</button>
              <button>Stop</button>
            </div>
          </div>
          
          <div class="service-card">
            <div class="service-header">
              <h3 class="service-title">EHB Home</h3>
              <span class="status running" title="Running"></span>
            </div>
            <div class="service-details">
              <div class="service-info">
                <span class="label">Port:</span>
                <span>5005</span>
              </div>
              <div class="service-info">
                <span class="label">Status:</span>
                <span>Running</span>
              </div>
              <div class="service-info">
                <span class="label">URL:</span>
                <span><a href="http://localhost:5005" target="_blank">http://localhost:5005</a></span>
              </div>
            </div>
            <div class="service-actions">
              <button>View Logs</button>
              <button>Restart</button>
              <button>Stop</button>
            </div>
          </div>
          
          <div class="service-card">
            <div class="service-header">
              <h3 class="service-title">Backend Server</h3>
              <span class="status running" title="Running"></span>
            </div>
            <div class="service-details">
              <div class="service-info">
                <span class="label">Port:</span>
                <span>5000</span>
              </div>
              <div class="service-info">
                <span class="label">Status:</span>
                <span>Running</span>
              </div>
              <div class="service-info">
                <span class="label">URL:</span>
                <span><a href="http://localhost:5000/api" target="_blank">http://localhost:5000/api</a></span>
              </div>
            </div>
            <div class="service-actions">
              <button>View Logs</button>
              <button>Restart</button>
              <button>Stop</button>
            </div>
          </div>
          
          <div class="service-card">
            <div class="service-header">
              <h3 class="service-title">Integration Hub</h3>
              <span class="status running" title="Running"></span>
            </div>
            <div class="service-details">
              <div class="service-info">
                <span class="label">Port:</span>
                <span>5003</span>
              </div>
              <div class="service-info">
                <span class="label">Status:</span>
                <span>Running</span>
              </div>
              <div class="service-info">
                <span class="label">URL:</span>
                <span><a href="http://localhost:5003/api" target="_blank">http://localhost:5003/api</a></span>
              </div>
            </div>
            <div class="service-actions">
              <button>View Logs</button>
              <button>Restart</button>
              <button>Stop</button>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // This would be replaced with actual API calls to get service status
        // and handle actions like restart, stop, etc.
        document.addEventListener('DOMContentLoaded', () => {
          console.log('Dashboard loaded');
          
          // Add click handlers for buttons
          document.querySelectorAll('.service-actions button').forEach(button => {
            button.addEventListener('click', () => {
              alert('This functionality is not implemented yet');
            });
          });
        });
      </script>
    </body>
    </html>
  \`);
});

// API endpoint to get services
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 'ehb-dashboard',
      name: 'EHB Dashboard',
      port: 5006,
      status: 'running',
      url: 'http://localhost:5006'
    },
    {
      id: 'ehb-home',
      name: 'EHB Home',
      port: 5005,
      status: 'running',
      url: 'http://localhost:5005'
    },
    {
      id: 'backend-server',
      name: 'Backend Server',
      port: 5000,
      status: 'running',
      url: 'http://localhost:5000/api'
    },
    {
      id: 'integration-hub',
      name: 'Integration Hub',
      port: 5003,
      status: 'running',
      url: 'http://localhost:5003/api'
    }
  ];
  
  res.json(services);
});

// Start server
server.listen(PORT, () => {
  console.log(\`Multi-Service Dashboard running on port \${PORT}\`);
  console.log(\`Access the dashboard at http://localhost:\${PORT}\`);
});
`;
  
  const ehbHomeIntegratorPath = path.join(process.cwd(), 'scripts', 'ehb-home-integrator.js');
  
  const ehbHomeIntegratorContent = `/**
 * EHB-HOME Integrator
 * 
 * This script automatically updates the EHB-HOME dashboard with new modules
 * and ensures proper integration between all EHB services.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const chokidar = require('chokidar');

// Configuration
const EHB_HOME_DIR = path.join(process.cwd(), 'EHB-HOME');
const SERVICES_DIR = path.join(process.cwd(), 'services');
const AI_SERVICES_DIR = path.join(process.cwd(), 'ai-services');
const INTEGRATION_HUB_URL = 'http://localhost:5003';
const LOG_FILE = path.join(process.cwd(), 'logs', 'ehb_home_integration.log');

/**
 * Log a message with timestamp
 * @param {string} message 
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = \`[\${timestamp}] \${message}\\n\`;
  
  // Console output
  console.log(logEntry);
  
  // File output
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error(\`Failed to write to log file: \${error.message}\`);
  }
}

/**
 * Find all EHB modules in services and ai-services directories
 * @returns {Array} Array of module information
 */
function findEhbModules() {
  const modules = [];
  
  // Check services directory
  if (fs.existsSync(SERVICES_DIR)) {
    fs.readdirSync(SERVICES_DIR).forEach(moduleName => {
      const modulePath = path.join(SERVICES_DIR, moduleName);
      
      if (fs.statSync(modulePath).isDirectory()) {
        // Get module capabilities
        const capabilities = getModuleCapabilities(modulePath);
        
        modules.push({
          name: moduleName,
          path: modulePath,
          type: 'service',
          capabilities
        });
      }
    });
  }
  
  // Check ai-services directory
  if (fs.existsSync(AI_SERVICES_DIR)) {
    fs.readdirSync(AI_SERVICES_DIR).forEach(moduleName => {
      const modulePath = path.join(AI_SERVICES_DIR, moduleName);
      
      if (fs.statSync(modulePath).isDirectory()) {
        // Get module capabilities
        const capabilities = getModuleCapabilities(modulePath);
        
        modules.push({
          name: moduleName,
          path: modulePath,
          type: 'ai-service',
          capabilities
        });
      }
    });
  }
  
  return modules;
}

/**
 * Get module capabilities based on its structure
 * @param {string} modulePath 
 * @returns {Array} List of capabilities
 */
function getModuleCapabilities(modulePath) {
  const capabilities = [];
  
  // Check for backend capabilities
  if (fs.existsSync(path.join(modulePath, 'backend'))) {
    capabilities.push('api');
  }
  
  // Check for frontend capabilities
  if (fs.existsSync(path.join(modulePath, 'frontend'))) {
    capabilities.push('ui');
  }
  
  // Check for AI capabilities
  if (fs.existsSync(path.join(modulePath, 'agent')) || 
      fs.existsSync(path.join(modulePath, 'models')) || 
      fs.existsSync(path.join(modulePath, 'brain'))) {
    capabilities.push('ai');
  }
  
  return capabilities;
}

/**
 * Update moduleConfig.js in EHB-HOME
 * @param {Array} modules 
 */
function updateModuleConfig(modules) {
  const utilsDir = path.join(EHB_HOME_DIR, 'utils');
  
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  const configPath = path.join(utilsDir, 'moduleConfig.js');
  
  const configContent = \`/**
 * EHB Module Configuration
 * Auto-generated by EHB-HOME Integrator
 */

export const modules = [
  \${modules.map(module => \`
  {
    id: "\${module.name.replace(/[^a-zA-Z0-9]/g, '')}",
    name: "\${module.name}",
    description: "\${module.name} service",
    type: "\${module.type}",
    path: "\${module.path.replace(/\\\\/g, '/')}",
    capabilities: [\${module.capabilities.map(cap => \`"\${cap}"\`).join(', ')}],
    icon: "/icons/\${module.type === 'ai-service' ? 'ai' : 'service'}.svg"
  }\`).join(',\\n')}
];

export default modules;
\`;
  
  fs.writeFileSync(configPath, configContent);
  logMessage(\`Updated module configuration in \${configPath}\`);
}

/**
 * Create or update moduleScanner.js in EHB-HOME
 */
function createModuleScanner() {
  const utilsDir = path.join(EHB_HOME_DIR, 'utils');
  const scannerPath = path.join(utilsDir, 'moduleScanner.js');
  
  const scannerContent = \`/**
 * EHB Module Scanner
 * Auto-generated by EHB-HOME Integrator
 */

import { modules } from './moduleConfig';

/**
 * Get all modules
 * @returns {Array} List of all modules
 */
export const getAllModules = () => {
  return modules;
};

/**
 * Get modules by type
 * @param {string} type 
 * @returns {Array} List of modules of specified type
 */
export const getModulesByType = (type) => {
  return modules.filter(module => module.type === type);
};

/**
 * Get modules by capability
 * @param {string} capability 
 * @returns {Array} List of modules with specified capability
 */
export const getModulesByCapability = (capability) => {
  return modules.filter(module => module.capabilities.includes(capability));
};

/**
 * Get module by ID
 * @param {string} id 
 * @returns {Object} Module with specified ID, or null
 */
export const getModuleById = (id) => {
  return modules.find(module => module.id === id) || null;
};

/**
 * Check if a module has a capability
 * @param {string} moduleId 
 * @param {string} capability 
 * @returns {boolean} True if module has capability
 */
export const hasCapability = (moduleId, capability) => {
  const module = getModuleById(moduleId);
  return module ? module.capabilities.includes(capability) : false;
};

export default {
  getAllModules,
  getModulesByType,
  getModulesByCapability,
  getModuleById,
  hasCapability
};
\`;
  
  fs.writeFileSync(scannerPath, scannerContent);
  logMessage(\`Created/updated module scanner in \${scannerPath}\`);
}

/**
 * Create or update ModuleCard component in EHB-HOME
 */
function createModuleCard() {
  const componentsDir = path.join(EHB_HOME_DIR, 'components');
  
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const cardPath = path.join(componentsDir, 'ModuleCard.js');
  
  const cardContent = \`import Link from 'next/link';
import Image from 'next/image';

/**
 * ModuleCard component
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function ModuleCard({ module }) {
  return (
    <Link href={\`/module/\${module.id}\`}>
      <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 relative mr-3">
            <Image
              src={module.icon || '/icons/service.svg'}
              alt={module.name}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h3 className="text-lg font-semibold">{module.name}</h3>
        </div>
        <p className="text-gray-600 text-sm">{module.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {module.capabilities.map(capability => (
            <span 
              key={capability}
              className={\`px-2 py-1 text-xs rounded-full \${getCapabilityStyles(capability)}\`}
            >
              {capability}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/**
 * Get styles for capability badge
 * @param {string} capability 
 * @returns {string} Class names
 */
function getCapabilityStyles(capability) {
  switch (capability) {
    case 'api':
      return 'bg-blue-100 text-blue-800';
    case 'ui':
      return 'bg-green-100 text-green-800';
    case 'ai':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
\`;
  
  fs.writeFileSync(cardPath, cardContent);
  logMessage(\`Created/updated ModuleCard component in \${cardPath}\`);
}

/**
 * Create or update ModuleGrid component in EHB-HOME
 */
function createModuleGrid() {
  const componentsDir = path.join(EHB_HOME_DIR, 'components');
  const gridPath = path.join(componentsDir, 'ModuleGrid.js');
  
  const gridContent = \`import { useState } from 'react';
import ModuleCard from './ModuleCard';

/**
 * ModuleGrid component
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function ModuleGrid({ modules }) {
  const [filter, setFilter] = useState('all');
  const [capabilityFilter, setCapabilityFilter] = useState('all');
  
  const filteredModules = modules.filter(module => {
    // Type filter
    if (filter !== 'all' && module.type !== filter) {
      return false;
    }
    
    // Capability filter
    if (capabilityFilter !== 'all' && !module.capabilities.includes(capabilityFilter)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module Type</label>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="service">Services</option>
            <option value="ai-service">AI Services</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capability</label>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={capabilityFilter}
            onChange={(e) => setCapabilityFilter(e.target.value)}
          >
            <option value="all">All Capabilities</option>
            <option value="api">API</option>
            <option value="ui">UI</option>
            <option value="ai">AI</option>
          </select>
        </div>
      </div>
      
      {filteredModules.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-yellow-700">No modules found with the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
\`;
  
  fs.writeFileSync(gridPath, gridContent);
  logMessage(\`Created/updated ModuleGrid component in \${gridPath}\`);
}

/**
 * Create or update Layout component in EHB-HOME
 */
function createLayout() {
  const componentsDir = path.join(EHB_HOME_DIR, 'components');
  const layoutPath = path.join(componentsDir, 'Layout.js');
  
  const layoutContent = \`import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Layout component
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function Layout({ children }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-semibold">EHB System</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <NavLink href="/" active={router.pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink href="/status" active={router.pathname === '/status'}>
              Status
            </NavLink>
            <NavLink href="/docs" active={router.pathname === '/docs'}>
              Documentation
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} EHB System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * NavLink component
 * @param {Object} props 
 * @returns {JSX.Element}
 */
function NavLink({ href, active, children }) {
  return (
    <Link href={href}>
      <a className={\`px-3 py-2 rounded-md text-sm font-medium transition-colors \${
        active 
          ? 'bg-indigo-800 text-white' 
          : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
      }\`}>
        {children}
      </a>
    </Link>
  );
}
\`;
  
  fs.writeFileSync(layoutPath, layoutContent);
  logMessage(\`Created/updated Layout component in \${layoutPath}\`);
}

/**
 * Create or update index page in EHB-HOME
 */
function createIndexPage() {
  const pagesDir = path.join(EHB_HOME_DIR, 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const indexPath = path.join(pagesDir, 'index.js');
  
  const indexContent = \`import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ModuleGrid from '../components/ModuleGrid';
import { getAllModules } from '../utils/moduleScanner';

/**
 * Home page
 * @returns {JSX.Element}
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState([]);
  
  useEffect(() => {
    // Get modules
    const moduleList = getAllModules();
    setModules(moduleList);
    setIsLoading(false);
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EHB System Dashboard</h1>
        <p className="text-gray-600">
          Access all EHB services and modules from this central dashboard.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <ModuleGrid modules={modules} />
      )}
    </Layout>
  );
}
\`;
  
  fs.writeFileSync(indexPath, indexContent);
  logMessage(\`Created/updated index page in \${indexPath}\`);
}

/**
 * Create or update status page in EHB-HOME
 */
function createStatusPage() {
  const pagesDir = path.join(EHB_HOME_DIR, 'pages');
  const statusPath = path.join(pagesDir, 'status.js');
  
  const statusContent = \`import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getAllModules } from '../utils/moduleScanner';

/**
 * Status page
 * @returns {JSX.Element}
 */
export default function StatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [statusData, setStatusData] = useState([]);
  
  useEffect(() => {
    // Get modules
    const moduleList = getAllModules();
    setModules(moduleList);
    
    // Generate dummy status data
    const statuses = moduleList.map(module => ({
      id: module.id,
      name: module.name,
      status: Math.random() > 0.2 ? 'online' : 'offline',
      lastUpdated: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 500),
      cpuUsage: Math.floor(Math.random() * 80),
      memoryUsage: Math.floor(Math.random() * 60),
    }));
    
    setStatusData(statuses);
    setIsLoading(false);
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
        <p className="text-gray-600">
          Check the status of all EHB services and modules.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory Usage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={\`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                      item.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }\`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.responseTime} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={\`h-2.5 rounded-full \${getUsageColor(item.cpuUsage)}\`} 
                          style={{ width: \`\${item.cpuUsage}%\` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600">{item.cpuUsage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={\`h-2.5 rounded-full \${getUsageColor(item.memoryUsage)}\`} 
                          style={{ width: \`\${item.memoryUsage}%\` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600">{item.memoryUsage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

/**
 * Get color for usage bar based on value
 * @param {number} value 
 * @returns {string} Class name
 */
function getUsageColor(value) {
  if (value < 50) {
    return 'bg-green-600';
  } else if (value < 80) {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
}
\`;
  
  fs.writeFileSync(statusPath, statusContent);
  logMessage(\`Created/updated status page in \${statusPath}\`);
}

/**
 * Create or update _app.js in EHB-HOME
 */
function createAppJs() {
  const pagesDir = path.join(EHB_HOME_DIR, 'pages');
  const appPath = path.join(pagesDir, '_app.js');
  
  const appContent = \`import '../styles/globals.css';

/**
 * App component
 * @param {Object} props 
 * @returns {JSX.Element}
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
\`;
  
  fs.writeFileSync(appPath, appContent);
  logMessage(\`Created/updated _app.js in \${appPath}\`);
}

/**
 * Create or update global styles in EHB-HOME
 */
function createGlobalStyles() {
  const stylesDir = path.join(EHB_HOME_DIR, 'styles');
  
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  
  const stylesPath = path.join(stylesDir, 'globals.css');
  
  const stylesContent = \`@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
\`;
  
  fs.writeFileSync(stylesPath, stylesContent);
  logMessage(\`Created/updated global styles in \${stylesPath}\`);
}

/**
 * Update package.json in EHB-HOME
 */
function updatePackageJson() {
  const packagePath = path.join(EHB_HOME_DIR, 'package.json');
  
  const packageContent = {
    name: 'ehb-home',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev -p 5005',
      build: 'next build',
      start: 'next start -p 5005',
      lint: 'next lint'
    },
    dependencies: {
      next: '^13.1.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      autoprefixer: '^10.4.13',
      postcss: '^8.4.20',
      tailwindcss: '^3.2.4'
    }
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
  logMessage(\`Updated package.json in \${packagePath}\`);
}

/**
 * Create or update next.config.js in EHB-HOME
 */
function createNextConfig() {
  const configPath = path.join(EHB_HOME_DIR, 'next.config.js');
  
  const configContent = \`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
\`;
  
  fs.writeFileSync(configPath, configContent);
  logMessage(\`Created/updated next.config.js in \${configPath}\`);
}

/**
 * Create or update tailwind.config.js in EHB-HOME
 */
function createTailwindConfig() {
  const configPath = path.join(EHB_HOME_DIR, 'tailwind.config.js');
  
  const configContent = \`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
\`;
  
  fs.writeFileSync(configPath, configContent);
  logMessage(\`Created/updated tailwind.config.js in \${configPath}\`);
}

/**
 * Create or update postcss.config.js in EHB-HOME
 */
function createPostcssConfig() {
  const configPath = path.join(EHB_HOME_DIR, 'postcss.config.js');
  
  const configContent = \`module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
\`;
  
  fs.writeFileSync(configPath, configContent);
  logMessage(\`Created/updated postcss.config.js in \${configPath}\`);
}

/**
 * Register with Integration Hub
 */
async function registerWithIntegrationHub() {
  logMessage('Registering EHB-HOME Integrator with Integration Hub');
  
  try {
    const response = await axios.post(\`\${INTEGRATION_HUB_URL}/api/register\`, {
      name: 'EHB-HOME-Integrator',
      url: 'http://localhost:5005',
      capabilities: ['ui', 'integration'],
      type: 'admin'
    });
    
    logMessage(\`Registration successful: \${JSON.stringify(response.data)}\`);
  } catch (error) {
    logMessage(\`Error registering with Integration Hub: \${error.message}\`);
  }
}

/**
 * Update EHB-HOME
 */
function updateEhbHome() {
  logMessage('Updating EHB-HOME with current modules');
  
  // Find all EHB modules
  const modules = findEhbModules();
  logMessage(\`Found \${modules.length} modules\`);
  
  // Update moduleConfig.js
  updateModuleConfig(modules);
  
  // Create or update moduleScanner.js
  createModuleScanner();
  
  // Create or update ModuleCard component
  createModuleCard();
  
  // Create or update ModuleGrid component
  createModuleGrid();
  
  // Create or update Layout component
  createLayout();
  
  // Create or update index page
  createIndexPage();
  
  // Create or update status page
  createStatusPage();
  
  // Create or update _app.js
  createAppJs();
  
  // Create or update global styles
  createGlobalStyles();
  
  // Update package.json
  updatePackageJson();
  
  // Create or update next.config.js
  createNextConfig();
  
  // Create or update tailwind.config.js
  createTailwindConfig();
  
  // Create or update postcss.config.js
  createPostcssConfig();
  
  logMessage('EHB-HOME updated successfully');
  
  // Rebuild EHB-HOME application
  logMessage('Rebuilding EHB-HOME application');
  
  exec(\`cd \${EHB_HOME_DIR} && npm run build\`, (error, stdout, stderr) => {
    if (error) {
      logMessage(\`Error rebuilding EHB-HOME: \${error.message}\`);
      return;
    }
    
    if (stdout) {
      logMessage(\`Rebuild output: \${stdout}\`);
    }
    
    if (stderr) {
      logMessage(\`Rebuild error output: \${stderr}\`);
    }
  });
}

/**
 * Watch for new services
 */
function watchForNewServices() {
  logMessage('Started watching for new services');
  
  const watcher = chokidar.watch([SERVICES_DIR, AI_SERVICES_DIR], {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    depth: 1,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  watcher.on('addDir', (dirPath) => {
    const parentDir = path.dirname(dirPath);
    
    if (parentDir === SERVICES_DIR || parentDir === AI_SERVICES_DIR) {
      logMessage(\`New service detected: \${dirPath}\`);
      
      // Update EHB-HOME after a short delay to ensure the directory is fully populated
      setTimeout(() => {
        updateEhbHome();
      }, 5000);
    }
  });
  
  watcher.on('error', (error) => {
    logMessage(\`Watcher error: \${error}\`);
  });
}

/**
 * Main function
 */
async function main() {
  logMessage('Starting EHB-HOME Integrator');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Update EHB-HOME
  updateEhbHome();
  
  // Register with Integration Hub
  await registerWithIntegrationHub();
  
  // Watch for new services
  watchForNewServices();
  
  logMessage('EHB-HOME Integrator started successfully');
}

// Run the main function
main();
`;
  
  fs.writeFileSync(ehbHomeIntegratorPath, ehbHomeIntegratorContent);
  logMessage(`Created EHB-HOME Integrator script: ${ehbHomeIntegratorPath}`);
}

/**
 * Create structure monitor script
 */
function createStructureMonitor() {
  const structureMonitorPath = path.join(process.cwd(), 'scripts', 'ehb-structure-monitor.js');
  
  const structureMonitorContent = `/**
 * EHB Structure Monitor
 * 
 * This script monitors the EHB folder structure and ensures it follows the correct
 * structure according to the EHB system architecture.
 */

const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Configuration
const PROJECT_ROOT = process.cwd();
const CATEGORIES = ['admin', 'services', 'ai-services', 'system'];
const STANDARD_DIRS = [
  'frontend', 'backend', 'models', 'config', 
  'public', 'utils', 'components', 'pages', 'api'
];
const WEBSOCKET_PORT = 8080;

/**
 * Log a message with timestamp
 * @param {string} message 
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  console.log('[' + timestamp + '] ' + message);
}

/**
 * Check if the directory exists
 * @param {string} dirPath 
 * @returns {boolean}
 */
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Create a directory if it doesn't exist
 * @param {string} dirPath 
 */
function createDirectory(dirPath) {
  if (!directoryExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logMessage(`Directory created: ${dirPath}`);
    return true;
  }
  return false;
}

/**
 * Get all service directories in a category
 * @param {string} categoryPath 
 * @returns {string[]}
 */
function getServiceDirs(categoryPath) {
  if (!directoryExists(categoryPath)) {
    return [];
  }
  
  return fs.readdirSync(categoryPath)
    .filter(item => {
      const itemPath = path.join(categoryPath, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .map(dir => path.join(categoryPath, dir));
}

/**
 * Check if a service has a package.json file
 * @param {string} servicePath 
 * @returns {boolean}
 */
function hasPackageJson(servicePath) {
  const packageJsonPath = path.join(servicePath, 'package.json');
  return fs.existsSync(packageJsonPath);
}

/**
 * Check and fix the structure of a service
 * @param {string} servicePath 
 */
function checkServiceStructure(servicePath) {
  const serviceName = path.basename(servicePath);
  
  logMessage(`Checking structure for service: ${serviceName}`);
  
  if (hasPackageJson(servicePath)) {
    logMessage(`Found package.json in service: ${serviceName} - could run npm install if needed`);
  }
  
  // Check standard directories
  STANDARD_DIRS.forEach(dir => {
    const dirPath = path.join(servicePath, dir);
    
    if (!directoryExists(dirPath)) {
      logMessage(`Created missing folder ${dir} in service: ${serviceName}`);
      createDirectory(dirPath);
    }
  });
}

/**
 * Check the structure of the entire EHB system
 */
function checkEhbStructure() {
  logMessage('Checking EHB structure...');
  
  // Create category directories if they don't exist
  CATEGORIES.forEach(category => {
    const categoryPath = path.join(PROJECT_ROOT, category);
    createDirectory(categoryPath);
  });
  
  // Check all services
  CATEGORIES.forEach(category => {
    const categoryPath = path.join(PROJECT_ROOT, category);
    const services = getServiceDirs(categoryPath);
    
    services.forEach(service => {
      checkServiceStructure(service);
    });
  });
  
  logMessage('Structure check complete');
}

/**
 * Start the file system watcher
 */
function startFileSystemWatcher() {
  logMessage('Starting file system watcher...');
  
  // Simulate a file system watcher by checking every minute
  // In a real implementation, this would use chokidar or a similar library
  setInterval(() => {
    checkEhbStructure();
  }, 60000);
  
  logMessage('File system watcher started');
}

/**
 * Start the WebSocket server
 */
function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });
  
  wss.on('connection', ws => {
    logMessage('WebSocket client connected');
    
    ws.on('message', message => {
      const data = JSON.parse(message);
      
      if (data.type === 'checkStructure') {
        checkEhbStructure();
        ws.send(JSON.stringify({ type: 'structureChecked' }));
      }
    });
    
    ws.on('close', () => {
      logMessage('WebSocket client disconnected');
    });
  });
  
  logMessage(`WebSocket server started on port ${WEBSOCKET_PORT}`);
}

/**
 * Main function
 */
function main() {
  logMessage('EHB Structure Monitoring System starting...');
  
  // Check EHB structure
  checkEhbStructure();
  
  // Start file system watcher
  startFileSystemWatcher();
  
  // Start WebSocket server
  startWebSocketServer();
  
  logMessage('EHB Structure Monitoring System is now running');
}

// Run the main function
main();
`;
  
  fs.writeFileSync(structureMonitorPath, structureMonitorContent);
  logMessage(`Created structure monitor script: ${structureMonitorPath}`);
}

/**
 * Main function
 */
async function main() {
  logMessage('Processing EHB System Intro Package');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Process EHB-AI-Dev-Phase-1
  processAIDevPhase1();
  
  // Process Phase 5
  processPhase5();
  
  // Create system rulebook
  createSystemRulebook();
  
  // Update package.json with required packages
  await updatePackageJson();
  
  // Create development workflow scripts
  createWorkflowScripts();
  
  // Create EHB-HOME Integrator script
  createWorkflowScripts();
  
  // Create structure monitor script
  createStructureMonitor();
  
  logMessage('EHB System Intro Package processed successfully');
}

// Run the main function
main();
`;
  
  fs.writeFileSync(processorPath, processorScript);
  logMessage(`Created intro package processor script: ${processorPath}`);
}

/**
 * Main function
 */
function main() {
  logMessage('Processing EHB System Intro Package');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Process EHB-AI-Dev-Phase-1
  processAIDevPhase1();
  
  // Process Phase 5
  processPhase5();
  
  // Create system rulebook
  createSystemRulebook();
  
  // Update package.json with required packages
  updatePackageJson();
  
  // Create development workflow scripts
  createWorkflowScripts();
  
  // Create EHB-HOME Integrator script
  createEhbHomeIntegrator();
  
  // Create structure monitor script
  createStructureMonitor();
  
  logMessage('EHB System Intro Package processed successfully');
}

// Run the main function
main();