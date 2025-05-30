/**
 * EHB Agent Installer
 * 
 * This script automatically processes ZIP files, detects their content type,
 * and installs them to the appropriate location in the EHB structure.
 * 
 * Note: This is a legacy wrapper that now delegates to the Auto-ZIP-Handler-Agent service.
 * New installations should interact directly with the Auto-ZIP-Handler-Agent service.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { importZip, detectModuleType } = require('./utils/zipImporter');
const { installModule, registerWithPortal, showSetupPage } = require('./utils/moduleInstaller');

// Auto-ZIP-Handler-Agent service configuration
const autoZipHandlerConfig = {
  enabled: true,
  serviceUrl: 'http://localhost:5040',
  apiPath: '/api/auto-zip-handler',
  useDirectService: true  // If true, use the service directly; if false, use local processing
};

/**
 * Auto-process all ZIP files in the uploads directory
 */
async function autoProcessAllUploads() {
  try {
    console.log('Looking for ZIP files in ./uploads directory...');
    
    // Check if the uploads directory exists
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
      console.log('Created ./uploads directory');
      return;
    }
    
    // Get all ZIP files in the uploads directory
    const incomingZips = fs.readdirSync('./uploads')
      .filter(file => file.endsWith('.zip'))
      .map(file => path.join('./uploads', file));
    
    console.log(`Found ${incomingZips.length} ZIP files in ./uploads directory`);
    
    if (incomingZips.length === 0) {
      console.log('No ZIP files found');
      return;
    }
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp', { recursive: true });
      console.log('Created ./temp directory');
    }
    
    // Process each ZIP file
    for (const zipPath of incomingZips) {
      const zipFile = path.basename(zipPath);
      const folderName = zipFile.replace('.zip', '');
      const extractDir = path.join('./temp', folderName);
      
      console.log(`Processing ${zipFile}...`);
      
      // Extract the ZIP file
      await importZip(zipPath, extractDir);
      
      // Detect the module type
      const moduleType = detectModuleType(extractDir);
      console.log(`Detected module type: ${moduleType}`);
      
      // Install the module based on its type
      let installedPath;
      
      if (fs.existsSync(`${extractDir}/services`)) {
        // Handle the case where there's a specific service folder structure
        const serviceDir = fs.readdirSync(`${extractDir}/services`)[0];
        if (serviceDir) {
          const servicePath = path.join(`${extractDir}/services`, serviceDir);
          installedPath = path.join('./services', serviceDir);
          
          // Create the target directory if it doesn't exist
          if (!fs.existsSync(installedPath)) {
            fs.mkdirSync(installedPath, { recursive: true });
          }
          
          // Copy the service files
          fs.cpSync(servicePath, installedPath, { recursive: true });
          console.log(`Installing service: ${serviceDir} to ${installedPath}`);
        } else {
          // Default behavior if there are no service subdirectories
          installedPath = path.join('./services', folderName);
          fs.cpSync(`${extractDir}/services`, installedPath, { recursive: true });
        }
      } else if (fs.existsSync(`${extractDir}/pages`)) {
        // This is likely a UI component
        installedPath = path.join('./admin', 'EHB-Developer-Portal');
        fs.cpSync(extractDir, installedPath, { recursive: true });
      } else if (fs.existsSync(`${extractDir}/utils`)) {
        // This is a utility module
        installedPath = './utils';
        fs.cpSync(path.join(extractDir, 'utils'), installedPath, { recursive: true });
      } else if (moduleType === 'admin') {
        installedPath = path.join('./admin', folderName);
        fs.cpSync(extractDir, installedPath, { recursive: true });
      } else if (moduleType === 'service') {
        installedPath = path.join('./services', folderName);
        fs.cpSync(extractDir, installedPath, { recursive: true });
      } else if (moduleType === 'system') {
        installedPath = path.join('./system', folderName);
        fs.cpSync(extractDir, installedPath, { recursive: true });
      } else {
        console.log(`Could not determine module type for ${folderName}. Skipping installation.`);
        continue;
      }
      
      // Register the module with the Developer Portal
      if (installedPath) {
        registerWithPortal(installedPath, moduleType);
      }
      
      // Delete the processed ZIP file to save space
      fs.unlinkSync(zipPath);
      
      console.log(`✅ ${folderName} installed successfully and ZIP file deleted`);
    }
    
    // Show the setup page in the Developer Portal
    showSetupPage();
    
    console.log('All ZIP files processed successfully');
  } catch (error) {
    console.error('Error processing ZIP files:', error);
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  autoProcessAllUploads();
}

module.exports = autoProcessAllUploads;