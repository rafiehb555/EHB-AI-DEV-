/**
 * EHB Data Flow Manager
 * 
 * This script manages the data flow between different EHB modules.
 * It ensures data is stored in the correct locations and properly linked.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chokidar = require('chokidar');
const AdmZip = require('adm-zip');

// Configuration
const BASE_DIR = process.cwd();
const LOG_FILE = path.join(BASE_DIR, 'ehb_data_flow.log');
const TEMP_DIR = path.join(BASE_DIR, 'temp');
const PROCESSED_DIR = path.join(BASE_DIR, 'attached_assets/processed');
const DATA_FLOW_CONFIG = {
  // Map of service types to their respective data directories
  serviceDataDirs: {
    'EHB-AI-Dev-Fullstack': path.join(BASE_DIR, 'EHB-AI-Dev-Fullstack', 'data'),
    'EHB-HOME': path.join(BASE_DIR, 'EHB-HOME', 'data'),
    'EHB-Developer-Portal': path.join(BASE_DIR, 'EHB-Developer-Portal', 'data'),
    'JPS-Job-Providing-Service': path.join(BASE_DIR, 'JPS-Job-Providing-Service', 'data'),
    'EHB-AI-Marketplace': path.join(BASE_DIR, 'EHB-AI-Marketplace', 'data'),
    'EHB-DASHBOARD': path.join(BASE_DIR, 'EHB-DASHBOARD', 'data'),
    'EHB-Blockchain': path.join(BASE_DIR, 'EHB-Blockchain', 'data'),
    'EHB-TrustyWallet-System': path.join(BASE_DIR, 'EHB-TrustyWallet-System', 'data'),
    'EHB-Tube': path.join(BASE_DIR, 'EHB-Tube', 'data'),
    'GoSellr-Ecommerce': path.join(BASE_DIR, 'GoSellr-Ecommerce', 'data'),
    'WMS-World-Medical-Service': path.join(BASE_DIR, 'WMS-World-Medical-Service', 'data'),
    'HPS-Education-Service': path.join(BASE_DIR, 'HPS-Education-Service', 'data'),
    'OLS-Online-Law-Service': path.join(BASE_DIR, 'OLS-Online-Law-Service', 'data')
  },
  
  // Data types and their file extensions
  dataTypes: {
    'company_info': ['.json', '.md'],
    'user_data': ['.json', '.csv'],
    'analytics': ['.json', '.csv'],
    'transactions': ['.json'],
    'media': ['.mp4', '.jpg', '.png', '.gif'],
    'documents': ['.pdf', '.docx', '.txt']
  }
};

/**
 * Write a message to the log file with timestamp
 * @param {string} message - Message to log
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Write to log file
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logMessage(`Created directory: ${dirPath}`);
  }
}

/**
 * Get list of all EHB modules (directories)
 * @returns {Array<string>} List of module names
 */
function getAllModules() {
  // Read directories in the base directory
  const items = fs.readdirSync(BASE_DIR);
  
  // Filter for directories that look like EHB modules
  const moduleDirs = items.filter(item => {
    const itemPath = path.join(BASE_DIR, item);
    return fs.statSync(itemPath).isDirectory() && 
           (item.startsWith('EHB-') || 
            item.includes('Service') || 
            item.includes('Dashboard') || 
            item.includes('Portal') || 
            item.includes('Ecommerce'));
  });
  
  return moduleDirs;
}

/**
 * Create data directories for all modules
 */
function createDataDirectories() {
  const modules = getAllModules();
  
  modules.forEach(moduleName => {
    const dataDir = path.join(BASE_DIR, moduleName, 'data');
    createDirIfNotExists(dataDir);
    
    // Create subdirectories for different data types
    Object.keys(DATA_FLOW_CONFIG.dataTypes).forEach(dataType => {
      const dataTypeDir = path.join(dataDir, dataType);
      createDirIfNotExists(dataTypeDir);
    });
  });
  
  logMessage(`Created data directories for ${modules.length} modules`);
}

/**
 * Clean up duplicate files across services
 */
