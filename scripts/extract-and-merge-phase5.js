/**
 * EHB Phase 5 Extract and Merge Script
 * 
 * This script extracts the EHB Phase 5 ZIP file and safely merges its contents
 * with the existing project without overwriting any existing files.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { execSync } = require('child_process');

// Configuration
const ZIP_FILE_PATH = path.join(__dirname, '../attached_assets/EHB phase 5 re.zip');
const EXTRACTION_TEMP_DIR = path.join(__dirname, '../temp_extract/phase5');
const ROOT_DIR = path.join(__dirname, '..');

// Log function with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Check if a path exists
function pathExists(pathToCheck) {
  return fs.existsSync(pathToCheck);
}

// Create a directory if it doesn't exist
function createDirIfNotExists(dirPath) {
  if (!pathExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

// Safely copy a file without overwriting existing files
function safeCopyFile(sourcePath, destPath) {
  // If destination already exists, don't overwrite it
  if (pathExists(destPath)) {
    log(`Skipping existing file: ${destPath}`);
    return false;
  }
  
  // Create destination directory if it doesn't exist
  createDirIfNotExists(path.dirname(destPath));
  
  // Copy the file
  fs.copyFileSync(sourcePath, destPath);
  log(`Copied: ${sourcePath} -> ${destPath}`);
  return true;
}

// Recursively copy directory contents without overwriting existing files
function safeCopyDirectory(sourceDir, destDir) {
  createDirIfNotExists(destDir);
  
  const items = fs.readdirSync(sourceDir);
  let copiedFiles = 0;
  let skippedFiles = 0;
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Recursively copy directory
      const results = safeCopyDirectory(sourcePath, destPath);
      copiedFiles += results.copiedFiles;
      skippedFiles += results.skippedFiles;
    } else {
      // Copy file if it doesn't exist
      if (safeCopyFile(sourcePath, destPath)) {
        copiedFiles++;
      } else {
        skippedFiles++;
      }
    }
  });
  
  return { copiedFiles, skippedFiles };
}

// Main function to extract and merge the Phase 5 ZIP file
async function extractAndMergePhase5() {
  try {
    log('Starting extraction and merging of EHB Phase 5');
    
    // Check if ZIP file exists
    if (!pathExists(ZIP_FILE_PATH)) {
      throw new Error(`ZIP file not found: ${ZIP_FILE_PATH}`);
    }
    
    // Create extraction temp directory
    createDirIfNotExists(EXTRACTION_TEMP_DIR);
    
    // Extract the ZIP file
    log(`Extracting ZIP file: ${ZIP_FILE_PATH}`);
    const zip = new AdmZip(ZIP_FILE_PATH);
    zip.extractAllTo(EXTRACTION_TEMP_DIR, true);
    log('Extraction completed');
    
    // Get a list of extracted directories
    const extractedItems = fs.readdirSync(EXTRACTION_TEMP_DIR);
    log(`Extracted items: ${extractedItems.join(', ')}`);
    
    // Merge each extracted directory with the corresponding project directory
    let totalCopiedFiles = 0;
    let totalSkippedFiles = 0;
    
    for (const item of extractedItems) {
      const sourcePath = path.join(EXTRACTION_TEMP_DIR, item);
      const stats = fs.statSync(sourcePath);
      
      if (stats.isDirectory()) {
        // Determine target directory based on the extracted directory name
        let targetDir;
        
        if (item.includes('frontend')) {
          targetDir = path.join(ROOT_DIR, 'EHB-DASHBOARD/frontend');
        } else if (item.includes('backend')) {
          targetDir = path.join(ROOT_DIR, 'EHB-DASHBOARD/backend');
        } else if (item.includes('models')) {
          targetDir = path.join(ROOT_DIR, 'models');
        } else {
          // Default to copying to a directory with the same name at the root
          targetDir = path.join(ROOT_DIR, item);
        }
        
        log(`Merging directory: ${item} -> ${targetDir}`);
        const results = safeCopyDirectory(sourcePath, targetDir);
        totalCopiedFiles += results.copiedFiles;
        totalSkippedFiles += results.skippedFiles;
        
        log(`Merged ${item}: Copied ${results.copiedFiles} files, Skipped ${results.skippedFiles} files`);
      } else {
        // Copy individual files to the root directory
        const destPath = path.join(ROOT_DIR, item);
        if (safeCopyFile(sourcePath, destPath)) {
          totalCopiedFiles++;
        } else {
          totalSkippedFiles++;
        }
      }
    }
    
    // Delete the ZIP file
    log(`Deleting ZIP file: ${ZIP_FILE_PATH}`);
    fs.unlinkSync(ZIP_FILE_PATH);
    
    // Generate a summary
    log('Extraction and merging completed');
    log(`Total files copied: ${totalCopiedFiles}`);
    log(`Total files skipped (already exist): ${totalSkippedFiles}`);
    
    return {
      success: true,
      extractedItems,
      copiedFiles: totalCopiedFiles,
      skippedFiles: totalSkippedFiles
    };
  } catch (error) {
    log(`Error during extraction and merging: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  extractAndMergePhase5()
    .then(result => {
      if (result.success) {
        log('EHB Phase 5 integration completed successfully!');
      } else {
        log('EHB Phase 5 integration failed.');
      }
    })
    .catch(error => {
      log(`Unhandled error: ${error.message}`);
    });
}

module.exports = {
  extractAndMergePhase5
};