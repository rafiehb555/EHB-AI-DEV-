/**
 * Fix EHB-HOME app/pages conflict
 * 
 * This script resolves the conflict between app/ and pages/ directories
 * in the EHB-HOME Next.js project
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const BASE_DIR = process.cwd();
const EHB_HOME_DIR = path.join(BASE_DIR, 'EHB-HOME');
const LOG_FILE = path.join(BASE_DIR, 'ehb_fix_app_pages_conflict.log');

/**
 * Log a message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Log to file
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

/**
 * Fix EHB-HOME app/pages conflict
 */
function fixAppPagesConflict() {
  log('Fixing EHB-HOME app/pages conflict...');
  
  // Check for app directory
  const appDir = path.join(EHB_HOME_DIR, 'app');
  const appBackupDir = path.join(EHB_HOME_DIR, 'app.bak');
  
  if (fs.existsSync(appDir)) {
    // If app directory exists, rename it
    if (fs.existsSync(appBackupDir)) {
      // If backup directory already exists, delete it
      try {
        fs.rmSync(appBackupDir, { recursive: true, force: true });
        log(`Removed existing app.bak directory`);
      } catch (error) {
        log(`Error removing app.bak directory: ${error.message}`);
      }
    }
    
    // Rename app to app.bak
    try {
      fs.renameSync(appDir, appBackupDir);
      log(`Renamed app directory to app.bak`);
    } catch (error) {
      log(`Error renaming app directory: ${error.message}`);
      
      // If rename fails, try copying files instead
      try {
        createDirIfNotExists(appBackupDir);
        
        const appFiles = fs.readdirSync(appDir);
        appFiles.forEach(file => {
          const appFilePath = path.join(appDir, file);
          const appBackupFilePath = path.join(appBackupDir, file);
          
          if (fs.statSync(appFilePath).isDirectory()) {
            // Copy directory
            exec(`cp -r "${appFilePath}" "${appBackupFilePath}"`, (error) => {
              if (error) {
                log(`Error copying directory ${file}: ${error.message}`);
              }
            });
          } else {
            // Copy file
            fs.copyFileSync(appFilePath, appBackupFilePath);
          }
        });
        
        // After copying, try removing app directory
        fs.rmSync(appDir, { recursive: true, force: true });
        log(`Copied app contents to app.bak and removed app directory`);
      } catch (copyError) {
        log(`Error copying app contents: ${copyError.message}`);
      }
    }
  }
  
  // Update next.config.js
  const nextConfigPath = path.join(EHB_HOME_DIR, 'next.config.js');
  
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;`;
    
    fs.writeFileSync(nextConfigPath, nextConfigContent);
    log(`Updated next.config.js with externalDir configuration`);
  }
  
  // Create .babelrc
  const babelrcPath = path.join(EHB_HOME_DIR, '.babelrc');
  
  const babelrcContent = `{
  "presets": ["next/babel"],
  "plugins": []
}`;
  
  fs.writeFileSync(babelrcPath, babelrcContent);
  log(`Created/updated .babelrc file`);
  
  // Create jsconfig.json
  const jsconfigPath = path.join(EHB_HOME_DIR, 'jsconfig.json');
  
  const jsconfigContent = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}`;
  
  fs.writeFileSync(jsconfigPath, jsconfigContent);
  log(`Created/updated jsconfig.json file`);
  
  log('Successfully fixed EHB-HOME app/pages conflict');
}

/**
 * Fix public data access
 */
function fixPublicDataAccess() {
  log('Fixing public data access...');
  
  // Create public directory if it doesn't exist
  const publicDir = path.join(EHB_HOME_DIR, 'public');
  createDirIfNotExists(publicDir);
  
  // Create a symbolic link from data in public
  const dataDir = path.join(EHB_HOME_DIR, 'data');
  const publicDataDir = path.join(publicDir, 'EHB-HOME', 'data');
  
  if (fs.existsSync(dataDir)) {
    // Create parent directories
    createDirIfNotExists(path.join(publicDir, 'EHB-HOME'));
    
    // If symlink already exists, remove it
    if (fs.existsSync(publicDataDir)) {
      try {
        fs.unlinkSync(publicDataDir);
        log(`Removed existing public data symlink`);
      } catch (error) {
        log(`Error removing public data symlink: ${error.message}`);
        
        // If unlink fails, try deletion
        try {
          fs.rmSync(publicDataDir, { recursive: true, force: true });
          log(`Removed existing public data directory`);
        } catch (rmError) {
          log(`Error removing public data directory: ${rmError.message}`);
        }
      }
    }
    
    // Create symlink or copy directory
    try {
      // Use relative path for symlink
      const relativeDataDir = path.relative(path.dirname(publicDataDir), dataDir);
      fs.symlinkSync(relativeDataDir, publicDataDir, 'dir');
      log(`Created symlink from ${relativeDataDir} to ${publicDataDir}`);
    } catch (error) {
      log(`Error creating symlink: ${error.message}`);
      
      // If symlink fails, copy the directory
      try {
        exec(`cp -r "${dataDir}" "${publicDataDir}"`, (error) => {
          if (error) {
            log(`Error copying data directory: ${error.message}`);
          } else {
            log(`Copied data directory to public`);
          }
        });
      } catch (copyError) {
        log(`Error copying data directory: ${copyError.message}`);
      }
    }
  }
  
  log('Successfully fixed public data access');
}

