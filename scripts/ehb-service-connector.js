/**
 * EHB Service Connector
 * 
 * This script sets up the internal API connections between different EHB service categories
 * as specified in Step 5 of the EHB organization plan.
 * 
 * The script:
 * - Connects services to admin dashboards
 * - Links the SQL system to all folders
 * - Gives AI services full access to all projects
 * - Sets up standardized API endpoints for inter-service communication
 */

const fs = require('fs');
const path = require('path');
const { FOLDER_MAPPING } = require('./ehb-folder-organizer');

// Root directory
const ROOT_DIR = path.resolve('.');

/**
 * Log messages to console with timestamp
 */
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Create connection between two services by generating 
 * configuration files for API communication
 */
function createServiceConnection(sourceService, targetService) {
  log(`Setting up connection: ${sourceService} → ${targetService}`);
  
  const sourceConfig = {
    targetService,
    apiEndpoint: `http://localhost:5000/${targetService.toLowerCase().replace(/[-]/g, '_')}`,
    connectionType: 'api',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  // Create connections directory if it doesn't exist
  const connectionsDir = path.join(ROOT_DIR, sourceService, 'connections');
  if (!fs.existsSync(connectionsDir)) {
    fs.mkdirSync(connectionsDir, { recursive: true });
  }
  
  // Write connection configuration
  const configPath = path.join(connectionsDir, `${targetService.toLowerCase()}.json`);
  fs.writeFileSync(configPath, JSON.stringify(sourceConfig, null, 2));
  
  log(`Created connection config: ${configPath}`);
  return { source: sourceService, target: targetService, configPath };
}

/**
 * Connect services to admin dashboards
 */
function connectServicesToDashboard() {
  log('Connecting services to admin dashboards');
  
  const adminServices = FOLDER_MAPPING['admin'];
  const servicesList = FOLDER_MAPPING['services'];
  
  const connections = [];
  
  // For each admin service, create connection to each service
  adminServices.forEach(adminService => {
    servicesList.forEach(service => {
      try {
        const connection = createServiceConnection(adminService, service);
        connections.push(connection);
      } catch (error) {
        log(`Error connecting ${adminService} to ${service}: ${error.message}`);
      }
    });
  });
  
  return connections;
}

/**
 * Connect SQL system to all folders
 */
function connectSQLToAllServices() {
  log('Connecting SQL system to all folders');
  
  const sqlService = 'EHB-SQL';
  const connections = [];
  
  // Get all folders from the mapping
  const allFolders = Object.values(FOLDER_MAPPING)
    .flat()
    .filter(folder => folder !== sqlService); // Exclude self-connection
  
  // Connect SQL to each folder
  allFolders.forEach(folder => {
    try {
      const connection = createServiceConnection(sqlService, folder);
      connections.push(connection);
      
      // Also create reverse connection
      const reverseConnection = createServiceConnection(folder, sqlService);
      connections.push(reverseConnection);
    } catch (error) {
      log(`Error connecting ${sqlService} to ${folder}: ${error.message}`);
    }
  });
  
  return connections;
}

/**
 * Connect AI services with full access to all projects
 */
function connectAIToAllServices() {
  log('Connecting AI services with full access to all projects');
  
  const aiService = 'EHB-AI-Dev-Fullstack';
  const connections = [];
  
  // Get all folders from the mapping
  const allFolders = Object.values(FOLDER_MAPPING)
    .flat()
    .filter(folder => folder !== aiService); // Exclude self-connection
  
  // Connect AI to each folder
  allFolders.forEach(folder => {
    try {
      const connection = createServiceConnection(aiService, folder);
      connections.push(connection);
    } catch (error) {
      log(`Error connecting ${aiService} to ${folder}: ${error.message}`);
    }
  });
  
  return connections;
}

/**
 * Create a manifest file for all connections
 */
function createConnectionManifest(allConnections) {
  log('Creating connection manifest');
  
  const manifestPath = path.join(ROOT_DIR, 'ehb-connections-manifest.json');
  const manifest = {
    connections: allConnections,
    totalConnections: allConnections.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  log(`Created connection manifest: ${manifestPath}`);
  
  return manifestPath;
}

/**
 * Main function to set up all service connections
 */
function setupServiceConnections() {
  log('Starting EHB service connections setup');
  
  // Connect services to dashboards
  const dashboardConnections = connectServicesToDashboard();
  log(`Created ${dashboardConnections.length} dashboard connections`);
  
  // Connect SQL to all services
  const sqlConnections = connectSQLToAllServices();
  log(`Created ${sqlConnections.length} SQL connections`);
  
  // Connect AI to all services
  const aiConnections = connectAIToAllServices();
  log(`Created ${aiConnections.length} AI connections`);
  
  // Combine all connections
  const allConnections = [
    ...dashboardConnections,
    ...sqlConnections,
    ...aiConnections
  ];
  
  // Create manifest
  const manifestPath = createConnectionManifest(allConnections);
  
  log('EHB service connections setup completed');
  log(`Total connections created: ${allConnections.length}`);
  
  return {
    dashboardConnections,
    sqlConnections,
    aiConnections,
    totalConnections: allConnections.length,
    manifestPath
  };
}

// Execute if run directly
if (require.main === module) {
  setupServiceConnections();
}

module.exports = {
  setupServiceConnections
};