const express = require('express');
const router = express.Router();
const { loginUser, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/login', loginUser);
router.get('/me', auth, getMe);
module.exports = router;
