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
