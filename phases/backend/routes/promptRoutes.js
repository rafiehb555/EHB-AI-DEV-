const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPrompts, savePrompt, incrementUsage } = require('../controllers/promptController');

router.get('/', auth, getPrompts);
router.post('/', auth, savePrompt);
router.post('/use', auth, incrementUsage);

module.exports = router;
