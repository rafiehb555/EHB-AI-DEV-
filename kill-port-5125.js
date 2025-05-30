/**
 * Direct port checking and release for port 5125
 * This script attempts to bind to port 5125 to test if it's free
 * and then releases it immediately so the main application can use it
 */

const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT = 5125;
const logFile = path.join(__dirname, 'logs/port-kill-5125.log');

// Ensure log directory exists
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a write stream for logs
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

log(`🔍 Checking if port ${PORT} is in use...`);

// Create a server to test if we can bind to the port
const testServer = net.createServer();

// Handle potential errors
testServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`❌ Port ${PORT} is currently in use`);
    log(`🔧 Attempting to forcibly free port ${PORT}...`);
    
    // Create a connection to the port to force the server to close
    const client = new net.Socket();
    
    client.on('error', () => {
      log(`⚠️ Unable to connect to port ${PORT} to force reset`);
      logStream.end();
      process.exit(1);
    });
    
    client.connect(PORT, '127.0.0.1', () => {
      log(`✅ Connected to port ${PORT}, attempting reset...`);
      client.destroy();
      
      // Try to bind to the port again after a short delay
      setTimeout(() => {
        testServer.listen(PORT, '0.0.0.0', () => {
          log(`✅ Successfully bound to port ${PORT} - it's now free`);
          testServer.close(() => {
            log(`✅ Released port ${PORT} for use by the main application`);
            logStream.end();
          });
        });
      }, 1000);
    });
  } else {
    log(`❌ Error checking port: ${err.message}`);
    logStream.end();
    process.exit(1);
  }
});

// If we can bind to the port, it's free
testServer.listen(PORT, '0.0.0.0', () => {
  log(`✅ Port ${PORT} is free`);
  testServer.close(() => {
    log(`✅ Released port ${PORT} for use by the main application`);
    logStream.end();
  });
});