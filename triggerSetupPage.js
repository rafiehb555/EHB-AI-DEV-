/**
 * Trigger Setup Page Script
 * 
 * This script creates the setup-needed.json file to trigger the setup page
 * in the Developer Portal.
 */

const fs = require('fs');
const path = require('path');

// Path to the setup-needed.json file
const setupPath = path.join('./admin/EHB-Developer-Portal', 'setup-needed.json');

// Create the setup-needed.json file
fs.writeFileSync(setupPath, JSON.stringify({
  setupNeeded: true,
  timestamp: new Date().toISOString()
}, null, 2));

console.log('Setup flag created at admin/EHB-Developer-Portal/setup-needed.json');
console.log('Visit the Developer Portal to see the setup page');