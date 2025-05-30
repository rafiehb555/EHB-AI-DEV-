/**
 * EHB Workspace Organizer - Step 1: Directory Setup and EHB-HOME Data
 * 
 * This script sets up the necessary directory structure and creates
 * service data for EHB-HOME.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = process.cwd();
const LOG_FILE = path.join(BASE_DIR, 'ehb_workspace_step1.log');
const ARCHIVE_DIR = path.join(BASE_DIR, 'archived');
const SERVICES_ROOT_DIR = path.join(BASE_DIR, 'services-root');
const SHARED_DIR = path.join(BASE_DIR, 'shared');

// Service descriptions
const SERVICE_DESCRIPTIONS = {
  'EHB-HOME': 'Central dashboard for the EHB system',
  'EHB-AI-Dev-Fullstack': 'AI development hub and integration services',
  'EHB-Developer-Portal': 'Documentation and resources for developers',
  'JPS-Job-Providing-Service': 'Employment and career services',
  'WMS-World-Medical-Service': 'Medical and healthcare services',
  'HPS-Education-Service': 'Educational services and learning platforms',
  'OLS-Online-Law-Service': 'Legal services and consultation',
  'GoSellr-Ecommerce': 'E-commerce platform for online stores',
  'EHB-Tube': 'Video streaming and media services',
  'EHB-TrustyWallet-System': 'Blockchain wallet and payment system',
  'EHB-SQL': 'Database services and SQL operations',
  'EHB-Blockchain': 'Blockchain infrastructure services',
  'EHB-DASHBOARD': 'Administrative dashboard for the EHB system',
  'EHB-Affiliate-System': 'Affiliate marketing and referral system',
  'EHB-Services-Departments-Flow': 'Flow management for services and departments',
  'EHB-AM-AFFILIATE-SYSTEM': 'Advanced affiliate marketing system',
  'EHB-AI-Marketplace': 'Marketplace for AI services and models',
  'EHB-Franchise': 'Franchise management system'
};

// Service types
const SERVICE_TYPES = {
  'EHB-HOME': 'frontend',
  'EHB-AI-Dev-Fullstack': 'fullstack',
  'EHB-Developer-Portal': 'frontend',
  'JPS-Job-Providing-Service': 'service',
  'WMS-World-Medical-Service': 'service',
  'HPS-Education-Service': 'service',
  'OLS-Online-Law-Service': 'service',
  'GoSellr-Ecommerce': 'ecommerce',
  'EHB-Tube': 'media',
  'EHB-TrustyWallet-System': 'wallet',
  'EHB-SQL': 'database',
  'EHB-Blockchain': 'blockchain',
  'EHB-DASHBOARD': 'dashboard',
  'EHB-Affiliate-System': 'affiliate',
  'EHB-Services-Departments-Flow': 'service',
  'EHB-AM-AFFILIATE-SYSTEM': 'affiliate',
  'EHB-AI-Marketplace': 'marketplace',
  'EHB-Franchise': 'service'
};

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
 * Get all service directories
 * @returns {Array<string>} Array of service directory names
 */
function getServiceDirs() {
  return fs.readdirSync(BASE_DIR)
    .filter(item => {
      const itemPath = path.join(BASE_DIR, item);
      return fs.statSync(itemPath).isDirectory() && 
             (item.startsWith('EHB-') || 
              item.includes('Service') || 
              item.includes('Dashboard') || 
              item.includes('Portal') || 
              item.includes('Ecommerce'));
    });
}

/**
 * Step 1: Create necessary directories
 */
function createNeededDirectories() {
  log('Creating necessary directories...');
  
  // Create archive directory
  createDirIfNotExists(ARCHIVE_DIR);
  
  // Create services root directory
  createDirIfNotExists(SERVICES_ROOT_DIR);
  
  // Create shared directory
  createDirIfNotExists(SHARED_DIR);
  
  // Create shared subdirectories
  createDirIfNotExists(path.join(SHARED_DIR, 'utils'));
  createDirIfNotExists(path.join(SHARED_DIR, 'components'));
  createDirIfNotExists(path.join(SHARED_DIR, 'models'));
  createDirIfNotExists(path.join(SHARED_DIR, 'api'));
  createDirIfNotExists(path.join(SHARED_DIR, 'types'));
  
  log('Successfully created all needed directories');
}

/**
 * Step 2: Create data directories for all services
 */
function createDataDirectories() {
  log('Creating data directories for all services...');
  
  const serviceDirs = getServiceDirs();
  
  serviceDirs.forEach(serviceDir => {
    const dataDir = path.join(BASE_DIR, serviceDir, 'data');
    createDirIfNotExists(dataDir);
    
    // Create subdirectories for different data types
    const dataTypes = ['company_info', 'user_data', 'analytics', 'transactions', 'media', 'documents'];
    dataTypes.forEach(dataType => {
      createDirIfNotExists(path.join(dataDir, dataType));
    });
    
    log(`Created data directories for ${serviceDir}`);
  });
}

