/**
 * Crypto Wallet Controller
 * 
 * Handles business logic for cryptocurrency wallet operations with ERC20/BEP20 support
 */

const { CryptoWallet, AddressValidator, TokenTransfer } = require('./index');

// In-memory wallet store (would be replaced with database in production)
const walletStore = new Map();

/**
 * Get or create a wallet for a user
 * @param {string} userId - The user ID
 * @returns {CryptoWallet} - The user's crypto wallet
 */
function getUserWallet(userId) {
  if (!walletStore.has(userId)) {
    walletStore.set(userId, new CryptoWallet(userId));
  }
  
  return walletStore.get(userId);
}

// Sample token data (would be fetched from blockchain API in production)
const sampleTokens = {
  // ERC20 Tokens (Ethereum)
  'erc20_tokens': [
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6
    }
  ],
  // BEP20 Tokens (Binance Smart Chain)
  'bep20_tokens': [
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      symbol: 'BUSD',
      name: 'Binance USD',
      decimals: 18
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      name: 'Tether USD (BSC)',
      decimals: 18
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      name: 'USD Coin (BSC)',
      decimals: 18
    }
  ]
};

// Crypto Wallet Controller
const CryptoWalletController = {
  /**
   * Validate a cryptocurrency address
   * @param {string} address - The address to validate
   * @param {string} type - The token type ('ERC20' or 'BEP20')
   * @returns {Object} - Validation result
   */
  validateAddress: (address, type) => {
    try {
      const isValid = AddressValidator.validateAddress(address, type);
      
      return {
        address,
        type,
        isValid,
        success: true
      };
    } catch (error) {
      return {
        address,
        type,
        error: error.message,
        isValid: false,
        success: false
      };
    }
  },
  
  /**
   * Set a blockchain address for a user's wallet
   * @param {string} userId - The user ID
   * @param {string} type - The blockchain/token type ('ERC20' or 'BEP20')
   * @param {string} address - The address to set (optional)
   * @returns {Object} - The set address
   */
  setAddress: (userId, type, address = null) => {
    try {
      const wallet = getUserWallet(userId);
      
      // If address is provided, validate it first
      if (address) {
        const isValid = AddressValidator.validateAddress(address, type);
        
        if (!isValid) {
          throw new Error(`Invalid ${type} address format`);
        }
      }
      
      const setAddress = wallet.setAddress(type, address);
      
      return {
        userId,
        type,
        address: setAddress,
        success: true
      };
    } catch (error) {
      return {
        userId,
        type,
        error: error.message,
        success: false
      };
    }
  },
  
  /**
   * Get all addresses for a user's wallet
   * @param {string} userId - The user ID
   * @returns {Object} - The user's addresses
   */
  getAddresses: (userId) => {
    const wallet = getUserWallet(userId);
    
    return {
      userId,
      addresses: wallet.getAddresses(),
      success: true
    };
  },
  
  /**
   * Add a token to a user's wallet
   * @param {string} userId - The user ID
   * @param {string} tokenAddress - The token contract address
   * @param {string} type - The token type ('ERC20' or 'BEP20')
   * @param {string} symbol - The token symbol
   * @returns {Object} - The added token
   */
  addToken: (userId, tokenAddress, type, symbol) => {
    try {
      const wallet = getUserWallet(userId);
      
      // Validate token address
      const isValid = AddressValidator.validateAddress(tokenAddress, type);
      
      if (!isValid) {
        throw new Error(`Invalid ${type} token address format`);
      }
      
      const token = wallet.addToken(tokenAddress, type, symbol);
      
      return {
        userId,
        token,
        success: true
      };
    } catch (error) {
      return {
        userId,
        error: error.message,
        success: false
      };
    }
  },
  
  /**
   * Update token balance
   * @param {string} userId - The user ID
   * @param {string} tokenAddress - The token contract address
   * @param {string} balance - The new balance
   * @returns {Object} - The updated token
   */
  updateTokenBalance: (userId, tokenAddress, balance) => {
    try {
      const wallet = getUserWallet(userId);
      const token = wallet.updateTokenBalance(tokenAddress, balance);
      
      return {
        userId,
        token,
        success: true
      };
    } catch (error) {
      return {
        userId,
        error: error.message,
        success: false
      };
    }
  },
  
  /**
   * Create a token transfer transaction
   * @param {string} userId - The user ID
   * @param {string} tokenAddress - The token contract address
   * @param {string} toAddress - The recipient address
   * @param {number} amount - The amount to transfer
   * @returns {Object} - The transaction information
   */
  createTransfer: (userId, tokenAddress, toAddress, amount) => {
    try {
      const wallet = getUserWallet(userId);
      
      // Ensure the wallet has a balance for this token
      if (!wallet.balances[tokenAddress]) {
        throw new Error('Token not found in wallet');
      }
      
      // Validate recipient address
      const tokenType = wallet.balances[tokenAddress].type;
      const isValid = AddressValidator.validateAddress(toAddress, tokenType);
      
      if (!isValid) {
        throw new Error(`Invalid recipient ${tokenType} address`);
      }
      
      const transaction = wallet.createTransfer(tokenAddress, toAddress, amount);
      
      return {
        userId,
        transaction,
        success: true
      };
    } catch (error) {
      return {
        userId,
        error: error.message,
        success: false
      };
    }
  },
  
  /**
   * Get all token balances for a user
   * @param {string} userId - The user ID
   * @returns {Object} - The user's token balances
   */
  getBalances: (userId) => {
    const wallet = getUserWallet(userId);
    
    return {
      userId,
      balances: wallet.getBalances(),
      success: true
    };
  },
  
  /**
   * Get transaction history for a user
   * @param {string} userId - The user ID
   * @returns {Object} - Transaction history
   */
  getTransactionHistory: (userId) => {
    const wallet = getUserWallet(userId);
    
    return {
      userId,
      transactions: wallet.getTransactionHistory(),
      success: true
    };
  },
  
  /**
   * Get available tokens for a blockchain
   * @param {string} type - The blockchain/token type ('ERC20' or 'BEP20')
   * @returns {Object} - List of available tokens
   */
  getAvailableTokens: (type) => {
    try {
      const tokenType = type.toLowerCase() === 'erc20' ? 'erc20_tokens' : 'bep20_tokens';
      
      if (!sampleTokens[tokenType]) {
        throw new Error(`Invalid token type: ${type}`);
      }
      
      return {
        type,
        tokens: sampleTokens[tokenType],
        success: true
      };
    } catch (error) {
      return {
        type,
        error: error.message,
        success: false
      };
    }
  }
};

module.exports = CryptoWalletController;