/**
 * Auto Fix All Errors Script
 * 
 * This script runs all error-fixing scripts to automatically repair common issues 
 * in the Developer Portal and other EHB components.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const LOG_FILE = path.join(__dirname, '..', 'auto-fix-all-errors.log');

// Log function with color
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(colors[color] + message + colors.reset);
  
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Execute command and return promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Check if script exists and run it
async function runScriptIfExists(scriptPath, description) {
  if (fs.existsSync(scriptPath)) {
    log(`Running: ${description}`, 'blue');
    
    try {
      const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
      
      if (stderr) {
        log(`Warning while running ${description}:`, 'yellow');
        log(stderr, 'yellow');
      }
      
      log(`Completed: ${description}`, 'green');
      return true;
    } catch (error) {
      log(`Error running ${description}:`, 'red');
      log(error.message, 'red');
      return false;
    }
  } else {
    log(`Script not found: ${scriptPath}`, 'yellow');
    return false;
  }
}

// Main function to run all scripts
async function runAllFixScripts() {
  log('=== Starting Auto Fix All Errors Process ===', 'cyan');
  
  log('Step 1: Running check for missing components', 'blue');
  await runScriptIfExists(
    path.join(__dirname, '..', 'admin', 'EHB-Developer-Portal', 'scripts', 'check-missing-components.js'),
    'Check Missing Components'
  );
  
  log('Step 2: Running auto merge duplicates', 'blue');
  await runScriptIfExists(
    path.join(__dirname, '..', 'admin', 'EHB-Developer-Portal', 'scripts', 'auto-merge-duplicates.js'),
    'Auto Merge Duplicates'
  );
  
  log('Step 3: Running auto fix UI errors', 'blue');
  await runScriptIfExists(
    path.join(__dirname, '..', 'admin', 'EHB-Developer-Portal', 'scripts', 'auto-fix-ui-errors.js'),
    'Auto Fix UI Errors'
  );
  
  log('Step 4: Running react errors scanner', 'blue');
  await runScriptIfExists(
    path.join(__dirname, '..', 'ehb_react_errors_scanner.js'),
    'React Errors Scanner'
  );
  
  log('Step 5: Running React DOM render fix', 'blue');
  await runScriptIfExists(
    path.join(__dirname, '..', 'ehb_reactdom_render_fix.js'),
    'React DOM Render Fix'
  );
  
  log('Step 6: Checking if Developer Portal workflow needs restart', 'blue');
  // We can add workflow restart logic here if needed
  
  log('=== Auto Fix All Errors Process Completed ===', 'green');
  log('If any errors persist, please check the logs for detailed information.', 'white');
}

// Run all fix scripts
runAllFixScripts()
  .then(() => {
    console.log('\nAll fix scripts completed.');
  })
  .catch(error => {
    console.error('Error:', error);
  });