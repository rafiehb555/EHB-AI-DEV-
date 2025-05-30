/**
 * Kill Port 5124 Script
 * 
 * This script attempts to kill any process running on port 5124
 */

const { exec } = require('child_process');

// Find and kill process running on port 5124
function killPort5124() {
  console.log('Attempting to kill processes on port 5124...');
  
  // Find PIDs using port 5124
  const cmd = process.platform === 'win32' 
    ? `netstat -ano | findstr :5124` 
    : `fuser -n tcp 5124 || echo "No process found"`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log('Error finding processes:', error.message);
      console.log('Trying alternative method...');
      
      // Alternative approach using internal methods
      tryToKillPortDirectly();
      return;
    }
    
    if (stderr) {
      console.log('Error output:', stderr);
    }
    
    if (stdout) {
      console.log('Found processes:', stdout);
      
      // Extract PIDs
      let pids = [];
      if (process.platform === 'win32') {
        // Windows netstat format
        const lines = stdout.trim().split('\n');
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length > 4) {
            pids.push(parts[4]);
          }
        });
      } else {
        // Linux fuser format
        const matches = stdout.match(/\d+/g);
        if (matches) {
          pids = matches;
        }
      }
      
      console.log('PIDs to kill:', pids);
      
      // Kill each PID
      pids.forEach(pid => {
        console.log(`Killing process ${pid}...`);
        
        const killCmd = process.platform === 'win32' 
          ? `taskkill /F /PID ${pid}` 
          : `kill -9 ${pid}`;
        
        exec(killCmd, (err, out, stderr) => {
          if (err) {
            console.log(`Error killing process ${pid}:`, err.message);
          } else {
            console.log(`Process ${pid} killed successfully`);
          }
        });
      });
    } else {
      console.log('No processes found on port 5124');
      
      // Try the direct method as a fallback
      tryToKillPortDirectly();
    }
  });
}

// Try to directly kill anything using the port through a different approach
function tryToKillPortDirectly() {
  console.log('Trying direct port killing method...');
  
  // Create a simple socket to attempt to bind to the port
  const net = require('net');
  const server = net.createServer();
  
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Port is in use, forcefully trying to reclaim it...');
      
      // Try a direct execute of a kill command
      const killCommand = process.platform === 'win32' 
        ? `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :5124') do taskkill /F /PID %a`
        : `lsof -ti:5124 | xargs kill -9 || pkill -f "node.*5124" || echo "No process found to kill"`;
      
      exec(killCommand, (err, stdout, stderr) => {
        if (err) {
          console.log('Failed to forcefully kill port:', err.message);
        } else {
          console.log('Forced kill output:', stdout);
          console.log('Port should be released now');
        }
      });
    } else {
      console.log('Error attempting to bind to port:', err.message);
    }
  });
  
  // Try to bind to the port to see if it's in use
  server.once('listening', () => {
    console.log('Port 5124 is available (not in use)');
    server.close();
  });
  
  server.listen(5124, '0.0.0.0');
}

// Run the port killer
killPort5124();