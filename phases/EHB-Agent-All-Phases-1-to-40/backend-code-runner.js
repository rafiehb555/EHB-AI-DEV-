// code-runner.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.post('/run-code', (req, res) => {
  const { code } = req.body;
  exec(`node -e "${code}"`, (error, stdout, stderr) => {
    if (error) return res.json({ error: stderr });
    res.json({ output: stdout });
  });
});

module.exports = router;
