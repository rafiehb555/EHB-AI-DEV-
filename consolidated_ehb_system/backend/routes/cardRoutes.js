const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listCards, createCard } = require('../controllers/cardController');

router.get('/list', auth, listCards);
router.post('/create', auth, createCard);

module.exports = router;
