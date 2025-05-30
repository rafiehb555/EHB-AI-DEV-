const User = require('../../models/User');
const Reward = require('../../models/Reward');

exports.getWallet = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

exports.transferCoins = async (req, res) => {
  const { recipient, amount } = req.body;
  const sender = await User.findById(req.user.id);
  const receiver = await User.findOne({ email: recipient });

  if (!receiver || sender.walletCoins < amount) {
    return res.status(400).json({ error: 'Transfer failed' });
  }

  sender.walletCoins -= amount;
  receiver.walletCoins += Number(amount);

  await sender.save();
  await receiver.save();

  await Reward.create({ from: sender._id, to: receiver._id, toEmail: recipient, amount });

  res.json({ message: 'Transfer successful' });
};

exports.getHistory = async (req, res) => {
  const history = await Reward.find({ from: req.user.id }).sort({ date: -1 });
  res.json(history);
};
