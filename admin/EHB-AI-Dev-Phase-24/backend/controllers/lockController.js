const CoinLock = require('../../models/CoinLock');

exports.lockCoin = async (req, res) => {
  const { amount, lockPeriod } = req.body;
  const userId = req.user.id;
  let bonus = 0;

  if (lockPeriod === '12') bonus = 0.5;
  else if (lockPeriod === '24') bonus = 1.0;
  else if (lockPeriod === '36') bonus = 1.1;

  const lock = new CoinLock({
    user: userId,
    amount,
    lockPeriod,
    bonusRate: bonus
  });
  await lock.save();

  res.json({ message: `✅ Locked ${amount} tokens for ${lockPeriod} months. Bonus: ${bonus}% monthly.` });
};

exports.getLocks = async (req, res) => {
  const userId = req.user.id;
  const locks = await CoinLock.find({ user: userId });
  res.json({ locks });
};
