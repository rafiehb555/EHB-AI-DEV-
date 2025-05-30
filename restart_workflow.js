/**
 * Restart Workflow Helper
 * 
 * This script provides a simple way to restart Replit workflows
 * It is designed to be used by scripts like auto-sync-phases.sh
 * 
 * Usage: node -e "require('./restart_workflow.js')('workflow name');"
 */

const { execSync } = require('child_process');

/**
 * Restart a workflow by name
 * @param {string} workflowName - The name of the workflow to restart
 */
function restartWorkflow(workflowName) {
  if (!workflowName) {
    console.error('Error: No workflow name provided');
    return;
  }
  
  console.log(`Attempting to restart workflow: ${workflowName}`);
  
  try {
    // Create a .restart file for the workflow to trigger restart
    const sanitizedName = workflowName.replace(/\s+/g, '-');
    const restartFilePath = `./${sanitizedName}.restart`;
    
    // Use execSync to create the restart file
    execSync(`touch ${restartFilePath}`);
    console.log(`Created restart file: ${restartFilePath}`);
    
    // Wait a moment for the restart to be detected
    console.log(`Waiting for workflow ${workflowName} to restart...`);
    
    // Success message
    console.log(`\x1b[32m✓ Requested restart for workflow: ${workflowName}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✗ Error restarting workflow ${workflowName}: ${error.message}\x1b[0m`);
  }
}

// If called directly with arguments
if (require.main === module) {
  const workflowName = process.argv[2];
  restartWorkflow(workflowName);
} else {
  // Export for use in other scripts
  module.exports = restartWorkflow;
}