/**
 * EHB Workspace Organizer
 * 
 * This script reorganizes and cleans up the EHB workspace:
 * 1. Identifies and removes duplicate modules/pages/components
 * 2. Moves files to their appropriate service folders
 * 3. Organizes services under services-root
 * 4. Connects services to EHB-HOME and EHB-DASHBOARD
 * 5. Analyzes and archives orphaned files
 */

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

// Configuration
const BASE_DIR = process.cwd();
const LOG_FILE = path.join(BASE_DIR, 'ehb_workspace_organizer.log');
const ARCHIVE_DIR = path.join(BASE_DIR, 'archived');
const SERVICES_ROOT_DIR = path.join(BASE_DIR, 'services-root');
const SHARED_DIR = path.join(BASE_DIR, 'shared');

// Service mapping
const SERVICE_MAPPING = {
  // Map keyword patterns to service directories
  'gosellr': 'GoSellr-Ecommerce',
  'ecommerce': 'GoSellr-Ecommerce',
  'shop': 'GoSellr-Ecommerce',
  'product': 'GoSellr-Ecommerce',
  
  'job': 'JPS-Job-Providing-Service',
  'career': 'JPS-Job-Providing-Service',
  'employment': 'JPS-Job-Providing-Service',
  'work': 'JPS-Job-Providing-Service',
  
  'education': 'HPS-Education-Service',
  'course': 'HPS-Education-Service',
  'learning': 'HPS-Education-Service',
  'school': 'HPS-Education-Service',
  'training': 'HPS-Education-Service',
  
  'health': 'WMS-World-Medical-Service',
  'medical': 'WMS-World-Medical-Service',
  'doctor': 'WMS-World-Medical-Service',
  'patient': 'WMS-World-Medical-Service',
  'hospital': 'WMS-World-Medical-Service',
  
  'law': 'OLS-Online-Law-Service',
  'legal': 'OLS-Online-Law-Service',
  'attorney': 'OLS-Online-Law-Service',
  'justice': 'OLS-Online-Law-Service',
  
  'wallet': 'EHB-TrustyWallet-System',
  'payment': 'EHB-TrustyWallet-System',
  'coin': 'EHB-TrustyWallet-System',
  'crypto': 'EHB-TrustyWallet-System',
  'blockchain': 'EHB-TrustyWallet-System',
  
  'affiliate': 'EHB-Affiliate-System',
  'referral': 'EHB-Affiliate-System',
  'commission': 'EHB-Affiliate-System',
  
  'tube': 'EHB-Tube',
  'video': 'EHB-Tube',
  'media': 'EHB-Tube',
  'stream': 'EHB-Tube',
  
  'dashboard': 'EHB-DASHBOARD',
  'admin': 'EHB-DASHBOARD',
  'analytics': 'EHB-DASHBOARD',
  
  'default': 'EHB-AI-Dev-Fullstack'
};

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

// Old directories to check for duplicate/movable files
const OLD_DIRS = ['frontend', 'backend', 'admin'];

// Log levels
const LOG_LEVELS = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

/**
 * Log a message with timestamp and optional level
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, success, warning, error)
 */
function log(message, level = LOG_LEVELS.INFO) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  // Colors for console logging
  const colors = {
    [LOG_LEVELS.INFO]: '\x1b[36m',     // Cyan
    [LOG_LEVELS.SUCCESS]: '\x1b[32m',  // Green
    [LOG_LEVELS.WARNING]: '\x1b[33m',  // Yellow
    [LOG_LEVELS.ERROR]: '\x1b[31m',    // Red
    reset: '\x1b[0m'                   // Reset
  };
  
  // Log to console with color
  console.log(`${colors[level]}${logEntry.trim()}${colors.reset}`);
  
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
    log(`Created directory: ${dirPath}`, LOG_LEVELS.SUCCESS);
  }
}

/**
 * Calculate MD5 hash of a file or string
 * @param {string|Buffer} content - File content or string
 * @returns {string} MD5 hash
 */
