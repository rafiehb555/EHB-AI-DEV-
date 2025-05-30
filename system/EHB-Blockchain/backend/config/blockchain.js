const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');
const { Alchemy, Network } = require('alchemy-sdk');
const Web3 = require('web3');

// Track which blockchain services are available
const availableServices = {};

// Moralis Configuration
let moralisInitialized = false;
try {
  if (process.env.MORALIS_API_KEY) {
    // Initialize Moralis
    Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    }).then(() => {
      console.log('Moralis initialized successfully');
      availableServices.moralis = true;
      moralisInitialized = true;
    }).catch(error => {
      console.error('Error initializing Moralis:', error.message);
    });
  } else {
    console.log('Moralis API key not found, related services will not be available');
  }
} catch (error) {
  console.error('Error configuring Moralis:', error.message);
}

// Alchemy Configuration
let alchemySdk = null;
try {
  if (process.env.ALCHEMY_API_KEY) {
    const settings = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: process.env.ALCHEMY_NETWORK || Network.ETH_MAINNET,
    };
    alchemySdk = new Alchemy(settings);
    availableServices.alchemy = true;
    console.log('Alchemy SDK initialized successfully');
  } else {
    console.log('Alchemy API key not found, related services will not be available');
  }
} catch (error) {
  console.error('Error initializing Alchemy SDK:', error.message);
}

// Web3 Configuration
let web3 = null;
try {
  if (process.env.INFURA_API_KEY) {
    const providerUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    availableServices.web3 = true;
    console.log('Web3 initialized with Infura successfully');
  } else if (process.env.ALCHEMY_API_KEY) {
    // Use Alchemy as fallback if Infura is not available
    const providerUrl = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
    web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    availableServices.web3 = true;
    console.log('Web3 initialized with Alchemy successfully');
  } else {
    console.log('Neither Infura nor Alchemy API keys found, Web3 services will not be available');
  }
} catch (error) {
  console.error('Error initializing Web3:', error.message);
}

// BSC Configuration
let bscWeb3 = null;
try {
  if (process.env.BSC_NODE_URL) {
    bscWeb3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NODE_URL));
    availableServices.bsc = true;
    console.log('BSC Web3 initialized successfully');
  } else {
    console.log('BSC node URL not found, BSC services will not be available');
  }
} catch (error) {
  console.error('Error initializing BSC Web3:', error.message);
}

// Polkadot Configuration
let polkadotApiPromise = null;
try {
  if (process.env.POLKADOT_NODE_URL) {
    // Polkadot.js API would be initialized here
    // We're just setting a flag for demonstration
    availableServices.polkadot = false;
    console.log('Polkadot API configuration would be initialized here');
  } else {
    console.log('Polkadot node URL not found, Polkadot services will not be available');
  }
} catch (error) {
  console.error('Error initializing Polkadot API:', error.message);
}

// Log available services
console.log('Available blockchain services:', Object.keys(availableServices).join(', ') || 'None');

// Helper function to get chain by name (for Moralis)
const getChain = (chainName) => {
  const chains = {
    ethereum: EvmChain.ETHEREUM,
    polygon: EvmChain.POLYGON,
    bsc: EvmChain.BSC,
    avalanche: EvmChain.AVALANCHE,
    fantom: EvmChain.FANTOM,
    cronos: EvmChain.CRONOS,
  };
  
  return chains[chainName.toLowerCase()] || EvmChain.ETHEREUM;
};

module.exports = {
  Moralis,
  moralisInitialized,
  alchemySdk,
  web3,
  bscWeb3,
  polkadotApiPromise,
  getChain,
  availableServices
};