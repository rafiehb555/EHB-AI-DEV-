const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAPIs, saveAPI, testAPI } = require('../controllers/apiServiceController');

router.get('/', auth, getAPIs);
router.post('/', auth, saveAPI);
router.post('/test', auth, testAPI);

module.exports = router;
