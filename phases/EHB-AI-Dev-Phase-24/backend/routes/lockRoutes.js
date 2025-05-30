const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { lockCoin, getLocks } = require('../controllers/lockController');

router.post('/coin', auth, lockCoin);
router.get('/my-locks', auth, getLocks);

module.exports = router;
