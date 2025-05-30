const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { askAI } = require('../controllers/chatController');

router.post('/ask', auth, askAI);
module.exports = router;
