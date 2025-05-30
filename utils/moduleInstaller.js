/**
 * Module Installer Utility
 * 
 * This utility provides functions for installing and registering modules.
 */

const fs = require('fs');
const path = require('path');

/**
 * Install a module to the target directory
 * 
 * @param {string} sourcePath - Path to the source directory
 * @param {string} targetPath - Path to the target directory
 * @returns {string} - Path where the module was installed
 */
function installModule(sourcePath, targetPath) {
  try {
    console.log(`Installing module from ${sourcePath} to ${targetPath}...`);

    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Copy the module files to the target directory
    fs.cpSync(sourcePath, targetPath, { recursive: true });

    console.log(`Successfully installed module to ${targetPath}`);
    return targetPath;
  } catch (error) {
    console.error(`Error installing module: ${error.message}`);
    throw error;
  }
}

/**
 * Register a module with the Developer Portal
 * 
 * @param {string} modulePath - Path to the installed module
 * @param {string} moduleType - Type of the module (admin, service, system)
 * @returns {boolean} - Whether the registration was successful
 */
function registerWithPortal(modulePath, moduleType) {
  try {
    console.log(`Registering module ${modulePath} (${moduleType}) with Developer Portal...`);
    
    // Path to the module registry file
    const registryPath = path.join('./admin/EHB-Developer-Portal', 'modules.json');
    
    // Create the registry file if it doesn't exist
    if (!fs.existsSync(registryPath)) {
      fs.writeFileSync(registryPath, JSON.stringify({ modules: [] }, null, 2));
    }
    
    // Read the registry
    const registryData = fs.readFileSync(registryPath, 'utf8');
    const registry = JSON.parse(registryData);
    
    // Ensure the modules array exists
    if (!registry.modules) {
      registry.modules = [];
    }
    
    // Check for config.json to get module info
    const configPath = path.join(modulePath, 'config.json');
    let moduleInfo = {
      name: path.basename(modulePath),
      type: moduleType,
      path: modulePath,
      installedAt: new Date().toISOString()
    };
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      moduleInfo = {
        ...moduleInfo,
        name: config.name || moduleInfo.name,
        version: config.version,
        description: config.description,
        author: config.author,
        icon: config.icon
      };
    }
    
    // Add the module to the registry
    registry.modules.push(moduleInfo);
    
    // Write the registry back to disk
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    
    console.log(`Module ${moduleInfo.name} (${moduleType}) registered with Developer Portal`);
    
    return true;
  } catch (error) {
    console.error(`Error registering module with Developer Portal: ${error.message}`);
    return false;
  }
}

/**
 * Show the setup page in the Developer Portal
 * 
 * @returns {boolean} - Whether the setup page was triggered successfully
 */
function showSetupPage() {
  try {
    console.log('Setup page should now be displayed in the Developer Portal');
    
    // Create the setup-needed.json file in the Developer Portal
    const setupNeededPath = path.join('./admin/EHB-Developer-Portal', 'setup-needed.json');
    fs.writeFileSync(setupNeededPath, JSON.stringify({ setupNeeded: true, timestamp: new Date().toISOString() }));
    
    return true;
  } catch (error) {
    console.error(`Error showing setup page: ${error.message}`);
    return false;
  }
}

// Export the functions
module.exports = {
  installModule,
  registerWithPortal,
  showSetupPage
};