const express = require('express');
const router = express.Router();
const { getGPTResponse } = require('../controllers/aiController');
const auth = require('../middleware/auth');
router.post('/ask', auth, getGPTResponse);
module.exports = router;
