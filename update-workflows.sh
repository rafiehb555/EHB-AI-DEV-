#!/bin/bash

echo "Updating workflow configurations for new folder structure..."

# Create main workflow setup directory
mkdir -p scripts/workflows

# Create workflow configuration file
cat > scripts/workflows/workflows.json << 'EOL'
{
  "workflows": [
    {
      "name": "Backend Server",
      "command": "cd admin/EHB-DASHBOARD/backend && node server.js",
      "description": "Runs the EHB Dashboard backend server"
    },
    {
      "name": "Frontend Server",
      "command": "cd admin/EHB-DASHBOARD && npm run dev",
      "description": "Runs the EHB Dashboard frontend server"
    },
    {
      "name": "Integration Hub",
      "command": "cd ai-services/EHB-AI-Dev && node index.js",
      "description": "Runs the Integration Hub for cross-service communication"
    },
    {
      "name": "Developer Portal",
      "command": "cd admin/EHB-Developer-Portal && PORT=5000 node index.js",
      "description": "Runs the Developer Portal for documentation and tools"
    },
    {
      "name": "JPS Affiliate Service",
      "command": "cd services/JPS-Job-Providing-Service && PORT=5000 node backend/server.js",
      "description": "Runs the Job Providing Service"
    },
    {
      "name": "EHB Home",
      "command": "cd admin/EHB-HOME && npm run dev",
      "description": "Runs the EHB Home module, the central dashboard"
    },
    {
      "name": "ZIP Watcher",
      "command": "node scripts/watch-assets.js",
      "description": "Monitors for new assets and ZIP files"
    },
    {
      "name": "Dev Agent System",
      "command": "node scripts/dev-agent-workflow.js",
      "description": "Runs the AI-powered developer agent system"
    },
    {
      "name": "Multi Service Dashboard",
      "command": "node scripts/multi-service-dashboard-server.js",
      "description": "Runs the multi-service monitoring dashboard"
    },
    {
      "name": "EHB Home Integrator",
      "command": "node scripts/ehb-home-integrator.js",
      "description": "Integrates all services with EHB Home module"
    }
  ]
}
EOL

# Create startup script
cat > scripts/startup.js << 'EOL'
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
EOL

# Create a script to register the workflows with Replit
cat > scripts/register-workflows.js << 'EOL'
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
EOL

# Create a script to update the workflow configuration in package.json
cat > scripts/update-package-json.js << 'EOL'
/**
 * Update Package.json Script
 * This script updates the scripts section in package.json to include workflow commands
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const workflowsPath = path.join(__dirname, 'workflows', 'workflows.json');

// Read files
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));

// Update scripts
packageJson.scripts = packageJson.scripts || {};

// Add basic scripts
packageJson.scripts['start'] = 'node scripts/startup.js';
packageJson.scripts['register-workflows'] = 'node scripts/register-workflows.js';

// Add workflow-specific scripts
workflowsData.workflows.forEach(workflow => {
  const scriptName = `start:${workflow.name.toLowerCase().replace(/ /g, '-')}`;
  packageJson.scripts[scriptName] = workflow.command;
});

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json updated successfully with workflow scripts');
EOL

# Make the scripts executable
chmod +x scripts/startup.js
chmod +x scripts/register-workflows.js
chmod +x scripts/update-package-json.js

# Update package.json
node scripts/update-package-json.js

echo "Workflow configurations updated successfully"