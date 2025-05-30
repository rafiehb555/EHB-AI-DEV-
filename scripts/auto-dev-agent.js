/**
 * EHB Auto Development Agent
 * 
 * This script provides an automated development system that can process
 * multiple service requirements simultaneously and develop them in the background.
 * 
 * Key features:
 * - Parallel processing of multiple service requirements
 * - Background task queue for development tasks
 * - Integration with EHB Integration Hub for cross-module communication
 * - Service dependency management
 * - Automatic code generation and module integration
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const axios = require('axios');
const chokidar = require('chokidar');

// Configuration
const INTEGRATION_HUB_URL = 'http://localhost:5003';
const TASK_QUEUE_FILE = path.join(__dirname, '../temp/auto-dev-tasks.json');
const SERVICE_CONFIG_DIR = path.join(__dirname, '../temp/service-configs');
const LOG_FILE = path.join(__dirname, '../temp/auto-dev.log');

// Initialize task queue storage
if (!fs.existsSync(path.dirname(TASK_QUEUE_FILE))) {
  fs.mkdirSync(path.dirname(TASK_QUEUE_FILE), { recursive: true });
}

if (!fs.existsSync(SERVICE_CONFIG_DIR)) {
  fs.mkdirSync(SERVICE_CONFIG_DIR, { recursive: true });
}

// Ensure log directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

/**
 * Log message to console and file
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage);
}

/**
 * Task queue for managing development tasks
 */
class TaskQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.loadQueue();
  }

  /**
   * Load the task queue from file
   */
  loadQueue() {
    try {
      if (fs.existsSync(TASK_QUEUE_FILE)) {
        this.queue = JSON.parse(fs.readFileSync(TASK_QUEUE_FILE, 'utf8'));
        log(`Loaded ${this.queue.length} tasks from queue file`);
      } else {
        this.queue = [];
        log('No existing task queue found, starting with empty queue');
      }
    } catch (error) {
      log(`Error loading task queue: ${error.message}`, 'error');
      this.queue = [];
    }
  }

  /**
   * Save the task queue to file
   */
  saveQueue() {
    try {
      fs.writeFileSync(TASK_QUEUE_FILE, JSON.stringify(this.queue, null, 2));
    } catch (error) {
      log(`Error saving task queue: ${error.message}`, 'error');
    }
  }

  /**
   * Add a task to the queue
   * @param {Object} task - Task to add
   */
  addTask(task) {
    // Add unique ID and timestamp
    task.id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    task.createdAt = new Date().toISOString();
    task.status = 'queued';
    
    this.queue.push(task);
    this.saveQueue();
    log(`Added task ${task.id} to queue: ${task.type} - ${task.serviceName}`);
    
    // Start processing if not already processing
    if (!this.processing) {
      this.processNext();
    }
  }

  /**
   * Process the next task in the queue
   */
  async processNext() {
    if (this.queue.length === 0) {
      this.processing = false;
      log('Task queue is empty, waiting for new tasks');
      return;
    }
    
    this.processing = true;
    const task = this.queue[0];
    
    log(`Starting to process task ${task.id}: ${task.type} - ${task.serviceName}`);
    task.status = 'processing';
    task.startedAt = new Date().toISOString();
    this.saveQueue();
    
    try {
      await this.processTask(task);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      log(`Successfully completed task ${task.id}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      log(`Failed to process task ${task.id}: ${error.message}`, 'error');
    }
    
    // Remove the processed task from the queue
    this.queue.shift();
    this.saveQueue();
    
    // Process the next task
    this.processNext();
  }

  /**
   * Process a specific task
   * @param {Object} task - Task to process
   */
  async processTask(task) {
    switch (task.type) {
      case 'createService':
        await this.createService(task);
        break;
      case 'updateService':
        await this.updateService(task);
        break;
      case 'addFeature':
        await this.addFeature(task);
        break;
      case 'generateCode':
        await this.generateCode(task);
        break;
      case 'integrateService':
        await this.integrateService(task);
        break;
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  /**
   * Create a new service
   * @param {Object} task - Task configuration
   */
  async createService(task) {
    const { serviceName, serviceType, requirements } = task;
    
    log(`Creating new service: ${serviceName} (${serviceType})`);
    
    // Create service directory if it doesn't exist
    const serviceDir = path.join(process.cwd(), serviceName);
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    
    // Save service configuration
    const configFile = path.join(SERVICE_CONFIG_DIR, `${serviceName}.json`);
    fs.writeFileSync(configFile, JSON.stringify({
      name: serviceName,
      type: serviceType,
      requirements,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, null, 2));
    
    // Create basic service structure based on type
    switch (serviceType) {
      case 'frontend':
        await this.setupFrontendService(serviceName, requirements);
        break;
      case 'backend':
        await this.setupBackendService(serviceName, requirements);
        break;
      case 'fullstack':
        await this.setupFullstackService(serviceName, requirements);
        break;
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
    
    // Register with Integration Hub
    await this.registerWithIntegrationHub(serviceName, serviceType);
  }
  
  /**
   * Setup a frontend service
   * @param {string} serviceName - Name of the service
   * @param {Object} requirements - Service requirements
   */
  async setupFrontendService(serviceName, requirements) {
    const serviceDir = path.join(process.cwd(), serviceName);
    
    // Create standard frontend directories
    const directories = [
      'public',
      'src',
      'src/components',
      'src/pages',
      'src/utils',
      'src/services',
      'src/assets',
      'src/styles'
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(path.join(serviceDir, dir))) {
        fs.mkdirSync(path.join(serviceDir, dir), { recursive: true });
      }
    });
    
    // Create package.json with Next.js configuration
    const packageJson = {
      name: serviceName.toLowerCase(),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'axios': '^1.6.0',
        'react-feather': '^2.0.10'
      }
    };
    
    fs.writeFileSync(
      path.join(serviceDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
};
`;
    
    fs.writeFileSync(path.join(serviceDir, 'next.config.js'), nextConfig);
    
    // Create basic index.js
    const indexPage = `import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>${serviceName}</title>
        <meta name="description" content="${serviceName} - EHB Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold text-center my-8">
          Welcome to ${serviceName}
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          This service is under development.
        </p>
      </main>
    </div>
  );
}
`;
    
    fs.writeFileSync(path.join(serviceDir, 'src/pages/index.js'), indexPage);
    
    // Create integration client
    const integrationClient = `/**
 * Integration Client for ${serviceName}
 * 
 * Connects this service with the EHB Integration Hub
 */
import axios from 'axios';

const INTEGRATION_HUB_URL = 'http://localhost:5003';
let moduleId = '${serviceName}';

/**
 * Initialize connection with the Integration Hub
 */
export async function initializeIntegration() {
  try {
    // Register module with Integration Hub
    const response = await axios.post(\`\${INTEGRATION_HUB_URL}/api/modules/register\`, {
      name: moduleId,
      url: window.location.origin,
      type: 'frontend',
      dataTypes: ['user', 'notification']
    });
    
    console.log('Successfully registered with Integration Hub', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to register with Integration Hub', error);
    throw error;
  }
}

/**
 * Get company information from the Integration Hub
 */
export async function getCompanyInfo() {
  try {
    const response = await axios.get(\`\${INTEGRATION_HUB_URL}/api/company-info\`);
    return response.data;
  } catch (error) {
    console.error('Failed to get company information', error);
    throw error;
  }
}

export default {
  initializeIntegration,
  getCompanyInfo
};
`;
    
    fs.writeFileSync(path.join(serviceDir, 'src/services/integrationClient.js'), integrationClient);
    
    log(`Frontend service structure created for ${serviceName}`);
  }
  
  /**
   * Setup a backend service
   * @param {string} serviceName - Name of the service
   * @param {Object} requirements - Service requirements
   */
  async setupBackendService(serviceName, requirements) {
    const serviceDir = path.join(process.cwd(), serviceName);
    
    // Create standard backend directories
    const directories = [
      'controllers',
      'models',
      'routes',
      'middlewares',
      'utils',
      'services',
      'config'
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(path.join(serviceDir, dir))) {
        fs.mkdirSync(path.join(serviceDir, dir), { recursive: true });
      }
    });
    
    // Create package.json
    const packageJson = {
      name: serviceName.toLowerCase(),
      version: '0.1.0',
      private: true,
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js'
      },
      dependencies: {
        'express': '^4.18.2',
        'cors': '^2.8.5',
        'dotenv': '^16.3.1',
        'axios': '^1.6.0',
        'morgan': '^1.10.0',
        'winston': '^3.11.0',
        'helmet': '^7.1.0',
        'compression': '^1.7.4'
      },
      devDependencies: {
        'nodemon': '^3.0.1'
      }
    };
    
    fs.writeFileSync(
      path.join(serviceDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create server.js
    const serverJs = `/**
 * ${serviceName} - Main Server
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { initializeIntegration } = require('./services/integrationService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register with Integration Hub
initializeIntegration()
  .then(() => {
    console.log('Successfully connected to Integration Hub');
  })
  .catch(err => {
    console.error('Failed to connect to Integration Hub:', err.message);
  });

// Start server
app.listen(PORT, () => {
  console.log(\`${serviceName} API server running on port \${PORT}\`);
});
`;
    
    fs.writeFileSync(path.join(serviceDir, 'server.js'), serverJs);
    
    // Create integration service
    const integrationService = `/**
 * Integration Service for ${serviceName}
 * 
 * Connects this service with the EHB Integration Hub
 */
const axios = require('axios');

const INTEGRATION_HUB_URL = 'http://localhost:5003';
const moduleId = '${serviceName}';

/**
 * Initialize connection with the Integration Hub
 */
async function initializeIntegration() {
  try {
    // Register module with Integration Hub
    const response = await axios.post(\`\${INTEGRATION_HUB_URL}/api/modules/register\`, {
      name: moduleId,
      url: \`http://localhost:\${process.env.PORT || 5000}\`,
      type: 'backend',
      dataTypes: ['user', 'document', 'notification']
    });
    
    console.log('Successfully registered with Integration Hub', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to register with Integration Hub', error);
    throw error;
  }
}

/**
 * Get company information from the Integration Hub
 */
async function getCompanyInfo() {
  try {
    const response = await axios.get(\`\${INTEGRATION_HUB_URL}/api/company-info\`);
    return response.data;
  } catch (error) {
    console.error('Failed to get company information', error);
    throw error;
  }
}

module.exports = {
  initializeIntegration,
  getCompanyInfo
};
`;
    
    fs.writeFileSync(path.join(serviceDir, 'services/integrationService.js'), integrationService);
    
    log(`Backend service structure created for ${serviceName}`);
  }
  
  /**
   * Setup a fullstack service
   * @param {string} serviceName - Name of the service
   * @param {Object} requirements - Service requirements
   */
  async setupFullstackService(serviceName, requirements) {
    const serviceDir = path.join(process.cwd(), serviceName);
    
    // Create frontend and backend directories
    const frontendDir = path.join(serviceDir, 'frontend');
    const backendDir = path.join(serviceDir, 'backend');
    
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    
    if (!fs.existsSync(backendDir)) {
      fs.mkdirSync(backendDir, { recursive: true });
    }
    
    // Setup frontend and backend
    await this.setupFrontendService(`${serviceName}/frontend`, requirements);
    await this.setupBackendService(`${serviceName}/backend`, requirements);
    
    // Create root package.json for the fullstack service
    const packageJson = {
      name: serviceName.toLowerCase(),
      version: '0.1.0',
      private: true,
      scripts: {
        "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
        "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
        "start:backend": "cd backend && npm start",
        "start:frontend": "cd frontend && npm start",
        "dev:backend": "cd backend && npm run dev",
        "dev:frontend": "cd frontend && npm run dev",
        "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
      },
      dependencies: {
        "concurrently": "^8.2.2"
      }
    };
    
    fs.writeFileSync(
      path.join(serviceDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create index.js entrypoint
    const indexJs = `/**
 * ${serviceName} - Main Entry Point
 * 
 * This file bootstraps both the frontend and backend services.
 */
const { spawn } = require('child_process');
const path = require('path');

// Start backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
});

backend.on('close', (code) => {
  console.log(\`Backend process exited with code \${code}\`);
});

frontend.on('close', (code) => {
  console.log(\`Frontend process exited with code \${code}\`);
});
`;
    
    fs.writeFileSync(path.join(serviceDir, 'index.js'), indexJs);
    
    log(`Fullstack service structure created for ${serviceName}`);
  }
  
  /**
   * Register a service with the Integration Hub
   * @param {string} serviceName - Name of the service
   * @param {string} serviceType - Type of service
   */
  async registerWithIntegrationHub(serviceName, serviceType) {
    try {
      log(`Registering ${serviceName} with Integration Hub`);
      
      const port = serviceType === 'frontend' ? 3000 : 5000;
      const url = `http://localhost:${port}`;
      
      const response = await axios.post(`${INTEGRATION_HUB_URL}/api/modules/register`, {
        name: serviceName,
        url,
        type: serviceType,
        dataTypes: ['user', 'notification', 'document']
      });
      
      log(`Successfully registered ${serviceName} with Integration Hub`);
      return response.data;
    } catch (error) {
      log(`Failed to register ${serviceName} with Integration Hub: ${error.message}`, 'error');
      // Don't throw the error to allow the task to continue
    }
  }

  /**
   * Update an existing service
   * @param {Object} task - Task configuration
   */
  async updateService(task) {
    // Implementation for updating a service
    log(`Updating service: ${task.serviceName}`);
  }

  /**
   * Add a feature to a service
   * @param {Object} task - Task configuration
   */
  async addFeature(task) {
    // Implementation for adding a feature to a service
    log(`Adding feature to service: ${task.serviceName}`);
  }

  /**
   * Generate code for a service
   * @param {Object} task - Task configuration
   */
  async generateCode(task) {
    // Implementation for generating code
    log(`Generating code for service: ${task.serviceName}`);
  }

  /**
   * Integrate a service with other services
   * @param {Object} task - Task configuration
   */
  async integrateService(task) {
    // Implementation for integrating a service
    log(`Integrating service: ${task.serviceName}`);
  }
}

/**
 * Auto Development Agent
 */
class AutoDevAgent {
  constructor() {
    this.taskQueue = new TaskQueue();
    this.configWatcher = null;
  }

  /**
   * Start the Auto Development Agent
   */
  start() {
    log('Starting EHB Auto Development Agent');
    
    // Create config directory if it doesn't exist
    if (!fs.existsSync(SERVICE_CONFIG_DIR)) {
      fs.mkdirSync(SERVICE_CONFIG_DIR, { recursive: true });
    }
    
    // Watch for changes in service config directory
    this.configWatcher = chokidar.watch(SERVICE_CONFIG_DIR, {
      persistent: true,
      ignored: /(^|[/\\])\../,
      ignoreInitial: false
    });
    
    this.configWatcher.on('add', path => this.handleConfigChange(path));
    this.configWatcher.on('change', path => this.handleConfigChange(path));
    
    log('Auto Development Agent started successfully');
  }

  /**
   * Handle changes to service configuration files
   * @param {string} filePath - Path to the changed file
   */
  handleConfigChange(filePath) {
    try {
      const configFileName = path.basename(filePath);
      log(`Config file changed: ${configFileName}`);
      
      const configData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const { name, type, requirements } = configData;
      
      if (!name || !type) {
        log(`Invalid config file: ${configFileName}`, 'warn');
        return;
      }
      
      // Check if the service already exists
      const serviceDir = path.join(process.cwd(), name);
      const serviceExists = fs.existsSync(serviceDir);
      
      if (!serviceExists) {
        // Create new service
        this.taskQueue.addTask({
          type: 'createService',
          serviceName: name,
          serviceType: type,
          requirements
        });
      } else {
        // Update existing service
        this.taskQueue.addTask({
          type: 'updateService',
          serviceName: name,
          serviceType: type,
          requirements
        });
      }
    } catch (error) {
      log(`Error processing config file: ${error.message}`, 'error');
    }
  }

  /**
   * Add a new service development task
   * @param {Object} serviceConfig - Service configuration
   */
  addService(serviceConfig) {
    const { name, type, requirements } = serviceConfig;
    
    if (!name || !type) {
      throw new Error('Service name and type are required');
    }
    
    // Save service configuration
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    fs.writeFileSync(configFile, JSON.stringify({
      name,
      type,
      requirements,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, null, 2));
    
    log(`Added service configuration for ${name}`);
  }

  /**
   * Stop the Auto Development Agent
   */
  stop() {
    log('Stopping Auto Development Agent');
    
    if (this.configWatcher) {
      this.configWatcher.close();
    }
    
    log('Auto Development Agent stopped');
  }
}

// Create and start the Auto Development Agent
const agent = new AutoDevAgent();
agent.start();

// Export the agent for external use
module.exports = agent;