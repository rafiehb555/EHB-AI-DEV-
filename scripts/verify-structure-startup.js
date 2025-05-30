/**
 * EHB Structure Verification Startup Script
 * 
 * This script runs the structure verification before starting any services.
 * If verification fails, it halts execution to prevent working with invalid structures.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running EHB structure verification...');

try {
  // Run the verification script
  execSync('node verify_structure.js', { stdio: 'inherit' });
  console.log('✅ Structure verification passed, proceeding with startup');
} catch (error) {
  console.error('❌ Structure verification failed. Please fix the issues before continuing.');
  process.exit(1);
}

// If we got here, verification passed - we can proceed with startup
console.log('🚀 Starting EHB services...');

// Load the startup script if it exists
try {
  const startupScript = path.join(__dirname, 'startup.js');
  require(startupScript);
} catch (error) {
  console.error('Error running startup script:', error.message);
  process.exit(1);
}