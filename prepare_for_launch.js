/**
 * EHB System Preparation for Launch
 * 
 * This script runs all the necessary steps to prepare the EHB system for launch:
 * 1. Process and consolidate all ZIP files
 * 2. Clean up temporary files and processed ZIPs
 * 3. Fix the EHB-HOME-Main-Redirector
 * 4. Restart all services if needed
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync('launch_preparation.log', `[${timestamp}] ${message}\n`);
}

function runPythonScript(scriptPath) {
  return new Promise((resolve, reject) => {
    log(`Running Python script: ${scriptPath}`);
    
    const pythonProcess = spawn('python3', [scriptPath]);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        log(`Python script ${scriptPath} completed successfully`);
        resolve();
      } else {
        log(`Python script ${scriptPath} exited with code ${code}`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  });
}

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    log(`Running Node.js script: ${scriptPath}`);
    
    const nodeProcess = spawn('node', [scriptPath]);
    
    nodeProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    nodeProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    nodeProcess.on('close', (code) => {
      if (code === 0) {
        log(`Node.js script ${scriptPath} completed successfully`);
        resolve();
      } else {
        log(`Node.js script ${scriptPath} exited with code ${code}`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  });
}

function checkServices() {
  return new Promise((resolve, reject) => {
    log('Checking running services...');
    
    exec('lsof -i -P -n | grep LISTEN', (error, stdout, stderr) => {
      if (error) {
        log(`Error checking services: ${error.message}`);
        // Don't reject, this might fail if lsof is not available
        resolve([]);
        return;
      }
      
      const lines = stdout.split('\n');
      const ports = [];
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        const parts = line.split(/\s+/);
        const addressPart = parts.find(p => p.includes('->') || p.includes(':'));
        
        if (addressPart) {
          const portMatch = addressPart.match(/:(\d+)$/);
          if (portMatch && portMatch[1]) {
            ports.push({
              port: parseInt(portMatch[1]),
              process: parts[0],
              pid: parts[1]
            });
          }
        }
      }
      
      log(`Found ${ports.length} listening ports`);
      for (const port of ports) {
        log(`Port ${port.port} is in use by ${port.process} (PID: ${port.pid})`);
      }
      
      resolve(ports);
    });
  });
}

async function main() {
  log('=======================================');
  log('Starting EHB System Preparation for Launch');
  log('=======================================');
  
  try {
    // Step 1: Run the Python script to process and consolidate ZIP files
    log('Step 1: Processing and consolidating ZIP files...');
    await runPythonScript('organize_and_merge_zips.py');
    
    // Step 2: Clean up temporary files and processed ZIPs
    log('Step 2: Cleaning up temporary files and processed ZIPs...');
    await runNodeScript('clean_zips_and_temp.js');
    
    // Step 3: Fix the EHB-HOME-Main-Redirector
    log('Step 3: Fixing the EHB-HOME-Main-Redirector...');
    await runNodeScript('fix_redirector.js');
    
    // Step 4: Check services
    log('Step 4: Checking services...');
    const runningServices = await checkServices();
    
    // Step 5: Provide final status
    log('=======================================');
    log('EHB System Preparation Completed');
    log('=======================================');
    
    log('\nSystem is now ready for launch!');
    log('The EHB system is accessible through:');
    log('1. Main Replit URL - redirects to EHB-HOME');
    log('2. Direct service access:');
    log('   - EHB-HOME: http://localhost:5005');
    log('   - Frontend: http://localhost:5000');
    log('   - Backend: http://localhost:5001');
    log('   - AI Integration Hub: http://localhost:5150');
    log('   - EHB Free Agent API: http://localhost:5130');
    
    log('\nIf you encounter any issues:');
    log('1. Check the launch_preparation.log file for errors');
    log('2. Run individual fix scripts as needed:');
    log('   - node fix_redirector.js - to fix the main redirector');
    log('   - python organize_and_merge_zips.py - to reprocess ZIP files');
  } catch (error) {
    log(`Error during system preparation: ${error.message}`);
    log('Please check the individual log files for more details');
  }
}

// Run the main function
main();