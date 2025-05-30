/**
 * EHB AI Dev - Phase Organizer
 * 
 * This script organizes all the AI development phases (1-31) by:
 * 1. Extracting all files from phases/EHB-AI-Dev-Phase-X directories
 * 2. Merging them into proper folders in services/SOT-Technologies/EHB-AI-Dev
 * 3. Removing duplicate files with conflict resolution
 * 4. Cleaning up temporary files and sources after successful integration
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const PHASES_DIR = './phases';
const TARGET_DIR = './services/SOT-Technologies/EHB-AI-Dev';
const PHASE_PREFIX = 'EHB-AI-Dev-Phase-';
const LOG_FILE = 'phase-integration.log';

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Logger
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
};

// Initialize log file
const initLog = () => {
  fs.writeFileSync(LOG_FILE, `--- EHB AI Dev Phase Integration Log ---\n`);
  log('Starting phase integration process...');
};

// Get all phase directories
const getPhaseDirectories = () => {
  try {
    const dirs = fs.readdirSync(PHASES_DIR)
      .filter(dir => dir.startsWith(PHASE_PREFIX))
      .sort((a, b) => {
        const numA = parseInt(a.replace(PHASE_PREFIX, ''));
        const numB = parseInt(b.replace(PHASE_PREFIX, ''));
        return numA - numB;
      });
    
    log(`Found ${dirs.length} phase directories`);
    return dirs;
  } catch (error) {
    log(`Error reading phase directories: ${error.message}`);
    return [];
  }
};

// Process each phase directory
const processPhaseDirectory = (phaseDir) => {
  const phasePath = path.join(PHASES_DIR, phaseDir);
  log(`Processing phase directory: ${phaseDir}`);
  
  try {
    const phaseContents = fs.readdirSync(phasePath);
    
    phaseContents.forEach(item => {
      const itemPath = path.join(phasePath, item);
      const stats = fs.statSync(itemPath);
      
      // Skip README files
      if (item.toLowerCase().includes('readme')) {
        log(`Skipping README file: ${item}`);
        return;
      }
      
      if (stats.isDirectory()) {
        // This is a directory, process it
        processComponentDirectory(itemPath, item);
      } else {
        // This is a file, copy it to the appropriate location
        copyPhaseFile(itemPath, item);
      }
    });
    
    log(`Completed processing phase directory: ${phaseDir}`);
    return true;
  } catch (error) {
    log(`Error processing phase directory ${phaseDir}: ${error.message}`);
    return false;
  }
};

// Process a component directory (frontend, backend, etc.)
const processComponentDirectory = (dirPath, dirName) => {
  const baseComponentName = dirName.split('-')[0]; // Extract base name (frontend, backend, etc.)
  const targetComponentDir = path.join(TARGET_DIR, baseComponentName);
  
  ensureDir(targetComponentDir);
  log(`Processing component directory: ${dirName} -> ${targetComponentDir}`);
  
  try {
    copyDirectoryContents(dirPath, targetComponentDir);
  } catch (error) {
    log(`Error processing component directory ${dirName}: ${error.message}`);
  }
};

// Copy a phase file to the appropriate target location
const copyPhaseFile = (filePath, fileName) => {
  const targetFilePath = path.join(TARGET_DIR, fileName);
  
  try {
    fs.copyFileSync(filePath, targetFilePath);
    log(`Copied file: ${fileName} -> ${targetFilePath}`);
  } catch (error) {
    log(`Error copying file ${fileName}: ${error.message}`);
  }
};

// Copy directory contents recursively
const copyDirectoryContents = (sourceDir, targetDir) => {
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      ensureDir(targetPath);
      copyDirectoryContents(sourcePath, targetPath);
    } else {
      // If file already exists, handle conflict
      if (fs.existsSync(targetPath)) {
        handleFileConflict(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        log(`Copied: ${sourcePath} -> ${targetPath}`);
      }
    }
  });
};

// Handle file conflict by comparing content and possibly merging
const handleFileConflict = (sourcePath, targetPath) => {
  const sourceContent = fs.readFileSync(sourcePath, 'utf8');
  const targetContent = fs.readFileSync(targetPath, 'utf8');
  
  if (sourceContent === targetContent) {
    log(`Skipped identical file: ${path.basename(sourcePath)}`);
    return;
  }
  
  // File is different, for safety keep both with phase suffix
  const fileName = path.basename(sourcePath);
  const dirName = path.dirname(targetPath);
  const newTargetPath = path.join(dirName, `${fileName}.new`);
  
  fs.copyFileSync(sourcePath, newTargetPath);
  log(`Conflict: Saved newer version as ${newTargetPath}`);
};

// Clean up temporary files after successful integration
const cleanupAfterIntegration = () => {
  log('Integration completed successfully. Starting cleanup...');
  // Don't delete source files until verified by the user
  log('Cleanup skipped. Please manually verify integration before deleting source files.');
};

// Main execution function
const main = async () => {
  initLog();
  
  // Get all phase directories
  const phaseDirectories = getPhaseDirectories();
  if (phaseDirectories.length === 0) {
    log('No phase directories found. Exiting.');
    return;
  }
  
  // Ensure target directory exists
  ensureDir(TARGET_DIR);
  
  // Process each phase directory
  let successCount = 0;
  for (const phaseDir of phaseDirectories) {
    const success = processPhaseDirectory(phaseDir);
    if (success) successCount++;
  }
  
  log(`Processed ${successCount} out of ${phaseDirectories.length} phase directories`);
  
  if (successCount === phaseDirectories.length) {
    cleanupAfterIntegration();
  } else {
    log('Some phases had errors during processing. Please check the log file.');
  }
  
  log('Phase integration process completed.');
};

// Execute the main function
main().catch(error => {
  log(`Fatal error: ${error.message}`);
});