/**
 * EHB ZIP Watcher Script
 * 
 * This script watches the attached_assets directory for new ZIP files and processes them
 * automatically using the process-ehb-zips.js script.
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

// Configuration
const ASSETS_DIRECTORY = path.join(process.cwd(), 'attached_assets');
const LOG_FILE = path.join(process.cwd(), 'logs', 'zip_watcher.log');

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
 * Process a ZIP file using the process-ehb-zips.js script
 * @param {string} zipFilePath 
 */
function processZipFile(zipFilePath) {
  const fileName = path.basename(zipFilePath);
  
  if (!fileName.endsWith('.zip')) {
    return;
  }
  
  logMessage(`New ZIP file detected: ${fileName}`);
  
  const command = `node ${path.join(process.cwd(), 'scripts', 'process-ehb-zips.js')} --file "${fileName}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logMessage(`Error processing ZIP file: ${error.message}`);
      return;
    }
    
    if (stdout) {
      logMessage(`ZIP processing output: ${stdout}`);
    }
    
    if (stderr) {
      logMessage(`ZIP processing error: ${stderr}`);
    }
    
    logMessage(`ZIP file processed: ${fileName}`);
  });
}

/**
 * Main function
 */
function main() {
  logMessage('Starting ZIP file watcher service');
  
  // Create log directory if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Check if chokidar is installed
  try {
    require.resolve('chokidar');
    logMessage('Chokidar already installed');
  } catch (error) {
    logMessage('Installing chokidar package...');
    
    exec('npm install chokidar', (error, stdout, stderr) => {
      if (error) {
        logMessage(`Failed to install chokidar: ${error.message}`);
        return;
      }
      
      logMessage('Chokidar installed successfully');
      startWatcher();
    });
    
    return;
  }
  
  startWatcher();
}

/**
 * Start the watcher
 */
function startWatcher() {
  logMessage(`Starting watcher on directory: ${ASSETS_DIRECTORY}`);
  
  // Create assets directory if it doesn't exist
  if (!fs.existsSync(ASSETS_DIRECTORY)) {
    fs.mkdirSync(ASSETS_DIRECTORY, { recursive: true });
  }
  
  // Initialize watcher
  const watcher = chokidar.watch(ASSETS_DIRECTORY, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: false
  });
  
  // Add event listeners
  watcher.on('add', (filePath) => {
    if (path.extname(filePath) === '.zip') {
      processZipFile(filePath);
    }
  });
  
  watcher.on('error', (error) => {
    logMessage(`Watcher error: ${error}`);
  });
  
  logMessage('ZIP watcher service started successfully');
}

// Run the main function
main();