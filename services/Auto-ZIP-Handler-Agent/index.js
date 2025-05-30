/**
 * Auto-ZIP-Handler-Agent
 * 
 * This service automatically processes ZIP files in the upload directories,
 * extracts them, identifies their module type, and installs them to the
 * appropriate location in the EHB system structure.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const axios = require('axios');
const chokidar = require('chokidar');
const config = require('./config.json');

// Ensure log directory exists
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Logging function
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error, debug)
 */
function log(message, level = 'info') {
  if (config.logging.enabled) {
    // Skip if log level is not sufficient
    const levels = ['error', 'warn', 'info', 'debug'];
    if (levels.indexOf(level) > levels.indexOf(config.logging.level)) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${level.toUpperCase()}: ${message}\n`;
    
    // Console output
    if (config.logging.consoleOutput) {
      const colors = {
        error: '\x1b[31m', // Red
        warn: '\x1b[33m',  // Yellow
        info: '\x1b[36m',  // Cyan
        debug: '\x1b[90m', // Gray
        reset: '\x1b[0m'   // Reset
      };
      console.log(`${colors[level]}${logEntry.trim()}${colors.reset}`);
    }
    
    // File output
    fs.appendFileSync(config.logging.file, logEntry);
  }
}

/**
 * Identify the type of module based on its structure
 * @param {string} extractDir - Path to the extracted directory
 * @returns {string} - Module type (service, ui, blockchain, etc.)
 */
function identifyModuleType(extractDir) {
  try {
    // Check if config.json exists in the root
    const configPath = path.join(extractDir, 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const moduleConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (moduleConfig.type && config.settings.allowedTypes.includes(moduleConfig.type)) {
          log(`Module type identified from config.json: ${moduleConfig.type}`, 'info');
          return moduleConfig.type;
        }
      } catch (error) {
        log(`Error parsing config.json: ${error.message}`, 'error');
      }
    }
    
    // If no valid type found in config.json, try to infer from structure
    const files = fs.readdirSync(extractDir);
    
    // Check for indicators of different module types
    if (files.includes('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(extractDir, 'package.json'), 'utf8'));
      
      // UI modules typically have React/Next.js dependencies
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (dependencies.react || dependencies.next || dependencies['@chakra-ui/react']) {
        log('Module type inferred as UI based on package.json dependencies', 'info');
        return 'ui';
      }
      
      // Service modules often have express or similar dependencies
      if (dependencies.express || dependencies.fastify || dependencies.koa) {
        log('Module type inferred as service based on package.json dependencies', 'info');
        return 'service';
      }
    }
    
    // Check for blockchain-related files
    if (
      files.includes('contracts') || 
      files.includes('truffle-config.js') || 
      files.includes('hardhat.config.js')
    ) {
      log('Module type inferred as blockchain based on file structure', 'info');
      return 'blockchain';
    }
    
    // Default to service if we can't determine type
    log('Could not determine module type, defaulting to service', 'warn');
    return 'service';
  } catch (error) {
    log(`Error identifying module type: ${error.message}`, 'error');
    return 'service'; // Default to service
  }
}

/**
 * Process a ZIP file
 * @param {string} zipFilePath - Path to the ZIP file
 */
async function processZipFile(zipFilePath) {
  log(`Processing ZIP file: ${zipFilePath}`, 'info');
  
  // Extract filename without extension
  const zipFileName = path.basename(zipFilePath, '.zip');
  const extractDir = path.join(config.settings.extractBaseDir, zipFileName);
  
  try {
    // Ensure extract directory exists
    if (!fs.existsSync(config.settings.extractBaseDir)) {
      fs.mkdirSync(config.settings.extractBaseDir, { recursive: true });
    }
    
    // Extract ZIP file
    log(`Extracting ${zipFilePath} to ${extractDir}...`, 'info');
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractDir, true);
    log(`Successfully extracted ${zipFilePath} to ${extractDir}`, 'info');
    
    // Identify module type
    const moduleType = identifyModuleType(extractDir);
    
    // Determine target installation directory
    const targetBaseDir = config.settings.targetPaths[moduleType];
    const moduleName = zipFileName;
    const targetDir = path.join(targetBaseDir, moduleName);
    
    // Install module to target directory
    log(`Installing ${moduleType} module: ${moduleName} to ${targetDir}`, 'info');
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetBaseDir)) {
      fs.mkdirSync(targetBaseDir, { recursive: true });
    }
    
    // If target directory already exists, handle accordingly
    if (fs.existsSync(targetDir)) {
      log(`Target directory ${targetDir} already exists, removing before install`, 'warn');
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    // Copy all files from extract directory to target directory
    fs.mkdirSync(targetDir, { recursive: true });
    copyDirectory(extractDir, targetDir);
    
    // Register module with Developer Portal
    await registerModule(moduleName, moduleType, targetDir);
    
    // Trigger setup page in Developer Portal
    await triggerSetupPage(moduleName, moduleType);
    
    // Clean up
    if (config.settings.deleteAfterInstall) {
      log(`Deleting ZIP file after successful installation: ${zipFilePath}`, 'info');
      fs.unlinkSync(zipFilePath);
    }
    
    log(`✅ ${moduleName} installed successfully`, 'info');
  } catch (error) {
    log(`Error processing ZIP file ${zipFilePath}: ${error.message}`, 'error');
  } finally {
    // Clean up extract directory
    if (fs.existsSync(extractDir)) {
      log(`Cleaning up extract directory: ${extractDir}`, 'debug');
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
  }
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * Register a module with the Developer Portal
 * @param {string} moduleName - Name of the module
 * @param {string} moduleType - Type of the module
 * @param {string} modulePath - Path to the installed module
 */
async function registerModule(moduleName, moduleType, modulePath) {
  if (!config.settings.registrationEndpoint) {
    log('No registration endpoint configured, skipping module registration', 'warn');
    return;
  }
  
  try {
    log(`Registering module ${moduleName} (${moduleType}) with Developer Portal...`, 'info');
    
    // Create module data
    const moduleData = {
      id: moduleName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name: moduleName,
      description: getModuleDescription(modulePath),
      type: moduleType,
      path: modulePath,
      version: getModuleVersion(modulePath),
      dependencies: getModuleDependencies(modulePath)
    };
    
    // Send registration request
    const response = await axios.post(config.settings.registrationEndpoint, {
      module: moduleData
    });
    
    if (response.status === 201 || response.status === 200) {
      log(`Module ${moduleName} (${moduleType}) registered with Developer Portal`, 'info');
    } else {
      log(`Failed to register module: ${response.statusText}`, 'error');
    }
  } catch (error) {
    log(`Error registering module with Developer Portal: ${error.message}`, 'error');
  }
}

/**
 * Trigger setup page in Developer Portal
 * @param {string} moduleName - Name of the module
 * @param {string} moduleType - Type of the module
 */
async function triggerSetupPage(moduleName, moduleType) {
  if (!config.settings.triggerSetupEndpoint) {
    log('No trigger setup endpoint configured, skipping setup page trigger', 'warn');
    return;
  }
  
  try {
    log(`Triggering setup page for ${moduleName}...`, 'info');
    
    // Send trigger request
    const response = await axios.post(config.settings.triggerSetupEndpoint, {
      module: moduleName,
      type: moduleType,
      timestamp: new Date().toISOString()
    });
    
    if (response.status === 200) {
      log('Setup page should now be displayed in the Developer Portal', 'info');
    } else {
      log(`Failed to trigger setup page: ${response.statusText}`, 'error');
    }
  } catch (error) {
    log(`Error triggering setup page: ${error.message}`, 'error');
  }
}

/**
 * Get description from module
 * @param {string} modulePath - Path to the module
 * @returns {string} - Module description
 */
function getModuleDescription(modulePath) {
  try {
    // Try to get description from config.json
    const configPath = path.join(modulePath, 'config.json');
    if (fs.existsSync(configPath)) {
      const moduleConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (moduleConfig.description) {
        return moduleConfig.description;
      }
    }
    
    // Try to get description from package.json
    const packagePath = path.join(modulePath, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (packageJson.description) {
        return packageJson.description;
      }
    }
    
    // Try to get description from README.md
    const readmePath = path.join(modulePath, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf8');
      const firstParagraph = readme.split('\n\n')[1]; // Skip title, get first paragraph
      if (firstParagraph && firstParagraph.length < 200) {
        return firstParagraph.trim();
      }
    }
    
    return 'No description available';
  } catch (error) {
    log(`Error getting module description: ${error.message}`, 'error');
    return 'No description available';
  }
}

/**
 * Get version from module
 * @param {string} modulePath - Path to the module
 * @returns {string} - Module version
 */
function getModuleVersion(modulePath) {
  try {
    // Try to get version from config.json
    const configPath = path.join(modulePath, 'config.json');
    if (fs.existsSync(configPath)) {
      const moduleConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (moduleConfig.version) {
        return moduleConfig.version;
      }
    }
    
    // Try to get version from package.json
    const packagePath = path.join(modulePath, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (packageJson.version) {
        return packageJson.version;
      }
    }
    
    return '1.0.0';
  } catch (error) {
    log(`Error getting module version: ${error.message}`, 'error');
    return '1.0.0';
  }
}

/**
 * Get dependencies from module
 * @param {string} modulePath - Path to the module
 * @returns {string[]} - Module dependencies
 */
function getModuleDependencies(modulePath) {
  try {
    // Try to get dependencies from config.json
    const configPath = path.join(modulePath, 'config.json');
    if (fs.existsSync(configPath)) {
      const moduleConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (moduleConfig.dependencies && Array.isArray(moduleConfig.dependencies)) {
        return moduleConfig.dependencies;
      }
    }
    
    return [];
  } catch (error) {
    log(`Error getting module dependencies: ${error.message}`, 'error');
    return [];
  }
}

/**
 * Watch for new ZIP files in the specified directories
 */
function startWatching() {
  const directories = config.settings.watchDirectories;
  
  log(`Starting to watch directories: ${directories.join(', ')}`, 'info');
  
  // Ensure all watch directories exist
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      log(`Creating watch directory: ${dir}`, 'info');
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Start watching
  const watcher = chokidar.watch(directories.map(dir => `${dir}/*.zip`), {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  watcher
    .on('add', zipFilePath => {
      log(`New ZIP file detected: ${zipFilePath}`, 'info');
      processZipFile(zipFilePath);
    })
    .on('error', error => {
      log(`Watcher error: ${error}`, 'error');
    });
  
  log('ZIP file watcher started successfully', 'info');
}

/**
 * Process all existing ZIP files in the watch directories
 */
function processExistingZipFiles() {
  const directories = config.settings.watchDirectories;
  
  log(`Checking for existing ZIP files in: ${directories.join(', ')}`, 'info');
  
  let zipCount = 0;
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      
      const zipFiles = files.filter(file => file.toLowerCase().endsWith('.zip'));
      zipCount += zipFiles.length;
      
      log(`Found ${zipFiles.length} ZIP files in ${dir}`, 'info');
      
      zipFiles.forEach(file => {
        const zipFilePath = path.join(dir, file);
        processZipFile(zipFilePath);
      });
    }
  });
  
  log(`Found and processed ${zipCount} existing ZIP files`, 'info');
}

/**
 * Main function to start the service
 */
function startService() {
  log(`Starting Auto-ZIP-Handler-Agent (version ${config.version})`, 'info');
  
  // Process existing ZIP files
  processExistingZipFiles();
  
  // Start watching for new files
  startWatching();
  
  log('Auto-ZIP-Handler-Agent service started successfully', 'info');
}

// Start the service
startService();