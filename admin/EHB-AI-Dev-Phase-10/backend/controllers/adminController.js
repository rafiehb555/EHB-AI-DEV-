const User = require('../../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('email sqlBadge tokens');
  res.json(users);
};

exports.getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ tokens: -1 }).limit(10);
  res.json(users);
};
