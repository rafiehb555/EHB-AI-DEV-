/**
 * EHB Free Agent Installer
 * 
 * This script automatically processes ZIP files containing EHB Free Agent components,
 * extracts them to the correct structure, and runs initialization scripts.
 * 
 * Usage: node ehb-free-agent-installer.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');

// Configuration
const UPLOADS_DIR = path.join(__dirname, 'attached_assets');
const TEMP_EXTRACT_DIR = path.join(__dirname, 'temp_extract');
const LOG_FILE = path.join(__dirname, 'logs', 'free-agent.log');

// Destination paths
const DESTINATIONS = {
  'ai-agent': path.join(__dirname, 'services', 'SOT-Technologies', 'EHB-AI-Dev', 'ai-agent'),
  'config': path.join(__dirname, 'config'),
  'api': path.join(__dirname, 'api'),
  'admin': path.join(__dirname, 'admin'),
  'logs': path.join(__dirname, 'logs'),
  'generated': path.join(__dirname, 'generated')
};

// Files that need to be executed after installation
const POST_INSTALL_SCRIPTS = [
  path.join(__dirname, 'services', 'SOT-Technologies', 'EHB-AI-Dev', 'ai-agent', 'sdkInstaller.js'),
  path.join(__dirname, 'services', 'SOT-Technologies', 'EHB-AI-Dev', 'ai-agent', 'ehb-free-agent.js')
];

// Utility functions
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Ensure logs directory exists
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        log(`Command stderr: ${stderr}`);
      }
      
      resolve(stdout);
    });
  });
}

// Main functions
async function processZipFile(zipFilePath) {
  const zipFileName = path.basename(zipFilePath);
  log(`Processing ZIP file: ${zipFileName}`);
  
  // Ensure temp extraction directory exists
  ensureDirectoryExists(TEMP_EXTRACT_DIR);
  
  try {
    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath);
    const extractDir = path.join(TEMP_EXTRACT_DIR, path.basename(zipFilePath, '.zip'));
    log(`Extracting to: ${extractDir}`);
    zip.extractAllTo(extractDir, true);
    
    // Process the extracted files
    await moveFilesToDestination(extractDir);
    
    // Clean up the extracted directory
    log(`Cleaning up extraction directory: ${extractDir}`);
    fs.rmSync(extractDir, { recursive: true, force: true });
    
    // Optional: Remove the original ZIP file
    // log(`Removing original ZIP file: ${zipFilePath}`);
    // fs.unlinkSync(zipFilePath);
    
    log(`Successfully processed: ${zipFileName}`);
    return true;
  } catch (error) {
    log(`Error processing ZIP file ${zipFileName}: ${error.message}`);
    return false;
  }
}

async function moveFilesToDestination(extractDir) {
  log(`Moving files from ${extractDir} to their destinations`);
  
  // Ensure all destination directories exist
  Object.values(DESTINATIONS).forEach(dir => ensureDirectoryExists(dir));
  
  // Function to recursively find files with specific names
  const findFiles = (dir, targetFileName) => {
    const results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        results.push(...findFiles(fullPath, targetFileName));
      } else if (file.name === targetFileName) {
        results.push(fullPath);
      }
    }
    
    return results;
  };
  
  // Map of known files and their destinations
  const fileMapping = {
    'ehb-free-agent.js': path.join(DESTINATIONS['ai-agent'], 'ehb-free-agent.js'),
    'sdkInstaller.js': path.join(DESTINATIONS['ai-agent'], 'sdkInstaller.js'),
    'whisperCommand.js': path.join(DESTINATIONS['ai-agent'], 'whisperCommand.js'),
    'voice-test.sh': path.join(DESTINATIONS['ai-agent'], 'voice-test.sh'),
    'free-api.json': path.join(DESTINATIONS['config'], 'free-api.json'),
    'upload-zip.js': path.join(DESTINATIONS['api'], 'upload-zip.js'),
    'save-email-settings.js': path.join(DESTINATIONS['api'], 'save-email-settings.js'),
    'save-webhook.js': path.join(DESTINATIONS['api'], 'save-webhook.js'),
    'ZIPUploader.jsx': path.join(DESTINATIONS['admin'], 'AgentControlPanel', 'components', 'ZIPUploader.jsx'),
    'WebhookConfigPanel.jsx': path.join(DESTINATIONS['admin'], 'AgentControlPanel', 'components', 'WebhookConfigPanel.jsx'),
    'AuthLogin.jsx': path.join(DESTINATIONS['admin'], 'AgentControlPanel', 'components', 'AuthLogin.jsx'),
    'git-sync.sh': path.join(__dirname, 'git-sync.sh')
  };
  
  // Process each known file
  for (const [fileName, destPath] of Object.entries(fileMapping)) {
    const foundFiles = findFiles(extractDir, fileName);
    
    if (foundFiles.length > 0) {
      // Use the first found file if multiple matches
      const sourcePath = foundFiles[0];
      
      // Ensure destination directory exists
      ensureDirectoryExists(path.dirname(destPath));
      
      // Copy the file
      fs.copyFileSync(sourcePath, destPath);
      log(`Copied ${fileName} to ${destPath}`);
    }
  }
  
  // Make script files executable
  const scriptFiles = [
    path.join(DESTINATIONS['ai-agent'], 'voice-test.sh'),
    path.join(__dirname, 'git-sync.sh')
  ];
  
  for (const scriptFile of scriptFiles) {
    if (fs.existsSync(scriptFile)) {
      await executeCommand(`chmod +x "${scriptFile}"`);
      log(`Made executable: ${scriptFile}`);
    }
  }
}

async function runPostInstallScripts() {
  log('Running post-installation scripts');
  
  for (const scriptPath of POST_INSTALL_SCRIPTS) {
    if (fs.existsSync(scriptPath)) {
      log(`Executing: ${scriptPath}`);
      try {
        const output = await executeCommand(`node "${scriptPath}"`);
        log(`Script output:\n${output}`);
      } catch (error) {
        log(`Error running script ${scriptPath}: ${error.message}`);
      }
    } else {
      log(`Script not found: ${scriptPath}`);
    }
  }
}

async function findAndProcessZipFiles() {
  // Ensure uploads directory exists
  ensureDirectoryExists(UPLOADS_DIR);
  
  // Get all ZIP files
  const files = fs.readdirSync(UPLOADS_DIR);
  const zipFiles = files.filter(file => file.toLowerCase().endsWith('.zip') && 
                                       file.toLowerCase().includes('free-agent'));
  
  if (zipFiles.length === 0) {
    log('No Free Agent ZIP files found in uploads directory');
    return;
  }
  
  log(`Found ${zipFiles.length} Free Agent ZIP files to process`);
  
  // Process each ZIP file
  for (const zipFile of zipFiles) {
    const zipFilePath = path.join(UPLOADS_DIR, zipFile);
    await processZipFile(zipFilePath);
  }
  
  // Run post-installation scripts
  await runPostInstallScripts();
  
  log('Free Agent installation completed');
}

// Main execution
(async function main() {
  log('Starting EHB Free Agent installation process');
  
  try {
    await findAndProcessZipFiles();
  } catch (error) {
    log(`Error during installation: ${error.message}`);
  }
})();