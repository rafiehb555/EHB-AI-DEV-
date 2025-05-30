/**
 * EHB Cleanup System
 * 
 * This script scans the EHB project structure to:
 * 1. Identify and safely delete empty/unused modules and ports
 * 2. Merge duplicate folder data
 * 3. Relocate misplaced data to proper locations
 * 4. Create backups of deleted content
 * 
 * IMPORTANT: Protected folders are never deleted
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

// Configuration
const config = {
  // Protected folders that should never be deleted
  protectedFolders: [
    'admin', 'EHB-HOME', 'ehb-dashboard', 'ai-dev', 'blockchain',
    'gosellr', 'pss', 'edr', 'emo', 'services/SOT-Technologies',
    'services/ehb-mongodb-api', 'services/ehb-s3-upload-service',
    'AI-Dashboard-Final-Phase-9', 'AICodingChat-Phase-3', 'AutoCardGen-Phase-7',
    'CodeSuggest-Phase-2', 'DashboardCommandAgent-Phase-11', 'EHB-AI-Agent',
    'EHB-AI-Agent-Phase-1', 'EHB-AI-Dev-BaseFiles', 'EHB-AutoDashboard-System',
    'EHB-Free-Agent-Package', 'EHB-MobileSync-Phase-13', 'ReferralTree-Phase-6',
    'SQLBadgeSystem-Phase-5', 'SmartAIAgent-Phase-10', 'SmartAccessControl-Phase-15',
    'TestPassFail-Phase-8', 'VoiceGPT-AIAgent-Phase-12', 'VoiceModuleGen-Phase-4',
    'attached_assets'
  ],
  
  // Empty file indicators
  emptyFileIndicators: [
    'index.js', 'config.js', 'README.md', 'api.js', 'server.js',
    'app.js', 'main.js', 'util.js', 'interface.js'
  ],
  
  // Backup directory
  backupDir: '__deleted_ports_backup__',
  
  // Known module patterns
  knownModulePatterns: [
    { pattern: /EHB-.*-Phase-\d+/, targetDir: 'phases' },
    { pattern: /EHB-Free-Agent-Phase\d+/, targetDir: 'phases' }
  ],
  
  // Consolidation mappings (source -> target)
  consolidationMappings: {
    'ai-agents': 'agent',
    'ai-services': 'services',
    'apis': 'api',
    'configs': 'config',
    'services-root': 'services',
    'test-module-phase-1': 'phases/test-module-phase-1',
    'test-module-phase-2': 'phases/test-module-phase-2',
    'test-module-phase-3': 'phases/test-module-phase-3',
    'test-module-for-zip': 'test-module',
    'test-module-v2': 'test-module'
  }
};

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Log a message with color
 */
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Create a directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, colors.green);
  }
}

/**
 * Check if a file is empty (0 KB)
 */
function isEmptyFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a directory is effectively empty (no files or only empty files)
 */
function isDirectoryEffectivelyEmpty(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    if (items.length === 0) return true;
    
    // Check if directory only contains empty files or directories
    return items.every(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        return isDirectoryEffectivelyEmpty(itemPath);
      } else {
        return isEmptyFile(itemPath);
      }
    });
  } catch (error) {
    return false;
  }
}

/**
 * Check if a directory has a package.json with dependencies
 */
