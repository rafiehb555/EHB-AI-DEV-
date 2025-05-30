const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitTest, getHistory, generateCertificate } = require('../controllers/testController');

router.post('/submit', auth, submitTest);
router.get('/history', auth, getHistory);
router.get('/certificate', auth, generateCertificate);

module.exports = router;
