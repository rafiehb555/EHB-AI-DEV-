/**
 * Update Replit Workflows Script
 * This script updates the Replit workflow configuration
 */

const fs = require('fs');
const path = require('path');

// Path to the .replit file
const replitFilePath = path.join(process.cwd(), '.replit');
const workflowsPath = path.join(__dirname, 'workflows', 'workflows.json');

// Read the workflows.json file
const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));

// Check if .replit file exists
if (fs.existsSync(replitFilePath)) {
  // Read the .replit file
  const replitContent = fs.readFileSync(replitFilePath, 'utf8');
  
  // Create a new .replit content with updated paths
  let newReplitContent = replitContent;
  
  // Update each workflow path
  workflowsData.workflows.forEach(workflow => {
    const workflowName = workflow.name.toLowerCase().replace(/ /g, '-');
    const oldPattern = new RegExp(`\\[\\[(.*)\\]\\]\\s+name\\s*=\\s*["']${workflow.name}["']\\s+command\\s*=\\s*["'].*?["']`, 'g');
    const replacement = `[[$1]]\n  name = "${workflow.name}"\n  command = "${workflow.command}"`;
    
    newReplitContent = newReplitContent.replace(oldPattern, replacement);
  });
  
  // Write the updated .replit file
  fs.writeFileSync(replitFilePath, newReplitContent);
  console.log('.replit file updated with new workflow paths');
} else {
  console.log('.replit file not found, skipping update');
}
