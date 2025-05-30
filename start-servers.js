const { execSync, spawn } = require('child_process');
const path = require('path');

// Log with timestamps
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to start the backend server
function startBackendServer() {
  log('Starting backend server...');
  
  const backendProcess = spawn('node', ['run-server.js'], {
    cwd: path.join(__dirname, 'backend'),
    env: { ...process.env, PORT: '5001' },
    stdio: 'pipe'
  });
  
  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data.toString().trim()}`);
  });
  
  backendProcess.on('close', (code) => {
    log(`Backend server process exited with code ${code}`);
    if (code !== 0) {
      log('Restarting backend server in 5 seconds...');
      setTimeout(startBackendServer, 5000);
    }
  });
  
  return backendProcess;
}

// Function to start the frontend server
function startFrontendServer() {
  log('Starting frontend server...');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    env: { ...process.env },
    stdio: 'pipe'
  });
  
  frontendProcess.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data.toString().trim()}`);
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data.toString().trim()}`);
  });
  
  frontendProcess.on('close', (code) => {
    log(`Frontend server process exited with code ${code}`);
    if (code !== 0) {
      log('Restarting frontend server in 5 seconds...');
      setTimeout(startFrontendServer, 5000);
    }
  });
  
  return frontendProcess;
}

// Start both servers
log('Starting servers...');
const backendProcess = startBackendServer();
const frontendProcess = startFrontendServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Received SIGINT. Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM. Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});