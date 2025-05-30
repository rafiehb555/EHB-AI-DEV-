const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getROISummary } = require('../controllers/roiController');

router.get('/summary', auth, getROISummary);
module.exports = router;
