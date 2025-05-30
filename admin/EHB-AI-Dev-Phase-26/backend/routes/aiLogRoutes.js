const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLogs, addLog } = require('../controllers/aiLogController');

router.get('/logs', auth, getLogs);
router.post('/add', auth, addLog);

module.exports = router;
