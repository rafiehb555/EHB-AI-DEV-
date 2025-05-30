const User = require('../../models/User');
const Reward = require('../../models/Reward');

exports.getPoolIncome = async (req, res) => {
  const user = await User.findById(req.user.id).populate('referrals');
  const referralBonus = user.referrals.length * 2;
  const poolBonus = Math.floor(user.referrals.length / 5) * 5;

  res.json({
    poolBonus,
    referralBonus,
    totalReferrals: user.referrals.length
  });
};
