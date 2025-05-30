const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLessons, submitAnswer } = require('../controllers/lessonController');

router.get('/', auth, getLessons);
router.post('/submit', auth, submitAnswer);

module.exports = router;
