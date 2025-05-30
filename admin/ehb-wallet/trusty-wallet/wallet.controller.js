/**
 * Trusty Wallet Controller
 * 
 * Handles business logic for trusty wallet operations with validator locking rules & fine engine
 */

const { TrustyWallet, Validator } = require('./index');

// In-memory wallet store (would be replaced with database in production)
const walletStore = new Map();
const validatorStore = new Map();

/**
 * Get or create a wallet for a user
 * @param {string} userId - The user ID
 * @returns {TrustyWallet} - The user's wallet
 */
function getUserWallet(userId) {
  if (!walletStore.has(userId)) {
    walletStore.set(userId, new TrustyWallet(userId));
  }
  
  return walletStore.get(userId);
}

/**
 * Get or create a validator for a user
 * @param {string} validatorId - The validator ID
 * @param {number} reputation - Initial reputation (optional)
 * @returns {Validator} - The validator
 */
function getValidator(validatorId, reputation) {
  if (!validatorStore.has(validatorId)) {
    validatorStore.set(validatorId, new Validator(validatorId, reputation));
  }
  
  return validatorStore.get(validatorId);
}

// Fine Engine implementation
const FineEngine = {
  /**
   * Calculate fine amount based on violation type and transaction amount
   * @param {string} violationType - The type of violation
   * @param {number} transactionAmount - The original transaction amount
   * @returns {number} - The calculated fine amount
   */
  calculateFine: (violationType, transactionAmount = 0) => {
    const baseFines = {
      'unauthorized_access': 50,
      'double_spend_attempt': 100,
      'invalid_validation': 75,
      'transaction_manipulation': 200,
      'delayed_validation': 25
    };
    
    const fineAmount = baseFines[violationType] || 50;
    
    // For transaction-related violations, add a percentage of the transaction amount
    if (transactionAmount > 0 && ['double_spend_attempt', 'transaction_manipulation'].includes(violationType)) {
      fineAmount += transactionAmount * 0.05; // 5% of transaction amount
    }
    
    return fineAmount;
  },
  
  /**
   * Apply a fine to a validator
   * @param {string} validatorId - The validator ID
   * @param {string} violationType - The type of violation
   * @param {number} transactionAmount - The original transaction amount (optional)
   * @param {string} details - Additional details about the violation (optional)
   * @returns {Object} - The fine result
   */
  applyFine: (validatorId, violationType, transactionAmount = 0, details = '') => {
    try {
      const validator = getValidator(validatorId);
      
      const fineAmount = FineEngine.calculateFine(violationType, transactionAmount);
      const reason = `${violationType}${details ? ': ' + details : ''}`;
      
      const fineResult = validator.applyFine(fineAmount, reason);
      
      return {
        validatorId,
        violationType,
        fineAmount,
        reason,
        result: fineResult,
        success: true
      };
    } catch (error) {
      return {
        validatorId,
        violationType,
        error: error.message,
        success: false
      };
    }
  }
};

// Reward System implementation
const RewardSystem = {
  /**
   * Calculate reward amount based on validator reputation and transaction amount
   * @param {number} reputation - The validator's reputation
   * @param {number} transactionAmount - The validated transaction amount
   * @returns {number} - The calculated reward amount
   */
  calculateReward: (reputation, transactionAmount = 0) => {
    // Base reward based on reputation
    let baseReward = 5 + (reputation / 20); // 5-10 based on reputation
    
    // Additional reward for larger transactions
    if (transactionAmount > 0) {
      baseReward += Math.min(transactionAmount * 0.001, 20); // Up to 20 additional reward
    }
    
    return baseReward;
  },
  
  /**
   * Award a reward to a validator
   * @param {string} validatorId - The validator ID
   * @param {number} transactionAmount - The validated transaction amount (optional)
   * @param {string} details - Additional details about the validation (optional)
   * @returns {Object} - The reward result
   */
  awardReward: (validatorId, transactionAmount = 0, details = '') => {
    try {
      const validator = getValidator(validatorId);
      
      const rewardAmount = RewardSystem.calculateReward(validator.reputation, transactionAmount);
      
      const rewardResult = validator.awardReward(rewardAmount);
      
      return {
        validatorId,
        rewardAmount,
        details,
        result: rewardResult,
        success: true
      };
    } catch (error) {
      return {
        validatorId,
        error: error.message,
        success: false
      };
    }
  }
};

