const express = require('express');
const router = express.Router();
const { getLeaderIncome } = require('../controllers/leaderIncomeController');

router.get('/leader-income', getLeaderIncome);
module.exports = router;
