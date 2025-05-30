const express = require('express');
const router = express.Router();
const { getAllUsers, getLeaderboard } = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
