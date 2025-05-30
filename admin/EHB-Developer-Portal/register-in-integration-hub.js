/**
 * Register in Integration Hub
 * 
 * This script is used to register a new module in the EHB Integration Hub.
 * It should be called from any new module that needs to be integrated into the EHB system.
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');

/**
 * Register a module with the Integration Hub
 * @param {Object} moduleInfo Information about the module
 * @param {string} moduleInfo.name Module name
 * @param {string} moduleInfo.description Module description
 * @param {string} moduleInfo.type Module type (service, department, admin, affiliate, system)
 * @param {number} moduleInfo.port Port where the module is running
 * @param {string} moduleInfo.url URL where the module is accessible
 * @returns {Promise<Object>} Registration result
 */
async function registerModule(moduleInfo) {
  try {
    // Default EHB-HOME API URL
    const integrationHubUrl = process.env.INTEGRATION_HUB_URL || 'http://localhost:5005/api/modules/register';
    
    console.log(`Registering module "${moduleInfo.name}" with Integration Hub at ${integrationHubUrl}...`);
    
    const response = await axios.post(integrationHubUrl, moduleInfo);
    
    console.log('Registration successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Create a module.json file in the current directory
 * @param {Object} moduleInfo Information about the module
 * @returns {Promise<Object>} Creation result
 */
async function createModuleJson(moduleInfo) {
  try {
    const moduleJsonPath = path.join(process.cwd(), 'module.json');
    
    // Generate module ID if not provided
    if (!moduleInfo.id) {
      moduleInfo.id = moduleInfo.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Add homepage and adminview flags if not provided
    moduleInfo.homepage = moduleInfo.homepage !== false;
    moduleInfo.adminview = moduleInfo.adminview !== false;
    
    // Write the module.json file
    fs.writeFileSync(moduleJsonPath, JSON.stringify(moduleInfo, null, 2), 'utf8');
    
    console.log(`Created module.json at ${moduleJsonPath}`);
    return { success: true, path: moduleJsonPath };
  } catch (error) {
    console.error('Failed to create module.json:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Register module from command line arguments
 */
async function registerFromCommandLine() {
  const args = process.argv.slice(2);
  
  // Check if module info is provided as JSON string
  if (args.length === 1 && args[0].startsWith('{')) {
    try {
      const moduleInfo = JSON.parse(args[0]);
      await createModuleJson(moduleInfo);
      await registerModule(moduleInfo);
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
      process.exit(1);
    }
    return;
  }
  
  // Check if we have enough arguments
  if (args.length < 3) {
    console.error('Usage: node register-in-integration-hub.js <name> <description> <type> [port] [url]');
    console.error('Example: node register-in-integration-hub.js "My Module" "This is my module" service 5001 http://localhost:5001');
    console.error('Or: node register-in-integration-hub.js \'{"name":"My Module","description":"This is my module","type":"service","port":5001,"url":"http://localhost:5001"}\'');
    process.exit(1);
  }
  
  // Parse arguments
  const [name, description, type, portStr, url] = args;
  const port = portStr ? parseInt(portStr, 10) : 0;
  
  // Register module
  const moduleInfo = {
    name,
    description,
    type,
    port,
    url
  };
  
  await createModuleJson(moduleInfo);
  await registerModule(moduleInfo);
}

// If this script is run directly, register from command line
if (require.main === module) {
  registerFromCommandLine().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = {
  registerModule,
  createModuleJson
};