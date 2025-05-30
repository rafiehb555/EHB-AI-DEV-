const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWallet, transferCoins, getHistory } = require('../controllers/walletController');

router.get('/me', auth, getWallet);
router.post('/transfer', auth, transferCoins);
router.get('/history', auth, getHistory);

module.exports = router;