function cleanupDuplicateFiles() {
  const modules = getAllModules();
  const fileHashes = new Map();
  const duplicates = [];
  
  // First pass: collect file hashes
  modules.forEach(moduleName => {
    const dataDir = path.join(BASE_DIR, moduleName, 'data');
    
    if (fs.existsSync(dataDir)) {
      Object.keys(DATA_FLOW_CONFIG.dataTypes).forEach(dataType => {
        const dataTypeDir = path.join(dataDir, dataType);
        
        if (fs.existsSync(dataTypeDir)) {
          const files = fs.readdirSync(dataTypeDir);
          
          files.forEach(file => {
            const filePath = path.join(dataTypeDir, file);
            
            if (fs.statSync(filePath).isFile()) {
              const fileContent = fs.readFileSync(filePath);
              const fileHash = require('crypto').createHash('md5').update(fileContent).digest('hex');
              
              if (fileHashes.has(fileHash)) {
                duplicates.push({
                  originalPath: fileHashes.get(fileHash),
                  duplicatePath: filePath
                });
              } else {
                fileHashes.set(fileHash, filePath);
              }
            }
          });
        }
      });
    }
  });
  
  // Second pass: remove duplicates
  duplicates.forEach(({originalPath, duplicatePath}) => {
    const originalPathParts = originalPath.split('/');
    const duplicatePathParts = duplicatePath.split('/');
    
    logMessage(`Found duplicate: "${duplicatePath}" is a duplicate of "${originalPath}"`);
    
    // Only remove if in different modules
    if (originalPathParts[originalPathParts.length - 4] !== duplicatePathParts[duplicatePathParts.length - 4]) {
      fs.unlinkSync(duplicatePath);
      logMessage(`Removed duplicate file: ${duplicatePath}`);
    }
  });
  
  logMessage(`Removed ${duplicates.length} duplicate files`);
}

/**
 * Process a single file and move it to the correct location
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    
    // Determine data type based on file extension
    let dataType = 'documents'; // Default
    
    for (const [type, extensions] of Object.entries(DATA_FLOW_CONFIG.dataTypes)) {
      if (extensions.includes(fileExt)) {
        dataType = type;
        break;
      }
    }
    
    // Determine which service the file belongs to
    let targetService = 'EHB-AI-Dev-Fullstack'; // Default service
    
    // Try to determine based on file content or name
    if (fileName.includes('company') || fileName.includes('ehb')) {
      targetService = 'EHB-AI-Dev-Fullstack';
    } else if (fileName.includes('user') || fileName.includes('profile')) {
      targetService = 'EHB-HOME';
    } else if (fileName.includes('job') || fileName.includes('career')) {
      targetService = 'JPS-Job-Providing-Service';
    } else if (fileName.includes('medical') || fileName.includes('health')) {
      targetService = 'WMS-World-Medical-Service';
    } else if (fileName.includes('education') || fileName.includes('course')) {
      targetService = 'HPS-Education-Service';
    } else if (fileName.includes('law') || fileName.includes('legal')) {
      targetService = 'OLS-Online-Law-Service';
    } else if (fileName.includes('ecommerce') || fileName.includes('product')) {
      targetService = 'GoSellr-Ecommerce';
    } else if (fileName.includes('video') || fileName.includes('tube')) {
      targetService = 'EHB-Tube';
    } else if (fileName.includes('wallet') || fileName.includes('payment')) {
      targetService = 'EHB-TrustyWallet-System';
    } else if (fileName.includes('blockchain') || fileName.includes('crypto')) {
      targetService = 'EHB-Blockchain';
    }
    
    // Create target directory if it doesn't exist
    const targetDir = path.join(BASE_DIR, targetService, 'data', dataType);
    createDirIfNotExists(targetDir);
    
    // Copy file to target location
    const targetPath = path.join(targetDir, fileName);
    fs.copyFileSync(filePath, targetPath);
    
    logMessage(`Processed file: ${fileName} -> ${targetService}/${dataType}`);
    return true;
  } catch (error) {
    logMessage(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Process a ZIP file containing data files
 * @param {string} zipFilePath - Path to the ZIP file
 */
function processZipFile(zipFilePath) {
  try {
    const zipFileName = path.basename(zipFilePath);
    logMessage(`Processing ZIP file: ${zipFileName}`);
    
    // Create temp extraction directory
    const extractDir = path.join(TEMP_DIR, `extract_${Date.now()}`);
    createDirIfNotExists(extractDir);
    
    // Extract ZIP file
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractDir, true);
    
    // Get list of extracted files
    const extractedFiles = [];
    function getAllFiles(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        
        if (fs.statSync(filePath).isDirectory()) {
          getAllFiles(filePath);
        } else {
          extractedFiles.push(filePath);
        }
      });
    }
    
    getAllFiles(extractDir);
    logMessage(`Extracted ${extractedFiles.length} files from ${zipFileName}`);
    
    // Process each extracted file
    let successCount = 0;
    extractedFiles.forEach(filePath => {
      if (processFile(filePath)) {
        successCount++;
      }
    });
    
    // Move ZIP file to processed directory
    createDirIfNotExists(PROCESSED_DIR);
    const processedPath = path.join(PROCESSED_DIR, zipFileName);
    fs.renameSync(zipFilePath, processedPath);
    
    // Clean up extraction directory
    fs.rmSync(extractDir, { recursive: true, force: true });
    
    logMessage(`Successfully processed ${successCount} files from ${zipFileName}`);
    logMessage(`Moved ${zipFileName} to processed directory`);
    
    return true;
  } catch (error) {
    logMessage(`Error processing ZIP file ${zipFilePath}: ${error.message}`);
    return false;
  }
}

