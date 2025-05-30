const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllModules, createModule } = require('../controllers/moduleController');

router.get('/all', auth, getAllModules);
router.post('/create', auth, createModule);

module.exports = router;
