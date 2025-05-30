const User = require('../../models/User');

exports.getLeaderIncome = async (req, res) => {
  const users = await User.find({}).populate('referrals');

  const leaderData = users.map(u => ({
    email: u.email,
    referrals: u.referrals.length,
    referralBonus: u.referrals.length * 2
  })).filter(u => u.referrals >= 5);

  res.json(leaderData);
};
