/**
 * Install Dependencies Script
 * 
 * This script installs the dependencies required by the EHB Agent Installer.
 */

const { execSync } = require('child_process');

console.log('Installing dependencies...');

try {
  console.log('Installing adm-zip...');
  execSync('npm install adm-zip', { stdio: 'inherit' });
  
  console.log('All dependencies installed successfully');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}