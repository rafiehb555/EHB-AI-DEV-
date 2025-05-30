const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chatWithAgent } = require('../controllers/agentController');

router.post('/chat', auth, chatWithAgent);

module.exports = router;
