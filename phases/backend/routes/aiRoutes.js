const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../controllers/aiController');
router.post('/ask', getAIResponse);
module.exports = router;