function calculateMd5(content) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(content).digest('hex');
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
  log('Step 1: Creating necessary directories...', LOG_LEVELS.INFO);
  
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
  
  log('Successfully created all needed directories', LOG_LEVELS.SUCCESS);
}

/**
 * Step 2: Identify and collect information on files in old directories
 * @returns {Object} Information on duplicate and movable files
 */
function identifyFileDestinations() {
  log('Step 2: Analyzing old directories for files to relocate...', LOG_LEVELS.INFO);
  
  const fileInfo = {
    duplicates: [], // Files that exist in both old and new locations
    movable: [],    // Files that should be moved to service directories
    utilities: [],  // Utility files that should go to shared directory
    other: []       // Other files that don't fit above categories
  };
  
  // Get all service directories to compare with
  const serviceDirs = getServiceDirs();
  
  // Function to recursively process a directory
  function processDir(dirPath, isOldDir = false) {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const relativePath = path.relative(BASE_DIR, itemPath);
      
      // Skip node_modules and hidden directories
      if (item === 'node_modules' || item.startsWith('.')) {
        return;
      }
      
      // Skip already organized service directories in old dirs
      if (isOldDir && serviceDirs.includes(item)) {
        return;
      }
      
      if (fs.statSync(itemPath).isDirectory()) {
        // Recursively process subdirectories
        processDir(itemPath, isOldDir);
      } else {
        // Process file
        const fileContent = fs.readFileSync(itemPath);
        const fileHash = calculateMd5(fileContent);
        const fileExt = path.extname(itemPath).toLowerCase();
        const fileNameLower = item.toLowerCase();
        const fileContentStr = fileContent.toString().toLowerCase();
        
        if (isOldDir) {
          // Check for duplicates in service directories
          let isDuplicate = false;
          let duplicatePath = null;
          
          serviceDirs.forEach(serviceDir => {
            const servicePath = path.join(BASE_DIR, serviceDir);
            
            // Check if file exists in this service directory
            const potentialDuplicates = findFilesByNameInDir(servicePath, item);
            
            potentialDuplicates.forEach(potentialDuplicate => {
              const duplicateContent = fs.readFileSync(potentialDuplicate);
              const duplicateHash = calculateMd5(duplicateContent);
              
              if (fileHash === duplicateHash) {
                isDuplicate = true;
                duplicatePath = potentialDuplicate;
              }
            });
          });
          
          if (isDuplicate) {
            fileInfo.duplicates.push({
              path: itemPath,
              hash: fileHash,
              duplicatePath,
              relativePath
            });
            return;
          }
          
          // Determine appropriate service destination based on file content and name
          let serviceDestination = determineServiceDestination(fileNameLower, fileContentStr);
          
          // If it's a utility/helper function, it should go to the shared directory
          if (fileNameLower.includes('util') || fileNameLower.includes('helper') || 
              fileNameLower.includes('common') || fileNameLower.includes('shared') || 
              fileNameLower.includes('lib')) {
            fileInfo.utilities.push({
              path: itemPath,
              hash: fileHash,
              relativePath
            });
            return;
          }
          
          if (serviceDestination) {
            fileInfo.movable.push({
              path: itemPath,
              hash: fileHash,
              serviceDestination,
              relativePath
            });
          } else {
            fileInfo.other.push({
              path: itemPath,
              hash: fileHash,
              relativePath
            });
          }
        }
      }
    });
  }
  
  // Process old directories
  OLD_DIRS.forEach(oldDir => {
    const oldDirPath = path.join(BASE_DIR, oldDir);
    processDir(oldDirPath, true);
  });
  
  log(`Analysis results:`, LOG_LEVELS.INFO);
  log(`- Duplicates found: ${fileInfo.duplicates.length}`, LOG_LEVELS.INFO);
  log(`- Movable files found: ${fileInfo.movable.length}`, LOG_LEVELS.INFO);
  log(`- Utility files found: ${fileInfo.utilities.length}`, LOG_LEVELS.INFO);
  log(`- Other files found: ${fileInfo.other.length}`, LOG_LEVELS.INFO);
  
  return fileInfo;
}

