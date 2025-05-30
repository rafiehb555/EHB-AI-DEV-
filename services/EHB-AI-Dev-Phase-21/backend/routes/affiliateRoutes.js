const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAffiliateTree } = require('../controllers/affiliateController');

router.get('/tree', auth, getAffiliateTree);
module.exports = router;
