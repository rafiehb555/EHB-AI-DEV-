/**
 * Start AI Hub Script
 * 
 * This script starts all components of the EHB AI Integration Hub.
 */

const { spawn } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Configuration
const AI_HUB_PATH = path.join(__dirname, 'services', 'SOT-Technologies', 'EHB-AI-Dev', 'ai-integration-hub');
const COLORIZE = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

/**
 * Log a message with color
 */
function log(message, color = COLORIZE.reset) {
  console.log(`${color}${message}${COLORIZE.reset}`);
}

/**
 * Check if the AI Hub exists
 */
function checkAIHub() {
  if (!existsSync(AI_HUB_PATH)) {
    log(`Error: AI Hub not found at ${AI_HUB_PATH}`, COLORIZE.red);
    process.exit(1);
  }
  log(`AI Hub found at ${AI_HUB_PATH}`, COLORIZE.green);
}

/**
 * Start the AI Hub server
 */
function startAIHub() {
  log('Starting AI Integration Hub...', COLORIZE.blue);
  
  const aiHub = spawn('node', ['index.js'], { 
    cwd: AI_HUB_PATH,
    env: { ...process.env },
    stdio: 'pipe'
  });
  
  aiHub.stdout.on('data', (data) => {
    process.stdout.write(`${COLORIZE.cyan}[AI Hub] ${data.toString()}${COLORIZE.reset}`);
  });
  
  aiHub.stderr.on('data', (data) => {
    process.stderr.write(`${COLORIZE.magenta}[AI Hub Error] ${data.toString()}${COLORIZE.reset}`);
  });
  
  aiHub.on('close', (code) => {
    log(`AI Hub process exited with code ${code}`, COLORIZE.yellow);
  });
  
  log('Started AI Integration Hub', COLORIZE.green);
}

/**
 * Start the AI Hub Redirector
 */
function startAIHubRedirector() {
  log('Starting AI Integration Hub Redirector...', COLORIZE.blue);
  
  const redirector = spawn('node', ['redirect-ai-integration-hub.js'], { 
    cwd: __dirname,
    env: { ...process.env },
    stdio: 'pipe'
  });
  
  redirector.stdout.on('data', (data) => {
    process.stdout.write(`${COLORIZE.cyan}[Redirector] ${data.toString()}${COLORIZE.reset}`);
  });
  
  redirector.stderr.on('data', (data) => {
    process.stderr.write(`${COLORIZE.magenta}[Redirector Error] ${data.toString()}${COLORIZE.reset}`);
  });
  
  redirector.on('close', (code) => {
    log(`Redirector process exited with code ${code}`, COLORIZE.yellow);
  });
  
  log('Started AI Integration Hub Redirector', COLORIZE.green);
}

/**
 * Main function
 */
function main() {
  log('=== EHB AI Hub Starter ===', COLORIZE.green);
  checkAIHub();
  startAIHub();
  startAIHubRedirector();
  log('All components started successfully!', COLORIZE.green);
  log('Access the AI Integration Hub at: http://localhost:4200', COLORIZE.blue);
}

// Run the main function
main();