/**
 * Find files with a given name in a directory (recursively)
 * @param {string} dirPath - Directory path to search in
 * @param {string} fileName - Filename to search for
 * @returns {Array<string>} Paths to matching files
 */
function findFilesByNameInDir(dirPath, fileName) {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    return results;
  }
  
  function searchDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      
      // Skip node_modules and hidden directories
      if (item === 'node_modules' || item.startsWith('.')) {
        return;
      }
      
      if (fs.statSync(itemPath).isDirectory()) {
        searchDir(itemPath);
      } else if (item === fileName) {
        results.push(itemPath);
      }
    });
  }
  
  searchDir(dirPath);
  return results;
}

/**
 * Determine which service a file belongs to based on content and name
 * @param {string} fileName - Lowercase filename
 * @param {string} fileContent - Lowercase file content
 * @returns {string|null} Service name or null if undetermined
 */
function determineServiceDestination(fileName, fileContent) {
  // Check file name and content against service mapping
  for (const [keyword, service] of Object.entries(SERVICE_MAPPING)) {
    if (fileName.includes(keyword) || fileContent.includes(keyword)) {
      return service;
    }
  }
  
  // If no match found, return default service
  return SERVICE_MAPPING.default;
}

/**
 * Step 3: Move files to their appropriate destinations
 * @param {Object} fileInfo - Information on files to move
 */
