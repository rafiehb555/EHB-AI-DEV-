const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitTest } = require('../controllers/testController');

router.post('/submit', auth, submitTest);

module.exports = router;
