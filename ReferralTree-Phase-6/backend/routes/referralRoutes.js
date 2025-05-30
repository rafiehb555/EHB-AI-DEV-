const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerReferral, getReferrals } = require('../controllers/referralController');

router.post('/register', auth, registerReferral);
router.get('/my-referrals', auth, getReferrals);

module.exports = router;
