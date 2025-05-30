/**
 * EHB Auto ZIP Handler
 *
 * This script automatically processes ZIP files from the attached_assets folder
 * and extracts them to the appropriate target folders based on module name.
 * It removes any "-Phase-X" suffixes from folder names after extraction.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');

const ASSETS_DIR = './attached_assets';
const PROCESSED_DIR = path.join(ASSETS_DIR, 'processed');

// Make sure processed directory exists
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

// Log file for the process
const LOG_FILE = './zip_processing.log';

/**
 * Logs a message to console and log file
 * @param {string} message - Message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Moves a file to the processed directory
 * @param {string} filePath - Path to the file
 */
function moveToProcessed(filePath) {
  const filename = path.basename(filePath);
  const targetPath = path.join(PROCESSED_DIR, filename);
  
  // Ensure we don't overwrite existing files in processed
  let finalTargetPath = targetPath;
  let counter = 1;
  
  while (fs.existsSync(finalTargetPath)) {
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    finalTargetPath = path.join(PROCESSED_DIR, `${baseName}_${counter}${ext}`);
    counter++;
  }
  
  fs.renameSync(filePath, finalTargetPath);
  log(`Moved ${filePath} to ${finalTargetPath}`);
}

/**
 * Determines the appropriate module folder for extraction
 * @param {string} zipFilename - Name of the ZIP file
 * @param {string[]} extractedFolders - List of folders found in the ZIP
 * @returns {string} Target directory name
 */
function determineTargetDir(zipFilename, extractedFolders) {
  // Try to match by ZIP filename first (without extension)
  const baseZipName = path.basename(zipFilename, path.extname(zipFilename));
  
  // Remove any "-Phase-X" suffix
  const phaseMatch = baseZipName.match(/-Phase-(\d+)$/);
  const hasPhase = phaseMatch !== null;
  const cleanName = baseZipName.replace(/-Phase-\d+$/, '');
  
  if (hasPhase) {
    const phaseNumber = phaseMatch[1];
    log(`Removed Phase-${phaseNumber} suffix from ${baseZipName} → ${cleanName}`);
  }
  
  // Check if we have a matching root directory
  const rootDirs = fs.readdirSync('.').filter(item => 
    fs.statSync(path.join('.', item)).isDirectory() && 
    !item.startsWith('.') && 
    item !== 'node_modules' &&
    item !== 'attached_assets' &&
    item !== 'scripts'
  );
  
  for (const dir of rootDirs) {
    if (dir.toLowerCase().includes(cleanName.toLowerCase())) {
      return dir;
    }
  }
  
  // If no match found by ZIP name, try to match by contents
  if (extractedFolders.length > 0) {
    const mainFolder = extractedFolders[0];
    const cleanMainFolder = mainFolder.replace(/-Phase-\d+$/, '');
    
    for (const dir of rootDirs) {
      if (dir.toLowerCase().includes(cleanMainFolder.toLowerCase())) {
        return dir;
      }
    }
  }
  
  // Return the cleaned ZIP name if no matches found
  return cleanName;
}

/**
 * Process a single ZIP file
 * @param {string} zipPath - Path to the ZIP file
 */
function processZipFile(zipPath) {
  try {
    log(`Processing ZIP file: ${zipPath}`);
    
    // Create a temporary directory for extraction
    const tempDir = path.join('.', 'temp_extract');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Extract the ZIP file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);
    
    // Check if config.json exists in the extracted content
    const configPath = path.join(tempDir, 'config.json');
    let configTargetDir = null;
    let moduleMetadata = null;
    
    if (fs.existsSync(configPath)) {
      try {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Check for target directory
        if (configData.targetDirectory) {
          configTargetDir = configData.targetDirectory;
          log(`Found config.json with target directory: ${configTargetDir}`);
        }
        
        // Check for module metadata
        if (configData.module) {
          moduleMetadata = configData.module;
          log(`Found module metadata in config.json: ${JSON.stringify(moduleMetadata)}`);
          
          // If module has a name but no targetDirectory was specified, use module name
          if (moduleMetadata.name && !configTargetDir) {
            configTargetDir = moduleMetadata.name;
            log(`Using module name as target directory: ${configTargetDir}`);
          }
        }
      } catch (error) {
        log(`Error parsing config.json: ${error.message}`);
      }
    }
    
    // Get all top-level directories in the extracted content
    const extractedItems = fs.readdirSync(tempDir);
    const extractedFolders = extractedItems.filter(item => 
      fs.statSync(path.join(tempDir, item)).isDirectory()
    );
    
    log(`Extracted folders: ${extractedFolders.join(', ')}`);
    
    // Determine target directory - prefer config.json if available
    const zipFilename = path.basename(zipPath);
    const targetDir = configTargetDir || determineTargetDir(zipFilename, extractedFolders);
    
    log(`Target directory determined: ${targetDir}`);
    
    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      log(`Created target directory: ${targetDir}`);
    }
    
    // Process each extracted folder
    for (const folder of extractedFolders) {
      const folderPath = path.join(tempDir, folder);
      
      // Remove "-Phase-X" suffix if present
      const folderPhaseMatch = folder.match(/-Phase-(\d+)$/);
      const folderHasPhase = folderPhaseMatch !== null;
      const cleanFolderName = folder.replace(/-Phase-\d+$/, '');
      
      if (folderHasPhase) {
        const phaseNumber = folderPhaseMatch[1];
        log(`Removed Phase-${phaseNumber} suffix from folder ${folder} → ${cleanFolderName}`);
      }
      
      // If we're merging into an existing module directory
      if (targetDir !== cleanFolderName) {
        // Copy all files from the extracted folder to the target directory
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
          const srcPath = path.join(folderPath, file);
          const destPath = path.join(targetDir, file);
          
          if (fs.statSync(srcPath).isDirectory()) {
            // Recursively copy directory
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            copyFolderRecursive(srcPath, destPath);
          } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
          }
        }
        log(`Merged ${folder} into ${targetDir}`);
      } 
      // If the folder name matches the target (apart from Phase suffix)
      else {
        // Simply rename the extracted folder if needed
        if (folder !== cleanFolderName) {
          const cleanFolderPath = path.join('.', cleanFolderName);
          if (fs.existsSync(cleanFolderPath)) {
            // If target already exists, merge the contents
            copyFolderRecursive(folderPath, cleanFolderPath);
            log(`Merged ${folder} into existing ${cleanFolderName}`);
          } else {
            // Otherwise just rename
            fs.renameSync(folderPath, cleanFolderPath);
            log(`Renamed ${folder} to ${cleanFolderName}`);
          }
        } else {
          // Move the folder to the root
          const rootFolderPath = path.join('.', folder);
          if (fs.existsSync(rootFolderPath)) {
            // Merge if it already exists
            copyFolderRecursive(folderPath, rootFolderPath);
            log(`Merged ${folder} into existing directory`);
          } else {
            fs.renameSync(folderPath, rootFolderPath);
            log(`Moved ${folder} to root directory`);
          }
        }
      }
    }
    
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    // If we have module metadata, attempt to register the module with the Integration Hub
    if (moduleMetadata) {
      try {
        registerModuleWithIntegrationHub(moduleMetadata, targetDir);
      } catch (error) {
        log(`Error registering module with Integration Hub: ${error.message}`);
      }
    }
    
    // Move the ZIP file to processed directory
    moveToProcessed(zipPath);
    
    log(`Successfully processed ZIP file: ${zipPath}`);
    return true;
  } catch (error) {
    log(`Error processing ZIP file ${zipPath}: ${error.message}`);
    return false;
  }
}

