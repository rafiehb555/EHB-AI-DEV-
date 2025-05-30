const User = require('../../models/User');

exports.adjustUserCoins = async (req, res) => {
  const { email, amount } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.walletCoins = amount;
  await user.save();
  res.json({ message: 'User coins updated' });
};
