// logs-handler.js
const express = require('express');
const router = express.Router();

const logs = [
  { phase: 'Phase 1', time: '2024-05-01 14:22', code: 'console.log("Hello")' },
  { phase: 'Phase 2', time: '2024-05-01 14:30', code: 'return 2 + 2' }
];

router.get('/preview/logs', (req, res) => {
  res.json(logs);
});

module.exports = router;
