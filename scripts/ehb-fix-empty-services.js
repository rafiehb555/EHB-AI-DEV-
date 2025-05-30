/**
 * EHB Fix Empty Services
 * 
 * This script adds base structure to the empty EHB-Services-Departments-Flow directory
 * and other potentially empty or problematic service directories.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = process.cwd();
const LOG_FILE = path.join(BASE_DIR, 'ehb_fix_empty_services.log');

/**
 * Log a message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Log to file
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

/**
 * Fix EHB-Services-Departments-Flow directory
 */
function fixDepartmentsFlow() {
  log('Fixing EHB-Services-Departments-Flow directory...');
  
  const departmentsFlowDir = path.join(BASE_DIR, 'EHB-Services-Departments-Flow');
  if (!fs.existsSync(departmentsFlowDir)) {
    createDirIfNotExists(departmentsFlowDir);
  }
  
  // Create basic structure
  createDirIfNotExists(path.join(departmentsFlowDir, 'data'));
  createDirIfNotExists(path.join(departmentsFlowDir, 'services'));
  createDirIfNotExists(path.join(departmentsFlowDir, 'models'));
  createDirIfNotExists(path.join(departmentsFlowDir, 'controllers'));
  createDirIfNotExists(path.join(departmentsFlowDir, 'api'));
  
  // Create basic README.md
  const readmePath = path.join(departmentsFlowDir, 'README.md');
  
  const readmeContent = `# EHB Services Departments Flow

This module manages the flow of data and operations between different services and departments
in the EHB system.

## Features

- Inter-service communication
- Department workflow management
- Service orchestration
- Process automation

## Setup

To set up this module, run:

\`\`\`
npm install
\`\`\`

## Usage

Import the service in your application:

\`\`\`javascript
const { ServiceFlow } = require('./services/ServiceFlow');

// Use the service
const flow = new ServiceFlow();
flow.connect('ServiceA', 'ServiceB', { data: 'example' });
\`\`\`

Last updated: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  log(`Created README.md: ${readmePath}`);
  
  // Create basic package.json
  const packageJsonPath = path.join(departmentsFlowDir, 'package.json');
  
  const packageJsonContent = {
    name: 'ehb-services-departments-flow',
    version: '1.0.0',
    description: 'Flow management for services and departments in the EHB system',
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      test: 'echo "Error: no test specified" && exit 1'
    },
    dependencies: {
      express: '^4.17.1',
      axios: '^0.21.1',
      'socket.io': '^4.2.0',
      cors: '^2.8.5',
      dotenv: '^10.0.0'
    }
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
  log(`Created package.json: ${packageJsonPath}`);
  
  // Create basic index.js
  const indexPath = path.join(departmentsFlowDir, 'index.js');
  
  const indexContent = `/**
 * EHB Services Departments Flow
 * Main entry point
 */

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'EHB Services Departments Flow',
    status: 'active',
    version: '1.0.0'
  });
});

app.get('/api/flows', (req, res) => {
  res.json({
    flows: [
      {
        id: 'flow-1',
        name: 'Basic Service Flow',
        services: ['EHB-HOME', 'EHB-AI-Dev-Fullstack'],
        status: 'active'
      }
    ]
  });
});