/**
 * Step 3: Set up service information for EHB-HOME
 */
function setupServiceInformation() {
  log('Setting up service information for dashboards...');
  
  // Get all service directories
  const serviceDirs = getServiceDirs();
  
  // Prepare service information
  const services = serviceDirs.map(serviceDir => {
    const description = SERVICE_DESCRIPTIONS[serviceDir] || `${serviceDir} module for EHB system`;
    const type = SERVICE_TYPES[serviceDir] || 'service';
    
    // Determine URL
    let url = '#';
    if (serviceDir === 'EHB-HOME') {
      url = 'http://localhost:5005';
    } else if (serviceDir === 'EHB-AI-Dev-Fullstack') {
      url = 'http://localhost:5003';
    } else if (serviceDir === 'EHB-Developer-Portal') {
      url = 'http://localhost:5000';
    } else if (serviceDir === 'JPS-Job-Providing-Service') {
      url = 'http://localhost:5000';
    } else if (serviceDir === 'EHB-DASHBOARD') {
      url = 'http://localhost:5002';
    }
    
    // Count data files if data directory exists
    let dataFiles = 0;
    const dataDir = path.join(BASE_DIR, serviceDir, 'data');
    if (fs.existsSync(dataDir)) {
      function countDataFiles(dir) {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          
          if (fs.statSync(itemPath).isDirectory()) {
            countDataFiles(itemPath);
          } else {
            dataFiles++;
          }
        });
      }
      
      try {
        countDataFiles(dataDir);
      } catch (err) {
        log(`Error counting files in ${dataDir}: ${err.message}`);
      }
    }
    
    return {
      name: serviceDir,
      type,
      description,
      url,
      status: 'online',
      dataFiles
    };
  });
  
  // Create service_info.json for EHB-HOME
  const ehbHomeDataDir = path.join(BASE_DIR, 'EHB-HOME', 'data');
  createDirIfNotExists(ehbHomeDataDir);
  
  const serviceInfoPath = path.join(ehbHomeDataDir, 'service_info.json');
  fs.writeFileSync(serviceInfoPath, JSON.stringify({ services }, null, 2));
  log(`Created service_info.json for EHB-HOME: ${serviceInfoPath}`);
  
  // Create service_info.json for EHB-DASHBOARD if it exists
  const ehbDashboardDataDir = path.join(BASE_DIR, 'EHB-DASHBOARD', 'data');
  if (fs.existsSync(path.dirname(ehbDashboardDataDir))) {
    createDirIfNotExists(ehbDashboardDataDir);
    
    const dashboardServiceInfoPath = path.join(ehbDashboardDataDir, 'service_info.json');
    fs.writeFileSync(dashboardServiceInfoPath, JSON.stringify({ services }, null, 2));
    log(`Created service_info.json for EHB-DASHBOARD: ${dashboardServiceInfoPath}`);
  }
  
  // Create structure_overview.md for documentation
  const structureOverviewPath = path.join(ehbHomeDataDir, 'structure_overview.md');
  
  // Group services by type
  const servicesByType = {};
  services.forEach(service => {
    if (!servicesByType[service.type]) {
      servicesByType[service.type] = [];
    }
    servicesByType[service.type].push(service);
  });
  
  // Generate structure overview content
  let overviewContent = `# EHB System Structure Overview\n\n`;
  overviewContent += `Last updated: ${new Date().toISOString()}\n\n`;
  
  // Add services by type
  Object.entries(servicesByType).forEach(([type, typeServices]) => {
    overviewContent += `## ${type.charAt(0).toUpperCase() + type.slice(1)} Services\n\n`;
    
    typeServices.forEach(service => {
      overviewContent += `### ${service.name}\n\n`;
      overviewContent += `- **Description**: ${service.description}\n`;
      overviewContent += `- **URL**: ${service.url}\n`;
      overviewContent += `- **Data Files**: ${service.dataFiles}\n`;
      overviewContent += `- **Status**: ${service.status}\n\n`;
    });
  });
  
  fs.writeFileSync(structureOverviewPath, overviewContent);
  log(`Created structure_overview.md: ${structureOverviewPath}`);
  
  log('Service information has been set up for dashboards');
}

/**
 * Main function: Execute steps
 */
function main() {
  log('Starting EHB Workspace Organizer - Step 1');
  
  try {
    // Step 1: Create necessary directories
    createNeededDirectories();
    
    // Step 2: Create data directories for all services 
    createDataDirectories();
    
    // Step 3: Set up service information for dashboards
    setupServiceInformation();
    
    log('EHB Workspace Organizer - Step 1 completed successfully');
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
  }
}

// Run the main function
main();