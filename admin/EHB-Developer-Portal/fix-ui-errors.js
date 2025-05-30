/**
 * Fix UI Errors
 * 
 * This script is a simple wrapper around the auto-fix-ui-errors.js script.
 * It automatically fixes common UI errors in the Developer Portal.
 */

const { exec } = require('child_process');
const path = require('path');

// Path to the auto-fix script
const scriptPath = path.join(__dirname, 'scripts', 'auto-fix-ui-errors.js');

console.log('Starting UI error fix process...');
console.log('This script will automatically fix common UI errors in the Developer Portal.');
console.log('Please wait...');

// Execute the auto-fix script
exec(`node ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Script Error: ${stderr}`);
    return;
  }
  
  console.log(stdout);
  console.log('UI error fix process completed successfully.');
  console.log('The Developer Portal should now be working correctly.');
});