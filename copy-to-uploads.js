/**
 * Copy ZIP files from the processed directory to the uploads directory
 * so they can be processed by the automatic file processor
 */

const fs = require('fs');
const path = require('path');

// Define directories
const processedDir = path.join(__dirname, 'attached_assets', 'processed');
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp_extract');

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Make sure the uploads directory exists
ensureDirectoryExists(uploadsDir);
ensureDirectoryExists(tempDir);

// Get all ZIP files from the processed directory
function getZipFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.filter(file => file.toLowerCase().endsWith('.zip'));
}

// Copy ZIP files to the uploads directory
function copyZipFiles() {
  const zipFiles = getZipFiles(processedDir);
  
  console.log(`Found ${zipFiles.length} ZIP files in the processed directory`);
  
  // Sort by priority (Agent files first, then EHB-AI-Dev files)
  const prioritizedFiles = zipFiles.sort((a, b) => {
    if (a.includes('Agent') && !b.includes('Agent')) return -1;
    if (!a.includes('Agent') && b.includes('Agent')) return 1;
    return 0;
  });
  
  // Copy priority ZIP files (Agent-related ZIPs and EHB-AI-Dev ZIPs)
  const filesToCopy = prioritizedFiles.filter(file => 
    file.includes('Agent') || file.includes('EHB-AI-Dev')
  );
  
  console.log(`Copying ${filesToCopy.length} priority ZIP files to uploads directory`);
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(processedDir, file);
    const destPath = path.join(uploadsDir, file);
    
    // Check if file already exists in the uploads directory
    if (!fs.existsSync(destPath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to uploads directory`);
      } catch (error) {
        console.error(`Error copying ${file}: ${error.message}`);
      }
    } else {
      console.log(`File ${file} already exists in uploads directory`);
    }
  });
  
  return filesToCopy;
}

// Main function
function main() {
  console.log('Starting copy process...');
  const copiedFiles = copyZipFiles();
  console.log(`Copy process completed. Copied ${copiedFiles.length} files.`);
  
  return copiedFiles;
}

// Run the main function
if (require.main === module) {
  main();
} else {
  module.exports = { main };
}