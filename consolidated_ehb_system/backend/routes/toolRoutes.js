const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTools, createTool, runTool } = require('../controllers/toolController');

router.get('/', auth, getTools);
router.post('/', auth, createTool);
router.post('/run', auth, runTool);

module.exports = router;
