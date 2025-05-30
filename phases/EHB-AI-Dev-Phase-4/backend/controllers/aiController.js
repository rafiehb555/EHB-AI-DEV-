const { Configuration, OpenAIApi } = require('openai');
const User = require('../../models/User');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.getGPTResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || user.tokens < 1) return res.status(403).json({ error: 'Insufficient tokens' });

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    user.tokens -= 1;
    user.totalPrompts += 1;

    if (user.totalPrompts > 20) user.sqlBadge = "VIP";
    else if (user.totalPrompts > 10) user.sqlBadge = "High";
    else if (user.totalPrompts > 5) user.sqlBadge = "Normal";
    else user.sqlBadge = "Basic";

    await user.save();

    res.json({ reply: completion.data.choices[0].message.content, badge: user.sqlBadge });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'GPT API error' });
  }
};
