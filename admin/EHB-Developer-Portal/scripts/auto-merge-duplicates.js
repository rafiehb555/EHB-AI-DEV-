/**
 * Auto Merge Duplicates Script
 * 
 * This script automatically detects duplicate files/components and merges or deletes them.
 * It helps resolve conflicts when multiple versions of the same file exist.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

// Log file path
const LOG_FILE = path.join(__dirname, '..', 'duplicate-fixes.log');

// Map of file paths by content hash
const filesByHash = new Map();

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Get hash of file content
async function getFileHash(filePath) {
  const content = await readFile(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Find duplicate files in directory
async function findDuplicates(dir, extension = null) {
  log(`Scanning directory: ${dir}`);
  
  const items = await readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const itemStat = await stat(itemPath);
    
    if (itemStat.isDirectory()) {
      // Recursively scan subdirectories
      await findDuplicates(itemPath, extension);
    } else if (itemStat.isFile()) {
      // Check file extension if specified
      if (extension && !item.endsWith(extension)) {
        continue;
      }
      
      try {
        const hash = await getFileHash(itemPath);
        
        if (filesByHash.has(hash)) {
          filesByHash.get(hash).push(itemPath);
        } else {
          filesByHash.set(hash, [itemPath]);
        }
      } catch (error) {
        log(`Error processing file ${itemPath}: ${error.message}`);
      }
    }
  }
}

// Merge duplicate files
async function mergeDuplicates() {
  for (const [hash, files] of filesByHash.entries()) {
    if (files.length > 1) {
      log(`Found duplicate files with hash ${hash}:`);
      files.forEach(file => log(`  - ${file}`));
      
      // Keep the first file, delete the others
      const fileToKeep = files[0];
      const filesToDelete = files.slice(1);
      
      log(`Keeping: ${fileToKeep}`);
      log(`Deleting: ${filesToDelete.join(', ')}`);
      
      for (const fileToDelete of filesToDelete) {
        try {
          await unlink(fileToDelete);
          log(`Deleted: ${fileToDelete}`);
        } catch (error) {
          log(`Error deleting ${fileToDelete}: ${error.message}`);
        }
      }
    }
  }
}

// Find and merge duplicate React components
async function processDuplicateComponents() {
  const rootDir = path.join(__dirname, '..');
  
  // Find JavaScript/JSX duplicates
  await findDuplicates(rootDir, '.jsx');
  await findDuplicates(rootDir, '.js');
  
  // Merge duplicates
  await mergeDuplicates();
}

// Main function
async function main() {
  log('Starting duplicate file detection and merge...');
  
  await processDuplicateComponents();
  
  log('Duplicate file processing completed');
}

// Execute the script
main()
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error('Error:', error);
  });