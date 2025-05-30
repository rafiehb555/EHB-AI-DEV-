const User = require('../../models/User');
const TestRecord = require('../../models/TestRecord');

exports.getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const vipCount = await User.countDocuments({ sqlBadge: 'VIP' });
  const passCount = await TestRecord.countDocuments({ status: 'Pass' });
  res.json({ totalUsers, vipCount, passCount });
};
