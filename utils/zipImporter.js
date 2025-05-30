/**
 * ZIP Importer Utility
 * 
 * This utility provides functions for importing and processing ZIP files.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

/**
 * Import a ZIP file and extract its contents
 * 
 * @param {string} zipPath - Path to the ZIP file
 * @param {string} extractDir - Directory to extract the ZIP to
 * @returns {Promise<boolean>} - Whether the extraction was successful
 */
async function importZip(zipPath, extractDir) {
  try {
    console.log(`Extracting ${zipPath} to ${extractDir}...`);
    
    // Make sure the extract directory exists
    if (fs.existsSync(extractDir)) {
      // Remove existing directory
      fs.rmSync(extractDir, { recursive: true });
    }
    
    fs.mkdirSync(extractDir, { recursive: true });
    
    // Extract the ZIP file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractDir, true);
    
    console.log(`Successfully extracted ${zipPath} to ${extractDir}`);
    return true;
  } catch (error) {
    console.error(`Error extracting ZIP: ${error.message}`);
    throw error;
  }
}

/**
 * Detect the type of module in the extracted directory
 * 
 * @param {string} extractDir - Path to the extracted directory
 * @returns {string} - Type of module ('admin', 'service', 'system', 'unknown')
 */
function detectModuleType(extractDir) {
  try {
    // Check for a package.json or config.json file for hints
    let packageInfo = {};
    let configInfo = {};
    
    const packagePath = path.join(extractDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    }
    
    const configPath = path.join(extractDir, 'config.json');
    if (fs.existsSync(configPath)) {
      configInfo = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // If the config explicitly states the type, use that
      if (configInfo.type) {
        return configInfo.type;
      }
    }
    
    // Check directory structure patterns
    if (fs.existsSync(path.join(extractDir, 'admin'))) {
      return 'admin';
    } else if (fs.existsSync(path.join(extractDir, 'services'))) {
      return 'service';
    } else if (fs.existsSync(path.join(extractDir, 'system'))) {
      return 'system';
    } else if (fs.existsSync(path.join(extractDir, 'pages'))) {
      // Next.js framework indicates UI component
      return 'admin';
    }
    
    // Look at key files to determine type
    const files = fs.readdirSync(extractDir).filter(file => 
      !file.startsWith('.') && file !== 'node_modules'
    );
    
    // Look for service-like patterns
    if (files.includes('server.js') || files.includes('index.js') || files.includes('api')) {
      return 'service';
    }
    
    // Look for admin UI patterns
    if (files.includes('components') || files.includes('pages') || files.includes('public')) {
      return 'admin';
    }
    
    // Look for system patterns
    if (files.includes('blockchain') || files.includes('database') || files.includes('core')) {
      return 'system';
    }
    
    // Default to service if we can't determine the type
    return 'service';
  } catch (error) {
    console.error(`Error detecting module type: ${error.message}`);
    return 'unknown';
  }
}

// Export the functions
module.exports = {
  importZip,
  detectModuleType
};