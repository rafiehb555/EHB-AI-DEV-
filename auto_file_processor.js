/**
 * EHB Automatic File Processor
 * 
 * This script automatically processes any uploaded files (text, PDF, ZIP, images, etc.),
 * determines their correct destination based on content analysis, moves them to the 
 * appropriate location within the EHB structure, and cleans up temporary files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

// Configuration
const WATCHED_DIRS = [
  './attached_assets',
  './uploads',
  './temp'
];

const PROCESSING_DIR = './temp_extract';
const TARGET_DIRS = {
  'phase': './phases',
  'service': './services',
  'admin': './admin',
  'agent': './agent',
  'frontend': './frontend',
  'config': './config',
  'contract': './contracts',
  'script': './scripts',
  'test': './tests',
  'ai': './services/SOT-Technologies/EHB-AI-Dev',
  'webhook': './webhooks',
  'api': './api',
  'util': './utils',
  'public': './public',
  'docs': './ehb_company_info'
};

// Ensure all required directories exist
function ensureDirectoriesExist() {
  console.log('[INFO] Ensuring all required directories exist...');
  
  // Ensure processing directory exists
  if (!fs.existsSync(PROCESSING_DIR)) {
    fs.mkdirSync(PROCESSING_DIR, { recursive: true });
  }
  
  // Ensure processed directory exists in attached_assets
  if (!fs.existsSync('./attached_assets/processed')) {
    fs.mkdirSync('./attached_assets/processed', { recursive: true });
  }
  
  // Ensure all target directories exist
  Object.values(TARGET_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[INFO] Created directory: ${dir}`);
    }
  });
}

// Clean up temporary extraction directory
function cleanupTempDir() {
  console.log('[INFO] Cleaning up temporary extraction directory...');
  
  if (fs.existsSync(PROCESSING_DIR)) {
    try {
      fs.rmSync(PROCESSING_DIR, { recursive: true, force: true });
      fs.mkdirSync(PROCESSING_DIR, { recursive: true });
      console.log('[SUCCESS] Cleaned up temporary extraction directory');
    } catch (error) {
      console.error(`[ERROR] Failed to clean up temporary directory: ${error.message}`);
    }
  }
}

// Analyze file content to determine category
function analyzeFileContent(filePath, fileName) {
  console.log(`[INFO] Analyzing file content: ${fileName}`);
  
  // Extract file extension
  const ext = path.extname(fileName).toLowerCase();
  
  // Check file content based on extension
  if (ext === '.zip') {
    return analyzeZipContent(filePath);
  } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
    return analyzeImageContent(filePath, fileName);
  } else if (ext === '.pdf') {
    return analyzePdfContent(filePath);
  } else if (['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css'].includes(ext)) {
    return analyzeTextContent(filePath);
  } else {
    console.log(`[WARNING] Unknown file type: ${ext}`);
    return null;
  }
}

// Analyze ZIP file content
function analyzeZipContent(zipPath) {
  console.log(`[INFO] Analyzing ZIP content: ${path.basename(zipPath)}`);
  
  try {
    // Extract ZIP to temp directory
    const zip = new AdmZip(zipPath);
    const extractDir = path.join(PROCESSING_DIR, path.basename(zipPath, '.zip'));
    zip.extractAllTo(extractDir, true);
    
    // Look for key indicator files that help determine category
    const files = getAllFiles(extractDir);
    
    // Check for phase indicators
    if (path.basename(zipPath).toLowerCase().includes('phase') || 
        files.some(f => path.basename(f).toLowerCase().includes('phase'))) {
      return { category: 'phase', extractDir };
    }
    
    // Check for service indicators
    if (files.some(f => f.includes('package.json'))) {
      const packageFile = files.find(f => f.includes('package.json'));
      try {
        const packageContent = fs.readFileSync(packageFile, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        if (packageJson.name && packageJson.name.toLowerCase().includes('service')) {
          return { category: 'service', extractDir };
        }
        
        if (packageJson.dependencies && (
            packageJson.dependencies.express || 
            packageJson.dependencies.fastify || 
            packageJson.dependencies['socket.io'])) {
          return { category: 'service', extractDir };
        }
      } catch (e) {
        console.log(`[WARNING] Error parsing package.json: ${e.message}`);
      }
    }
    
    // Check for AI indicators
    if (path.basename(zipPath).toLowerCase().includes('ai') || 
        files.some(f => path.basename(f).toLowerCase().includes('ai'))) {
      return { category: 'ai', extractDir };
    }
    
    // Check for agent indicators
    if (path.basename(zipPath).toLowerCase().includes('agent') || 
        files.some(f => path.basename(f).toLowerCase().includes('agent'))) {
      return { category: 'agent', extractDir };
    }
    
    // Check for admin indicators
    if (path.basename(zipPath).toLowerCase().includes('admin') || 
        files.some(f => path.basename(f).toLowerCase().includes('admin'))) {
      return { category: 'admin', extractDir };
    }
    
    // If no specific category can be determined, prompt user
    console.log(`[WARNING] Could not automatically determine category for ${path.basename(zipPath)}`);
    return null;
  } catch (error) {
    console.error(`[ERROR] Failed to analyze ZIP file: ${error.message}`);
    return null;
  }
}

// Get all files in a directory recursively
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Analyze image content to determine category
function analyzeImageContent(filePath, fileName) {
  console.log(`[INFO] Analyzing image content: ${fileName}`);
  
  // Move screenshots to documentation by default
  if (fileName.toLowerCase().includes('screenshot') || 
      fileName.toLowerCase().includes('screen') || 
      fileName.toLowerCase().includes('shot')) {
    return { category: 'docs', filePath };
  }
  
  // Icons or logos go to public
  if (fileName.toLowerCase().includes('icon') || 
      fileName.toLowerCase().includes('logo')) {
    return { category: 'public', filePath };
  }
  
  // Default to docs for other images
  return { category: 'docs', filePath };
}

// Analyze PDF content
function analyzePdfContent(filePath) {
  console.log(`[INFO] Analyzing PDF content: ${path.basename(filePath)}`);
  // Default to docs for PDFs
  return { category: 'docs', filePath };
}

// Analyze text content
function analyzeTextContent(filePath) {
  console.log(`[INFO] Analyzing text content: ${path.basename(filePath)}`);
  
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath).toLowerCase();
    
    // Check for script indicators
    if (fileName.endsWith('.sh') || 
        fileName.endsWith('.js') && content.includes('#!/usr/bin/env node') ||
        content.includes('function') && content.includes('console.log')) {
      return { category: 'script', filePath };
    }
    
    // Check for contract indicators
    if (fileName.endsWith('.sol') || 
        content.includes('contract ') || 
        content.includes('pragma solidity')) {
      return { category: 'contract', filePath };
    }
    
    // Check for config indicators
    if (fileName.includes('config') || 
        fileName.endsWith('.json') || 
        fileName.endsWith('.env') || 
        fileName.endsWith('.config.js')) {
      return { category: 'config', filePath };
    }
    
    // Check for test indicators
    if (fileName.includes('test') || 
        content.includes('describe(') && content.includes('it(')) {
      return { category: 'test', filePath };
    }
    
    // Check for API indicators
    if (content.includes('app.get(') || 
        content.includes('app.post(') || 
        content.includes('router.get(')) {
      return { category: 'api', filePath };
    }
    
    // Check for phase indicators
    if (fileName.includes('phase') || content.includes('phase')) {
      return { category: 'phase', filePath };
    }
    
    // Check for AI indicators
    if (fileName.includes('ai') || 
        content.includes('openai') || 
        content.includes('gpt') || 
        content.includes('anthropic') || 
        content.includes('claude')) {
      return { category: 'ai', filePath };
    }
    
    // Default to docs
    return { category: 'docs', filePath };
  } catch (error) {
    console.error(`[ERROR] Failed to analyze text file: ${error.message}`);
    return null;
  }
}

// Move file to appropriate location based on analysis
function moveFileToDestination(fileInfo) {
  if (!fileInfo || !fileInfo.category) {
    console.log('[WARNING] No file information or category available');
    return false;
  }
  
  const { category, filePath, extractDir } = fileInfo;
  const targetDir = TARGET_DIRS[category];
  
  if (!targetDir) {
    console.log(`[ERROR] Target directory not defined for category: ${category}`);
    return false;
  }
  
  try {
    if (extractDir) {
      // This is an extracted directory, need to copy its contents
      console.log(`[INFO] Moving extracted contents from ${extractDir} to ${targetDir}`);
      
      // Create target directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Get the base directory name
      const baseDirName = path.basename(extractDir);
      
      // Copy directory contents
      const targetPath = path.join(targetDir, baseDirName);
      
      // Remove target path if it already exists
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
      
      // Copy directory
      fs.cpSync(extractDir, targetPath, { recursive: true });
      console.log(`[SUCCESS] Moved extracted contents to ${targetPath}`);
      
      return true;
    } else {
      // This is a single file
      console.log(`[INFO] Moving file from ${filePath} to ${targetDir}`);
      
      // Create target directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copy file
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetDir, fileName);
      
      // Remove target file if it already exists
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      
      // Copy file
      fs.copyFileSync(filePath, targetPath);
      console.log(`[SUCCESS] Moved file to ${targetPath}`);
      
      return true;
    }
  } catch (error) {
    console.error(`[ERROR] Failed to move file to destination: ${error.message}`);
    return false;
  }
}

// Move processed file to the processed directory
function moveToProcessed(filePath) {
  try {
    const fileName = path.basename(filePath);
    const processedPath = path.join('./attached_assets/processed', fileName);
    
    // Remove processed file if it already exists
    if (fs.existsSync(processedPath)) {
      fs.unlinkSync(processedPath);
    }
    
    // Move file to processed directory
    fs.renameSync(filePath, processedPath);
    console.log(`[SUCCESS] Moved ${fileName} to processed directory`);
    
    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to move file to processed directory: ${error.message}`);
    return false;
  }
}

// Process a single file
function processFile(filePath) {
  console.log(`[INFO] Processing file: ${filePath}`);
  
  try {
    const fileName = path.basename(filePath);
    
    // Skip already processed files
    if (filePath.includes('/processed/')) {
      console.log(`[INFO] Skipping already processed file: ${fileName}`);
      return;
    }
    
    // Analyze file content to determine category
    const fileInfo = analyzeFileContent(filePath, fileName);
    
    if (!fileInfo) {
      console.log(`[WARNING] Could not analyze file: ${fileName}`);
      return;
    }
    
    // Move file to appropriate location
    const success = moveFileToDestination(fileInfo);
    
    // Move file to processed directory if successful
    if (success) {
      moveToProcessed(filePath);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to process file: ${error.message}`);
  }
}

// Clean empty directories
function cleanEmptyDirectories(dir) {
  let files = fs.readdirSync(dir);
  
  if (files.length === 0) {
    console.log(`[INFO] Removing empty directory: ${dir}`);
    fs.rmdirSync(dir);
    return;
  }
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      cleanEmptyDirectories(filePath);
      
      // Check if directory is now empty after cleaning subdirectories
      if (fs.readdirSync(filePath).length === 0) {
        console.log(`[INFO] Removing empty directory: ${filePath}`);
        fs.rmdirSync(filePath);
      }
    }
  }
}

// Scan for files and process them
function scanAndProcessFiles() {
  console.log('[INFO] Scanning for files to process...');
  
  // Process each watched directory
  WATCHED_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        
        // Skip processed directory
        if (file === 'processed') {
          return;
        }
        
        // Process file if it's a file
        if (fs.statSync(filePath).isFile()) {
          processFile(filePath);
        }
      });
    }
  });
  
  // Clean up temp directory
  cleanupTempDir();
  
  // Clean empty directories
  WATCHED_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      cleanEmptyDirectories(dir);
    }
  });
}

// Watch directories for changes
function watchDirectories() {
  console.log('[INFO] Setting up file watchers...');
  
  WATCHED_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`[INFO] Watching directory: ${dir}`);
      
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (eventType === 'rename' && filename) {
          const filePath = path.join(dir, filename);
          
          // Process only if it's a new file
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            console.log(`[INFO] New file detected: ${filename}`);
            processFile(filePath);
          }
        }
      });
    }
  });
}

// Main function
function main() {
  console.log('==================================================');
  console.log('======= EHB AUTOMATIC FILE PROCESSOR =============');
  console.log('==================================================');
  
  // Ensure all directories exist
  ensureDirectoriesExist();
  
  // First, process existing files
  scanAndProcessFiles();
  
  // Then set up watchers for future files
  watchDirectories();
  
  console.log('==================================================');
  console.log('======= FILE PROCESSOR RUNNING ===================');
  console.log('==================================================');
  console.log('The system will automatically process any new files');
  console.log('and organize them into the correct structure.');
  console.log('==================================================');
}

// Start the system
main();