// Trusty Wallet Controller
const TrustyWalletController = {
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
      totalBalance: wallet.getTotalBalance(),
      lockedBalance: wallet.lockedBalance,
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
   * @param {string} validatorApproval - Optional validator approval for large withdrawals
   * @returns {Object} - Transaction information
   */
  withdraw: (userId, amount, destination, validatorApproval = null) => {
    try {
      const wallet = getUserWallet(userId);
      const transaction = wallet.withdraw(amount, destination, validatorApproval);
      
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
   * Lock funds in the wallet for validation
   * @param {string} userId - The user ID
   * @param {number} amount - The amount to lock
   * @returns {Object} - Transaction information
   */
  lockFunds: (userId, amount) => {
    try {
      const wallet = getUserWallet(userId);
      const transaction = wallet.lockFunds(amount);
      
      return {
        userId,
        transaction,
        validatorStatus: wallet.getValidatorStatus(),
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
   * Unlock funds from the wallet
   * @param {string} userId - The user ID
   * @param {number} amount - The amount to unlock
   * @returns {Object} - Transaction information
   */
  unlockFunds: (userId, amount) => {
    try {
      const wallet = getUserWallet(userId);
      const transaction = wallet.unlockFunds(amount);
      
      return {
        userId,
        transaction,
        validatorStatus: wallet.getValidatorStatus(),
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
   * Get validator status for a user
   * @param {string} userId - The user ID
   * @returns {Object} - Validator status
   */
  getValidatorStatus: (userId) => {
    const wallet = getUserWallet(userId);
    const status = wallet.getValidatorStatus();
    
    return {
      userId,
      validatorStatus: status,
      success: true
    };
  },
  
  /**
   * Apply a fine to a validator
   * @param {string} validatorId - The validator ID
   * @param {string} violationType - The type of violation
   * @param {number} transactionAmount - The original transaction amount (optional)
   * @param {string} details - Additional details about the violation (optional)
   * @returns {Object} - The fine result
   */
  applyFine: (validatorId, violationType, transactionAmount, details) => {
    return FineEngine.applyFine(validatorId, violationType, transactionAmount, details);
  },
  
  /**
   * Award a reward to a validator
   * @param {string} validatorId - The validator ID
   * @param {number} transactionAmount - The validated transaction amount (optional)
   * @param {string} details - Additional details about the validation (optional)
   * @returns {Object} - The reward result
   */
  awardReward: (validatorId, transactionAmount, details) => {
    return RewardSystem.awardReward(validatorId, transactionAmount, details);
  },
  
  /**
   * Validate a transaction using a validator
   * @param {string} validatorId - The validator ID
   * @param {Object} transaction - The transaction to validate
   * @returns {Object} - Validation result
   */
  validateTransaction: (validatorId, transaction) => {
    try {
      const validator = getValidator(validatorId);
      
      // Skip validation if validator is not active
      if (validator.reputation < 20 || !validator.lockedAmount) {
        throw new Error('Validator is not active');
      }
      
      // Simple validation logic (would be more complex in production)
      const isValid = transaction && 
                      transaction.amount > 0 && 
                      transaction.type && 
                      (transaction.source || transaction.destination);
      
      if (isValid) {
        // Award reward for successful validation
        const reward = RewardSystem.awardReward(
          validatorId, 
          transaction.amount, 
          `Validated ${transaction.type} transaction`
        );
        
        return {
          validatorId,
          transaction,
          validationResult: true,
          reward,
          success: true
        };
      } else {
        // Apply fine for invalid validation
        const fine = FineEngine.applyFine(
          validatorId, 
          'invalid_validation', 
          transaction?.amount || 0,
          'Failed to validate transaction'
        );
        
        return {
          validatorId,
          transaction,
          validationResult: false,
          fine,
          success: false
        };
      }
    } catch (error) {
      return {
        validatorId,
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
  }
};

module.exports = {
  TrustyWalletController,
  FineEngine,
  RewardSystem
};