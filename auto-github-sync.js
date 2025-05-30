/**
 * EHB GitHub Auto-Sync Script
 * 
 * This script automatically pushes changes to GitHub at regular intervals.
 * It tracks changes to the codebase and commits them with timestamped messages.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Should be set in environment variables
const REMOTE_REPO = process.env.GIT_REPO || 'https://github.com/rafiehb555/EHB-AI-DEV-.git';
const BRANCH = 'main';
const SYNC_INTERVAL_MINUTES = 15;
const AUTHOR_NAME = 'EHB Agent';
const AUTHOR_EMAIL = 'agent@ehb.com';

// Log file
const LOG_FILE = path.join(__dirname, 'github-sync.log');

// Function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Function to execute a shell command
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        log(`Command stderr: ${stderr}`);
      }
      
      resolve(stdout.trim());
    });
  });
}

// Initialize git repository if not already initialized
async function initializeGit() {
  try {
    // Check if .git directory exists
    if (!fs.existsSync(path.join(__dirname, '.git'))) {
      log('Initializing git repository...');
      await executeCommand('git init');
    }
    
    // Set git configuration
    await executeCommand(`git config --global user.name "${AUTHOR_NAME}"`);
    await executeCommand(`git config --global user.email "${AUTHOR_EMAIL}"`);
    
    // Check if remote is already set
    const remotes = await executeCommand('git remote -v');
    
    if (!remotes.includes('origin')) {
      // Add remote origin with token
      const remoteUrl = GITHUB_TOKEN 
        ? REMOTE_REPO.replace('https://', `https://${GITHUB_TOKEN}@`) 
        : REMOTE_REPO;
        
      await executeCommand(`git remote add origin ${remoteUrl}`);
      log('Remote repository configured');
    }
    
    log('Git repository initialized successfully');
  } catch (error) {
    log(`Failed to initialize git: ${error.message}`);
  }
}

// Check for changes and commit
async function checkAndCommit() {
  try {
    // Add all changes
    log('Checking for changes...');
    
    // Get status
    const status = await executeCommand('git status --porcelain');
    
    if (status) {
      // There are changes
      log(`Found changes:\n${status}`);
      
      // Add all changes
      await executeCommand('git add .');
      
      // Create commit message with timestamp
      const timestamp = new Date().toISOString();
      const commitMessage = `🔁 Auto-sync update: ${timestamp}`;
      
      // Commit changes
      await executeCommand(`git commit -m "${commitMessage}"`);
      log('Changes committed successfully');
      
      return true; // Changes were committed
    } else {
      log('No changes detected');
      return false; // No changes
    }
  } catch (error) {
    log(`Error checking for changes: ${error.message}`);
    return false;
  }
}

// Push changes to GitHub
async function pushToGitHub() {
  try {
    // Push to remote
    log(`Pushing changes to ${REMOTE_REPO} (${BRANCH})...`);
    
    // Force push to ensure sync
    await executeCommand(`git push -u origin ${BRANCH}`);
    
    log('Changes pushed successfully');
    return true;
  } catch (error) {
    log(`Error pushing to GitHub: ${error.message}`);
    
    // If push fails, try to pull first (in case of rejected non-fast-forward)
    try {
      log('Attempting to pull latest changes...');
      await executeCommand(`git pull origin ${BRANCH} --rebase`);
      
      // Try pushing again
      log('Retrying push...');
      await executeCommand(`git push -u origin ${BRANCH}`);
      
      log('Changes pushed successfully after pull');
      return true;
    } catch (pullError) {
      log(`Error during pull and retry: ${pullError.message}`);
      return false;
    }
  }
}

// Main sync function
async function syncWithGitHub() {
  try {
    // Initialize if needed
    await initializeGit();
    
    // Check for changes and commit
    const hasChanges = await checkAndCommit();
    
    // Push if there were changes
    if (hasChanges) {
      await pushToGitHub();
    }
    
    log('Sync process completed');
  } catch (error) {
    log(`Sync error: ${error.message}`);
  }
}

// Start the sync process with interval
function startAutoSync() {
  log('Starting GitHub auto-sync service...');
  log(`Sync interval: ${SYNC_INTERVAL_MINUTES} minutes`);
  
  // Run immediately
  syncWithGitHub();
  
  // Set interval for future syncs
  setInterval(syncWithGitHub, SYNC_INTERVAL_MINUTES * 60 * 1000);
}

// Check for required environment variables
if (!GITHUB_TOKEN) {
  log('WARNING: GITHUB_TOKEN environment variable is not set. Authentication may fail.');
}

// Run the auto-sync process
startAutoSync();

// Export functions for module use
module.exports = {
  syncWithGitHub,
  initializeGit,
  checkAndCommit,
  pushToGitHub
};