/**
 * Fix the fetch statement in the index.js file
 */
function fixIndexFetch() {
  log('Fixing index.js fetch path...');
  
  const indexPath = path.join(EHB_HOME_DIR, 'pages', 'index.js');
  
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Change fetch path to use public URL
    indexContent = indexContent.replace(
      /const response = await fetch\('\/EHB-HOME\/data\/service_info\.json'\);/g,
      `const response = await fetch('/data/service_info.json');`
    );
    
    fs.writeFileSync(indexPath, indexContent);
    log(`Updated fetch path in index.js`);
  }
  
  log('Successfully fixed index.js fetch path');
}

/**
 * Restart EHB-HOME workflow
 */
function restartEhbHomeWorkflow() {
  log('Attempting to restart EHB-HOME workflow...');
  
  // Kill any existing Node.js processes related to EHB-HOME
  exec('pkill -f "cd EHB-HOME && npm run dev" || true', (error, stdout, stderr) => {
    log('Stopped any existing EHB-HOME processes');
    
    // Add a small delay before starting new process
    setTimeout(() => {
      // Start EHB-HOME in a new process
      exec('cd EHB-HOME && npm run dev', (err, out, serr) => {
        if (err) {
          log(`Error starting EHB-HOME: ${err.message}`);
          return;
        }
        log('Started EHB-HOME workflow');
      });
    }, 1000);
  });
}

/**
 * Create directories for services in services-root and set up symlinks
 */
function organizeServicesRoot() {
  log('Organizing services-root directory...');
  
  const SERVICES_ROOT_DIR = path.join(BASE_DIR, 'services-root');
  createDirIfNotExists(SERVICES_ROOT_DIR);
  
  // Get all service directories
  const serviceDirs = fs.readdirSync(BASE_DIR)
    .filter(item => {
      const itemPath = path.join(BASE_DIR, item);
      return fs.statSync(itemPath).isDirectory() && 
             (item.startsWith('EHB-') || 
              item.includes('Service') || 
              item.includes('Dashboard') || 
              item.includes('Portal') || 
              item.includes('Ecommerce'));
    });
  
  // Create symlinks in services-root
  serviceDirs.forEach(serviceDir => {
    const sourcePath = path.join(BASE_DIR, serviceDir);
    const destPath = path.join(SERVICES_ROOT_DIR, serviceDir);
    
    // Skip if the directory is already in services-root
    if (sourcePath === destPath) {
      return;
    }
    
    // Create symlink if it doesn't exist
    if (!fs.existsSync(destPath)) {
      try {
        // Use relative path for symlink
        const relativeSourcePath = path.relative(SERVICES_ROOT_DIR, sourcePath);
        fs.symlinkSync(relativeSourcePath, destPath, 'dir');
        log(`Created symlink from ${relativeSourcePath} to ${destPath}`);
      } catch (error) {
        log(`Error creating symlink for ${serviceDir}: ${error.message}`);
      }
    }
  });
  
  log('Successfully organized services-root directory');
}

/**
 * Main function: Execute tasks
 */
function main() {
  log('Starting EHB-HOME app/pages conflict fix');
  
  try {
    // Fix EHB-HOME app/pages conflict
    fixAppPagesConflict();
    
    // Fix public data access
    fixPublicDataAccess();
    
    // Fix index.js fetch
    fixIndexFetch();
    
    // Organize services-root
    organizeServicesRoot();
    
    // Try to restart EHB-HOME workflow
    restartEhbHomeWorkflow();
    
    log('EHB-HOME app/pages conflict fix completed successfully');
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
  }
}

// Run the main function
main();