// Service flows routes
app.get('/api/departments', (req, res) => {
  res.json({
    departments: [
      {
        id: 'dept-1',
        name: 'AI Development',
        services: ['EHB-AI-Dev-Fullstack', 'EHB-AI-Marketplace']
      },
      {
        id: 'dept-2',
        name: 'Finance',
        services: ['EHB-TrustyWallet-System']
      },
      {
        id: 'dept-3',
        name: 'Commerce',
        services: ['GoSellr-Ecommerce']
      },
      {
        id: 'dept-4',
        name: 'Healthcare',
        services: ['WMS-World-Medical-Service']
      },
      {
        id: 'dept-5',
        name: 'Education',
        services: ['HPS-Education-Service']
      },
      {
        id: 'dept-6',
        name: 'Legal',
        services: ['OLS-Online-Law-Service']
      },
      {
        id: 'dept-7',
        name: 'Employment',
        services: ['JPS-Job-Providing-Service']
      },
      {
        id: 'dept-8',
        name: 'Media',
        services: ['EHB-Tube']
      }
    ]
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(\`EHB Services Departments Flow running on port \${port}\`);
  });
}

module.exports = app;
`;
  
  fs.writeFileSync(indexPath, indexContent);
  log(`Created index.js: ${indexPath}`);
  
  // Create basic service flow
  const serviceFlowPath = path.join(departmentsFlowDir, 'services', 'ServiceFlow.js');
  createDirIfNotExists(path.dirname(serviceFlowPath));
  
  const serviceFlowContent = `/**
 * Service Flow
 * Manages the flow of data between services
 */

class ServiceFlow {
  constructor() {
    this.flows = new Map();
  }
  
  /**
   * Connect two services with a data flow
   * @param {string} sourceService - Source service name
   * @param {string} targetService - Target service name
   * @param {Object} options - Flow options
   * @returns {string} Flow ID
   */
  connect(sourceService, targetService, options = {}) {
    const flowId = \`flow-\${Date.now()}-\${Math.round(Math.random() * 1000)}\`;
    
    this.flows.set(flowId, {
      id: flowId,
      source: sourceService,
      target: targetService,
      options,
      status: 'active',
      createdAt: new Date()
    });
    
    console.log(\`Created flow \${flowId} from \${sourceService} to \${targetService}\`);
    return flowId;
  }
  
  /**
   * Get all flows
   * @returns {Array} All flows
   */
  getAllFlows() {
    return Array.from(this.flows.values());
  }
  
  /**
   * Get flows for a specific service
   * @param {string} serviceName - Service name
   * @returns {Array} Flows for the service
   */
  getFlowsForService(serviceName) {
    return Array.from(this.flows.values()).filter(
      flow => flow.source === serviceName || flow.target === serviceName
    );
  }
  
  /**
   * Send data through a flow
   * @param {string} flowId - Flow ID
   * @param {any} data - Data to send
   * @returns {boolean} Success status
   */
  sendData(flowId, data) {
    const flow = this.flows.get(flowId);
    
    if (!flow) {
      console.error(\`Flow \${flowId} not found\`);
      return false;
    }
    
    console.log(\`Sending data through flow \${flowId} from \${flow.source} to \${flow.target}\`);
    console.log(\`Data: \${JSON.stringify(data)}\`);
    
    // In a real implementation, this would send the data to the target service
    
    return true;
  }
}

module.exports = { ServiceFlow };
`;
  
  fs.writeFileSync(serviceFlowPath, serviceFlowContent);
  log(`Created ServiceFlow.js: ${serviceFlowPath}`);
  
  // Create model file
  const departmentModelPath = path.join(departmentsFlowDir, 'models', 'Department.js');
  createDirIfNotExists(path.dirname(departmentModelPath));
  
  const departmentModelContent = `/**
 * Department Model
 */

class Department {
  constructor(id, name, services = []) {
    this.id = id;
    this.name = name;
    this.services = services;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  addService(service) {
    if (!this.services.includes(service)) {
      this.services.push(service);
      this.updatedAt = new Date();
    }
    return this;
  }
  
  removeService(service) {
    this.services = this.services.filter(s => s !== service);
    this.updatedAt = new Date();
    return this;
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      services: this.services,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = { Department };
`;
  
  fs.writeFileSync(departmentModelPath, departmentModelContent);
  log(`Created Department.js model: ${departmentModelPath}`);
  
  // Create departments data file
  const departmentsDataPath = path.join(departmentsFlowDir, 'data', 'departments.json');
  createDirIfNotExists(path.dirname(departmentsDataPath));
  
  const departmentsData = {
    departments: [
      {
        id: 'dept-1',
        name: 'AI Development',
        services: ['EHB-AI-Dev-Fullstack', 'EHB-AI-Marketplace']
      },
      {
        id: 'dept-2',
        name: 'Finance',
        services: ['EHB-TrustyWallet-System']
      },
      {
        id: 'dept-3',
        name: 'Commerce',
        services: ['GoSellr-Ecommerce']
      },
      {
        id: 'dept-4',
        name: 'Healthcare',
        services: ['WMS-World-Medical-Service']
      },
      {
        id: 'dept-5',
        name: 'Education',
        services: ['HPS-Education-Service']
      },
      {
        id: 'dept-6',
        name: 'Legal',
        services: ['OLS-Online-Law-Service']
      },
      {
        id: 'dept-7',
        name: 'Employment',
        services: ['JPS-Job-Providing-Service']
      },
      {
        id: 'dept-8',
        name: 'Media',
        services: ['EHB-Tube']
      }
    ]
  };
  
  fs.writeFileSync(departmentsDataPath, JSON.stringify(departmentsData, null, 2));
  log(`Created departments.json data: ${departmentsDataPath}`);
  
  log('Successfully fixed EHB-Services-Departments-Flow directory with basic structure');
}

/**
 * Fix potentially empty service directories
 */
function fixEmptyServiceDirectories() {
  log('Checking for other potentially empty service directories...');
  
  // List of service directories to check
  const servicesToCheck = [
    'EHB-Affiliate-System',
    'EHB-Blockchain',
    'EHB-SQL'
  ];
  
  servicesToCheck.forEach(serviceName => {
    const serviceDir = path.join(BASE_DIR, serviceName);
    
    if (!fs.existsSync(serviceDir)) {
      // Create the directory if it doesn't exist
      createDirIfNotExists(serviceDir);
      log(`Created service directory: ${serviceName}`);
    }
    
    // Check if the directory is empty
    const dirContents = fs.readdirSync(serviceDir);
    if (dirContents.length <= 1 && (dirContents.length === 0 || dirContents.includes('.gitkeep'))) {
      log(`Found empty service directory: ${serviceName}, adding basic structure...`);
      
      // Create basic structure
      createDirIfNotExists(path.join(serviceDir, 'data'));
      createDirIfNotExists(path.join(serviceDir, 'src'));
      createDirIfNotExists(path.join(serviceDir, 'api'));
      
      // Create basic README.md
      const readmePath = path.join(serviceDir, 'README.md');
      
      const readmeContent = `# ${serviceName}

This is part of the EHB system.

## Description

${getServiceDescription(serviceName)}

## Setup

To set up this module, run:

\`\`\`
npm install
\`\`\`

## Usage

Start the service:

\`\`\`
npm start
\`\`\`

Last updated: ${new Date().toISOString()}
`;
      
      fs.writeFileSync(readmePath, readmeContent);
      log(`Created README.md: ${readmePath}`);
      
      // Create basic package.json
      const packageJsonPath = path.join(serviceDir, 'package.json');
      
      const packageJsonContent = {
        name: serviceName.toLowerCase(),
        version: '1.0.0',
        description: getServiceDescription(serviceName),
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          test: 'echo "Error: no test specified" && exit 1'
        },
        dependencies: {
          express: '^4.17.1',
          axios: '^0.21.1'
        }
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
      log(`Created package.json: ${packageJsonPath}`);
      
      // Create basic index.js
      const indexPath = path.join(serviceDir, 'index.js');
      
      const indexContent = `/**
 * ${serviceName}
 * Main entry point
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    service: '${serviceName}',
    status: 'active',
    version: '1.0.0'
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(\`${serviceName} running on port \${port}\`);
  });
}

module.exports = app;
`;
      
      fs.writeFileSync(indexPath, indexContent);
      log(`Created index.js: ${indexPath}`);
      
      log(`Successfully fixed ${serviceName} directory with basic structure`);
    }
  });
}

/**
 * Get a description for a service based on its name
 * @param {string} serviceName - Name of the service
 * @returns {string} Service description
 */
function getServiceDescription(serviceName) {
  switch (serviceName) {
    case 'EHB-Affiliate-System':
      return 'Affiliate marketing and referral system for the EHB platform';
    case 'EHB-Blockchain':
      return 'Blockchain infrastructure services for the EHB system';
    case 'EHB-SQL':
      return 'Database services and SQL operations for the EHB platform';
    default:
      return `${serviceName} module for the EHB system`;
  }
}

/**
 * Main function: Execute tasks
 */
function main() {
  log('Starting EHB Fix Empty Services');
  
  try {
    // Fix EHB-Services-Departments-Flow directory
    fixDepartmentsFlow();
    
    // Fix other potentially empty service directories
    fixEmptyServiceDirectories();
    
    log('EHB Fix Empty Services completed successfully');
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
  }
}

// Run the main function
main();