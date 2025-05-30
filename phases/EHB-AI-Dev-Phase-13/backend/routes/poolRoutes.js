const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPoolIncome } = require('../controllers/poolIncomeController');

router.get('/pool', auth, getPoolIncome);
module.exports = router;
