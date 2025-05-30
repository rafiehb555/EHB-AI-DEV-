/**
 * Crypto Wallet API Routes
 * 
 * Defines the API endpoints for cryptocurrency wallet operations with ERC20/BEP20 support
 */

const express = require('express');
const CryptoWalletController = require('../wallet.controller');

// Create a router
const router = express.Router();

/**
 * @route POST /api/crypto-wallet/validate-address
 * @description Validate a cryptocurrency address
 * @access Public
 */
router.post('/validate-address', (req, res) => {
  const { address, type } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Missing address', success: false });
  }
  
  if (!type || !['ERC20', 'BEP20'].includes(type.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid or missing type', success: false });
  }
  
  try {
    const result = CryptoWalletController.validateAddress(address, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/crypto-wallet/:userId/set-address
 * @description Set a blockchain address for a user's wallet
 * @access Private
 */
router.post('/:userId/set-address', (req, res) => {
  const { userId } = req.params;
  const { type, address } = req.body;
  
  if (!type || !['ERC20', 'BEP20'].includes(type.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid or missing type', success: false });
  }
  
  try {
    const result = CryptoWalletController.setAddress(userId, type, address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/crypto-wallet/:userId/addresses
 * @description Get all addresses for a user's wallet
 * @access Private
 */
router.get('/:userId/addresses', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = CryptoWalletController.getAddresses(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/crypto-wallet/:userId/add-token
 * @description Add a token to a user's wallet
 * @access Private
 */
router.post('/:userId/add-token', (req, res) => {
  const { userId } = req.params;
  const { tokenAddress, type, symbol } = req.body;
  
  if (!tokenAddress) {
    return res.status(400).json({ error: 'Missing token address', success: false });
  }
  
  if (!type || !['ERC20', 'BEP20'].includes(type.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid or missing type', success: false });
  }
  
  if (!symbol) {
    return res.status(400).json({ error: 'Missing token symbol', success: false });
  }
  
  try {
    const result = CryptoWalletController.addToken(userId, tokenAddress, type, symbol);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/crypto-wallet/:userId/update-balance
 * @description Update token balance
 * @access Private
 */
router.post('/:userId/update-balance', (req, res) => {
  const { userId } = req.params;
  const { tokenAddress, balance } = req.body;
  
  if (!tokenAddress) {
    return res.status(400).json({ error: 'Missing token address', success: false });
  }
  
  if (balance === undefined) {
    return res.status(400).json({ error: 'Missing balance', success: false });
  }
  
  try {
    const result = CryptoWalletController.updateTokenBalance(userId, tokenAddress, balance);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route POST /api/crypto-wallet/:userId/transfer
 * @description Create a token transfer transaction
 * @access Private
 */
router.post('/:userId/transfer', (req, res) => {
  const { userId } = req.params;
  const { tokenAddress, toAddress, amount } = req.body;
  
  if (!tokenAddress) {
    return res.status(400).json({ error: 'Missing token address', success: false });
  }
  
  if (!toAddress) {
    return res.status(400).json({ error: 'Missing recipient address', success: false });
  }
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount', success: false });
  }
  
  try {
    const result = CryptoWalletController.createTransfer(userId, tokenAddress, toAddress, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/crypto-wallet/:userId/balances
 * @description Get all token balances for a user
 * @access Private
 */
router.get('/:userId/balances', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = CryptoWalletController.getBalances(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/crypto-wallet/:userId/transactions
 * @description Get transaction history for a user
 * @access Private
 */
router.get('/:userId/transactions', (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = CryptoWalletController.getTransactionHistory(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route GET /api/crypto-wallet/available-tokens/:type
 * @description Get available tokens for a blockchain
 * @access Public
 */
router.get('/available-tokens/:type', (req, res) => {
  const { type } = req.params;
  
  if (!type || !['ERC20', 'BEP20'].includes(type.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid or missing type', success: false });
  }
  
  try {
    const result = CryptoWalletController.getAvailableTokens(type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;