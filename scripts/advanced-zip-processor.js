/**
 * Advanced ZIP File Processor for EHB System
 * 
 * This script processes ZIP files, extracts them to appropriate directories,
 * and then deletes the original ZIP files to keep the workspace clean.
 * 
 * Key features:
 * - Process each ZIP file individually with specialized handling
 * - Extract content to appropriate target directories
 * - Register modules with the Integration Hub
 * - Delete ZIP files after successful processing
 * - Detailed logging for debugging
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const axios = require('axios');
const { exec } = require('child_process');

// Configuration
const INPUT_DIR = path.join(process.cwd(), 'attached_assets');
const EXTRACT_DIR = path.join(process.cwd(), 'temp');
const LOG_FILE = path.join(process.cwd(), 'zip_processing.log');
const INTEGRATION_HUB_URL = 'http://localhost:5003';

// Module type mapping based on folder name patterns
const MODULE_TYPE_MAPPING = {
  'dashboard': 'dashboard',
  'affiliate': 'affiliate',
  'wallet': 'wallet',
  'tube': 'media',
  'sql': 'database',
  'home': 'home',
  'law': 'service',
  'medical': 'service', 
  'education': 'service',
  'ecommerce': 'ecommerce',
  'dev': 'development',
  'tech': 'technology'
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
 * Process a config.json file if it exists in the extracted directory
 * @param {Object} configData - Configuration data from config.json
 * @param {string} extractDir - Path to the extracted directory
 * @returns {Object} - Processed configuration
 */
function processConfigFile(configData, extractDir) {
  // If no config data, create default config
  if (!configData) {
    logMessage('No config.json found, using default configuration');
    return {
      targetDir: null,
      dependencies: [],
      postInstallCommands: []
    };
  }
  
  logMessage(`Processing config file: ${JSON.stringify(configData)}`);
  
  // Process dependencies if specified
  if (configData.dependencies && Array.isArray(configData.dependencies)) {
    logMessage(`Installing ${configData.dependencies.length} dependencies from config`);
    
    // Install each dependency
    configData.dependencies.forEach(dep => {
      try {
        if (dep.type === 'npm') {
          exec(`cd "${extractDir}" && npm install ${dep.name}`, (error, stdout, stderr) => {
            if (error) {
              logMessage(`Error installing NPM dependency ${dep.name}: ${error.message}`);
            } else {
              logMessage(`Installed NPM dependency: ${dep.name}`);
            }
          });
        } else if (dep.type === 'pip') {
          exec(`pip install ${dep.name}`, (error, stdout, stderr) => {
            if (error) {
              logMessage(`Error installing PIP dependency ${dep.name}: ${error.message}`);
            } else {
              logMessage(`Installed PIP dependency: ${dep.name}`);
            }
          });
        }
      } catch (error) {
        logMessage(`Failed to install dependency ${dep.name}: ${error.message}`);
      }
    });
  }
  
  return configData;
}

/**
 * Identify the type of EHB module based on folder name and contents
 * @param {string} folderName - Name of the folder
 * @param {Array<string>} filesList - List of files in the folder
 * @returns {string} - Module type
 */
function identifyModuleType(folderName, filesList) {
  // Convert folder name to lowercase for easier matching
  const lowerFolderName = folderName.toLowerCase();
  
  // Check for specific files that indicate module type
  const hasPackageJson = filesList.includes('package.json');
  const hasNextConfig = filesList.includes('next.config.js');
  const hasPythonFiles = filesList.some(file => file.endsWith('.py'));
  const hasHtmlFiles = filesList.some(file => file.endsWith('.html'));
  const hasDbFiles = filesList.some(file => 
    file.includes('database') || 
    file.includes('schema') || 
    file.includes('model')
  );
  
  // Check folder name against our mapping
  for (const [key, type] of Object.entries(MODULE_TYPE_MAPPING)) {
    if (lowerFolderName.includes(key)) {
      logMessage(`Module type identified as '${type}' based on folder name '${folderName}'`);
      return type;
    }
  }
  
  // Determine type based on files
  if (hasNextConfig) {
    return 'frontend';
  } else if (hasPackageJson && !hasNextConfig) {
    return 'backend';
  } else if (hasPythonFiles) {
    return 'python';
  } else if (hasDbFiles) {
    return 'database';
  } else if (hasHtmlFiles) {
    return 'static';
  }
  
  // Default module type
  logMessage(`Could not identify module type for '${folderName}', using default 'unknown'`);
  return 'unknown';
}

