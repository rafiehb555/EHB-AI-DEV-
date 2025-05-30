/**
 * EHB Project Cleanup - Step 1: Delete Old & Duplicate Folders
 */

const fs = require('fs-extra');
const path = require('path');

// Configuration
const ROOT_DIR = path.resolve('.');
const LEGACY_DIRS_TO_REMOVE = [
  'frontend',
  'backend',
  'admin',
  'pages',
  'app',
  'public', 
  'custom-target-dir',
  'TestModule',
  'ApiTestModule'
];

// Helper functions
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync(path.join(ROOT_DIR, 'ehb_reset.log'), `[${timestamp}] ${message}\n`);
}

// Delete legacy directories at root level
LEGACY_DIRS_TO_REMOVE.forEach(dir => {
  const dirPath = path.join(ROOT_DIR, dir);
  if (fs.existsSync(dirPath)) {
    log(`Removing legacy directory: ${dir}`);
    fs.removeSync(dirPath);
  } else {
    log(`Directory ${dir} does not exist, skipping`);
  }
});

// Create archived directory if it doesn't exist
const archivedDir = path.join(ROOT_DIR, 'archived');
if (!fs.existsSync(archivedDir)) {
  fs.mkdirSync(archivedDir);
  log('Created archived directory');
}

log('Step 1: Old and duplicate folders deleted successfully');