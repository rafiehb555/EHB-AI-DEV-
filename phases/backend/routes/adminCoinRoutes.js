const express = require('express');
const router = express.Router();
const { adjustUserCoins } = require('../controllers/adminCoinController');

router.post('/coins', adjustUserCoins);
module.exports = router;
