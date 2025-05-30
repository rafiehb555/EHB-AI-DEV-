/**
 * EHB Shared Web3 Client
 * 
 * This module provides a centralized Web3 client that can be used
 * across different services in the EHB ecosystem. It handles initialization,
 * blockchain interactions, and common operations for Ethereum-compatible networks.
 * 
 * @version 1.0.0
 * @date 2025-05-13
 */

const { ethers } = require('ethers');

// Configuration
const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';
const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc';
const PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY;
const DEBUG = process.env.NODE_ENV !== 'production';

// Network configurations
const NETWORKS = {
  ethereum: {
    name: 'Ethereum Mainnet',
    rpcUrl: ETH_RPC_URL,
    chainId: 1,
    blockExplorer: 'https://etherscan.io',
    symbol: 'ETH',
    decimals: 18
  },
  bsc: {
    name: 'Binance Smart Chain',
    rpcUrl: BSC_RPC_URL,
    chainId: 56,
    blockExplorer: 'https://bscscan.com',
    symbol: 'BNB',
    decimals: 18
  },
  polygon: {
    name: 'Polygon (Matic)',
    rpcUrl: POLYGON_RPC_URL,
    chainId: 137,
    blockExplorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    decimals: 18
  },
  avalanche: {
    name: 'Avalanche',
    rpcUrl: AVALANCHE_RPC_URL,
    chainId: 43114,
    blockExplorer: 'https://snowtrace.io',
    symbol: 'AVAX',
    decimals: 18
  }
};

// Singleton instances
const providers = {};
const signers = {};

/**
 * Get or initialize the Web3 provider for a specific network
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @returns {ethers.providers.JsonRpcProvider} Provider instance
 */
function getProvider(network = 'ethereum') {
  if (!providers[network]) {
    const networkConfig = NETWORKS[network];
    
    if (!networkConfig) {
      throw new Error(`Unknown network: ${network}`);
    }
    
    try {
      providers[network] = new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl);
      console.log(`Web3 provider initialized for ${networkConfig.name}`);
    } catch (error) {
      console.error(`Error initializing Web3 provider for ${network}:`, error);
      throw error;
    }
  }
  
  return providers[network];
}

/**
 * Get or initialize a signer for a specific network
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @param {string} privateKey Private key (optional, uses ETHEREUM_PRIVATE_KEY env var if not provided)
 * @returns {ethers.Wallet} Signer instance
 */
function getSigner(network = 'ethereum', privateKey = PRIVATE_KEY) {
  if (!signers[network]) {
    if (!privateKey) {
      console.warn(`No private key provided for ${network}. Creating read-only signer.`);
      return null;
    }
    
    try {
      const provider = getProvider(network);
      signers[network] = new ethers.Wallet(privateKey, provider);
      console.log(`Web3 signer initialized for ${NETWORKS[network].name}`);
    } catch (error) {
      console.error(`Error initializing Web3 signer for ${network}:`, error);
      throw error;
    }
  }
  
  return signers[network];
}

/**
 * Test the Web3 connection to a specific network
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @returns {Promise<Object>} Connection test results
 */
async function testConnection(network = 'ethereum') {
  try {
    const networkConfig = NETWORKS[network];
    
    if (!networkConfig) {
      return {
        connected: false,
        error: `Unknown network: ${network}`,
      };
    }
    
    const provider = getProvider(network);
    
    // Try to get the latest block
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    
    // Get gas price
    const gasPrice = await provider.getGasPrice();
    
    return {
      connected: true,
      network: networkConfig.name,
      chainId: networkConfig.chainId,
      blockNumber,
      timestamp: new Date(block.timestamp * 1000).toISOString(),
      gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei') + ' Gwei',
      blockExplorer: networkConfig.blockExplorer
    };
  } catch (error) {
    console.error(`Error testing Web3 connection for ${network}:`, error);
    return {
      connected: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Connection error'
    };
  }
}

/**
 * Get token balance for an address
 * @param {string} address Wallet address
 * @param {string} tokenAddress Token contract address (optional, for ERC20 tokens)
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @returns {Promise<Object>} Balance information
 */
async function getBalance(address, tokenAddress = null, network = 'ethereum') {
  try {
    if (!address) {
      throw new Error('Wallet address is required');
    }
    
    const provider = getProvider(network);
    const networkConfig = NETWORKS[network];
    
    if (tokenAddress) {
      // ERC20 token balance
      const abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)'
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
      
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.decimals(),
        tokenContract.symbol()
      ]);
      
      return {
        success: true,
        address,
        token: tokenAddress,
        balance: ethers.utils.formatUnits(balance, decimals),
        symbol,
        decimals,
        network: networkConfig.name
      };
    } else {
      // Native token balance
      const balance = await provider.getBalance(address);
      
      return {
        success: true,
        address,
        balance: ethers.utils.formatUnits(balance, networkConfig.decimals),
        symbol: networkConfig.symbol,
        decimals: networkConfig.decimals,
        network: networkConfig.name
      };
    }
  } catch (error) {
    console.error('Error getting balance:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error getting balance'
    };
  }
}

