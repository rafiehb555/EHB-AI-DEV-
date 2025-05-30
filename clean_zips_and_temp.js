/**
 * Clean ZIPs and Temp Files
 * 
 * This script cleans up all ZIP files and temporary directories after
 * the consolidation process has completed successfully.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Config
const rootDir = process.cwd();
const attachedAssetsDir = path.join(rootDir, 'attached_assets');
const tempDirs = [
  'temp',
  'temp_extract'
];

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync('cleanup.log', `[${timestamp}] ${message}\n`);
}

function moveZipToProcessed(zipPath) {
  try {
    const fileName = path.basename(zipPath);
    const processedDir = path.join(attachedAssetsDir, 'processed');
    
    // Create processed directory if it doesn't exist
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
      log(`Created processed directory: ${processedDir}`);
    }
    
    const destPath = path.join(processedDir, fileName);
    fs.renameSync(zipPath, destPath);
    log(`Moved ${fileName} to processed directory`);
    return true;
  } catch (error) {
    log(`Error moving zip file ${zipPath}: ${error.message}`);
    return false;
  }
}

function cleanDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        cleanDirectory(fullPath);
        
        // Remove empty directory
        if (fs.readdirSync(fullPath).length === 0) {
          fs.rmdirSync(fullPath);
          log(`Removed empty directory: ${fullPath}`);
        }
      } else {
        // Skip non-zip files in the attached_assets directory
        if (dirPath === attachedAssetsDir && !entry.name.toLowerCase().endsWith('.zip')) {
          continue;
        }
        
        // Skip some important files
        if (['cleanup.log', 'ehb_consolidation.log', 'ehb_zip_processing.log'].includes(entry.name)) {
          continue;
        }
        
        fs.unlinkSync(fullPath);
        log(`Removed file: ${fullPath}`);
      }
    }
  } catch (error) {
    log(`Error cleaning directory ${dirPath}: ${error.message}`);
  }
}

function processZipFiles() {
  try {
    if (!fs.existsSync(attachedAssetsDir)) {
      log(`Attached assets directory does not exist: ${attachedAssetsDir}`);
      return;
    }
    
    const entries = fs.readdirSync(attachedAssetsDir, { withFileTypes: true });
    let zipCount = 0;
    
    for (const entry of entries) {
      if (!entry.isDirectory() && entry.name.toLowerCase().endsWith('.zip')) {
        const zipPath = path.join(attachedAssetsDir, entry.name);
        if (moveZipToProcessed(zipPath)) {
          zipCount++;
        }
      }
    }
    
    log(`Processed ${zipCount} ZIP files`);
  } catch (error) {
    log(`Error processing ZIP files: ${error.message}`);
  }
}

function cleanTempDirectories() {
  for (const tempDir of tempDirs) {
    const dirPath = path.join(rootDir, tempDir);
    if (fs.existsSync(dirPath)) {
      log(`Cleaning temporary directory: ${dirPath}`);
      cleanDirectory(dirPath);
      
      // Remove the directory if it's empty
      if (fs.readdirSync(dirPath).length === 0) {
        fs.rmdirSync(dirPath);
        log(`Removed empty temporary directory: ${dirPath}`);
      }
    }
  }
}

function restartMainRedirector() {
  log('Restarting EHB-HOME-Main-Redirector...');
  
  // First kill any existing process
  exec('pkill -f "node redirect-to-ehb-home.js"', (error, stdout, stderr) => {
    // Ignore errors - it might not be running
    
    // Start the redirector in the background
    exec('node redirect-to-ehb-home.js &', (error, stdout, stderr) => {
      if (error) {
        log(`Error starting redirector: ${error.message}`);
        return;
      }
      
      log('EHB-HOME-Main-Redirector started successfully');
    });
  });
}

function main() {
  log('=======================================');
  log('Starting cleanup process');
  log('=======================================');
  
  // Process all ZIP files
  processZipFiles();
  
  // Clean temporary directories
  cleanTempDirectories();
  
  // Restart the main redirector
  restartMainRedirector();
  
  log('=======================================');
  log('Cleanup process completed');
  log('=======================================');
  
  log('\nSystem should now be ready for deployment.');
  log('Access the EHB-HOME module at the Replit URL.');
}

// Run the main function
main();