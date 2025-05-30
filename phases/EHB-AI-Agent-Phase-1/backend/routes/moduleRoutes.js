const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateModule } = require('../controllers/moduleController');

router.post('/module', auth, generateModule);

module.exports = router;