/**
 * Send a transaction
 * @param {Object} options Transaction options
 * @param {string} options.to Recipient address
 * @param {string|number} options.value Amount to send (in ETH/BNB/etc)
 * @param {string} options.network Network name (ethereum, bsc, polygon, avalanche)
 * @param {string} options.privateKey Private key (optional, uses ETHEREUM_PRIVATE_KEY env var if not provided)
 * @returns {Promise<Object>} Transaction result
 */
async function sendTransaction(options) {
  try {
    const { 
      to, 
      value,
      data = '0x',
      gasLimit = 21000,
      network = 'ethereum',
      privateKey = PRIVATE_KEY
    } = options;
    
    if (!to) {
      throw new Error('Recipient address is required');
    }
    
    if (value === undefined || value === null) {
      throw new Error('Amount is required');
    }
    
    if (!privateKey) {
      throw new Error('Private key is required. Set ETHEREUM_PRIVATE_KEY or provide privateKey option.');
    }
    
    const networkConfig = NETWORKS[network];
    const provider = getProvider(network);
    const signer = new ethers.Wallet(privateKey, provider);
    
    const valueWei = ethers.utils.parseUnits(value.toString(), networkConfig.decimals);
    
    const tx = await signer.sendTransaction({
      to,
      value: valueWei,
      data,
      gasLimit
    });
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      value: ethers.utils.formatUnits(valueWei, networkConfig.decimals),
      symbol: networkConfig.symbol,
      gasUsed: receipt.gasUsed.toString(),
      txUrl: `${networkConfig.blockExplorer}/tx/${receipt.transactionHash}`
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error sending transaction'
    };
  }
}

/**
 * Deploy a smart contract
 * @param {Object} options Deployment options
 * @param {string} options.abi Contract ABI
 * @param {string} options.bytecode Contract bytecode
 * @param {Array} options.args Constructor arguments
 * @param {string} options.network Network name (ethereum, bsc, polygon, avalanche)
 * @param {string} options.privateKey Private key (optional, uses ETHEREUM_PRIVATE_KEY env var if not provided)
 * @returns {Promise<Object>} Deployment result
 */
async function deployContract(options) {
  try {
    const { 
      abi, 
      bytecode,
      args = [],
      network = 'ethereum',
      privateKey = PRIVATE_KEY
    } = options;
    
    if (!abi) {
      throw new Error('Contract ABI is required');
    }
    
    if (!bytecode) {
      throw new Error('Contract bytecode is required');
    }
    
    if (!privateKey) {
      throw new Error('Private key is required. Set ETHEREUM_PRIVATE_KEY or provide privateKey option.');
    }
    
    const networkConfig = NETWORKS[network];
    const provider = getProvider(network);
    const signer = new ethers.Wallet(privateKey, provider);
    
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    
    // Wait for deployment
    await contract.deployed();
    
    // Get deployment transaction receipt
    const receipt = await provider.getTransactionReceipt(contract.deployTransaction.hash);
    
    return {
      success: true,
      address: contract.address,
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      network: networkConfig.name,
      contractUrl: `${networkConfig.blockExplorer}/address/${contract.address}`
    };
  } catch (error) {
    console.error('Error deploying contract:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error deploying contract'
    };
  }
}

/**
 * Create a contract instance for interacting with a deployed contract
 * @param {string} address Contract address
 * @param {string|Array} abi Contract ABI
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @param {string} privateKey Private key for signing (optional)
 * @returns {ethers.Contract} Contract instance
 */
function getContract(address, abi, network = 'ethereum', privateKey = null) {
  if (!address) {
    throw new Error('Contract address is required');
  }
  
  if (!abi) {
    throw new Error('Contract ABI is required');
  }
  
  const provider = getProvider(network);
  
  if (privateKey) {
    const signer = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(address, abi, signer);
  }
  
  return new ethers.Contract(address, abi, provider);
}

/**
 * Create a new wallet
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @returns {Object} Wallet information
 */
function createWallet(network = 'ethereum') {
  try {
    const networkConfig = NETWORKS[network];
    
    if (!networkConfig) {
      throw new Error(`Unknown network: ${network}`);
    }
    
    const wallet = ethers.Wallet.createRandom();
    
    return {
      success: true,
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
      network: networkConfig.name,
      warning: 'Keep your private key and mnemonic secure! Anyone with access to them can control your funds.'
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Error creating wallet'
    };
  }
}

/**
 * Get available networks
 * @returns {Object} Network configurations
 */
function getNetworks() {
  return NETWORKS;
}

/**
 * Get network configuration details
 * @param {string} network Network name (ethereum, bsc, polygon, avalanche)
 * @returns {Object} Network configuration
 */
function getNetworkConfig(network = 'ethereum') {
  const networkConfig = NETWORKS[network];
  
  if (!networkConfig) {
    console.warn(`Unknown network: ${network}`);
    return null;
  }
  
  return { ...networkConfig };
}

// Export the Web3 interface
module.exports = {
  getProvider,
  getSigner,
  testConnection,
  getBalance,
  sendTransaction,
  deployContract,
  getContract,
  createWallet,
  getNetworks,
  getNetworkConfig,
  ethers
};