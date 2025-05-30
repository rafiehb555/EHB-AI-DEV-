const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { runCommand } = require('../controllers/commandController');

router.post('/run', auth, runCommand);

module.exports = router;
