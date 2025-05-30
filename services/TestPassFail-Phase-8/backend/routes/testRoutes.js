const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitTest, getResults } = require('../controllers/testController');

router.post('/submit', auth, submitTest);
router.get('/results', auth, getResults);

module.exports = router;
