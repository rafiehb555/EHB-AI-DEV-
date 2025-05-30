/**
 * Copy Free Agent ZIP files from attached_assets to the uploads directory
 * This script helps prepare ZIP files for the Free Agent Installer
 */

const fs = require('fs');
const path = require('path');

const ATTACHED_ASSETS_DIR = path.join(__dirname, 'attached_assets');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Created uploads directory: ${UPLOADS_DIR}`);
}

// Find all Free Agent ZIP files
const files = fs.readdirSync(ATTACHED_ASSETS_DIR);
const zipFiles = files.filter(file => 
  file.toLowerCase().endsWith('.zip') && 
  (file.toLowerCase().includes('free-agent') || 
   file.toLowerCase().includes('ehb-free-agent'))
);

if (zipFiles.length === 0) {
  console.log('No Free Agent ZIP files found in attached_assets directory');
  process.exit(0);
}

console.log(`Found ${zipFiles.length} Free Agent ZIP files to copy`);

// Copy each ZIP file to the uploads directory
let copiedCount = 0;
for (const zipFile of zipFiles) {
  const sourcePath = path.join(ATTACHED_ASSETS_DIR, zipFile);
  const destPath = path.join(UPLOADS_DIR, zipFile);
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${zipFile}`);
    copiedCount++;
  } catch (error) {
    console.error(`Error copying ${zipFile}: ${error.message}`);
  }
}

console.log(`Done! Copied ${copiedCount} of ${zipFiles.length} files to uploads directory`);