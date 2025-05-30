/**
 * Check Port Script
 * 
 * This script attempts to bind to a port to see if it's available
 * and reports which ports are in use by trying to bind to them.
 */
const net = require('net');

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use`);
        resolve(false);
      } else {
        reject(err);
      }
    });
    
    server.listen(port, '0.0.0.0', () => {
      console.log(`Port ${port} is available`);
      server.close(() => {
        resolve(true);
      });
    });
  });
}

async function checkPorts() {
  console.log('Checking common ports for availability...');
  // Check ports 5000 to 5010 which are commonly used in our system
  for (let port = 5000; port <= 5150; port += 10) {
    try {
      await checkPort(port);
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
    }
  }
}

checkPorts().then(() => {
  console.log('Port check completed');
});