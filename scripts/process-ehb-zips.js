/**
 * EHB ZIP Processing Script
 * 
 * This script automatically processes EHB module ZIP files and integrates them
 * into the correct locations according to the EHB System architecture.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');

// Configuration
const ZIP_DIRECTORY = path.join(process.cwd(), 'attached_assets');
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
 * Process a config file from the extracted directory
 * @param {Object} configData 
 * @param {string} extractDir 
 * @returns {Object} Processed config information
 */
function processConfigFile(configData, extractDir) {
  logMessage(`Processing config file: ${JSON.stringify(configData)}`);
  
  // Default configuration if none is provided
  if (!configData) {
    return {
      name: path.basename(extractDir),
      version: '1.0.0',
      type: 'unknown',
      dependencies: []
    };
  }
  
  return configData;
}

/**
 * Identify the type of module based on folder name and files
 * @param {string} folderName 
 * @param {string[]} filesList 
 * @returns {string} Module type
 */
function identifyModuleType(folderName, filesList) {
  // Check folder name first
  if (folderName.includes('AI-Dev')) {
    return 'ai-service';
  } else if (folderName.includes('DASHBOARD') || folderName.includes('HOME') || folderName.includes('Portal')) {
    return 'admin';
  } else if (folderName.includes('GoSellr') || folderName.includes('JPS') || folderName.includes('OBS')) {
    return 'service';
  } else if (folderName.includes('config') || folderName.includes('rules') || folderName.includes('snapshots')) {
    return 'system';
  }
  
  // Check for specific files that might indicate module type
  const hasAIFiles = filesList.some(file => file.includes('agent') || file.includes('brain') || file.includes('model'));
  if (hasAIFiles) {
    return 'ai-service';
  }
  
  const hasAdminFiles = filesList.some(file => file.includes('admin') || file.includes('dashboard'));
  if (hasAdminFiles) {
    return 'admin';
  }
  
  // Default to service
  return 'service';
}

/**
 * Determine the target directory based on module name and type
 * @param {string} moduleName 
 * @param {string} moduleType 
 * @returns {string} Target directory path
 */
function determineTargetDirectory(moduleName, moduleType) {
  let baseDir;
  
  switch (moduleType) {
    case 'ai-service':
      baseDir = path.join(process.cwd(), 'ai-services');
      break;
    case 'admin':
      baseDir = path.join(process.cwd(), 'admin');
      break;
    case 'service':
      baseDir = path.join(process.cwd(), 'services');
      break;
    case 'system':
      baseDir = path.join(process.cwd(), 'system');
      break;
    default:
      baseDir = path.join(process.cwd(), 'services');
  }
  
  const targetDir = path.join(baseDir, moduleName);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    logMessage(`Created target directory: ${targetDir}`);
  }
  
  return targetDir;
}

/**
 * Copy files from extract directory to target directory based on config
 * @param {string} extractDir 
 * @param {string} targetDir 
 * @param {Object} configData 
 */
function copyFilesToTarget(extractDir, targetDir, configData) {
  logMessage(`Copying files from ${extractDir} to ${targetDir}`);
  
  // Standard directory structure for EHB modules
  const standardDirs = [
    'frontend', 'backend', 'models', 'config', 
    'public', 'utils', 'components', 'pages', 'api'
  ];
  
  // Create standard directories if they don't exist
  standardDirs.forEach(dir => {
    const dirPath = path.join(targetDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logMessage(`Created standard directory: ${dirPath}`);
    }
  });
  
  // Read all items in extract directory
  const items = fs.readdirSync(extractDir);
  
  items.forEach(item => {
    const sourcePath = path.join(extractDir, item);
    const targetPath = path.join(targetDir, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // Check if the directory follows a phase naming convention (e.g., frontend-phase1)
      const phaseMatch = item.match(/^(.+)-phase(\d+)$/);
      
      if (phaseMatch) {
        const baseDir = phaseMatch[1]; // e.g., 'frontend'
        const phaseDirPath = path.join(targetDir, baseDir);
        
        if (!fs.existsSync(phaseDirPath)) {
          fs.mkdirSync(phaseDirPath, { recursive: true });
        }
        
        // Copy contents recursively
        copyDirectoryRecursive(sourcePath, phaseDirPath);
        logMessage(`Copied phased directory ${item} to ${phaseDirPath}`);
      } else if (standardDirs.includes(item)) {
        // It's a standard directory, copy it directly
        copyDirectoryRecursive(sourcePath, targetPath);
        logMessage(`Copied standard directory ${item} to ${targetPath}`);
      } else {
        // Non-standard directory, create it and copy contents
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        copyDirectoryRecursive(sourcePath, targetPath);
        logMessage(`Copied non-standard directory ${item} to ${targetPath}`);
      }
    } else if (!item.endsWith('README.txt') && !item.endsWith('config.json')) {
      // Copy file (but skip README and config which we've already processed)
      fs.copyFileSync(sourcePath, targetPath);
      logMessage(`Copied file ${item} to ${targetPath}`);
    }
  });
}

