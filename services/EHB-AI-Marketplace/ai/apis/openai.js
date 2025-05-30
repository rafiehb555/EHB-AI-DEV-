
// Ye file OpenAI ki API calls handle karti hai
const express = require('express');
const axios = require('axios');
const router = express.Router();

// OpenAI ke liye API configuration
const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// POST /api/openai/ask
// req.body mein ye data bhejo:
// {
//   "prompt": "your question here",
//   "model": "gpt-4"
// }
router.post('/ask', async (req, res) => {
  try {
    const response = await openaiApi.post('/chat/completions', {
      model: req.body.model || 'gpt-4',
      messages: [{ role: 'user', content: req.body.prompt }]
    });
    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
});

module.exports = router;
