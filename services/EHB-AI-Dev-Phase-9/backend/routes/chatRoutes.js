const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendMessage, getHistory } = require('../controllers/chatController');

router.post('/send', auth, sendMessage);
router.get('/history', auth, getHistory);

module.exports = router;
