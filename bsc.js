/**
 * Binance Smart Chain (BSC) Blockchain Integration
 * This script fetches the latest block from the BSC network using Viem
 * and logs transaction information to the EHB Dashboard.
 */

require('dotenv').config();
const { createPublicClient, http } = require('viem');
const { bsc } = require('viem/chains');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize BSC provider with viem
const rpcUrl = process.env.BSCRPCURL;
const client = createPublicClient({
  chain: bsc,
  transport: http(rpcUrl)
});

// Log file path
const logFilePath = path.join(logsDir, 'bsc-transactions.log');

// Function to format BN to string
function formatBigInt(value) {
  return value.toString();
}

// Function to get the latest BSC block
async function getLatestBscBlock() {
  try {
    console.log("Connecting to BSC network...");
    const blockNumber = await client.getBlockNumber();
    console.log(`Latest BSC block number: ${blockNumber}`);
    
    // Get block details
    const block = await client.getBlock({ 
      blockNumber, 
      includeTransactions: true 
    });
    
    if (!block) {
      throw new Error("Failed to retrieve block details");
    }
    
    const blockInfo = {
      network: "BSC",
      blockNumber: formatBigInt(block.number),
      timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
      hash: block.hash,
      parentHash: block.parentHash,
      miner: block.miner,
      gasUsed: formatBigInt(block.gasUsed),
      gasLimit: formatBigInt(block.gasLimit),
      transactionCount: block.transactions.length
    };
    
    // Log information to file
    const logEntry = `[${new Date().toISOString()}] BSC BLOCK: ${JSON.stringify(blockInfo, null, 2)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    
    console.log("Block information logged to file:", logFilePath);
    
    // Return for dashboard integration
    return blockInfo;
  } catch (error) {
    const errorMsg = `Error fetching BSC block: ${error.message}`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ERROR: ${errorMsg}\n`);
    
    return {
      network: "BSC",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Function to format viem formatted transaction
function formatTransaction(tx) {
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to || '(Contract Creation)',
    value: formatBigInt(tx.value),
    gasPrice: tx.gasPrice ? formatBigInt(tx.gasPrice) : 'N/A'
  };
}

// Function to get the latest transactions
async function getLatestBscTransactions(count = 5) {
  try {
    console.log(`Fetching latest ${count} BSC transactions...`);
    const blockNumber = await client.getBlockNumber();
    
    // Get block with transactions
    const block = await client.getBlock({ 
      blockNumber, 
      includeTransactions: true 
    });
    
    if (!block || !block.transactions) {
      throw new Error("Failed to retrieve block transactions");
    }
    
    // Get the last 'count' transactions
    const transactions = block.transactions
      .slice(-count)
      .map(formatTransaction);
    
    // Log transactions to file
    const logEntry = `[${new Date().toISOString()}] BSC TRANSACTIONS: ${JSON.stringify(transactions, null, 2)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    
    console.log(`Retrieved ${transactions.length} transactions from block ${formatBigInt(blockNumber)}`);
    return transactions;
  } catch (error) {
    const errorMsg = `Error fetching BSC transactions: ${error.message}`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] ERROR: ${errorMsg}\n`);
    
    return {
      network: "BSC",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Dashboard integration function
async function updateDashboard() {
  try {
    const blockInfo = await getLatestBscBlock();
    const transactions = await getLatestBscTransactions();
    
    // Create a structured object for dashboard
    const dashboardData = {
      network: "BSC",
      timestamp: new Date().toISOString(),
      lastBlock: blockInfo,
      recentTransactions: transactions
    };
    
    // Save dashboard data to file for EHB Dashboard API integration
    const dashboardFilePath = path.join(logsDir, 'bsc-dashboard.json');
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
        console.log(`Auto-refreshed BSC data at ${new Date().toISOString()}`);
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
  console.log(" BINANCE SMART CHAIN (BSC) BLOCKCHAIN INTEGRATION");
  console.log("=".repeat(50));
  
  // Run with auto-refresh
  startAutoRefresh();
}

// Export functions for module use
module.exports = {
  getLatestBscBlock,
  getLatestBscTransactions,
  updateDashboard,
  startAutoRefresh
};