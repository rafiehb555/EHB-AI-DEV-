const Chat = require('../../models/Chat');
const User = require('../../models/User');
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

exports.sendMessage = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.tokens < 1) return res.status(403).json({ error: 'Insufficient tokens' });

  const history = await Chat.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
  const messages = history.map(h => ({ role: h.role, content: h.content })).reverse();
  messages.push({ role: 'user', content: req.body.message });

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages
  });

  const reply = response.data.choices[0].message.content;

  await Chat.create({ user: user._id, role: 'user', content: req.body.message });
  await Chat.create({ user: user._id, role: 'assistant', content: reply });

  user.tokens -= 1;
  await user.save();

  res.json({ role: 'assistant', content: reply });
};

exports.getHistory = async (req, res) => {
  const chat = await Chat.find({ user: req.user.id }).sort({ createdAt: 1 });
  res.json(chat);
};
