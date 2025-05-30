exports.getAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    res.json({ reply: `Received prompt: ${prompt}` });
  } catch (error) {
    res.status(500).json({ error: 'AI response failed' });
  }
};
