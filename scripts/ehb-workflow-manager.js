/**
 * EHB Workflow Manager
 * This script manages the workflows for the EHB system
 * Version: 1.0.0 - May 10, 2025
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Default workflow configurations
const DEFAULT_WORKFLOWS = [
  {
    name: 'Backend Server',
    command: 'cd admin/EHB-DASHBOARD/backend && node server.js',
    description: 'Runs the EHB Dashboard backend server'
  },
  {
    name: 'Frontend Server',
    command: 'cd admin/EHB-DASHBOARD && npm run dev',
    description: 'Runs the EHB Dashboard frontend server'
  },
  {
    name: 'Integration Hub',
    command: 'cd ai-services/EHB-AI-Dev && node index.js',
    description: 'Runs the Integration Hub for cross-service communication'
  },
  {
    name: 'Developer Portal',
    command: 'cd admin/EHB-Developer-Portal && PORT=5000 node index.js',
    description: 'Runs the Developer Portal for documentation and tools'
  },
  {
    name: 'JPS Affiliate Service',
    command: 'cd services/JPS-Job-Providing-Service && PORT=5000 node backend/server.js',
    description: 'Runs the Job Providing Service'
  },
  {
    name: 'EHB Home',
    command: 'cd admin/EHB-HOME && npm run dev',
    description: 'Runs the EHB Home module, the central dashboard'
  },
  {
    name: 'ZIP Watcher',
    command: 'node scripts/watch-assets.js',
    description: 'Monitors for new assets and ZIP files'
  },
  {
    name: 'Dev Agent System',
    command: 'node scripts/dev-agent-workflow.js',
    description: 'Runs the AI-powered developer agent system'
  },
  {
    name: 'Multi Service Dashboard',
    command: 'node scripts/multi-service-dashboard-server.js',
    description: 'Runs the multi-service monitoring dashboard'
  },
  {
    name: 'EHB Home Integrator',
    command: 'node scripts/ehb-home-integrator.js',
    description: 'Integrates all services with EHB Home module'
  }
];

// Create workflows directory if it doesn't exist
const workflowsDir = path.join(__dirname, 'workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

// Save default workflows
const workflowsPath = path.join(workflowsDir, 'workflows.json');
if (!fs.existsSync(workflowsPath)) {
  fs.writeFileSync(workflowsPath, JSON.stringify({ workflows: DEFAULT_WORKFLOWS }, null, 2));
  console.log('Created default workflows configuration');
}

// Function to start a workflow
function startWorkflow(workflow) {
  console.log(`Starting workflow: ${workflow.name}`);
  
  const [cmd, ...args] = workflow.command.split(' ');
  const proc = spawn(cmd, args, {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  proc.on('exit', (code) => {
    console.log(`Workflow ${workflow.name} exited with code ${code}`);
    
    // Auto-restart on crash after a delay
    setTimeout(() => {
      console.log(`Automatically restarting workflow: ${workflow.name}`);
      startWorkflow(workflow);
    }, 5000);
  });
  
  return proc;
}

// Function to start all workflows
function startAllWorkflows() {
  const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8')).workflows;
  const processes = {};
  
  workflows.forEach(workflow => {
    processes[workflow.name] = startWorkflow(workflow);
  });
  
  return processes;
}

// Export functions
module.exports = {
  startWorkflow,
  startAllWorkflows,
  DEFAULT_WORKFLOWS
};

// If this script is run directly, start all workflows
if (require.main === module) {
  console.log('Starting all workflows...');
  const processes = startAllWorkflows();
  
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
}