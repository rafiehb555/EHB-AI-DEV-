/**
 * AI Agent Core Launcher Script
 * 
 * This script launches the ultra-simple-ai-core.js script 
 * which provides a minimal implementation of the AI Agent Core service
 * that is guaranteed to start and respond to basic requests.
 */

const { exec } = require('child_process');
const path = require('path');

function log(message) {
  console.log(`[AI-Core-Launcher] ${message}`);
}

// Get the path to the ultra-simple-ai-core.js file
const scriptPath = path.join(__dirname, 'ultra-simple-ai-core.js');

log(`Starting AI Agent Core from ${scriptPath}`);

// Launch the AI Agent Core script
const childProcess = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    log(`Error executing AI Agent Core: ${error.message}`);
    return;
  }
  if (stderr) {
    log(`AI Agent Core stderr: ${stderr}`);
  }
});

// Forward the child process output to the console
childProcess.stdout.on('data', (data) => {
  log(`Output: ${data.toString().trim()}`);
});

childProcess.stderr.on('data', (data) => {
  log(`Error: ${data.toString().trim()}`);
});

// Handle the child process exit
childProcess.on('exit', (code, signal) => {
  if (code !== 0) {
    log(`AI Agent Core exited with code ${code} and signal ${signal}`);
  } else {
    log('AI Agent Core exited successfully');
  }
});

// Handle the process termination
process.on('SIGINT', () => {
  log('Received SIGINT. Stopping AI Agent Core...');
  childProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM. Stopping AI Agent Core...');
  childProcess.kill('SIGTERM');
  process.exit(0);
});

log('AI Agent Core launcher started');