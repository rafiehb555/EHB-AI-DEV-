const Prompt = require('../../models/Prompt');

exports.getPrompts = async (req, res) => {
  const prompts = await Prompt.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(prompts);
};

exports.savePrompt = async (req, res) => {
  const { title, content } = req.body;
  await Prompt.create({ user: req.user.id, title, content });
  res.json({ message: 'Prompt saved' });
};

exports.incrementUsage = async (req, res) => {
  const { id } = req.body;
  await Prompt.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
  res.json({ message: 'Usage updated' });
};
