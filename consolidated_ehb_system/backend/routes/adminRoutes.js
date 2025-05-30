const express = require('express');
const router = express.Router();
const { rechargeTokens } = require('../controllers/adminController');
router.post('/recharge', rechargeTokens);
module.exports = router;
