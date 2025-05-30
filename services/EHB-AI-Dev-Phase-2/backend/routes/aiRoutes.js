const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../controllers/aiController');
const auth = require('../middleware/auth');
router.post('/ask', auth, getAIResponse);
module.exports = router;
