/**
 * EHB Blockchain API Director
 * 
 * This script starts all blockchain API integrations:
 * 1. Ethereum (ETH)
 * 2. Polygon
 * 3. Polygon Worldchain
 * 4. Binance Smart Chain (BSC)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path for this director
const logFilePath = path.join(logsDir, 'blockchain-api-director.log');

// Function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFilePath, logMessage);
}

// Function to start a script as a child process
function startScript(scriptPath, name) {
  const scriptName = path.basename(scriptPath);
  log(`Starting ${name} (${scriptName})...`);
  
  const process = spawn('node', [scriptPath], {
    detached: true,
    stdio: 'pipe'
  });
  
  process.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(`[${name}] ${output}`);
    }
  });
  
  process.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (error) {
      log(`[${name} ERROR] ${error}`);
    }
  });
  
  process.on('close', (code) => {
    log(`[${name}] Process exited with code ${code}`);
    
    // Restart the process after a delay
    setTimeout(() => {
      log(`Restarting ${name}...`);
      startScript(scriptPath, name);
    }, 5000);
  });
  
  return process;
}

// Function to log a summary of the dashboard JSON files
function logDashboardSummary() {
  try {
    const networks = [
      { name: 'Ethereum', file: 'eth-dashboard.json' },
      { name: 'Polygon', file: 'polygon-dashboard.json' },
      { name: 'Polygon Worldchain', file: 'polygon-worldchain-dashboard.json' },
      { name: 'BSC', file: 'bsc-dashboard.json' }
    ];
    
    log('\n===== BLOCKCHAIN DASHBOARD SUMMARY =====');
    
    for (const network of networks) {
      const filePath = path.join(logsDir, network.file);
      
      if (fs.existsSync(filePath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const timestamp = data.timestamp || 'Unknown';
          const blockNumber = data.lastBlock?.blockNumber || 'Unknown';
          const txCount = Array.isArray(data.recentTransactions) ? data.recentTransactions.length : 'Unknown';
          
          log(`${network.name}: Block #${blockNumber}, ${txCount} transactions, Updated: ${timestamp}`);
        } catch (error) {
          log(`${network.name}: Error reading dashboard data: ${error.message}`);
        }
      } else {
        log(`${network.name}: Dashboard data not yet available`);
      }
    }
    
    log('=========================================\n');
  } catch (error) {
    log(`Error generating dashboard summary: ${error.message}`);
  }
}

// Main function to start all blockchain API services
function startAllBlockchainAPIs() {
  log('==================================================');
  log(' STARTING EHB BLOCKCHAIN API INTEGRATION SERVICES');
  log('==================================================');
  
  // Start each blockchain API integration
  const ethProcess = startScript(path.join(__dirname, 'eth.js'), 'Ethereum');
  const polygonProcess = startScript(path.join(__dirname, 'polygon.js'), 'Polygon');
  const worldchainProcess = startScript(path.join(__dirname, 'polygon-worldchain.js'), 'Polygon Worldchain');
  const bscProcess = startScript(path.join(__dirname, 'bsc.js'), 'BSC');
  
  // Log a summary of all dashboard data every minute
  setInterval(logDashboardSummary, 60000);
  
  // Initial summary after 10 seconds (allow time for initial data)
  setTimeout(logDashboardSummary, 10000);
  
  log('All blockchain API services started successfully');
}

// Run the main function if this script is executed directly
if (require.main === module) {
  startAllBlockchainAPIs();
}

// Export for module use
module.exports = { startAllBlockchainAPIs };