/**
 * Determine the target directory based on module name and type
 * @param {string} moduleName - Name of the module
 * @param {string} moduleType - Type of the module
 * @returns {string} - Target directory path
 */
function determineTargetDirectory(moduleName, moduleType) {
  // Special case handling
  if (moduleName.includes('HOME') || moduleName === 'EHB-HOME') {
    return path.join(process.cwd(), 'EHB-HOME');
  }
  
  if (moduleName.includes('DASHBOARD') || moduleName === 'EHB-DASHBOARD') {
    return path.join(process.cwd(), 'EHB-DASHBOARD');
  }
  
  if (moduleName.includes('AI-Dev-Fullstack') || moduleName === 'EHB-AI-Dev-Fullstack') {
    return path.join(process.cwd(), 'EHB-AI-Dev-Fullstack');
  }
  
  // Remove any phase indicators in the name (like -Phase-1, -Phase-2)
  const cleanedModuleName = moduleName.replace(/-Phase-\d+$/, '');
  
  // Standard module types to folder mapping
  switch (moduleType) {
    case 'frontend':
    case 'backend':
    case 'fullstack':
    case 'dashboard':
    case 'wallet':
    case 'affiliate':
    case 'home':
    case 'media':
    case 'ecommerce':
    case 'database':
    case 'technology':
    case 'development':
    case 'service':
      return path.join(process.cwd(), cleanedModuleName);
    default:
      // For unknown module types, use the original name
      return path.join(process.cwd(), moduleName);
  }
}

/**
 * Copy files from extract directory to target directory based on config
 * @param {string} extractDir - Source directory (extracted ZIP)
 * @param {string} targetDir - Target directory
 * @param {Object} configData - Configuration data
 */
function copyFilesToTarget(extractDir, targetDir, configData) {
  logMessage(`Copying files from ${extractDir} to ${targetDir}`);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    logMessage(`Created target directory: ${targetDir}`);
  }
  
  // Get the list of files and directories in the extract directory
  const items = fs.readdirSync(extractDir);
  
  // Process each item
  items.forEach(item => {
    const sourcePath = path.join(extractDir, item);
    const targetPath = path.join(targetDir, item);
    
    // Skip config.json
    if (item === 'config.json') {
      return;
    }
    
    // Check if the item is a directory or file
    const isDirectory = fs.statSync(sourcePath).isDirectory();
    
    if (isDirectory) {
      // If the target directory already exists, merge content
      if (fs.existsSync(targetPath)) {
        // Recursively copy the contents
        copyFilesToTarget(sourcePath, targetPath, configData);
      } else {
        // Copy the entire directory
        fs.mkdirSync(targetPath, { recursive: true });
        copyFilesToTarget(sourcePath, targetPath, configData);
      }
    } else {
      // For files, check if the target file already exists
      if (fs.existsSync(targetPath)) {
        // Compare file content to decide whether to overwrite
        const sourceContent = fs.readFileSync(sourcePath);
        const targetContent = fs.readFileSync(targetPath);
        
        if (sourceContent.equals(targetContent)) {
          logMessage(`Skipping identical file: ${item}`);
        } else {
          // Backup existing file
          const backupPath = `${targetPath}.bak`;
          fs.copyFileSync(targetPath, backupPath);
          logMessage(`Backed up existing file to: ${backupPath}`);
          
          // Copy the new file
          fs.copyFileSync(sourcePath, targetPath);
          logMessage(`Updated existing file: ${item}`);
        }
      } else {
        // Simply copy the file
        fs.copyFileSync(sourcePath, targetPath);
        logMessage(`Copied new file: ${item}`);
      }
    }
  });
  
  logMessage(`Completed copying files to: ${targetDir}`);
}

