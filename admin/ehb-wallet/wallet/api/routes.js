/**
 * Standard Wallet API Routes
 * 
 * Defines the API endpoints for standard wallet operations
 */

const express = require('express');
const WalletController = require('../wallet.controller');

// Create a router
const router = express.Router();

/**
 * @route GET /api/wallet/:userId/balance
 * @description Get wallet balance for a user
 * @access Private
 */
router.get('/:userId/balance', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = WalletController.getBalance(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/wallet/:userId/deposit
 * @description Add funds to a user's wallet
 * @access Private
 */
router.post('/:userId/deposit', (req, res) => {
  const { userId } = req.params;
  const { amount, source } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = WalletController.deposit(userId, amount, source);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/wallet/:userId/withdraw
 * @description Withdraw funds from a user's wallet
 * @access Private
 */
router.post('/:userId/withdraw', (req, res) => {
  const { userId } = req.params;
  const { amount, destination } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = WalletController.withdraw(userId, amount, destination);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/wallet/:userId/transactions
 * @description Get transaction history for a user
 * @access Private
 */
router.get('/:userId/transactions', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = WalletController.getTransactionHistory(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/wallet/transfer
 * @description Transfer funds between users
 * @access Private
 */
router.post('/transfer', (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  if (!fromUserId || !toUserId) {
    return res.status(400).json({ error: 'Missing user IDs', success: false });
  }
  
  try {
    const result = WalletController.transfer(fromUserId, toUserId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;