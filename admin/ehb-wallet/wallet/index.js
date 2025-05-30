/**
 * Standard Wallet Module
 * 
 * Handles basic wallet functionality for the EHB platform
 */

// Module configuration
const config = {
  name: 'Standard Wallet',
  version: '1.0.0',
  type: 'admin-only',
  description: 'Basic wallet functionality for EHB platform'
};

// Wallet class implementation
class StandardWallet {
  constructor(userId) {
    this.userId = userId;
    this.balance = 0;
    this.transactions = [];
  }

  // Get current balance
  getBalance() {
    return this.balance;
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
  withdraw(amount, destination) {
    if (amount <= 0) {
      throw new Error('Invalid withdrawal amount');
    }
    
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    
    this.balance -= amount;
    
    // Record transaction
    const transaction = {
      type: 'withdrawal',
      amount,
      destination,
      timestamp: new Date(),
      balanceAfter: this.balance
    };
    
    this.transactions.push(transaction);
    return transaction;
  }
  
  // Get transaction history
  getTransactionHistory() {
    return this.transactions;
  }
}

// Module exports
module.exports = {
  config,
  StandardWallet,
  createWallet: (userId) => new StandardWallet(userId)
};

console.log("Module loaded: Standard Wallet System");