/**
 * Run any post-integration scripts specified in the config
 * @param {Object} configData - Configuration data
 * @param {string} targetDir - Target directory
 */
function runPostIntegrationScripts(configData, targetDir) {
  if (!configData || !configData.postInstallCommands || !Array.isArray(configData.postInstallCommands)) {
    return;
  }
  
  logMessage(`Running ${configData.postInstallCommands.length} post-integration commands`);
  
  // Run each command
  configData.postInstallCommands.forEach((cmd, index) => {
    try {
      exec(`cd "${targetDir}" && ${cmd}`, (error, stdout, stderr) => {
        if (error) {
          logMessage(`Error running command ${index + 1}: ${error.message}`);
        } else {
          logMessage(`Successfully ran command ${index + 1}: ${cmd}`);
          if (stdout) logMessage(`Command output: ${stdout}`);
        }
      });
    } catch (error) {
      logMessage(`Failed to run command ${index + 1}: ${error.message}`);
    }
  });
}

/**
 * Process a single ZIP file and integrate it into the EHB system
 * @param {string} zipFilePath - Path to the ZIP file
 * @returns {Promise<boolean>} - Whether the processing was successful
 */
async function processZipFile(zipFilePath) {
  const zipFileName = path.basename(zipFilePath);
  const moduleName = path.basename(zipFilePath, '.zip');
  
  logMessage(`Processing ZIP file: ${zipFileName}`);
  
  try {
    // Create extraction directory
    const extractDirBase = path.join(EXTRACT_DIR, moduleName);
    if (fs.existsSync(extractDirBase)) {
      fs.rmSync(extractDirBase, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDirBase, { recursive: true });
    
    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractDirBase, true);
    logMessage(`Extracted ZIP to: ${extractDirBase}`);
    
    // Check for config.json
    let configData = null;
    const configPath = path.join(extractDirBase, 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        configData = JSON.parse(configContent);
        logMessage(`Found and parsed config.json: ${configPath}`);
      } catch (error) {
        logMessage(`Error parsing config.json: ${error.message}`);
      }
    }
    
    // Process the configuration
    configData = processConfigFile(configData, extractDirBase);
    
    // Get a list of files in the extracted directory
    const filesList = fs.readdirSync(extractDirBase);
    
    // Handle special case for single directory extraction
    let extractDir = extractDirBase;
    if (filesList.length === 1 && fs.statSync(path.join(extractDirBase, filesList[0])).isDirectory()) {
      // If there's only one directory in the extract, use that
      extractDir = path.join(extractDirBase, filesList[0]);
      logMessage(`Using single directory inside ZIP: ${extractDir}`);
    }
    
    // Get updated list of files after potentially changing extractDir
    const updatedFilesList = fs.readdirSync(extractDir);
    
    // Identify module type
    const moduleType = identifyModuleType(moduleName, updatedFilesList);
    
    // Determine target directory
    const targetDir = configData && configData.targetDir ? 
      path.join(process.cwd(), configData.targetDir) : 
      determineTargetDirectory(moduleName, moduleType);
    
    logMessage(`Target directory determined as: ${targetDir}`);
    
    // Copy files to target
    copyFilesToTarget(extractDir, targetDir, configData);
    
    // Run post-integration scripts
    runPostIntegrationScripts(configData, targetDir);
    
    // Register with Integration Hub
    try {
      await registerWithIntegrationHub(moduleName, moduleType, targetDir);
    } catch (error) {
      logMessage(`Warning: Failed to register with Integration Hub: ${error.message}`);
      // Continue processing even if registration fails
    }
    
    // Now delete the original ZIP file
    fs.unlinkSync(zipFilePath);
    logMessage(`Deleted original ZIP file: ${zipFilePath}`);
    
    // Clean up the extraction directory
    fs.rmSync(extractDirBase, { recursive: true, force: true });
    logMessage(`Cleaned up extraction directory: ${extractDirBase}`);
    
    return true;
  } catch (error) {
    logMessage(`Error processing ZIP file ${zipFileName}: ${error.message}`);
    return false;
  }
}

