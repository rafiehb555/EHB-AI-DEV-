const User = require('../../models/User');

exports.getAffiliateTree = async (req, res) => {
  const tree = [];
  let currentLevel = [req.user.id];
  let totalEarnings = 0;

  for (let i = 0; i < 5; i++) {
    const levelUsers = await User.find({ referrer: { $in: currentLevel } });
    tree.push(levelUsers.map(u => ({ email: u.email, roi: u.roi })));
    totalEarnings += levelUsers.reduce((sum, u) => sum + u.roi, 0) * (1 - i * 0.1);
    currentLevel = levelUsers.map(u => u._id);
  }

  res.json({ tree, totalEarnings });
};
