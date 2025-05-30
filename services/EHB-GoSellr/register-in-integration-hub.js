/**
 * GoSellr Integration Registration
 * 
 * This script registers the GoSellr module with the EHB Integration Hub
 * to enable seamless integration with other EHB components.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Module configuration
const MODULE_CONFIG = {
  name: 'EHB-GoSellr',
  type: 'franchise',
  version: '1.0.0',
  description: 'Smart e-commerce platform under EHB Ecosystem',
  entryPoints: {
    frontend: '/frontend/pages/index.js',
    admin: '/admin/pages/index.js',
    franchise: '/franchise/sub-dashboard/index.js'
  },
  capabilities: [
    'e-commerce',
    'vendor-management',
    'product-catalog',
    'order-processing',
    'franchise-management',
    'customer-profile',
    'ai-recommendations'
  ],
  dependencies: [
    'EHB-HOME',
    'EHB-DASHBOARD',
    'EHB-AI-Dev'
  ],
  aiEnhancements: [
    'user-suggestion-engine',
    'auto-mail-sender',
    'job-alerts-ai',
    'sql-suggestion-engine',
    'voice-faq',
    'ai-search-bar',
    'ai-robot-assistant'
  ],
  integration: {
    ehbHome: {
      cardTitle: 'GoSellr E-Commerce',
      cardDescription: 'Smart online shopping with franchise opportunities',
      cardIcon: 'shopping-cart',
      cardPath: '/gosellr'
    }
  }
};

/**
 * Create a module configuration file
 */
function createModuleConfig() {
  const configPath = path.join(__dirname, 'module-config.json');
  fs.writeFileSync(configPath, JSON.stringify(MODULE_CONFIG, null, 2));
  console.log(`Module configuration created at: ${configPath}`);
}

/**
 * Register the module with the EHB Integration Hub
 */
async function registerWithIntegrationHub() {
  try {
    // Get the Integration Hub API URL from environment or use default
    const integrationHubUrl = process.env.EHB_INTEGRATION_HUB_URL || 'http://localhost:5000/api/modules/register';
    
    console.log(`Registering GoSellr module with Integration Hub at: ${integrationHubUrl}`);
    
    // Make a POST request to the Integration Hub to register the module
    const response = await axios.post(integrationHubUrl, MODULE_CONFIG);
    
    console.log('Module registration successful!');
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('Error registering module with Integration Hub:', error.message);
    console.log('Will create a local configuration file instead.');
    
    // Create a local configuration file as fallback
    createModuleConfig();
    
    return false;
  }
}

/**
 * Run the registration process
 */
async function run() {
  console.log('Starting GoSellr module registration...');
  
  // Always create the local config file
  createModuleConfig();
  
  // Try to register with the Integration Hub
  const registrationResult = await registerWithIntegrationHub();
  
  if (registrationResult) {
    console.log('GoSellr successfully integrated with EHB system.');
  } else {
    console.log('Created local configuration. To complete integration, run the EHB Integration Hub service.');
  }
}

// Run the registration process
run();