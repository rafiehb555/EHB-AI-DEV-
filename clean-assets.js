/**
 * Clean Assets Script
 * 
 * This script deletes all ZIP files from the attached_assets folder
 * and sets up automated cleanup for any future ZIP uploads.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Log utility
function log(message, color = 'white') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`${colors[color]}${logMessage}${colors.reset}`);
}

// Clean all ZIP files from a directory
function cleanZipFiles(dirPath) {
  try {
    log(`Cleaning ZIP files from ${dirPath}...`, 'cyan');
    
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      log(`Directory ${dirPath} does not exist.`, 'yellow');
      return { removed: 0, failed: 0 };
    }
    
    // Get all files
    const files = fs.readdirSync(dirPath);
    let removedCount = 0;
    let failedCount = 0;
    
    // Find and delete ZIP files
    for (const file of files) {
      if (file.toLowerCase().endsWith('.zip')) {
        const filePath = path.join(dirPath, file);
        
        try {
          fs.unlinkSync(filePath);
          log(`Deleted ZIP file: ${filePath}`, 'green');
          removedCount++;
        } catch (err) {
          log(`Failed to delete ${filePath}: ${err.message}`, 'red');
          failedCount++;
        }
      }
    }
    
    log(`Finished cleaning ZIP files from ${dirPath}`, 'green');
    return { removed: removedCount, failed: failedCount };
  } catch (err) {
    log(`Error cleaning ZIP files: ${err.message}`, 'red');
    return { removed: 0, failed: 0, error: err.message };
  }
}

// Main function to clean multiple directories
function cleanAllAssets() {
  log('Starting asset cleanup process...', 'magenta');
  
  // Define directories to clean
  const directories = [
    './attached_assets',
    './uploads',
    './ehb_zips'
  ];
  
  let totalRemoved = 0;
  let totalFailed = 0;
  
  // Process each directory
  for (const dir of directories) {
    const { removed, failed } = cleanZipFiles(dir);
    totalRemoved += removed;
    totalFailed += failed;
  }
  
  // Set up watch for attached_assets to auto-delete new ZIP files
  setupZipWatcher('./attached_assets');
  
  log(`🧹 Total cleanup summary: ${totalRemoved} ZIP files removed, ${totalFailed} failed`, 
    totalFailed > 0 ? 'yellow' : 'green');
}

// Watch a directory and delete any new ZIP files immediately
function setupZipWatcher(dirPath) {
  if (!fs.existsSync(dirPath)) {
    log(`Directory ${dirPath} does not exist, cannot set up watcher.`, 'yellow');
    return;
  }
  
  log(`Setting up ZIP file watcher for ${dirPath}...`, 'cyan');
  
  // Use fs.watch to monitor the directory
  fs.watch(dirPath, (eventType, filename) => {
    if (filename && filename.toLowerCase().endsWith('.zip')) {
      log(`Detected new ZIP file: ${filename}`, 'yellow');
      
      // Wait 5 seconds to ensure the file is fully uploaded
      setTimeout(() => {
        const filePath = path.join(dirPath, filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            log(`Auto-deleted new ZIP file: ${filePath}`, 'green');
          } catch (err) {
            log(`Failed to auto-delete ${filePath}: ${err.message}`, 'red');
          }
        }
      }, 5000);
    }
  });
  
  log(`✅ ZIP file watcher active for ${dirPath}`, 'green');
}

// Run if called directly
if (require.main === module) {
  cleanAllAssets();
}

module.exports = {
  cleanZipFiles,
  cleanAllAssets,
  setupZipWatcher
};