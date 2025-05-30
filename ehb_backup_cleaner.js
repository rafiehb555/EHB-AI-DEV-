/**
 * EHB Backup Cleaner
 * 
 * This script cleans up unnecessary backup files and directories to save space
 * and improve project organization.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
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

// Log utility
function log(message, color = 'white') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`${colors[color]}${logMessage}${colors.reset}`);
  
  // Also append to log file
  try {
    fs.appendFileSync('ehb_cleanup.log', logMessage + '\n');
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

// Create log file if it doesn't exist
function ensureLogFile() {
  try {
    if (!fs.existsSync('ehb_cleanup.log')) {
      fs.writeFileSync('ehb_cleanup.log', '# EHB Backup Cleaner Log\n\n');
    }
  } catch (error) {
    console.error(`Failed to create log file: ${error.message}`);
  }
}

// Check if a directory is empty
function isDirectoryEmpty(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.length === 0;
  } catch (error) {
    log(`Error checking if directory is empty: ${error.message}`, 'red');
    return false;
  }
}

// Find and delete empty directories
function cleanEmptyDirectories(rootDir = '.') {
  try {
    let emptyDirsCount = 0;
    
    function scanDirectory(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      // First, recursively process subdirectories
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(dir, entry.name);
          scanDirectory(fullPath);
        }
      }
      
      // Then check if the directory is now empty and delete if necessary
      if (isDirectoryEmpty(dir) && dir !== '.' && dir !== './node_modules' && !dir.includes('node_modules')) {
        log(`Removing empty directory: ${dir}`, 'yellow');
        fs.rmdirSync(dir);
        emptyDirsCount++;
      }
    }
    
    scanDirectory(rootDir);
    return emptyDirsCount;
  } catch (error) {
    log(`Error cleaning empty directories: ${error.message}`, 'red');
    return 0;
  }
}

// Clean backup files that have common backup suffixes/prefixes
function cleanBackupFiles(rootDir = '.') {
  try {
    let backupFilesCount = 0;
    const backupPatterns = [
      /\.bak$/i,         // .bak suffix
      /\.backup$/i,      // .backup suffix
      /~$/,              // Ends with ~
      /^backup[-_]/i,    // Starts with backup- or backup_
      /[-_]backup$/i,    // Ends with -backup or _backup
      /\.old$/i,         // .old suffix
      /\.tmp$/i,         // .tmp suffix
      /\.copy$/i,        // .copy suffix
      /\(\d+\)$/         // Ends with (1), (2), etc.
    ];
    
    function scanDirectory(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip specific directories
          if (['node_modules', '.git', 'uploads'].includes(entry.name)) {
            continue;
          }
          
          // For directories, look for backup directory patterns first
          const isBackupDir = /^_backup|backup$|\.bak$|\.old$/.test(entry.name);
          
          if (isBackupDir) {
            log(`Removing backup directory: ${fullPath}`, 'yellow');
            fs.rmSync(fullPath, { recursive: true, force: true });
            backupFilesCount++;
          } else {
            // Otherwise recursively scan the directory
            scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          // For files, check against backup patterns
          const isBackupFile = backupPatterns.some(pattern => pattern.test(entry.name));
          
          if (isBackupFile) {
            log(`Removing backup file: ${fullPath}`, 'yellow');
            fs.unlinkSync(fullPath);
            backupFilesCount++;
          }
        }
      }
    }
    
    scanDirectory(rootDir);
    return backupFilesCount;
  } catch (error) {
    log(`Error cleaning backup files: ${error.message}`, 'red');
    return 0;
  }
}

// Clean old processed ZIP files that are older than a certain date
function cleanOldProcessedZips(daysOld = 7) {
  try {
    let deletedCount = 0;
    const processedDir = path.join('./uploads', 'processed');
    
    if (fs.existsSync(processedDir)) {
      const now = new Date();
      const files = fs.readdirSync(processedDir);
      
      for (const file of files) {
        if (file.endsWith('.zip')) {
          const filePath = path.join(processedDir, file);
          const stats = fs.statSync(filePath);
          const fileDate = new Date(stats.mtime);
          const diffDays = (now - fileDate) / (1000 * 60 * 60 * 24);
          
          if (diffDays > daysOld) {
            log(`Removing old ZIP (${Math.floor(diffDays)} days old): ${filePath}`, 'yellow');
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      }
    }
    
    return deletedCount;
  } catch (error) {
    log(`Error cleaning old ZIP files: ${error.message}`, 'red');
    return 0;
  }
}

// Clean temporary extract directories
function cleanTempDirs() {
  try {
    let cleanedDirs = 0;
    const tempDirs = [
      './temp',
      './temp_extract',
      './temp_extract_phase2'
    ];
    
    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        log(`Cleaning temporary directory: ${dir}`, 'yellow');
        fs.rmSync(dir, { recursive: true, force: true });
        fs.mkdirSync(dir, { recursive: true });
        cleanedDirs++;
      }
    }
    
    return cleanedDirs;
  } catch (error) {
    log(`Error cleaning temporary directories: ${error.message}`, 'red');
    return 0;
  }
}

// Main backup cleaning function
function cleanBackups() {
  ensureLogFile();
  log('🧹 Starting backup files cleanup process...', 'cyan');
  
  // Clean backup files
  const backupFilesRemoved = cleanBackupFiles();
  log(`✅ Removed ${backupFilesRemoved} backup files`, 'green');
  
  // Clean old processed ZIPs
  const oldZipsRemoved = cleanOldProcessedZips(7); // 7 days old ZIPs
  log(`✅ Removed ${oldZipsRemoved} old processed ZIP files`, 'green');
  
  // Clean temp directories
  const tempDirsCleaned = cleanTempDirs();
  log(`✅ Cleaned ${tempDirsCleaned} temporary directories`, 'green');
  
  // Clean empty directories last (after removing files)
  const emptyDirsRemoved = cleanEmptyDirectories();
  log(`✅ Removed ${emptyDirsRemoved} empty directories`, 'green');
  
  log('✨ Backup cleanup process completed', 'green');
  
  return {
    backupFilesRemoved,
    oldZipsRemoved,
    tempDirsCleaned,
    emptyDirsRemoved
  };
}

// Run if called directly
if (require.main === module) {
  cleanBackups();
}

module.exports = {
  cleanBackups,
  cleanEmptyDirectories,
  cleanBackupFiles,
  cleanOldProcessedZips,
  cleanTempDirs
};