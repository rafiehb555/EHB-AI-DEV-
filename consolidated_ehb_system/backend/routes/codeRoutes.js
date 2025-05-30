const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSuggestion } = require('../controllers/codeController');

router.post('/suggest', auth, getSuggestion);

module.exports = router;
