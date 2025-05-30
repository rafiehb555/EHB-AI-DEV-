const express = require('express');
const router = express.Router();
const { addReferral } = require('../controllers/adminController');
router.post('/add-referral', addReferral);
module.exports = router;
