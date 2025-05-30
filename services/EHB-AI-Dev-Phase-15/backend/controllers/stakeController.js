const Staking = require('../../models/Staking');
const User = require('../../models/User');

exports.getStakeInfo = async (req, res) => {
  let stake = await Staking.findOne({ user: req.user.id });
  if (!stake) {
    stake = await Staking.create({ user: req.user.id });
  }
  const monthlyReward = Math.floor(stake.locked * stake.rewardRate);
  res.json({
    locked: stake.locked,
    unlocked: stake.unlocked,
    monthlyReward
  });
};

exports.lockCoins = async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user.id);
  if (user.walletCoins < amount) return res.status(400).json({ error: 'Insufficient coins' });

  let stake = await Staking.findOne({ user: user._id });
  if (!stake) stake = await Staking.create({ user: user._id });

  user.walletCoins -= amount;
  stake.locked += amount;
  await user.save();
  await stake.save();
  res.json({ message: 'Coins locked' });
};

exports.unlockCoins = async (req, res) => {
  const stake = await Staking.findOne({ user: req.user.id });
  const user = await User.findById(req.user.id);
  const reward = Math.floor(stake.locked * stake.rewardRate);
  user.walletCoins += stake.locked + reward;
  stake.unlocked += stake.locked;
  stake.locked = 0;
  await user.save();
  await stake.save();
  res.json({ message: 'Coins unlocked with reward' });
};
