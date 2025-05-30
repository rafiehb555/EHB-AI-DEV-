const User = require('../../models/User');

exports.rechargeTokens = async (req, res) => {
  const { email, tokens } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.tokens += parseInt(tokens);
  await user.save();

  res.json({ message: `User ${email} recharged with ${tokens} tokens.` });
};
