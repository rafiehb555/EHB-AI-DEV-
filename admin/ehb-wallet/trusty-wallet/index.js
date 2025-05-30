/**
 * Trusty Wallet Module
 * 
 * Enhanced wallet with validator locking rules and reward logic
 */

// Module configuration
const config = {
  name: 'Trusty Wallet',
  version: '1.0.0',
  type: 'admin-only',
  description: 'Enhanced wallet with validator mechanisms'
};

// Validator class for locking rules
class Validator {
  constructor(validatorId, reputation = 100) {
    this.validatorId = validatorId;
    this.reputation = reputation;
    this.validatedTransactions = 0;
    this.failedValidations = 0;
    this.lockedAmount = 0;
    this.rewards = 0;
    this.fines = 0;
  }
  
  // Lock funds as validator stake
  lockFunds(amount) {
    if (amount <= 0) {
      throw new Error('Invalid lock amount');
    }
    
    this.lockedAmount += amount;
    return this.lockedAmount;
  }
  
  // Release locked funds
  unlockFunds(amount) {
    if (amount <= 0) {
      throw new Error('Invalid unlock amount');
    }
    
    if (amount > this.lockedAmount) {
      throw new Error('Cannot unlock more than locked amount');
    }
    
    this.lockedAmount -= amount;
    return this.lockedAmount;
  }
  
  // Process validation rewards
  awardReward(amount) {
    if (amount <= 0) {
      throw new Error('Invalid reward amount');
    }
    
    this.rewards += amount;
    this.reputation = Math.min(this.reputation + 1, 100);
    this.validatedTransactions++;
    
    return {
      validatorId: this.validatorId,
      rewards: this.rewards,
      reputation: this.reputation,
      validatedTransactions: this.validatedTransactions
    };
  }
  
  // Apply fine for failed validation
  applyFine(amount, reason) {
    if (amount <= 0) {
      throw new Error('Invalid fine amount');
    }
    
    this.fines += amount;
    this.reputation = Math.max(this.reputation - 5, 0);
    this.failedValidations++;
    
    return {
      validatorId: this.validatorId,
      fines: this.fines,
      reputation: this.reputation,
      failedValidations: this.failedValidations,
      reason
    };
  }
  
  // Get validator status
  getStatus() {
    return {
      validatorId: this.validatorId,
      reputation: this.reputation,
      lockedAmount: this.lockedAmount,
      rewards: this.rewards,
      fines: this.fines,
      validatedTransactions: this.validatedTransactions,
      failedValidations: this.failedValidations,
      isActive: this.reputation > 20 && this.lockedAmount > 0
    };
  }
}

// Trusty Wallet implementation
class TrustyWallet {
  constructor(userId) {
    this.userId = userId;
    this.balance = 0;
    this.transactions = [];
    this.lockedBalance = 0;
    this.validator = null;
  }
  
  // Get current balance (excluding locked funds)
  getBalance() {
    return this.balance;
  }
  
  // Get total balance (including locked funds)
  getTotalBalance() {
    return this.balance + this.lockedBalance;
  }
  
  // Add funds to wallet
  deposit(amount, source) {
    if (amount <= 0) {
      throw new Error('Invalid deposit amount');
    }
    
    this.balance += amount;
    
    // Record transaction
    const transaction = {
      type: 'deposit',
      amount,
      source,
      timestamp: new Date(),
      balanceAfter: this.balance
    };
    
    this.transactions.push(transaction);
    return transaction;
  }
  
  // Remove funds from wallet
  withdraw(amount, destination, validatorApproval = null) {
    if (amount <= 0) {
      throw new Error('Invalid withdrawal amount');
    }
    
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    
    // For large amounts, require validator approval
    if (amount > 1000 && !validatorApproval) {
      throw new Error('Validator approval required for large withdrawals');
    }
    
    this.balance -= amount;
    
    // Record transaction
    const transaction = {
      type: 'withdrawal',
      amount,
      destination,
      validatorApproval,
      timestamp: new Date(),
      balanceAfter: this.balance
    };
    
    this.transactions.push(transaction);
    return transaction;
  }
  
  // Lock funds (for validator stake)
  lockFunds(amount) {
    if (amount <= 0) {
      throw new Error('Invalid lock amount');
    }
    
    if (amount > this.balance) {
      throw new Error('Insufficient funds to lock');
    }
    
    this.balance -= amount;
    this.lockedBalance += amount;
    
    // Initialize validator if not already
    if (!this.validator) {
      this.validator = new Validator(this.userId);
    }
    
    this.validator.lockFunds(amount);
    
    // Record transaction
    const transaction = {
      type: 'lock',
      amount,
      timestamp: new Date(),
      balanceAfter: this.balance,
      lockedBalanceAfter: this.lockedBalance
    };
    
    this.transactions.push(transaction);
    return transaction;
  }
  
  // Unlock funds (from validator stake)
  unlockFunds(amount) {
    if (amount <= 0) {
      throw new Error('Invalid unlock amount');
    }
    
    if (amount > this.lockedBalance) {
      throw new Error('Insufficient locked funds');
    }
    
    if (!this.validator) {
      throw new Error('No validator configured for this wallet');
    }
    
    this.validator.unlockFunds(amount);
    
    this.lockedBalance -= amount;
    this.balance += amount;
    
    // Record transaction
    const transaction = {
      type: 'unlock',
      amount,
      timestamp: new Date(),
      balanceAfter: this.balance,
      lockedBalanceAfter: this.lockedBalance
    };
    
    this.transactions.push(transaction);
    return transaction;
  }
  
  // Get validator status
  getValidatorStatus() {
    if (!this.validator) {
      return null;
    }
    
    return this.validator.getStatus();
  }
  
  // Get transaction history
  getTransactionHistory() {
    return this.transactions;
  }
}

// Module exports
module.exports = {
  config,
  TrustyWallet,
  Validator,
  createWallet: (userId) => new TrustyWallet(userId),
  createValidator: (validatorId, reputation) => new Validator(validatorId, reputation)
};

console.log("Module loaded: Trusty Wallet System with Validator Rules");