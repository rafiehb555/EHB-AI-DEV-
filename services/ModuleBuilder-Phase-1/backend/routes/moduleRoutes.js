const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { buildModule } = require('../controllers/moduleController');

router.post('/build', auth, buildModule);
module.exports = router;
