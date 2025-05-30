/**
 * Enhanced ZIP File Watcher for EHB System
 * 
 * This script watches for new ZIP files in the attached_assets directory,
 * processes them one by one as they are uploaded, and deletes them after processing.
 * 
 * Key features:
 * - Watch for new ZIP files in real-time
 * - Process each ZIP file separately and sequentially
 * - Use advanced-zip-processor.js for processing logic
 * - Delete ZIP files after processing
 * - Detailed logging
 */

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const zipProcessor = require('./advanced-zip-processor');

// Configuration
const WATCH_DIR = path.join(process.cwd(), 'attached_assets');
const LOG_FILE = path.join(process.cwd(), 'zip_watcher.log');
const PROCESSING_LOCK_FILE = path.join(process.cwd(), 'temp', 'processing.lock');

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
 * Check if a file is a ZIP file
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Whether the file is a ZIP file
 */
function isZipFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.zip';
}

/**
 * Create a processing lock
 * @returns {boolean} - Whether the lock was successfully created
 */
function createProcessingLock() {
  try {
    // Create the lock directory if it doesn't exist
    const lockDir = path.dirname(PROCESSING_LOCK_FILE);
    if (!fs.existsSync(lockDir)) {
      fs.mkdirSync(lockDir, { recursive: true });
    }
    
    // Create lock file with current timestamp
    fs.writeFileSync(PROCESSING_LOCK_FILE, new Date().toISOString());
    return true;
  } catch (error) {
    logMessage(`Error creating processing lock: ${error.message}`);
    return false;
  }
}

/**
 * Release the processing lock
 */
function releaseProcessingLock() {
  try {
    if (fs.existsSync(PROCESSING_LOCK_FILE)) {
      fs.unlinkSync(PROCESSING_LOCK_FILE);
    }
  } catch (error) {
    logMessage(`Error releasing processing lock: ${error.message}`);
  }
}

/**
 * Check if a processing lock exists
 * @returns {boolean} - Whether a processing lock exists
 */
function processingLockExists() {
  return fs.existsSync(PROCESSING_LOCK_FILE);
}

/**
 * Process a single ZIP file
 * @param {string} zipFilePath - Path to the ZIP file
 * @returns {Promise<boolean>} - Whether processing was successful
 */
async function processSingleZipFile(zipFilePath) {
  logMessage(`Processing ZIP file: ${path.basename(zipFilePath)}`);
  
  // Check if the file still exists (it might have been deleted by another process)
  if (!fs.existsSync(zipFilePath)) {
    logMessage(`ZIP file no longer exists: ${zipFilePath}`);
    return false;
  }
  
  try {
    // Process the ZIP file
    const success = await zipProcessor.processZipFile(zipFilePath);
    
    // If processing failed, don't delete the file
    if (!success) {
      logMessage(`Failed to process ZIP file: ${zipFilePath}`);
      return false;
    }
    
    // If the file still exists (wasn't deleted by the processor), delete it
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
      logMessage(`Deleted ZIP file after processing: ${zipFilePath}`);
    }
    
    return true;
  } catch (error) {
    logMessage(`Error processing ZIP file ${zipFilePath}: ${error.message}`);
    return false;
  }
}

/**
 * Process all existing ZIP files in the watch directory
 * @returns {Promise<void>}
 */
async function processExistingZipFiles() {
  // Create a processing lock
  if (processingLockExists()) {
    logMessage('Another process is already processing ZIP files, skipping.');
    return;
  }
  
  if (!createProcessingLock()) {
    logMessage('Failed to create processing lock, skipping.');
    return;
  }
  
  try {
    // Get all .zip files in the watch directory
    const files = fs.readdirSync(WATCH_DIR)
      .filter(file => isZipFile(file))
      .map(file => path.join(WATCH_DIR, file));
    
    if (files.length === 0) {
      logMessage('No ZIP files found in the watch directory.');
      releaseProcessingLock();
      return;
    }
    
    logMessage(`Found ${files.length} ZIP files to process.`);
    
    // Process each file sequentially
    for (const file of files) {
      await processSingleZipFile(file);
    }
  } catch (error) {
    logMessage(`Error processing existing ZIP files: ${error.message}`);
  } finally {
    // Release the processing lock
    releaseProcessingLock();
  }
}

/**
 * Register the watcher with the Integration Hub
 */
async function registerWithIntegrationHub() {
  try {
    const axios = require('axios');
    
    const response = await axios.post('http://localhost:5003/api/modules/register', {
      name: 'ZIPWatcher',
      type: 'utility',
      url: 'http://localhost:5000',
      capabilities: {
        features: ['file_processing', 'module_integration'],
        dataTypes: ['document', 'module']
      }
    });
    
    logMessage('Successfully registered ZIP Watcher with Integration Hub');
  } catch (error) {
    logMessage(`Failed to register with Integration Hub: ${error.message}`);
  }
}

/**
 * Start the file watcher
 */
function startWatcher() {
  logMessage('Starting ZIP file watcher service');
  
  // Check if chokidar is installed
  try {
    require.resolve('chokidar');
    logMessage('Chokidar already installed');
  } catch (err) {
    logMessage('Installing chokidar...');
    exec('npm install chokidar', (error, stdout, stderr) => {
      if (error) {
        logMessage(`Error installing chokidar: ${error.message}`);
        return;
      }
      logMessage('Chokidar installed successfully');
      startWatcher();
    });
    return;
  }
  
  // Create the watch directory if it doesn't exist
  if (!fs.existsSync(WATCH_DIR)) {
    fs.mkdirSync(WATCH_DIR, { recursive: true });
    logMessage(`Created watch directory: ${WATCH_DIR}`);
  }
  
  // Start the watcher
  logMessage(`Starting watcher on directory: ${WATCH_DIR}`);
  
  // Initialize watcher
  const watcher = chokidar.watch(`${WATCH_DIR}/*.zip`, {
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  // Event handlers
  watcher
    .on('add', async filePath => {
      // New ZIP file detected
      if (isZipFile(filePath)) {
        logMessage(`New ZIP file detected: ${path.basename(filePath)}`);
        
        // Wait a bit to ensure the file is fully written
        setTimeout(async () => {
          // Process the file if no other processing is happening
          if (!processingLockExists()) {
            if (createProcessingLock()) {
              try {
                await processSingleZipFile(filePath);
              } finally {
                releaseProcessingLock();
              }
            }
          } else {
            logMessage(`File ${path.basename(filePath)} will be processed later.`);
          }
        }, 5000);
      }
    })
    .on('error', error => {
      logMessage(`Watcher error: ${error.message}`);
    });
  
  // Process any existing ZIP files
  processExistingZipFiles();
  
  // Register with Integration Hub
  registerWithIntegrationHub();
  
  logMessage('ZIP watcher service started successfully');
}

// Start the watcher
startWatcher();

// Handle process termination
process.on('SIGINT', () => {
  logMessage('ZIP watcher service shutting down');
  releaseProcessingLock();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logMessage(`Uncaught exception: ${error.message}`);
  releaseProcessingLock();
});

module.exports = {
  processSingleZipFile,
  processExistingZipFiles,
  startWatcher
};