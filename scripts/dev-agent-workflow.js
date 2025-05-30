/**
 * EHB Auto Development Agent Workflow
 * 
 * This script sets up the workflows for the Auto Development Agent system.
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const API_PORT = process.env.DEV_AGENT_PORT || 5010;
const UI_PORT = process.env.DEV_AGENT_UI_PORT || 5011;

console.log('Starting EHB Auto Development Agent system...');

// Start the agent
const agent = spawn('node', [path.join(__dirname, 'auto-dev-agent.js')], {
  stdio: 'inherit',
  shell: true
});

console.log('Auto Development Agent started');

// Start the API
const api = spawn('node', [path.join(__dirname, 'api-dev-agent.js')], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DEV_AGENT_PORT: API_PORT
  }
});

console.log(`API server started on port ${API_PORT}`);

// Start the UI
const ui = spawn('node', [path.join(__dirname, 'dev-agent-ui-server.js')], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DEV_AGENT_UI_PORT: UI_PORT
  }
});

console.log(`UI server started on port ${UI_PORT}`);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down Auto Development Agent system...');
  
  agent.kill('SIGINT');
  api.kill('SIGINT');
  ui.kill('SIGINT');
  
  process.exit();
});

// Log when processes exit
agent.on('close', (code) => {
  console.log(`Auto Development Agent exited with code ${code}`);
});

api.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
});

ui.on('close', (code) => {
  console.log(`UI server exited with code ${code}`);
});

console.log('\nEHB Auto Development Agent system is now running');
console.log(`- Agent: Running in background`);
console.log(`- API: http://localhost:${API_PORT}/api`);
console.log(`- UI: http://localhost:${UI_PORT}`);
console.log('\nAccess the UI to start developing multiple services simultaneously');