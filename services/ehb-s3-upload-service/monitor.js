/**
 * S3 Upload Service Monitor
 * 
 * This script monitors and ensures the S3 Upload Service is running.
 * It can be used to manually start the service if the workflow has issues.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// Configuration
const PORT = process.env.S3_SERVICE_PORT || 5400;
const SERVICE_PATH = path.join(__dirname, 'index.js');
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_RESTART_ATTEMPTS = 3;

let serviceProcess = null;
let restartAttempts = 0;

// Function to check if the service is running
function checkServiceHealth() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            resolve({ running: true, health });
          } catch (e) {
            resolve({ running: true, error: 'Invalid health response' });
          }
        });
      } else {
        resolve({ running: false, statusCode: res.statusCode });
      }
    });

    req.on('error', () => {
      resolve({ running: false, error: 'Connection refused' });
    });

    req.end();
  });
}

// Function to start the service
function startService() {
  console.log('Starting S3 Upload Service...');
  
  if (serviceProcess) {
    console.log('Service process already exists, terminating...');
    try {
      serviceProcess.kill();
    } catch (e) {
      console.error('Error terminating existing process:', e.message);
    }
  }
  
  serviceProcess = spawn('node', [SERVICE_PATH], {
    stdio: 'inherit',
    detached: false
  });
  
  serviceProcess.on('error', (err) => {
    console.error('Failed to start service:', err.message);
  });
  
  serviceProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`Service exited with code ${code} and signal ${signal}`);
      serviceProcess = null;
      
      // Try to restart if we haven't exceeded max attempts
      if (restartAttempts < MAX_RESTART_ATTEMPTS) {
        restartAttempts++;
        console.log(`Attempting restart (${restartAttempts}/${MAX_RESTART_ATTEMPTS})...`);
        setTimeout(startService, 5000);
      } else {
        console.error('Maximum restart attempts reached. Manual intervention required.');
      }
    } else {
      console.log('Service exited normally');
      serviceProcess = null;
    }
  });
  
  return serviceProcess;
}

// Main monitoring loop
async function monitorService() {
  console.log('==================================');
  console.log('S3 Upload Service Monitor Started');
  console.log('==================================');
  console.log(`Monitoring service on port ${PORT}`);
  console.log(`Service path: ${SERVICE_PATH}`);
  console.log(`Check interval: ${CHECK_INTERVAL}ms`);
  console.log('==================================');
  
  // Immediately start the service
  startService();
  
  // Then periodically check its health
  setInterval(async () => {
    const status = await checkServiceHealth();
    
    if (status.running) {
      // Service is running, reset restart counter
      restartAttempts = 0;
      console.log(`[${new Date().toISOString()}] S3 Upload Service is running`);
    } else {
      console.error(`[${new Date().toISOString()}] S3 Upload Service is not running:`, status.error || 'Unknown error');
      
      // Start the service if it's not running
      if (!serviceProcess && restartAttempts < MAX_RESTART_ATTEMPTS) {
        restartAttempts++;
        console.log(`Attempting restart (${restartAttempts}/${MAX_RESTART_ATTEMPTS})...`);
        startService();
      } else if (restartAttempts >= MAX_RESTART_ATTEMPTS) {
        console.error('Maximum restart attempts reached. Manual intervention required.');
      }
    }
  }, CHECK_INTERVAL);
}

// Start monitoring
monitorService();