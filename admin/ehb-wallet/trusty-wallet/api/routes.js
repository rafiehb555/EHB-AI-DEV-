/**
 * Trusty Wallet API Routes
 * 
 * Defines the API endpoints for trusty wallet operations with validator mechanisms
 */

const express = require('express');
const { TrustyWalletController } = require('../wallet.controller');

// Create a router
const router = express.Router();

/**
 * @route GET /api/trusty-wallet/:userId/balance
 * @description Get wallet balance for a user
 * @access Private
 */
router.get('/:userId/balance', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = TrustyWalletController.getBalance(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/:userId/deposit
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
    const result = TrustyWalletController.deposit(userId, amount, source);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/:userId/withdraw
 * @description Withdraw funds from a user's wallet
 * @access Private
 */
router.post('/:userId/withdraw', (req, res) => {
  const { userId } = req.params;
  const { amount, destination, validatorApproval } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = TrustyWalletController.withdraw(userId, amount, destination, validatorApproval);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/:userId/lock
 * @description Lock funds for validation
 * @access Private
 */
router.post('/:userId/lock', (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = TrustyWalletController.lockFunds(userId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/:userId/unlock
 * @description Unlock funds from validation
 * @access Private
 */
router.post('/:userId/unlock', (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = TrustyWalletController.unlockFunds(userId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/trusty-wallet/:userId/validator
 * @description Get validator status for a user
 * @access Private
 */
router.get('/:userId/validator', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = TrustyWalletController.getValidatorStatus(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/validator/:validatorId/fine
 * @description Apply a fine to a validator
 * @access Private (Admin)
 */
router.post('/validator/:validatorId/fine', (req, res) => {
  const { validatorId } = req.params;
  const { violationType, transactionAmount, details } = req.body;
  
  if (!violationType) {
    return res.status(400).json({ error: 'Missing violation type', success: false });
  }
  
  try {
    const result = TrustyWalletController.applyFine(validatorId, violationType, transactionAmount, details);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/validator/:validatorId/reward
 * @description Award a reward to a validator
 * @access Private (Admin)
 */
router.post('/validator/:validatorId/reward', (req, res) => {
  const { validatorId } = req.params;
  const { transactionAmount, details } = req.body;
  
  try {
    const result = TrustyWalletController.awardReward(validatorId, transactionAmount, details);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/trusty-wallet/validator/:validatorId/validate
 * @description Validate a transaction using a validator
 * @access Private
 */
router.post('/validator/:validatorId/validate', (req, res) => {
  const { validatorId } = req.params;
  const { transaction } = req.body;
  
  if (!transaction) {
    return res.status(400).json({ error: 'Missing transaction', success: false });
  }
  
  try {
    const result = TrustyWalletController.validateTransaction(validatorId, transaction);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/trusty-wallet/:userId/transactions
 * @description Get transaction history for a user
 * @access Private
 */
router.get('/:userId/transactions', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = TrustyWalletController.getTransactionHistory(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;