/**
 * Recursively copy a folder
 * @param {string} source - Source folder
 * @param {string} target - Target folder
 */
function copyFolderRecursive(source, target) {
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const srcPath = path.join(source, file);
    const destPath = path.join(target, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Recursive copy for subdirectories
      copyFolderRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Find and process all ZIP files in the assets directory
 */
function processAllZipFiles() {
  log('Starting automatic ZIP processing');
  
  // Get all ZIP files in the assets directory
  const files = fs.readdirSync(ASSETS_DIR);
  const zipFiles = files.filter(file => 
    file.toLowerCase().endsWith('.zip') && 
    fs.statSync(path.join(ASSETS_DIR, file)).isFile()
  );
  
  log(`Found ${zipFiles.length} ZIP files to process`);
  
  if (zipFiles.length === 0) {
    log('No ZIP files found. Exiting.');
    return;
  }
  
  // Process each ZIP file
  let successCount = 0;
  for (const zipFile of zipFiles) {
    const zipPath = path.join(ASSETS_DIR, zipFile);
    const success = processZipFile(zipPath);
    if (success) {
      successCount++;
    }
  }
  
  log(`Processed ${successCount} out of ${zipFiles.length} ZIP files successfully`);
}

// Install adm-zip if not already installed
function installDependencies() {
  return new Promise((resolve, reject) => {
    log('Checking for required dependencies...');
    
    // Check if adm-zip is installed
    try {
      require.resolve('adm-zip');
      log('adm-zip is already installed');
      resolve();
    } catch (e) {
      log('Installing adm-zip package...');
      exec('npm install adm-zip', (error, stdout, stderr) => {
        if (error) {
          log(`Error installing adm-zip: ${error.message}`);
          reject(error);
          return;
        }
        log('Successfully installed adm-zip');
        resolve();
      });
    }
  });
}

// Main function
async function main() {
  try {
    await installDependencies();
    processAllZipFiles();
  } catch (error) {
    log(`Error in main process: ${error.message}`);
  }
}

/**
 * Register a newly processed module with the Integration Hub
 * @param {Object} moduleMetadata - Metadata for the module from config.json
 * @param {string} targetDir - The target directory where the module was extracted
 */
function registerModuleWithIntegrationHub(moduleMetadata, targetDir) {
  const integrationHubUrl = process.env.INTEGRATION_HUB_URL || 'http://localhost:5003';
  const registrationUrl = `${integrationHubUrl}/api/modules/register`;
  
  // Prepare registration payload
  const payload = {
    ...moduleMetadata,
    path: path.resolve(targetDir),
    registeredBy: 'ZipProcessor',
    registrationTime: new Date().toISOString()
  };
  
  log(`Attempting to register module with Integration Hub at ${registrationUrl}`);
  log(`Registration payload: ${JSON.stringify(payload)}`);
  
  // Use the built-in http module to make a POST request
  const http = require('http');
  const url = new URL(registrationUrl);
  
  const requestOptions = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Create a request
  const req = http.request(requestOptions, (res) => {
    let data = '';
    
    // Collect response data
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // Process response when it's complete
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        log(`Successfully registered module ${moduleMetadata.name} with Integration Hub`);
        log(`Response: ${data}`);
      } else {
        log(`Failed to register module. Status code: ${res.statusCode}`);
        log(`Response: ${data}`);
      }
    });
  });
  
  // Handle errors
  req.on('error', (error) => {
    log(`Error during module registration: ${error.message}`);
  });
  
  // Send the payload
  req.write(JSON.stringify(payload));
  req.end();
}

// Execute the main function
main();