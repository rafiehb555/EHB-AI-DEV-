/**
 * EHB Workflow Registration Script
 * This script registers all workflows with Replit
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const workflowsPath = path.join(__dirname, 'workflows', 'workflows.json');
const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));

function registerWorkflow(workflow) {
  console.log(`Registering workflow: ${workflow.name}`);
  
  // Use the workflows_set_run_config_tool
  const cmd = `node -e "
    const fs = require('fs');
    const path = require('path');
    
    // Create a temporary file for the workflow
    const tempFile = path.join(process.cwd(), '.temp-workflow.json');
    fs.writeFileSync(tempFile, JSON.stringify({
      name: '${workflow.name}',
      command: '${workflow.command}'
    }));
    
    // Call the workflows_set_run_config_tool
    const { spawn } = require('child_process');
    const proc = spawn('replit-workflows', ['set', '-f', tempFile]);
    
    proc.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    proc.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    proc.on('close', (code) => {
      fs.unlinkSync(tempFile);
      console.log('Workflow registration complete with code: ' + code);
    });
  "`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error registering workflow ${workflow.name}:`, error);
      return;
    }
    console.log(`Workflow ${workflow.name} registered successfully`);
    console.log(stdout);
  });
}

// Register all workflows
workflowsData.workflows.forEach(registerWorkflow);

console.log('All workflows have been registered');