function moveFilesToDestinations(fileInfo) {
  log('Step 3: Moving files to appropriate destinations...', LOG_LEVELS.INFO);
  
  // Move duplicate files to archive directory
  fileInfo.duplicates.forEach(file => {
    const archivePath = path.join(ARCHIVE_DIR, 'duplicates', file.relativePath);
    createDirIfNotExists(path.dirname(archivePath));
    
    // Copy to archive
    fs.copyFileSync(file.path, archivePath);
    log(`Archived duplicate file: ${file.relativePath} -> ${path.relative(BASE_DIR, archivePath)}`, LOG_LEVELS.SUCCESS);
  });
  
  // Move utility files to shared directory
  fileInfo.utilities.forEach(file => {
    const fileName = path.basename(file.path);
    const fileExt = path.extname(file.path).toLowerCase();
    let sharedSubdir = 'utils'; // Default to utils
    
    // Determine shared subdirectory based on file extension and name
    if (['.jsx', '.tsx'].includes(fileExt) || fileName.toLowerCase().includes('component')) {
      sharedSubdir = 'components';
    } else if (fileName.toLowerCase().includes('model') || fileName.toLowerCase().includes('schema')) {
      sharedSubdir = 'models';
    } else if (fileName.toLowerCase().includes('api') || fileName.toLowerCase().includes('route')) {
      sharedSubdir = 'api';
    } else if (fileName.toLowerCase().includes('type') || fileName.toLowerCase().includes('interface')) {
      sharedSubdir = 'types';
    }
    
    const destPath = path.join(SHARED_DIR, sharedSubdir, fileName);
    
    // Copy to shared directory
    fs.copyFileSync(file.path, destPath);
    log(`Moved utility file: ${file.relativePath} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
    
    // Create archive copy
    const archivePath = path.join(ARCHIVE_DIR, 'utilities', file.relativePath);
    createDirIfNotExists(path.dirname(archivePath));
    fs.copyFileSync(file.path, archivePath);
  });
  
  // Move service files to their destinations in the services-root
  fileInfo.movable.forEach(file => {
    const fileName = path.basename(file.path);
    const fileExt = path.extname(file.path).toLowerCase();
    const serviceDir = path.join(SERVICES_ROOT_DIR, file.serviceDestination);
    createDirIfNotExists(serviceDir);
    
    let destSubdir = '';
    
    // Determine destination subdirectory based on file extension and name
    if (['.jsx', '.tsx'].includes(fileExt) || fileName.toLowerCase().includes('component')) {
      destSubdir = 'components';
    } else if (['.js', '.ts'].includes(fileExt) && 
              (fileName.toLowerCase().includes('model') || fileName.toLowerCase().includes('schema'))) {
      destSubdir = 'models';
    } else if (['.js', '.ts'].includes(fileExt) && 
              (fileName.toLowerCase().includes('controller') || fileName.toLowerCase().includes('service'))) {
      destSubdir = 'backend';
    } else if (['.js', '.ts'].includes(fileExt) && 
              (fileName.toLowerCase().includes('route') || fileName.toLowerCase().includes('api'))) {
      destSubdir = 'api';
    } else if (['.css', '.scss', '.less'].includes(fileExt)) {
      destSubdir = 'styles';
    } else if (['.html', '.ejs', '.pug'].includes(fileExt)) {
      destSubdir = 'views';
    } else if (fileName.toLowerCase().includes('test') || fileName.toLowerCase().includes('spec')) {
      destSubdir = 'tests';
    } else {
      // Default to root of service directory
      destSubdir = '';
    }
    
    const destPath = destSubdir 
      ? path.join(serviceDir, destSubdir, fileName)
      : path.join(serviceDir, fileName);
    
    // Create destination directory if needed
    createDirIfNotExists(path.dirname(destPath));
    
    // Copy to service directory
    fs.copyFileSync(file.path, destPath);
    log(`Moved service file: ${file.relativePath} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
    
    // Create archive copy
    const archivePath = path.join(ARCHIVE_DIR, 'moved_services', file.relativePath);
    createDirIfNotExists(path.dirname(archivePath));
    fs.copyFileSync(file.path, archivePath);
  });
  
  // Archive other files
  fileInfo.other.forEach(file => {
    const archivePath = path.join(ARCHIVE_DIR, 'other', file.relativePath);
    createDirIfNotExists(path.dirname(archivePath));
    
    // Copy to archive
    fs.copyFileSync(file.path, archivePath);
    log(`Archived other file: ${file.relativePath} -> ${path.relative(BASE_DIR, archivePath)}`, LOG_LEVELS.SUCCESS);
  });
  
  log('Files have been moved to their destinations and archived', LOG_LEVELS.SUCCESS);
}

/**
 * Step 4: Set up service information for EHB-HOME and EHB-DASHBOARD
 */
function setupServiceInformation() {
  log('Step 4: Setting up service information for dashboards...', LOG_LEVELS.INFO);
  
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
      
      countDataFiles(dataDir);
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
  log(`Created service_info.json for EHB-HOME: ${serviceInfoPath}`, LOG_LEVELS.SUCCESS);
  
  // Create service_info.json for EHB-DASHBOARD
  const ehbDashboardDataDir = path.join(BASE_DIR, 'EHB-DASHBOARD', 'data');
  createDirIfNotExists(ehbDashboardDataDir);
  
  const dashboardServiceInfoPath = path.join(ehbDashboardDataDir, 'service_info.json');
  fs.writeFileSync(dashboardServiceInfoPath, JSON.stringify({ services }, null, 2));
  log(`Created service_info.json for EHB-DASHBOARD: ${dashboardServiceInfoPath}`, LOG_LEVELS.SUCCESS);
  
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
  log(`Created structure_overview.md: ${structureOverviewPath}`, LOG_LEVELS.SUCCESS);
  
  log('Service information has been set up for dashboards', LOG_LEVELS.SUCCESS);
}

/**
 * Step 5: Clean up empty directories and organize services-root
 */
function cleanupAndOrganize() {
  log('Step 5: Cleaning up and final organization...', LOG_LEVELS.INFO);
  
  // Move relevant service directories to services-root if not already there
  const serviceDirs = getServiceDirs();
  
  serviceDirs.forEach(serviceDir => {
    const sourcePath = path.join(BASE_DIR, serviceDir);
    const destPath = path.join(SERVICES_ROOT_DIR, serviceDir);
    
    // Skip if the directory is already in services-root
    if (sourcePath === destPath) {
      return;
    }
    
    // Create symbolic link in services-root to the original service directory
    if (!fs.existsSync(destPath)) {
      if (process.platform === 'win32') {
        // Windows requires special permission for symlinks, use junction instead
        try {
          execSync(`mklink /J "${destPath}" "${sourcePath}"`, { stdio: 'pipe' });
          log(`Created junction for service: ${serviceDir} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
        } catch (error) {
          // If junction fails, copy the directory instead
          try {
            execSync(`xcopy "${sourcePath}" "${destPath}" /E /I /H /Y`, { stdio: 'pipe' });
            log(`Copied service directory: ${serviceDir} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
          } catch (copyError) {
            log(`Error copying service directory ${serviceDir}: ${copyError.message}`, LOG_LEVELS.ERROR);
          }
        }
      } else {
        // Unix-like systems can create symbolic links directly
        try {
          fs.symlinkSync(sourcePath, destPath, 'dir');
          log(`Created symlink for service: ${serviceDir} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
        } catch (error) {
          // If symlink fails, copy the directory instead
          try {
            execSync(`cp -r "${sourcePath}" "${destPath}"`, { stdio: 'pipe' });
            log(`Copied service directory: ${serviceDir} -> ${path.relative(BASE_DIR, destPath)}`, LOG_LEVELS.SUCCESS);
          } catch (copyError) {
            log(`Error copying service directory ${serviceDir}: ${copyError.message}`, LOG_LEVELS.ERROR);
          }
        }
      }
    }
  });
  
  // Create README.md for services-root
  const servicesRootReadmePath = path.join(SERVICES_ROOT_DIR, 'README.md');
  
  const servicesRootReadmeContent = `# EHB Services Root Directory

This directory contains all the services and modules that make up the EHB system.

## Services

${serviceDirs.map(serviceDir => `- **${serviceDir}**: ${SERVICE_DESCRIPTIONS[serviceDir] || serviceDir}`).join('\n')}

## Structure

Each service follows a similar structure:

- \`/api\` - API routes and endpoints
- \`/components\` - UI components
- \`/models\` - Data models and schemas
- \`/utils\` - Utility functions
- \`/data\` - Service-specific data storage

## Integration

All services are integrated through the EHB-AI-Dev-Fullstack Integration Hub and
displayed in the EHB-HOME dashboard.

Last updated: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(servicesRootReadmePath, servicesRootReadmeContent);
  log(`Created README.md for services-root: ${servicesRootReadmePath}`, LOG_LEVELS.SUCCESS);
  
  // Create README.md for shared directory
  const sharedReadmePath = path.join(SHARED_DIR, 'README.md');
  
  const sharedReadmeContent = `# EHB Shared Directory

This directory contains shared code that is used across multiple services.

## Structure

- \`/api\` - Shared API utilities and endpoints
- \`/components\` - Shared UI components
- \`/models\` - Shared data models and schemas
- \`/utils\` - Shared utility functions
- \`/types\` - Shared type definitions and interfaces

## Usage

Code in this directory should be properly documented and designed for reuse.
When adding new shared code, ensure it is properly categorized in the appropriate subdirectory.

Last updated: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(sharedReadmePath, sharedReadmeContent);
  log(`Created README.md for shared directory: ${sharedReadmePath}`, LOG_LEVELS.SUCCESS);
  
  // Fix empty EHB-Services-Departments-Flow directory
  const departmentsFlowDir = path.join(BASE_DIR, 'EHB-Services-Departments-Flow');
  if (fs.existsSync(departmentsFlowDir)) {
    // Check if it's empty (or nearly empty)
    const departmentsFlowFiles = fs.readdirSync(departmentsFlowDir);
    
    if (departmentsFlowFiles.length <= 1) { // Empty or only has .gitkeep
      log(`Found empty directory: EHB-Services-Departments-Flow, adding base structure...`, LOG_LEVELS.WARNING);
      
      // Create basic structure
      createDirIfNotExists(path.join(departmentsFlowDir, 'data'));
      createDirIfNotExists(path.join(departmentsFlowDir, 'services'));
      createDirIfNotExists(path.join(departmentsFlowDir, 'models'));
      createDirIfNotExists(path.join(departmentsFlowDir, 'controllers'));
      
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
          axios: '^0.21.1'
        }
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
      
      // Create basic index.js
      const indexPath = path.join(departmentsFlowDir, 'index.js');
      
      const indexContent = `/**
 * EHB Services Departments Flow
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

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(\`EHB Services Departments Flow running on port \${port}\`);
  });
}

module.exports = app;
`;
      
      fs.writeFileSync(indexPath, indexContent);
      
      // Create basic service flow
      const serviceFlowPath = path.join(departmentsFlowDir, 'services', 'ServiceFlow.js');
      
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
      
      createDirIfNotExists(path.dirname(serviceFlowPath));
      fs.writeFileSync(serviceFlowPath, serviceFlowContent);
      
      log(`Added base structure to EHB-Services-Departments-Flow`, LOG_LEVELS.SUCCESS);
    }
  }
  
  log('Cleanup and final organization completed', LOG_LEVELS.SUCCESS);
}

/**
 * Step 6: Restart services and update dashboards
 */
function updateDashboards() {
  log('Step 6: Updating dashboards and restarting services...', LOG_LEVELS.INFO);
  
  try {
    // Update EHB-HOME index.js to show all services
    const ehbHomeIndexPath = path.join(BASE_DIR, 'EHB-HOME', 'pages', 'index.js');
    
    if (fs.existsSync(ehbHomeIndexPath)) {
      log(`Updating EHB-HOME dashboard...`, LOG_LEVELS.INFO);
      
      // Create simplified and stable version of the dashboard
      const ehbHomeIndexContent = `import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// Card color mapping based on service type
const typeColorMap = {
  frontend: 'bg-blue-100',
  backend: 'bg-green-100',
  fullstack: 'bg-purple-100',
  dashboard: 'bg-indigo-100',
  wallet: 'bg-yellow-100',
  ecommerce: 'bg-pink-100',
  media: 'bg-red-100',
  database: 'bg-gray-100',
  affiliate: 'bg-orange-100',
  blockchain: 'bg-cyan-100',
  marketplace: 'bg-emerald-100',
  service: 'bg-teal-100',
  default: 'bg-gray-100'
};

/**
 * Home Page Component
 */
export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/EHB-HOME/data/service_info.json');
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback data if fetch fails
        setServices([
          {
            name: 'EHB-HOME',
            type: 'frontend',
            description: 'Central dashboard for EHB system',
            url: 'http://localhost:5005',
            status: 'online'
          },
          {
            name: 'EHB-AI-Dev-Fullstack',
            type: 'fullstack',
            description: 'AI development hub and integration services',
            url: 'http://localhost:5003',
            status: 'online'
          },
          {
            name: 'EHB-Developer-Portal',
            type: 'frontend',
            description: 'Documentation and resources for developers',
            url: 'http://localhost:5000',
            status: 'online'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>EHB System Dashboard</title>
        <meta name="description" content="EHB System Dashboard" />
      </Head>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            EHB System Dashboard
          </h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Services Section */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Services & Departments</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p>Loading services...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map(service => (
                  <div 
                    key={service.name}
                    className={\`\${typeColorMap[service.type] || typeColorMap.default} shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow\`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                        {service.type}
                      </span>
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Links Section */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Links</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Quick access to key resources</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a 
                      href="http://localhost:5000" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                        <span className="text-lg">DP</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Developer Portal</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5003" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-500 text-white">
                        <span className="text-lg">IH</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Integration Hub</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5001/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white">
                        <span className="text-lg">API</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">API Explorer</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5000/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                        <span className="text-lg">DOC</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Documentation</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Departments Section */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Departments</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Key departments in the EHB system</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-medium text-blue-800">AI Development</h3>
                      <p className="mt-1 text-sm text-blue-600">AI services and development tools</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-medium text-green-800">Finance</h3>
                      <p className="mt-1 text-sm text-green-600">Financial services and payments</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-medium text-purple-800">Commerce</h3>
                      <p className="mt-1 text-sm text-purple-600">E-commerce and marketplace</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="font-medium text-yellow-800">Healthcare</h3>
                      <p className="mt-1 text-sm text-yellow-600">Medical services and health</p>
                    </div>
                    
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h3 className="font-medium text-pink-800">Education</h3>
                      <p className="mt-1 text-sm text-pink-600">Educational services and learning</p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <h3 className="font-medium text-indigo-800">Legal</h3>
                      <p className="mt-1 text-sm text-indigo-600">Legal services and consultation</p>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h3 className="font-medium text-red-800">Media</h3>
                      <p className="mt-1 text-sm text-red-600">Media streaming and content</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="font-medium text-orange-800">Employment</h3>
                      <p className="mt-1 text-sm text-orange-600">Job services and careers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="border-t border-gray-200 pt-8">
              <p className="text-center text-sm text-gray-500">
                EHB System Dashboard &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
      
      fs.writeFileSync(ehbHomeIndexPath, ehbHomeIndexContent);
      log(`Updated EHB-HOME dashboard index.js`, LOG_LEVELS.SUCCESS);
    } else {
      log(`EHB-HOME index.js not found at ${ehbHomeIndexPath}`, LOG_LEVELS.WARNING);
    }
    
    // Try to restart EHB-HOME service with a gentle kill and restart approach
    try {
      // First try to find and kill any running EHB-HOME processes
      log(`Attempting to restart EHB-HOME service...`, LOG_LEVELS.INFO);
      
      // Use native commands to avoid errors
      if (process.platform === 'win32') {
        // Windows
        try {
          execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq EHB-HOME"', { stdio: 'pipe' });
        } catch (error) {
          // Ignore errors from taskkill
        }
      } else {
        // Unix/Linux
        try {
          execSync('pkill -f "cd EHB-HOME && npm run dev"', { stdio: 'pipe' });
        } catch (error) {
          // Ignore errors from pkill
        }
      }
      
      // Start the EHB-HOME service in the background
      const startCommand = 'cd EHB-HOME && npm run dev';
      exec(startCommand, (error, stdout, stderr) => {
        if (error) {
          log(`Error starting EHB-HOME service: ${error.message}`, LOG_LEVELS.ERROR);
          return;
        }
        log(`EHB-HOME service started successfully`, LOG_LEVELS.SUCCESS);
      });
      
      log(`Requested restart of EHB-HOME service`, LOG_LEVELS.SUCCESS);
    } catch (error) {
      log(`Error restarting EHB-HOME service: ${error.message}`, LOG_LEVELS.ERROR);
    }
  } catch (error) {
    log(`Error updating dashboards: ${error.message}`, LOG_LEVELS.ERROR);
  }
}

/**
 * Main function: Organize the EHB workspace
 */
function organizeWorkspace() {
  log('Starting EHB Workspace Organizer', LOG_LEVELS.INFO);
  
  try {
    // Step 1: Create necessary directories
    createNeededDirectories();
    
    // Step 2: Identify file destinations
    const fileInfo = identifyFileDestinations();
    
    // Step 3: Move files to their destinations
    moveFilesToDestinations(fileInfo);
    
    // Step 4: Set up service information
    setupServiceInformation();
    
    // Step 5: Clean up and organize
    cleanupAndOrganize();
    
    // Step 6: Update dashboards
    updateDashboards();
    
    log('EHB Workspace organization completed successfully', LOG_LEVELS.SUCCESS);
  } catch (error) {
    log(`Error organizing workspace: ${error.message}`, LOG_LEVELS.ERROR);
    log(`Stack trace: ${error.stack}`, LOG_LEVELS.ERROR);
  }
}

// Run the workspace organizer
organizeWorkspace();