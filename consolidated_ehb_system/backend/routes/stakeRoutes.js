const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getStakeInfo, lockCoins, unlockCoins } = require('../controllers/stakeController');

router.get('/info', auth, getStakeInfo);
router.post('/lock', auth, lockCoins);
router.post('/unlock', auth, unlockCoins);

module.exports = router;
