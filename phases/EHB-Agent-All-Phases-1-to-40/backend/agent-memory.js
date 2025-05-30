// agent-memory.js
const express = require('express');
const router = express.Router();

const memory = [
  { prompt: "Generate calculator", response: "function calculator() { ... }" },
  { prompt: "Create login form", response: "<form>...</form>" }
];

router.get('/agent/memory', (req, res) => {
  res.json(memory);
});

module.exports = router;
