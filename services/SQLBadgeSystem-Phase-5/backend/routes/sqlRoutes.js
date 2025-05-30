const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitScore } = require('../controllers/sqlController');

router.post('/submit-score', auth, submitScore);

module.exports = router;
