const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { detectAndTranslate } = require('../controllers/translateController');

router.post('/', auth, detectAndTranslate);

module.exports = router;
