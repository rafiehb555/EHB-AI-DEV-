/**
 * EHB Auto Error Prevention System
 * 
 * This script sets up automated error scanning and fixing at regular intervals
 * to maintain code quality and prevent runtime errors in the EHB AI project.
 */

const { scanAndFix } = require('./ehb_error_scanner');
const { scanAndFixReactErrors } = require('./ehb_react_errors_scanner');
const { scanAndFixReactDOMRender } = require('./ehb_reactdom_render_fix');
const { cleanBackups } = require('./ehb_backup_cleaner');
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
    fs.appendFileSync('ehb_auto_fix.log', logMessage + '\n');
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

// Create log directory if it doesn't exist
function ensureLogFile() {
  try {
    if (!fs.existsSync('ehb_auto_fix.log')) {
      fs.writeFileSync('ehb_auto_fix.log', '# EHB Auto Error Prevention Log\n\n');
    }
  } catch (error) {
    console.error(`Failed to create log file: ${error.message}`);
  }
}

// Run the auto-fix process
async function runAgentCleanup() {
  log('🤖 Running automated error detection and prevention...', 'cyan');
  
  try {
    // First run general JavaScript error scanner
    log('Step 1: Running general JavaScript error scanner...', 'cyan');
    const { totalScanned, totalFixed } = await scanAndFix();
    
    if (totalFixed > 0) {
      log(`✅ General auto-fix completed: fixed issues in ${totalFixed}/${totalScanned} files`, 'green');
    } else {
      log(`✓ No general issues found in ${totalScanned} files`, 'blue');
    }
    
    // Then run React-specific error scanner
    log('Step 2: Running React-specific error scanner...', 'cyan');
    const { totalScanned: reactTotalScanned, totalFixed: reactTotalFixed } = await scanAndFixReactErrors();
    
    if (reactTotalFixed > 0) {
      log(`✅ React auto-fix completed: fixed issues in ${reactTotalFixed}/${reactTotalScanned} files`, 'green');
    } else {
      log(`✓ No React issues found in ${reactTotalScanned} files`, 'blue');
    }
    
    // Run React DOM render fix for React 18
    log('Step 3: Running React DOM render fix for React 18 compatibility...', 'cyan');
    const { totalScanned: renderTotalScanned, totalFixed: renderTotalFixed } = await scanAndFixReactDOMRender();
    
    if (renderTotalFixed > 0) {
      log(`✅ React DOM render fix completed: fixed issues in ${renderTotalFixed}/${renderTotalScanned} files`, 'green');
    } else {
      log(`✓ No React DOM render issues found in ${renderTotalScanned} files`, 'blue');
    }
    
    // Run backup files cleanup (once per day)
    log('Step 4: Running backup files and empty directory cleanup...', 'cyan');
    
    // Check if we ran cleanup today already
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let lastCleanupDate = '';
    
    try {
      if (fs.existsSync('last_cleanup.txt')) {
        lastCleanupDate = fs.readFileSync('last_cleanup.txt', 'utf8').trim();
      }
    } catch (err) {
      log(`Could not read last cleanup date: ${err.message}`, 'yellow');
    }
    
    // Run cleanup if we haven't today
    let cleanupResults = { backupFilesRemoved: 0, oldZipsRemoved: 0, emptyDirsRemoved: 0, tempDirsCleaned: 0 };
    
    if (lastCleanupDate !== today) {
      cleanupResults = cleanBackups();
      
      // Save today's date as last cleanup
      try {
        fs.writeFileSync('last_cleanup.txt', today);
      } catch (err) {
        log(`Could not save cleanup date: ${err.message}`, 'yellow');
      }
      
      log(`✅ Backup cleanup completed: removed ${cleanupResults.backupFilesRemoved} backup files, ` +
          `${cleanupResults.oldZipsRemoved} old ZIPs, ${cleanupResults.emptyDirsRemoved} empty directories, ` +
          `and cleaned ${cleanupResults.tempDirsCleaned} temp directories`, 'green');
    } else {
      log(`✓ Backup cleanup already run today (${today})`, 'blue');
    }
    
    return { 
      totalScanned: totalScanned + reactTotalScanned + renderTotalScanned, 
      totalFixed: totalFixed + reactTotalFixed + renderTotalFixed,
      backupsRemoved: cleanupResults.backupFilesRemoved + cleanupResults.oldZipsRemoved,
      dirsCleaned: cleanupResults.emptyDirsRemoved + cleanupResults.tempDirsCleaned
    };
  } catch (error) {
    log(`❌ Error during auto-fix: ${error.message}`, 'red');
    return { totalScanned: 0, totalFixed: 0, error: error.message };
  }
}

// Set up automated error prevention
function setupAutomatedErrorPrevention(intervalMinutes = 10) {
  ensureLogFile();
  
  const intervalMs = intervalMinutes * 60 * 1000;
  
  log(`🔄 Setting up automated error prevention to run every ${intervalMinutes} minutes`, 'magenta');
  
  // Run immediately on startup
  runAgentCleanup();
  
  // Then set up interval
  const interval = setInterval(runAgentCleanup, intervalMs);
  
  log('✨ Automated error prevention system is now active', 'green');
  
  return interval;
}

// Run if called directly
if (require.main === module) {
  // The first argument can specify the interval in minutes
  const args = process.argv.slice(2);
  const intervalMinutes = args[0] ? parseInt(args[0], 10) : 10;
  
  if (isNaN(intervalMinutes) || intervalMinutes < 1) {
    log('❌ Invalid interval specified. Using default of 10 minutes.', 'yellow');
    setupAutomatedErrorPrevention(10);
  } else {
    setupAutomatedErrorPrevention(intervalMinutes);
  }
}

module.exports = {
  setupAutomatedErrorPrevention,
  runAgentCleanup
};