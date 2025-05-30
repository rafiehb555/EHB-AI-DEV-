/**
 * EHB-HOME ZIP Processor
 * 
 * This script contains special rules for processing EHB-HOME ZIP files:
 * 1. Automatically extract EHB-HOME-Phase-x.zip files
 * 2. Move all contents to the EHB-HOME/ folder
 * 3. Delete the ZIP file after extraction
 * 4. Run npm install and set up auto-start scripts
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');

// Logging utilities
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [EHB-HOME-PROCESSOR] ${message}`;
  console.log(logMessage);
  
  // Also log to file
  const logPath = path.join(__dirname, '../ehb_home_processor.log');
  fs.appendFileSync(logPath, logMessage + '\n');
}

/**
 * Process an EHB-HOME ZIP file
 * @param {string} zipFilePath - Path to the ZIP file
 * @returns {Promise<boolean>} - Success status
 */
async function processEhbHomeZip(zipFilePath) {
  try {
    const fileName = path.basename(zipFilePath);
    log(`Processing EHB-HOME ZIP file: ${fileName}`);
    
    // Check if it's an EHB-HOME ZIP file
    if (!fileName.startsWith('EHB-HOME') && !fileName.startsWith('ehb-home')) {
      log(`Not an EHB-HOME ZIP file, skipping special processing`);
      return false;
    }
    
    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath);
    log(`Extracting ZIP file...`);
    
    // Create EHB-HOME directory if it doesn't exist
    const targetDir = path.join(process.cwd(), 'EHB-HOME');
    if (!fs.existsSync(targetDir)) {
      log(`Creating EHB-HOME directory`);
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Extract all entries
    const entries = zip.getEntries();
    
    // First, handle any root level files/folders
    for (const entry of entries) {
      const entryName = entry.entryName;
      const targetPath = path.join(targetDir, entryName);
      
      // Skip directories, they'll be created automatically
      if (entry.isDirectory) continue;
      
      // Create parent directories if needed
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      
      // Extract file
      fs.writeFileSync(targetPath, entry.getData());
      log(`Extracted: ${entryName}`);
    }
    
    log(`Extraction complete. All files moved to EHB-HOME/ directory`);
    
    // Move the ZIP file to processed directory
    const processedDir = path.join(process.cwd(), 'attached_assets/processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    
    const processedFilePath = path.join(processedDir, fileName);
    fs.renameSync(zipFilePath, processedFilePath);
    log(`Moved ZIP file to processed directory: ${processedFilePath}`);
    
    // Run npm install and setup
    await runSetupCommands(targetDir);
    
    return true;
  } catch (error) {
    log(`Error processing EHB-HOME ZIP file: ${error.message}`);
    return false;
  }
}

/**
 * Run setup commands in the EHB-HOME directory
 * @param {string} targetDir - EHB-HOME directory path
 * @returns {Promise<void>}
 */
async function runSetupCommands(targetDir) {
  return new Promise((resolve, reject) => {
    log(`Running npm install in EHB-HOME directory`);
    
    // Change to target directory and run npm install
    exec('cd ' + targetDir + ' && npm install', (error, stdout, stderr) => {
      if (error) {
        log(`Error running npm install: ${error.message}`);
        log(stderr);
        reject(error);
        return;
      }
      
      log(`npm install completed successfully`);
      log(stdout);
      
      // Ensure there's a workflow for EHB-HOME
      setupWorkflow();
      
      resolve();
    });
  });
}

/**
 * Setup Replit workflow for EHB-HOME
 */
function setupWorkflow() {
  try {
    const replitConfigPath = path.join(process.cwd(), '.replit');
    
    if (!fs.existsSync(replitConfigPath)) {
      log(`No .replit file found, skipping workflow setup`);
      return;
    }
    
    let replitContent = fs.readFileSync(replitConfigPath, 'utf8');
    
    // Check if EHB Home workflow already exists
    if (replitContent.includes('name = "EHB Home"')) {
      log(`EHB Home workflow already exists`);
      return;
    }
    
    // Add EHB Home workflow
    const workflowConfig = `
[[workflows.workflow]]
name = "EHB Home"
author = "ehb-home-processor"
mode = "sequential"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "cd EHB-HOME && npm run dev"
waitForPort = 3000
`;
    
    // Append workflow configuration
    fs.appendFileSync(replitConfigPath, workflowConfig);
    log(`Added EHB Home workflow to .replit configuration`);
    
  } catch (error) {
    log(`Error setting up workflow: ${error.message}`);
  }
}

/**
 * Check if a file is a new EHB-HOME ZIP file
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Whether the file is a new EHB-HOME ZIP file
 */
function isEhbHomeZip(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  return fileName.endsWith('.zip') && 
         (fileName.startsWith('ehb-home') || fileName.startsWith('ehb-home-phase'));
}

module.exports = {
  processEhbHomeZip,
  isEhbHomeZip
};