const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/status', async (req, res) => {
  try {
    const status = {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;