function hasPackageJsonWithDependencies(dirPath) {
  try {
    const packageJsonPath = path.join(dirPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return false;
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasDependencies = packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0;
    const hasDevDependencies = packageJson.devDependencies && Object.keys(packageJson.devDependencies).length > 0;
    
    return hasDependencies || hasDevDependencies;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a folder has actively running code
 */
function hasActiveCode(dirPath) {
  try {
    // Check for specific file patterns that indicate active code
    const hasWorkflow = fs.existsSync(path.join(dirPath, 'start.js')) || 
                        fs.existsSync(path.join(dirPath, 'server.js')) ||
                        fs.existsSync(path.join(dirPath, 'index.js'));
    
    // Check if there are non-empty JS files
    const hasNonEmptyJsFiles = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
      .some(file => !isEmptyFile(path.join(dirPath, file.name)));
    
    return hasWorkflow && hasNonEmptyJsFiles;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a folder is protected from deletion
 */
function isProtectedFolder(folderPath) {
  const normalizedPath = folderPath.replace(/\\/g, '/');
  return config.protectedFolders.some(protectedFolder => 
    normalizedPath === protectedFolder || 
    normalizedPath.startsWith(`${protectedFolder}/`) ||
    normalizedPath.endsWith(`/${protectedFolder}`)
  );
}

/**
 * Backup a folder before deletion
 */
function backupFolder(folderPath) {
  const backupPath = path.join(config.backupDir, folderPath);
  ensureDir(path.dirname(backupPath));
  
  try {
    // Use recursive copy
    fs.cpSync(folderPath, backupPath, { recursive: true });
    log(`✅ Backed up: ${folderPath} → ${backupPath}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to backup ${folderPath}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Safely delete a folder
 */
function safelyDeleteFolder(folderPath) {
  if (isProtectedFolder(folderPath)) {
    log(`🔒 Protected folder, not deleting: ${folderPath}`, colors.yellow);
    return false;
  }
  
  try {
    if (backupFolder(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      log(`🗑️ Deleted folder: ${folderPath}`, colors.red);
      return true;
    }
    return false;
  } catch (error) {
    log(`❌ Failed to delete ${folderPath}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Merge folder contents from source to target
 */
function mergeFolderContents(sourceDir, targetDir) {
  ensureDir(targetDir);
  
  try {
    const items = fs.readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);
      
      if (fs.existsSync(targetPath)) {
        const sourceStats = fs.statSync(sourcePath);
        const targetStats = fs.statSync(targetPath);
        
        if (sourceStats.isDirectory() && targetStats.isDirectory()) {
          // Recursively merge directories
          mergeFolderContents(sourcePath, targetPath);
        } else if (sourceStats.isFile()) {
          // If target file exists, keep the newer version
          if (sourceStats.mtime > targetStats.mtime) {
            fs.copyFileSync(sourcePath, targetPath);
            log(`📝 Updated file: ${targetPath}`, colors.blue);
          }
        }
      } else {
        // Target doesn't exist, just copy
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, targetPath, { recursive: true });
          log(`📁 Copied directory: ${sourcePath} → ${targetPath}`, colors.blue);
        } else {
          fs.copyFileSync(sourcePath, targetPath);
          log(`📄 Copied file: ${sourcePath} → ${targetPath}`, colors.blue);
        }
      }
    }
    
    log(`✅ Merged: ${sourceDir} → ${targetDir}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to merge ${sourceDir} to ${targetDir}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Scan and identify folders for cleanup
 */
function scanFoldersForCleanup(rootDir = '.', results = { 
  emptyFolders: [], 
  duplicateFolders: [],
  misplacedFolders: []
}) {
  try {
    // Check if directory exists first
    if (!fs.existsSync(rootDir)) {
      log(`Directory does not exist: ${rootDir}`, colors.yellow);
      return results;
    }
    
    const items = fs.readdirSync(rootDir);
    
    for (const item of items) {
      if (item === config.backupDir || item === 'node_modules' || item.startsWith('.')) continue;
      
      const itemPath = path.join(rootDir, item);
      
      // Check if file/directory exists before getting stats
      if (!fs.existsSync(itemPath)) {
        continue;
      }
      
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Check for empty folders
        if (isDirectoryEffectivelyEmpty(itemPath) && !isProtectedFolder(itemPath)) {
          results.emptyFolders.push(itemPath);
          continue;
        }
        
        // Check for duplicate folders based on naming patterns
        for (const { pattern, targetDir } of config.knownModulePatterns) {
          if (pattern.test(item) && !isProtectedFolder(itemPath)) {
            results.duplicateFolders.push({
              source: itemPath,
              target: targetDir
            });
            break;
          }
        }
        
        // Check for folders that need consolidation
        if (config.consolidationMappings[item] && rootDir === '.') {
          results.misplacedFolders.push({
            source: itemPath,
            target: config.consolidationMappings[item]
          });
        }
        
        // Recursive scan
        scanFoldersForCleanup(itemPath, results);
      }
    }
  } catch (error) {
    log(`Error scanning directory ${rootDir}: ${error.message}`, colors.red);
  }
  
  return results;
}

/**
 * Process folders for cleanup
 */
function processFoldersForCleanup() {
  log('🔍 Scanning project structure for cleanup...', colors.cyan);
  
  // Ensure backup directory exists
  ensureDir(config.backupDir);
  
  // Scan for folders to clean up
  const { emptyFolders, duplicateFolders, misplacedFolders } = scanFoldersForCleanup();
  
  // Process empty folders
  if (emptyFolders.length > 0) {
    log('\n🗑️ Found empty folders to delete:', colors.magenta);
    emptyFolders.forEach(folder => {
      log(`  - ${folder}`, colors.white);
    });
    
    for (const folder of emptyFolders) {
      safelyDeleteFolder(folder);
    }
  } else {
    log('\n✅ No empty folders found.', colors.green);
  }
  
  // Process duplicate folders
  if (duplicateFolders.length > 0) {
    log('\n🔄 Consolidating duplicate folders:', colors.magenta);
    duplicateFolders.forEach(({ source, target }) => {
      log(`  - ${source} → ${target}`, colors.white);
    });
    
    for (const { source, target } of duplicateFolders) {
      if (!fs.existsSync(source)) {
        log(`❌ Source does not exist: ${source}`, colors.red);
        continue;
      }
      
      ensureDir(target);
      if (mergeFolderContents(source, target)) {
        safelyDeleteFolder(source);
      }
    }
  } else {
    log('\n✅ No duplicate folders found.', colors.green);
  }
  
  // Process misplaced folders
  if (misplacedFolders.length > 0) {
    log('\n📦 Relocating misplaced folders:', colors.magenta);
    misplacedFolders.forEach(({ source, target }) => {
      log(`  - ${source} → ${target}`, colors.white);
    });
    
    for (const { source, target } of misplacedFolders) {
      if (!fs.existsSync(source)) {
        log(`❌ Source does not exist: ${source}`, colors.red);
        continue;
      }
      
      ensureDir(target);
      if (mergeFolderContents(source, target)) {
        safelyDeleteFolder(source);
      }
    }
  } else {
    log('\n✅ No misplaced folders found.', colors.green);
  }
  
  log('\n✅ Cleanup process completed!', colors.green);
}

/**
 * Generate a report of the clean-up process
 */
function generateCleanupReport() {
  log('\n📊 EHB Cleanup Report:', colors.cyan);
  
  // Report on deleted folders
  const deletedFolders = fs.readdirSync(config.backupDir);
  log(`\n🗑️ Removed: ${deletedFolders.length} unused folders`, colors.red);
  
  // Report on remaining active workflows
  try {
    const output = execSync('ps aux | grep node').toString();
    const activeProcesses = output.split('\n')
      .filter(line => line.includes('node') && !line.includes('grep'))
      .length;
    
    log(`\n🔄 Active Processes: ${activeProcesses}`, colors.green);
  } catch (error) {
    log('\n❌ Failed to check active processes', colors.red);
  }
  
  // Summary
  log('\n✅ Final Status:', colors.green);
  log('- Protected folders remain intact', colors.white);
  log('- Duplicates consolidated', colors.white);
  log('- Misplaced data relocated', colors.white);
  log(`- Backups saved to: ${config.backupDir}`, colors.white);
}

// Run the cleanup process
try {
  processFoldersForCleanup();
  generateCleanupReport();
} catch (error) {
  log(`\n❌ Error during cleanup: ${error.message}`, colors.red);
  log(error.stack, colors.red);
}