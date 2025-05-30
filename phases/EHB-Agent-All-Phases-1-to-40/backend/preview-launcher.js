// preview-launcher.js
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

router.post('/launch-preview', (req, res) => {
  const { path, port } = req.body;
  exec(`node ${path}`, (error, stdout, stderr) => {
    if (error) return res.json({ success: false, error: stderr });
    res.json({ success: true, port, message: 'Preview launched' });
  });
});

module.exports = router;
