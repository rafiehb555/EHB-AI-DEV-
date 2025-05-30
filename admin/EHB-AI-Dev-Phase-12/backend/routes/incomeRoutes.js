const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getIncomeSummary } = require('../controllers/incomeController');

router.get('/summary', auth, getIncomeSummary);
module.exports = router;