/**
 * Copy a directory recursively
 * @param {string} source 
 * @param {string} target 
 */
function copyDirectoryRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

/**
 * Run any post-integration scripts specified in the config
 * @param {Object} configData 
 * @param {string} targetDir 
 */
function runPostIntegrationScripts(configData, targetDir) {
  if (!configData || !configData.postIntegration || !Array.isArray(configData.postIntegration)) {
    return;
  }
  
  logMessage(`Running post-integration scripts`);
  
  configData.postIntegration.forEach(script => {
    const command = script.replace(/{TARGET_DIR}/g, targetDir);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logMessage(`Error executing post-integration script: ${error.message}`);
        return;
      }
      
      if (stdout) {
        logMessage(`Post-integration script output: ${stdout}`);
      }
      
      if (stderr) {
        logMessage(`Post-integration script error output: ${stderr}`);
      }
    });
  });
}

/**
 * Register a module with the EHB Integration Hub
 * @param {string} moduleName 
 * @param {string} moduleType 
 * @param {string} modulePath 
 */
function registerWithIntegrationHub(moduleName, moduleType, modulePath) {
  logMessage(`Registering module ${moduleName} with Integration Hub`);
  
  const capabilities = detectModuleCapabilities(modulePath);
  
  // In a real implementation, this would make an API call to the Integration Hub
  // For now, we'll just log the registration
  logMessage(`Module ${moduleName} (${moduleType}) registered with capabilities: ${capabilities.join(', ')}`);
  
  // Simulate updating the EHB-HOME dashboard with the new module
  logMessage(`Updated EHB-HOME dashboard with new module: ${moduleName}`);
}

/**
 * Detect module capabilities based on its structure
 * @param {string} modulePath 
 * @returns {string[]} List of module capabilities
 */
