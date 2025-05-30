/**
 * Polygon Worldchain Blockchain Integration
 * This script fetches the latest block from the Polygon Worldchain network
 * and logs transaction information to the EHB Dashboard.
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize Polygon Worldchain provider
const rpcUrl = process.env.POLYGONWORLDCHAINRPC_URL;
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Log file path
const logFilePath = path.join(logsDir, 'polygon-worldchain-transactions.log');

// Function to get the latest Polygon Worldchain block
async function getLatestWorldchainBlock() {
  try {
    console.log("Connecting to Polygon Worldchain network...");
    const blockNumber = await provider.getBlockNumber();
    console.log(`Latest Polygon Worldchain block number: ${blockNumber}`);
    
    // Get block details
    const block = await provider.getBlock(blockNumber);
    
    if (!block) {
      throw new Error("Failed to retrieve block details");
    }
    
    const blockInfo = {
      network: "Polygon Worldchain",
      blockNumber: block.number,
      timestamp: new Date(block.timestamp * 1000).toISOString(),
      hash: block.hash,
      parentHash: block.parentHash,
      miner: block.miner,
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
      transactionCount: block.transactions.length
    };
    
    // Log information to file
    const logEntry = `[${new Date().toISOString()}] POLYGON WORLDCHAIN BLOCK: ${JSON.stringify(blockInfo, null, 2)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    
    console.log("Block information logged to file:", logFilePath);
    
    // Return for dashboard integration
    return blockInfo;
  } catch (error) {
    const errorMsg = `Error fetching Polygon Worldchain block: ${error.message}`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ERROR: ${errorMsg}\n`);
    
    return {
      network: "Polygon Worldchain",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Function to get the latest transactions
async function getLatestWorldchainTransactions(count = 5) {
  try {
    console.log(`Fetching latest ${count} Polygon Worldchain transactions...`);
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    if (!block || !block.transactions) {
      throw new Error("Failed to retrieve block transactions");
    }
    
    const transactions = [];
    
    // Get the last 'count' transactions
    const txHashes = block.transactions.slice(-count);
    
    // Process each transaction
    for (const txHash of txHashes) {
      try {
        const tx = await provider.getTransaction(txHash);
        if (tx) {
          transactions.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to || '(Contract Creation)',
            value: ethers.formatEther(tx.value),
            gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei') + ' Gwei'
          });
        }
      } catch (txError) {
        console.warn(`Skipping transaction ${txHash} due to error: ${txError.message}`);
      }
    }
    
    // Log transactions to file
    const logEntry = `[${new Date().toISOString()}] POLYGON WORLDCHAIN TRANSACTIONS: ${JSON.stringify(transactions, null, 2)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    
    console.log(`Retrieved ${transactions.length} transactions from block ${blockNumber}`);
    return transactions;
  } catch (error) {
    const errorMsg = `Error fetching Polygon Worldchain transactions: ${error.message}`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ERROR: ${errorMsg}\n`);
    
    return {
      network: "Polygon Worldchain",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Dashboard integration function
async function updateDashboard() {
  try {
    const blockInfo = await getLatestWorldchainBlock();
    const transactions = await getLatestWorldchainTransactions();
    
    // Create a structured object for dashboard
    const dashboardData = {
      network: "Polygon Worldchain",
      timestamp: new Date().toISOString(),
      lastBlock: blockInfo,
      recentTransactions: transactions
    };
    
    // Save dashboard data to file for EHB Dashboard API integration
    const dashboardFilePath = path.join(logsDir, 'polygon-worldchain-dashboard.json');
    fs.writeFileSync(dashboardFilePath, JSON.stringify(dashboardData, null, 2));
    
    console.log("Dashboard data updated successfully at:", dashboardFilePath);
    return dashboardData;
  } catch (error) {
    console.error("Dashboard update error:", error.message);
    return { error: error.message };
  }
}

// Auto-refresh functionality (every 30 seconds)
async function startAutoRefresh(intervalSeconds = 30) {
  try {
    // Initial update
    await updateDashboard();
    
    // Set up interval for auto-refresh
    setInterval(async () => {
      try {
        await updateDashboard();
        console.log(`Auto-refreshed Polygon Worldchain data at ${new Date().toISOString()}`);
      } catch (refreshError) {
        console.error("Auto-refresh error:", refreshError.message);
      }
    }, intervalSeconds * 1000);
    
    console.log(`Auto-refresh enabled: updating every ${intervalSeconds} seconds`);
  } catch (error) {
    console.error("Failed to start auto-refresh:", error.message);
  }
}

// Run if called directly (not imported as a module)
if (require.main === module) {
  console.log("=".repeat(50));
  console.log(" POLYGON WORLDCHAIN BLOCKCHAIN INTEGRATION");
  console.log("=".repeat(50));
  
  // Run with auto-refresh
  startAutoRefresh();
}

// Export functions for module use
module.exports = {
  getLatestWorldchainBlock,
  getLatestWorldchainTransactions,
  updateDashboard,
  startAutoRefresh
};