/**
 * Watch for new data files and process them
 */
function watchForNewDataFiles() {
  // Create watcher for the attached_assets directory
  const watcher = chokidar.watch(path.join(BASE_DIR, 'attached_assets'), {
    ignored: [
      '**/node_modules/**',
      '**/processed/**'
    ],
    persistent: true
  });
  
  logMessage('Started watching for new data files in attached_assets directory');
  
  // Handle file add events
  watcher.on('add', filePath => {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.zip') {
      // Process ZIP file
      processZipFile(filePath);
    } else if (['.json', '.md', '.csv', '.pdf', '.docx', '.txt', '.mp4', '.jpg', '.png', '.gif'].includes(ext)) {
      // Process individual data file
      processFile(filePath);
      
      // Move processed file to processed directory
      createDirIfNotExists(PROCESSED_DIR);
      const fileName = path.basename(filePath);
      const processedPath = path.join(PROCESSED_DIR, fileName);
      fs.renameSync(filePath, processedPath);
      
      logMessage(`Moved ${fileName} to processed directory`);
    }
  });
  
  return watcher;
}

/**
 * Generate service info for the dashboard
 * @returns {Array<Object>} List of service information
 */
function generateServiceInfo() {
  const modules = getAllModules();
  const serviceInfo = [];
  
  modules.forEach(moduleName => {
    const modulePath = path.join(BASE_DIR, moduleName);
    
    // Skip if not a directory
    if (!fs.existsSync(modulePath) || !fs.statSync(modulePath).isDirectory()) {
      return;
    }
    
    // Try to determine module type
    let moduleType = 'service';
    
    // Check for package.json
    const packageJsonPath = path.join(modulePath, 'package.json');
    let packageData = null;
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      } catch (error) {
        logMessage(`Error parsing package.json for ${moduleName}: ${error.message}`);
      }
    }
    
    // Check for next.config.js
    const hasNextConfig = fs.existsSync(path.join(modulePath, 'next.config.js'));
    
    // Check for presence of certain folders
    const hasFrontendFolder = fs.existsSync(path.join(modulePath, 'frontend'));
    const hasBackendFolder = fs.existsSync(path.join(modulePath, 'backend'));
    const hasComponentsFolder = fs.existsSync(path.join(modulePath, 'components'));
    const hasPagesFolder = fs.existsSync(path.join(modulePath, 'pages'));
    const hasServicesFolder = fs.existsSync(path.join(modulePath, 'services'));
    
    // Check for data files
    const dataDir = path.join(modulePath, 'data');
    let dataFiles = 0;
    
    if (fs.existsSync(dataDir)) {
      function countFiles(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          
          if (fs.statSync(filePath).isDirectory()) {
            countFiles(filePath);
          } else if (fs.statSync(filePath).isFile()) {
            dataFiles++;
          }
        });
      }
      
      countFiles(dataDir);
    }
    
    // Determine module type based on name and folders
    if (moduleName.toLowerCase().includes('dashboard')) {
      moduleType = 'dashboard';
    } else if (moduleName.toLowerCase().includes('wallet')) {
      moduleType = 'wallet';
    } else if (moduleName.toLowerCase().includes('tube') || 
             moduleName.toLowerCase().includes('media')) {
      moduleType = 'media';
    } else if (moduleName.toLowerCase().includes('sql') || 
             moduleName.toLowerCase().includes('database')) {
      moduleType = 'database';
    } else if (moduleName.toLowerCase().includes('ecommerce') || 
             moduleName.toLowerCase().includes('sell')) {
      moduleType = 'ecommerce';
    } else if (moduleName.toLowerCase().includes('affiliate')) {
      moduleType = 'affiliate';
    } else if (moduleName.toLowerCase().includes('service')) {
      moduleType = 'service';
    } else if (hasFrontendFolder && hasBackendFolder) {
      moduleType = 'fullstack';
    } else if (hasNextConfig || hasComponentsFolder || hasPagesFolder) {
      moduleType = 'frontend';
    } else if (hasServicesFolder || hasBackendFolder) {
      moduleType = 'backend';
    }
    
    // Get module description
    let description = `${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} module for EHB system`;
    
    if (packageData && packageData.description) {
      description = packageData.description;
    }
    
    // Get last modified time of the module directory
    const stats = fs.statSync(modulePath);
    const lastModified = stats.mtime;
    
    // Construct URL based on module type
    let url = '#';
    let port = null;
    
    if (moduleType === 'frontend' || moduleType === 'dashboard') {
      url = 'http://localhost:5002';
      port = 5002;
    } else if (moduleType === 'backend') {
      url = 'http://localhost:5001';
      port = 5001;
    } else if (moduleType === 'fullstack') {
      url = 'http://localhost:5000';
      port = 5000;
    }
    
    // Special cases for specific modules
    if (moduleName === 'EHB-HOME') {
      url = 'http://localhost:5005';
      port = 5005;
    } else if (moduleName === 'EHB-AI-Dev-Fullstack') {
      url = 'http://localhost:5003';
      port = 5003;
    } else if (moduleName === 'EHB-Developer-Portal') {
      url = 'http://localhost:5000';
      port = 5000;
    }
    
    // Get data files by type
    const dataStats = {};
    
    if (fs.existsSync(dataDir)) {
      Object.keys(DATA_FLOW_CONFIG.dataTypes).forEach(dataType => {
        const dataTypeDir = path.join(dataDir, dataType);
        
        if (fs.existsSync(dataTypeDir)) {
          const files = fs.readdirSync(dataTypeDir);
          dataStats[dataType] = files.filter(file => fs.statSync(path.join(dataTypeDir, file)).isFile()).length;
        } else {
          dataStats[dataType] = 0;
        }
      });
    }
    
    serviceInfo.push({
      name: moduleName,
      path: modulePath,
      type: moduleType,
      description,
      lastModified,
      dataFiles,
      dataStats,
      url,
      port
    });
  });
  
  return serviceInfo;
}

