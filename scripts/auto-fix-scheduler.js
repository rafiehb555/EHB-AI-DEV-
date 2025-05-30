
/**
 * Auto Fix Scheduler
 * 
 * This script runs the auto-fix process at regular intervals.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    try {
        fs.appendFileSync(path.join(process.cwd(), 'ehb_auto_fix_scheduler.log'), logMessage + '\n');
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
    }
}

// Run the fix-ehb-errors script
function runAutoFix() {
    log('Running automatic system fixes...');
    
    try {
        execSync('node scripts/fix-ehb-errors.js', { stdio: 'inherit' });
        log('Automatic system fixes completed successfully.');
    } catch (err) {
        log(`Error running automatic fixes: ${err.message}`);
    }
}

// Main function
function startScheduler() {
    log('Starting auto-fix scheduler...');
    
    // Run an initial fix
    runAutoFix();
    
    // Set up interval
    setInterval(runAutoFix, CHECK_INTERVAL);
    
    log(`Auto-fix scheduler started. Will run every ${CHECK_INTERVAL / 60000} minutes.`);
}

// Register for unexpected shutdowns
process.on('uncaughtException', (err) => {
    log(`Uncaught exception: ${err.message}`);
    log(err.stack);
});

process.on('unhandledRejection', (reason) => {
    log(`Unhandled rejection: ${reason}`);
});

// Start the scheduler
startScheduler();
