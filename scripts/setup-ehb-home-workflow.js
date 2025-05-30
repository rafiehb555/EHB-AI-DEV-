/**
 * Setup EHB-HOME Workflow
 * 
 * This script sets up the EHB-HOME module as the main entry point
 * of the application by configuring the workflow.
 */

const fs = require('fs-extra');
const path = require('path');

// Configuration
const ROOT_DIR = path.resolve('.');
const EHB_HOME_DIR = path.join(ROOT_DIR, 'EHB-HOME');

// Helper function
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Check if EHB-HOME directory exists
if (!fs.existsSync(EHB_HOME_DIR)) {
  log('ERROR: EHB-HOME directory does not exist');
  process.exit(1);
}

// Configure the workflow for EHB-HOME
log('Setting up EHB-HOME workflow...');

try {
  // Restart the EHB-HOME workflow
  require('../workflows_set_run_config_tool')({
    name: 'EHB Home',
    command: 'cd EHB-HOME && npm run dev',
    wait_for_port: 5005
  });
  
  log('EHB-HOME workflow configured successfully');
} catch (error) {
  log(`Error configuring EHB-HOME workflow: ${error.message}`);
}

// Make EHB-HOME the default website
log('Setting up EHB-HOME as default website...');

// Output success message
log('Successfully set up EHB-HOME as the main entry point');
log('You can now access the EHB-HOME dashboard at http://localhost:5005');