/**
 * Update service info in JSON file for dashboard
 */
function updateServiceInfoFile() {
  const serviceInfo = generateServiceInfo();
  const serviceInfoPath = path.join(BASE_DIR, 'EHB-HOME', 'data', 'service_info.json');
  
  // Create directory if it doesn't exist
  createDirIfNotExists(path.dirname(serviceInfoPath));
  
  // Write service info to file
  fs.writeFileSync(serviceInfoPath, JSON.stringify(serviceInfo, null, 2));
  
  logMessage(`Updated service info in ${serviceInfoPath}`);
}

/**
 * Create structure overview file
 */
function createStructureOverview() {
  const serviceInfo = generateServiceInfo();
  const structurePath = path.join(BASE_DIR, 'EHB-HOME', 'data', 'structure_overview.md');
  
  // Create directory if it doesn't exist
  createDirIfNotExists(path.dirname(structurePath));
  
  // Generate structure overview content
  let content = '# EHB System Structure Overview\n\n';
  content += `Last updated: ${new Date().toISOString()}\n\n`;
  
  // Group services by type
  const servicesByType = {};
  
  serviceInfo.forEach(service => {
    if (!servicesByType[service.type]) {
      servicesByType[service.type] = [];
    }
    
    servicesByType[service.type].push(service);
  });
  
  // Add services by type
  for (const [type, services] of Object.entries(servicesByType)) {
    content += `## ${type.charAt(0).toUpperCase() + type.slice(1)} Services\n\n`;
    
    services.forEach(service => {
      content += `### ${service.name}\n\n`;
      content += `- **Description**: ${service.description}\n`;
      content += `- **URL**: ${service.url}\n`;
      content += `- **Data Files**: ${service.dataFiles}\n`;
      content += '- **Data Types**:\n';
      
      for (const [dataType, count] of Object.entries(service.dataStats)) {
        if (count > 0) {
          content += `  - ${dataType}: ${count} files\n`;
        }
      }
      
      content += `- **Last Modified**: ${service.lastModified}\n\n`;
    });
  }
  
  // Write structure overview to file
  fs.writeFileSync(structurePath, content);
  
  logMessage(`Created structure overview in ${structurePath}`);
}

/**
 * Main function
 */
async function main() {
  logMessage('Starting EHB Data Flow Manager');
  
  try {
    // Create temp directory if it doesn't exist
    createDirIfNotExists(TEMP_DIR);
    
    // Create data directories for all modules
    createDataDirectories();
    
    // Clean up duplicate files across services
    cleanupDuplicateFiles();
    
    // Update service info for dashboard
    updateServiceInfoFile();
    
    // Create structure overview
    createStructureOverview();
    
    // Start watching for new data files
    const watcher = watchForNewDataFiles();
    
    // Update service info and structure overview periodically
    setInterval(() => {
      updateServiceInfoFile();
      createStructureOverview();
    }, 30000); // Every 30 seconds
    
    logMessage('EHB Data Flow Manager started successfully');
    
    // Handle process termination
    process.on('SIGINT', () => {
      logMessage('Stopping EHB Data Flow Manager');
      watcher.close();
      process.exit(0);
    });
  } catch (error) {
    logMessage(`Error in EHB Data Flow Manager: ${error.message}`);
  }
}

// Start the application
main();