/**
 * Register a module with the Integration Hub
 * @param {string} moduleName - Name of the module
 * @param {string} moduleType - Type of the module
 * @param {string} modulePath - Path to the module
 * @returns {Promise<Object>} - Registration response
 */
async function registerWithIntegrationHub(moduleName, moduleType, modulePath) {
  try {
    logMessage(`Registering module ${moduleName} with Integration Hub`);
    
    // Detect capabilities
    const capabilities = await detectModuleCapabilities(modulePath);
    
    // Generate URL based on module type
    let moduleUrl = `http://localhost:5000`;
    if (moduleType === 'frontend' || moduleType === 'dashboard') {
      moduleUrl = `http://localhost:5002`;
    } else if (moduleType === 'backend') {
      moduleUrl = `http://localhost:5001`;
    }
    
    // Make the registration request
    const response = await axios.post(`${INTEGRATION_HUB_URL}/api/modules/register`, {
      name: moduleName,
      type: moduleType,
      url: moduleUrl,
      capabilities,
      path: modulePath
    });
    
    logMessage(`Successfully registered module ${moduleName} with Integration Hub`);
    return response.data;
  } catch (error) {
    logMessage(`Error registering module ${moduleName} with Integration Hub: ${error.message}`);
    throw error;
  }
}

/**
 * Detect module capabilities based on its structure
 * @param {string} modulePath - Path to the module
 * @returns {Object} - Module capabilities
 */
async function detectModuleCapabilities(modulePath) {
  const capabilities = {
    dataTypes: [],
    features: []
  };
  
  try {
    // Check for package.json to detect Node.js capabilities
    const packageJsonPath = path.join(modulePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check dependencies to detect capabilities
        const deps = { ...packageData.dependencies, ...packageData.devDependencies };
        
        if (deps) {
          if (deps.react || deps.next) capabilities.features.push('frontend');
          if (deps.express || deps.fastify || deps.koa) capabilities.features.push('api');
          if (deps.mongoose || deps.sequelize || deps.prisma) {
            capabilities.features.push('database');
            capabilities.dataTypes.push('document');
          }
          if (deps.openai || deps.anthropic) capabilities.features.push('ai');
          if (deps['socket.io'] || deps.ws) capabilities.features.push('realtime');
          if (deps.stripe) capabilities.features.push('payments');
          if (deps.jsonwebtoken || deps.passport) capabilities.features.push('authentication');
        }
      } catch (error) {
        logMessage(`Error parsing package.json: ${error.message}`);
      }
    }
    
    // Look for specific directories to detect capabilities
    const dirs = fs.readdirSync(modulePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name.toLowerCase());
    
    if (dirs.includes('models') || dirs.includes('model')) {
      capabilities.features.push('database');
      capabilities.dataTypes.push('document');
    }
    
    if (dirs.includes('components') || dirs.includes('views')) {
      capabilities.features.push('frontend');
    }
    
    if (dirs.includes('controllers') || dirs.includes('routes') || dirs.includes('api')) {
      capabilities.features.push('api');
    }
    
    if (dirs.includes('auth') || dirs.includes('authentication')) {
      capabilities.features.push('authentication');
      capabilities.dataTypes.push('user');
    }
    
    if (dirs.includes('payments') || dirs.includes('billing')) {
      capabilities.features.push('payments');
      capabilities.dataTypes.push('transaction');
    }
    
    if (dirs.includes('notifications')) {
      capabilities.features.push('notifications');
      capabilities.dataTypes.push('notification');
    }
    
    // Add some default data types
    if (!capabilities.dataTypes.includes('user')) {
      capabilities.dataTypes.push('user');
    }
    
    if (!capabilities.dataTypes.includes('notification')) {
      capabilities.dataTypes.push('notification');
    }
    
    // Remove duplicates
    capabilities.features = [...new Set(capabilities.features)];
    capabilities.dataTypes = [...new Set(capabilities.dataTypes)];
    
    logMessage(`Detected capabilities for module at ${modulePath}: ${JSON.stringify(capabilities)}`);
    return capabilities;
  } catch (error) {
    logMessage(`Error detecting module capabilities: ${error.message}`);
    return capabilities;
  }
}

