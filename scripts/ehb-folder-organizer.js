/**
 * EHB Folder Organizer
 * 
 * This script reorganizes the EHB project folders according to the categorized structure.
 * It follows the steps outlined in the documentation:
 * 1. Prepares and cleans existing folders
 * 2. Creates main category directories
 * 3. Moves folders to appropriate categories
 * 4. Sets up folder mapping for future reference
 */

const fs = require('fs');
const path = require('path');

// Root directory
const ROOT_DIR = path.resolve('.');

// Category mapping
const FOLDER_MAPPING = {
  'franchise-system': ['EHB-Franchise'],
  'dev-services': ['SOT-Technologies'],
  'ai-services': ['EHB-AI-Dev-Fullstack', 'EHB-AI-Dev-Phase-1', 'EHB-AI-Marketplace'],
  'admin': ['EHB-Developer-Portal', 'EHB-HOME', 'EHB-DASHBOARD'],
  'system': ['EHB-Blockchain', 'EHB-TrustyWallet-System', 'EHB-SQL', 'EHB-Services-Departments-Flow'],
  'services': [
    'GoSellr-Ecommerce',
    'WMS-World-Medical-Service',
    'HPS-Education-Service',
    'OLS-Online-Law-Service',
    'JPS-Job-Providing-Service',
    'EHB-Tube',
    'HMS-Machinery'
  ]
};

// List of folders to preserve
const PRESERVE_FOLDERS = [
  ...FOLDER_MAPPING['franchise-system'],
  ...FOLDER_MAPPING['dev-services'],
  ...FOLDER_MAPPING['ai-services'],
  ...FOLDER_MAPPING['admin'],
  ...FOLDER_MAPPING['system'],
  ...FOLDER_MAPPING['services'],
  // Add other essential folders here
  'scripts',
  'shared',
  'attached_assets',
  'ehb_company_info',
  'ehb_zips',
  'models',
  'services-root',
  'temp',
  'temp_extract'
];

/**
 * Log messages to console with timestamp
 */
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Check if a path exists
 */
function pathExists(pathToCheck) {
  return fs.existsSync(pathToCheck);
}

/**
 * Create directory if it doesn't exist
 */
function createDirIfNotExists(dirPath) {
  if (!pathExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

/**
 * Move a folder to a category
 */
function moveFolder(sourceFolder, destinationCategory) {
  const sourcePath = path.join(ROOT_DIR, sourceFolder);
  const destPath = path.join(ROOT_DIR, destinationCategory, sourceFolder);
  
  if (!pathExists(sourcePath)) {
    log(`Source folder does not exist: ${sourcePath}`);
    return false;
  }
  
  createDirIfNotExists(path.join(ROOT_DIR, destinationCategory));
  
  try {
    // If destination already exists, remove it first
    if (pathExists(destPath)) {
      log(`Destination already exists, removing: ${destPath}`);
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    // Create symlink instead of moving to avoid breaking existing paths
    fs.symlinkSync(sourcePath, destPath, 'dir');
    log(`Created symlink: ${sourcePath} -> ${destPath}`);
    return true;
  } catch (error) {
    log(`Error moving folder ${sourceFolder} to ${destinationCategory}: ${error.message}`);
    return false;
  }
}

/**
 * Save folder mapping to a file for future reference
 */
function saveFolderMapping() {
  const mappingFilePath = path.join(ROOT_DIR, 'ehb-folder-mapping.json');
  fs.writeFileSync(mappingFilePath, JSON.stringify(FOLDER_MAPPING, null, 2));
  log(`Saved folder mapping to: ${mappingFilePath}`);
}

/**
 * Step 1: Prepare and clean existing folders
 */
function prepareAndCleanFolders() {
  log('STEP 1: Preparing and cleaning existing folders');
  
  // Get all directories in the root folder
  const allDirectories = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  log(`Found ${allDirectories.length} directories in root`);
  
  // Identify folders that are not in the preserve list
  const foldersToPreserve = new Set(PRESERVE_FOLDERS);
  const unusedFolders = allDirectories.filter(dir => !foldersToPreserve.has(dir));
  
  log(`Identified ${unusedFolders.length} directories not in preserve list`);
  
  return { allDirectories, unusedFolders };
}

/**
 * Step 2: Create main category directories
 */
function createCategoryDirectories() {
  log('STEP 2: Creating main category directories');
  
  // Create each category directory
  Object.keys(FOLDER_MAPPING).forEach(category => {
    createDirIfNotExists(path.join(ROOT_DIR, category));
  });
}

/**
 * Step 3: Move folders to categorized structure
 */
function moveToCategories() {
  log('STEP 3: Moving folders to categorized structure');
  
  // Track success/failure for each folder
  const results = {
    success: [],
    failure: []
  };
  
  // Process each category and its folders
  Object.entries(FOLDER_MAPPING).forEach(([category, folders]) => {
    folders.forEach(folder => {
      if (pathExists(path.join(ROOT_DIR, folder))) {
        const success = moveFolder(folder, category);
        if (success) {
          results.success.push({ folder, category });
        } else {
          results.failure.push({ folder, category });
        }
      } else {
        log(`Folder not found: ${folder}`);
        results.failure.push({ folder, category, reason: 'not_found' });
      }
    });
  });
  
  return results;
}

/**
 * Main function to organize folders
 */
function organizeEHBFolders() {
  log('Starting EHB folder organization');
  
  // Step 1: Prepare and clean existing folders
  const { allDirectories, unusedFolders } = prepareAndCleanFolders();
  
  // Step 2: Create main category directories
  createCategoryDirectories();
  
  // Step 3: Move folders to categorized structure
  const moveResults = moveToCategories();
  
  // Step 4: Save folder mapping for future reference
  saveFolderMapping();
  
  // Log summary
  log('EHB Folder organization completed');
  log(`Total directories: ${allDirectories.length}`);
  log(`Preserved directories: ${PRESERVE_FOLDERS.length}`);
  log(`Unused directories: ${unusedFolders.length}`);
  log(`Successfully moved: ${moveResults.success.length}`);
  log(`Failed to move: ${moveResults.failure.length}`);
  
  return {
    allDirectories,
    unusedFolders,
    moveResults,
    preservedFolders: PRESERVE_FOLDERS
  };
}

// Execute if run directly
if (require.main === module) {
  organizeEHBFolders();
}

module.exports = {
  organizeEHBFolders,
  FOLDER_MAPPING
};