const Investment = require('../../models/Investment');
const WeeklyEarning = require('../../models/WeeklyEarning');
const mongoose = require('mongoose');

exports.getROISummary = async (req, res) => {
  const userId = req.user.id;

  const invested = await Investment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const returned = await Investment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$returned' } } }
  ]);

  const weekly = await WeeklyEarning.find({ user: userId }).sort({ date: -1 }).limit(4);

  res.json({
    totalInvested: invested[0]?.total || 0,
    totalReturned: returned[0]?.total || 0,
    weeklyEarnings: weekly.map(w => ({ week: w.week, amount: w.amount }))
  });
};
