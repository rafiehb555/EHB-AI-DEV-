/**
 * EHB AI Dev - File Conflict Merger
 * 
 * This script merges files with conflicts that were created during the phase integration.
 * It combines both versions of files with .new extension and the original files.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const TARGET_DIR = './services/SOT-Technologies/EHB-AI-Dev';
const LOG_FILE = 'merge-integration.log';

// Ensure log file exists
const initLog = () => {
  fs.writeFileSync(LOG_FILE, `--- EHB AI Dev Conflict Merge Log ---\n`);
  log('Starting conflict merge process...');
};

// Logger
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
};

// Find all .new files recursively
const findNewFiles = (dir) => {
  let results = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findNewFiles(filePath));
    } else if (file.endsWith('.new')) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Merge a conflicted file
const mergeFile = (newFilePath) => {
  const originalFilePath = newFilePath.replace('.new', '');
  
  if (!fs.existsSync(originalFilePath)) {
    log(`Original file doesn't exist for ${newFilePath}, just renaming`);
    fs.renameSync(newFilePath, originalFilePath);
    return true;
  }
  
  try {
    const originalContent = fs.readFileSync(originalFilePath, 'utf8');
    const newContent = fs.readFileSync(newFilePath, 'utf8');
    
    // Skip if content is identical
    if (originalContent.trim() === newContent.trim()) {
      log(`Files are identical for ${originalFilePath}, removing .new file`);
      fs.unlinkSync(newFilePath);
      return true;
    }
    
    // Create merged content with comments
    const mergedContent = [
      `/**`,
      ` * MERGED FILE - Combined from multiple phases`,
      ` * Original file: ${path.basename(originalFilePath)}`,
      ` * Updated content from: ${path.basename(newFilePath)}`,
      ` * Merged on: ${new Date().toISOString()}`,
      ` */`,
      ``,
      `// ORIGINAL CONTENT START`,
      originalContent,
      `// ORIGINAL CONTENT END`,
      ``,
      `// NEWER CONTENT START - From phases`,
      newContent,
      `// NEWER CONTENT END`,
      ``,
      `// TODO: Manually resolve these conflicts by combining the functionality`,
      `// This file contains code from multiple development phases that need to be integrated`,
    ].join('\n');
    
    // Create a merged version with _merged suffix
    const mergedFilePath = originalFilePath.replace(/\.js$/, '_merged.js');
    fs.writeFileSync(mergedFilePath, mergedContent);
    
    log(`Created merged file: ${mergedFilePath}`);
    
    // Keep the original and new file for reference
    return true;
  } catch (error) {
    log(`Error merging ${newFilePath}: ${error.message}`);
    return false;
  }
};

// Process all controllers
const mergeControllers = () => {
  const controllersDir = path.join(TARGET_DIR, 'backend', 'controllers');
  
  if (!fs.existsSync(controllersDir)) {
    log(`Controllers directory doesn't exist: ${controllersDir}`);
    return;
  }
  
  log(`Processing controllers in ${controllersDir}`);
  
  const controllerFiles = fs.readdirSync(controllersDir)
    .filter(file => file.endsWith('.js.new'))
    .map(file => path.join(controllersDir, file));
  
  log(`Found ${controllerFiles.length} controller files with conflicts`);
  
  let successCount = 0;
  for (const file of controllerFiles) {
    if (mergeFile(file)) {
      successCount++;
    }
  }
  
  log(`Successfully processed ${successCount} out of ${controllerFiles.length} controller files`);
};

// Process all new files
const processAllNewFiles = () => {
  const newFiles = findNewFiles(TARGET_DIR);
  
  log(`Found ${newFiles.length} files with .new extension`);
  
  let successCount = 0;
  for (const file of newFiles) {
    if (mergeFile(file)) {
      successCount++;
    }
  }
  
  log(`Successfully processed ${successCount} out of ${newFiles.length} conflict files`);
};

// Fix empty controller files
const fixEmptyControllers = () => {
  const controllersDir = path.join(TARGET_DIR, 'backend', 'controllers');
  
  if (!fs.existsSync(controllersDir)) {
    return;
  }
  
  log(`Checking for empty controller files in ${controllersDir}`);
  
  const controllerFiles = fs.readdirSync(controllersDir)
    .filter(file => file.endsWith('.js') && !file.includes('merged') && !file.endsWith('.new'))
    .map(file => path.join(controllersDir, file));
  
  log(`Found ${controllerFiles.length} total controller files to check`);
  
  let fixedCount = 0;
  for (const file of controllerFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if file is very small/likely a stub
    if (content.length < 100 && !content.includes('exports') && !content.includes('function')) {
      const fileName = path.basename(file);
      const controllerName = fileName.replace('Controller.js', '');
      
      const newContent = `
/**
 * ${controllerName} Controller
 * Provides API endpoints for ${controllerName} functionality
 */

const ${controllerName}Model = require('../models/${controllerName}');

// Get all ${controllerName}s
exports.getAll${controllerName} = async (req, res) => {
  try {
    const items = await ${controllerName}Model.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ${controllerName}
exports.get${controllerName} = async (req, res) => {
  try {
    const item = await ${controllerName}Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: '${controllerName} not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ${controllerName}
exports.create${controllerName} = async (req, res) => {
  try {
    const item = new ${controllerName}Model(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ${controllerName}
exports.update${controllerName} = async (req, res) => {
  try {
    const updated = await ${controllerName}Model.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: '${controllerName} not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ${controllerName}
exports.delete${controllerName} = async (req, res) => {
  try {
    const deleted = await ${controllerName}Model.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '${controllerName} not found' });
    }
    res.status(200).json({ message: '${controllerName} deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`;
      
      fs.writeFileSync(file, newContent);
      log(`Fixed empty controller file: ${file}`);
      fixedCount++;
    }
  }
  
  log(`Fixed ${fixedCount} empty controller files`);
};

// Main execution function
const main = async () => {
  initLog();
  
  // Fix any remaining controller conflicts
  mergeControllers();
  
  // Process all remaining new files
  processAllNewFiles();
  
  // Fix empty controller files
  fixEmptyControllers();
  
  log('Conflict merge process completed.');
};

// Execute the main function
main().catch(error => {
  log(`Fatal error: ${error.message}`);
});