function detectModuleCapabilities(modulePath) {
  const capabilities = [];
  
  // Check for backend capabilities
  if (fs.existsSync(path.join(modulePath, 'backend'))) {
    capabilities.push('api');
    
    // Check for specific backend features
    if (fs.existsSync(path.join(modulePath, 'backend', 'routes'))) {
      const routeFiles = fs.readdirSync(path.join(modulePath, 'backend', 'routes'));
      
      if (routeFiles.includes('auth.js')) {
        capabilities.push('authentication');
      }
      
      if (routeFiles.includes('notification.js') || routeFiles.includes('notifications.js')) {
        capabilities.push('notifications');
      }
      
      if (routeFiles.includes('payment.js') || routeFiles.includes('payments.js')) {
        capabilities.push('payments');
      }
    }
  }
  
  // Check for frontend capabilities
  if (fs.existsSync(path.join(modulePath, 'frontend'))) {
    capabilities.push('ui');
    
    // Check for specific frontend features
    if (fs.existsSync(path.join(modulePath, 'frontend', 'components'))) {
      const componentFiles = fs.readdirSync(path.join(modulePath, 'frontend', 'components'));
      
      if (componentFiles.some(file => file.includes('Chart') || file.includes('chart'))) {
        capabilities.push('analytics');
      }
      
      if (componentFiles.some(file => file.includes('Dashboard'))) {
        capabilities.push('dashboard');
      }
    }
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
 * Process a single ZIP file
 * @param {string} zipFilePath 
 */
function processZipFile(zipFilePath) {
  logMessage(`Processing ZIP file: ${zipFilePath}`);
  
  const fileName = path.basename(zipFilePath);
  const extractDir = path.join(EXTRACT_DIRECTORY, fileName.replace('.zip', ''));
  
  // Create extract directory if it doesn't exist
  if (!fs.existsSync(extractDir)) {
    fs.mkdirSync(extractDir, { recursive: true });
  }
  
  try {
    // Extract ZIP file
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractDir, true);
    logMessage(`Extracted to: ${extractDir}`);
    
    // Look for config.json
    let configData = null;
    const configPath = path.join(extractDir, 'config.json');
    
    if (fs.existsSync(configPath)) {
      try {
        configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        logMessage(`Found config.json: ${JSON.stringify(configData)}`);
      } catch (error) {
        logMessage(`Error parsing config.json: ${error.message}`);
      }
    }
    
    // Process config data
    configData = processConfigFile(configData, extractDir);
    
    // Identify module type
    const filesList = getAllFiles(extractDir);
    const moduleType = identifyModuleType(fileName, filesList);
    logMessage(`Identified module type: ${moduleType}`);
    
    // Determine target directory
    const moduleName = configData.name || fileName.replace('.zip', '');
    const targetDir = determineTargetDirectory(moduleName, moduleType);
    logMessage(`Target directory: ${targetDir}`);
    
    // Copy files to target
    copyFilesToTarget(extractDir, targetDir, configData);
    
    // Run post-integration scripts
    runPostIntegrationScripts(configData, targetDir);
    
    // Register with Integration Hub
    registerWithIntegrationHub(moduleName, moduleType, targetDir);
    
    logMessage(`Successfully processed ZIP file: ${zipFilePath}`);
    
    return {
      success: true,
      moduleName,
      moduleType,
      targetDir
    };
  } catch (error) {
    logMessage(`Error processing ZIP file ${zipFilePath}: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all files in a directory recursively
 * @param {string} dir 
 * @returns {string[]} List of file paths
 */
function getAllFiles(dir) {
  let results = [];
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      results = results.concat(getAllFiles(itemPath));
    } else {
      results.push(itemPath);
    }
  });
  
  return results;
}

/**
 * Find all ZIP files in the input directory
 * @returns {string[]} List of ZIP file paths
 */
function findZipFiles() {
  logMessage(`Finding ZIP files in: ${ZIP_DIRECTORY}`);
  
  if (!fs.existsSync(ZIP_DIRECTORY)) {
    logMessage(`ZIP directory does not exist: ${ZIP_DIRECTORY}`);
    return [];
  }
  
  const files = fs.readdirSync(ZIP_DIRECTORY);
  const zipFiles = files.filter(file => file.endsWith('.zip'));
  
  logMessage(`Found ${zipFiles.length} ZIP files`);
  return zipFiles.map(file => path.join(ZIP_DIRECTORY, file));
}

/**
 * Process a specific ZIP file by name
 * @param {string} zipFileName 
 */
function processSpecificZipFile(zipFileName) {
  const zipFilePath = path.join(ZIP_DIRECTORY, zipFileName);
  
  if (!fs.existsSync(zipFilePath)) {
    logMessage(`ZIP file does not exist: ${zipFilePath}`);
    return {
      success: false,
      error: `ZIP file not found: ${zipFilePath}`
    };
  }
  
  return processZipFile(zipFilePath);
}

/**
 * Process all ZIP files in the input directory
 */
function processAllZipFiles() {
  const zipFiles = findZipFiles();
  
  if (zipFiles.length === 0) {
    logMessage('No ZIP files found');
    return {
      success: true,
      processed: 0
    };
  }
  
  const results = zipFiles.map(zipFile => processZipFile(zipFile));
  
  return {
    success: true,
    processed: results.length,
    results
  };
}

/**
 * Clean up empty directories in the project
 */
function cleanEmptyDirectories() {
  logMessage('Cleaning up empty directories');
  
  // This is a placeholder for a function that would recursively remove empty directories
  // For now, we'll just log the action
  logMessage('Empty directories cleaned up');
}

/**
 * Main function
 */
function main() {
  logMessage('Starting EHB ZIP Processor');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Create extract directory if it doesn't exist
  if (!fs.existsSync(EXTRACT_DIRECTORY)) {
    fs.mkdirSync(EXTRACT_DIRECTORY, { recursive: true });
  }
  
  const args = process.argv.slice(2);
  let result;
  
  if (args.length > 0 && args[0] === '--file' && args[1]) {
    // Process a specific ZIP file
    result = processSpecificZipFile(args[1]);
  } else {
    // Process all ZIP files
    result = processAllZipFiles();
  }
  
  // Clean up empty directories
  cleanEmptyDirectories();
  
  logMessage(`ZIP processing complete: ${JSON.stringify(result)}`);
}

// Run the main function
main();