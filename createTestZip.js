/**
 * Create Test ZIP Script
 * 
 * This script creates a ZIP file from the test module for testing the EHB Agent Installer.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// Create a new zip file
const zip = new AdmZip();

// Add the test module to the zip
const testModulePath = './test-module';
const testModuleDir = fs.readdirSync(testModulePath);

console.log('Adding files to ZIP:');
// Add files from the test module
function addDirectoryToZip(dir, baseInZip) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const inZipPath = path.join(baseInZip, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      console.log(`  - Directory: ${inZipPath}`);
      addDirectoryToZip(filePath, inZipPath);
    } else {
      console.log(`  - File: ${inZipPath}`);
      zip.addFile(inZipPath, fs.readFileSync(filePath));
    }
  }
}

addDirectoryToZip(testModulePath, '');

// Write the zip file
const zipPath = './uploads/EHB-Test-Service.zip';
zip.writeZip(zipPath);

console.log(`Test ZIP created at ${zipPath}`);
console.log('Run the EHB Agent Installer to process the ZIP file');