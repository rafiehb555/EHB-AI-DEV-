/**
 * Standard Wallet Controller
 * 
 * Handles business logic for standard wallet operations
 */

const StandardWallet = require('./index').StandardWallet;

// In-memory wallet store (would be replaced with database in production)
const walletStore = new Map();

/**
 * Get or create a wallet for a user
 * @param {string} userId - The user ID
 * @returns {StandardWallet} - The user's wallet
 */
function getUserWallet(userId) {
  if (!walletStore.has(userId)) {
    walletStore.set(userId, new StandardWallet(userId));
  }
  
  return walletStore.get(userId);
}

// Wallet Controller
const WalletController = {
  /**
   * Get wallet balance for a user
   * @param {string} userId - The user ID
   * @returns {Object} - Wallet balance information
   */
  getBalance: (userId) => {
    const wallet = getUserWallet(userId);
    
    return {
      userId,
      balance: wallet.getBalance(),
      success: true
    };
  },
  
  /**
   * Add funds to a user's wallet
   * @param {string} userId - The user ID
   * @param {number} amount - The amount to deposit
   * @param {string} source - The source of the funds
   * @returns {Object} - Transaction information
   */
  deposit: (userId, amount, source) => {
    try {
      const wallet = getUserWallet(userId);
      const transaction = wallet.deposit(amount, source);
      
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
   * Withdraw funds from a user's wallet
   * @param {string} userId - The user ID
   * @param {number} amount - The amount to withdraw
   * @param {string} destination - The destination for the funds
   * @returns {Object} - Transaction information
   */
  withdraw: (userId, amount, destination) => {
    try {
      const wallet = getUserWallet(userId);
      const transaction = wallet.withdraw(amount, destination);
      
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
   * Transfer funds between users
   * @param {string} fromUserId - The sender user ID
   * @param {string} toUserId - The recipient user ID
   * @param {number} amount - The amount to transfer
   * @returns {Object} - Transfer information
   */
  transfer: (fromUserId, toUserId, amount) => {
    try {
      const fromWallet = getUserWallet(fromUserId);
      const toWallet = getUserWallet(toUserId);
      
      // Withdraw from sender
      const withdrawalTransaction = fromWallet.withdraw(amount, `Transfer to ${toUserId}`);
      
      // Deposit to recipient
      const depositTransaction = toWallet.deposit(amount, `Transfer from ${fromUserId}`);
      
      return {
        fromUserId,
        toUserId,
        amount,
        withdrawalTransaction,
        depositTransaction,
        success: true
      };
    } catch (error) {
      return {
        fromUserId,
        toUserId,
        amount,
        error: error.message,
        success: false
      };
    }
  }
};

module.exports = WalletController;