/**
 * Find all ZIP files in the input directory
 * @returns {Array<string>} - List of ZIP file paths
 */
function findZipFiles() {
  try {
    if (!fs.existsSync(INPUT_DIR)) {
      fs.mkdirSync(INPUT_DIR, { recursive: true });
    }
    
    // Get all .zip files in the input directory
    const zipFiles = fs.readdirSync(INPUT_DIR)
      .filter(file => file.toLowerCase().endsWith('.zip'))
      .map(file => path.join(INPUT_DIR, file));
    
    logMessage(`Found ${zipFiles.length} ZIP files to process`);
    return zipFiles;
  } catch (error) {
    logMessage(`Error finding ZIP files: ${error.message}`);
    return [];
  }
}

/**
 * Process all ZIP files in the input directory
 * @returns {Promise<void>}
 */
async function processAllZipFiles() {
  // Create extract directory if it doesn't exist
  if (!fs.existsSync(EXTRACT_DIR)) {
    fs.mkdirSync(EXTRACT_DIR, { recursive: true });
  }
  
  // Find all ZIP files
  const zipFiles = findZipFiles();
  
  if (zipFiles.length === 0) {
    logMessage('No ZIP files found to process');
    return;
  }
  
  // Process each ZIP file sequentially
  let processedCount = 0;
  for (const zipFile of zipFiles) {
    const success = await processZipFile(zipFile);
    if (success) {
      processedCount++;
    }
  }
  
  logMessage(`Processed ${processedCount} out of ${zipFiles.length} ZIP files`);
  
  // Clean up empty directories
  cleanEmptyDirectories();
}

/**
 * Clean up empty directories
 */
function cleanEmptyDirectories() {
  logMessage('Cleaning up empty directories');
  
  // Check if the extract directory is empty
  if (fs.existsSync(EXTRACT_DIR)) {
    try {
      const items = fs.readdirSync(EXTRACT_DIR);
      if (items.length === 0) {
        fs.rmdirSync(EXTRACT_DIR);
        logMessage(`Removed empty directory: ${EXTRACT_DIR}`);
      }
    } catch (error) {
      logMessage(`Error checking extract directory: ${error.message}`);
    }
  }
  
  // Check for other empty directories in the project root
  try {
    const tempDirs = fs.readdirSync(process.cwd())
      .filter(item => {
        const itemPath = path.join(process.cwd(), item);
        return fs.statSync(itemPath).isDirectory() && 
               item.startsWith('temp-') || 
               item === 'temp';
      });
    
    tempDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      try {
        const items = fs.readdirSync(dirPath);
        if (items.length === 0) {
          fs.rmdirSync(dirPath);
          logMessage(`Removed empty directory: ${dirPath}`);
        }
      } catch (error) {
        logMessage(`Error checking directory ${dir}: ${error.message}`);
      }
    });
  } catch (error) {
    logMessage(`Error checking for empty directories: ${error.message}`);
  }
}

/**
 * Main function to process ZIP files
 */
async function main() {
  logMessage('Starting advanced ZIP file processing');
  
  try {
    await processAllZipFiles();
    logMessage('ZIP processing completed successfully');
  } catch (error) {
    logMessage(`Error processing ZIP files: ${error.message}`);
  }
}

// Run the main function
main();

// Export functions for testing and external use
module.exports = {
  processZipFile,
  findZipFiles,
  processAllZipFiles
};