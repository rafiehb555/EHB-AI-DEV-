exports.getSuggestion = async (req, res) => {
  const { input } = req.body;
  const fakeSuggestion = `// Based on your input:\nconsole.log('Hello, World!');`;
  res.json({ suggestion: fakeSuggestion });
};
