/**
 * Structure Maintainer Runner
 * 
 * This script executes the structure maintainer on demand
 * and can be used to trigger structure checks from workflows
 */

// Don't import the full module which starts a file watcher
// Instead, directly use the functions from the file
const fs = require('fs');
const path = require('path');

// Base directory structure for each EHB module
const STRUCTURE_TEMPLATE = {
  'frontend': {
    'components': {},
    'pages': {},
    'styles': {},
    'utils': {},
    'public': {},
  },
  'backend': {
    'api': {},
    'config': {},
    'models': {},
    'services': {},
  }
};

// Main directories to scan for modules
const MAIN_DIRECTORIES = [
  'admin',
  'services',
  'services-root',
  'dev-services',
  'ai-services',
  'franchise-system'
];

/**
 * Creates directories recursively if they don't exist
 * @param {string} baseDir - Base directory to start from
 * @param {object} structure - Directory structure object
 */
function createDirectoryStructure(baseDir, structure) {
  for (const [dir, subDirs] of Object.entries(structure)) {
    const dirPath = path.join(baseDir, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    if (Object.keys(subDirs).length > 0) {
      createDirectoryStructure(dirPath, subDirs);
    }
  }
}

/**
 * Scans main directories for modules and applies template structure
 */
function applyStructureToAllModules() {
  console.log('EHB Structure Maintainer: Scanning for modules...');
  
  for (const mainDir of MAIN_DIRECTORIES) {
    if (!fs.existsSync(mainDir)) {
      console.log(`Warning: Main directory '${mainDir}' does not exist. Creating it.`);
      fs.mkdirSync(mainDir, { recursive: true });
    }
    
    try {
      const modules = fs.readdirSync(mainDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const module of modules) {
        // Skip directories that don't follow EHB naming convention
        if (!module.startsWith('EHB-')) continue;
        
        const modulePath = path.join(mainDir, module);
        console.log(`Checking structure for module: ${modulePath}`);
        createDirectoryStructure(modulePath, STRUCTURE_TEMPLATE);
      }
    } catch (error) {
      console.error(`Error scanning directory ${mainDir}:`, error);
    }
  }
  
  console.log('EHB Structure Maintainer: Structure check complete');
}

// Run the structure check (without the file watcher)
console.log('Running structure maintainer check...');
applyStructureToAllModules();
console.log('Structure check completed.');