/**
 * EHB System Startup Script
 * This script launches all necessary workflows for the EHB system
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const workflowsPath = path.join(__dirname, 'workflows', 'workflows.json');
const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));

const processes = {};

function startWorkflow(workflow) {
  console.log(`Starting workflow: ${workflow.name}`);
  
  const [cmd, ...args] = workflow.command.split(' ');
  const proc = spawn(cmd, args, {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  processes[workflow.name] = proc;
  
  proc.on('exit', (code) => {
    console.log(`Workflow ${workflow.name} exited with code ${code}`);
    delete processes[workflow.name];
    
    // Auto-restart on crash after a delay
    setTimeout(() => {
      console.log(`Automatically restarting workflow: ${workflow.name}`);
      startWorkflow(workflow);
    }, 5000);
  });
}

// Start all workflows
workflowsData.workflows.forEach(startWorkflow);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down all workflows...');
  
  Object.keys(processes).forEach(name => {
    console.log(`Terminating workflow: ${name}`);
    processes[name].kill();
  });
  
  setTimeout(() => {
    console.log('All workflows terminated. Exiting...');
    process.exit(0);
  }, 2000);
});

console.log('All workflows started successfully');
