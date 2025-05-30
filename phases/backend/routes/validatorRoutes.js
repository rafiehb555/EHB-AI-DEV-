const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getEarnings, addEarning } = require('../controllers/validatorController');

router.get('/earnings', auth, getEarnings);
router.post('/add', auth, addEarning);

module.exports = router;
