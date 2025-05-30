const Reward = require('../../models/Reward');
const mongoose = require('mongoose');

exports.getIncomeSummary = async (req, res) => {
  const userId = req.user.id;
  const received = await Reward.aggregate([
    { $match: { to: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const sent = await Reward.aggregate([
    { $match: { from: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const monthly = await Reward.aggregate([
    { $match: { to: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" }
      }
    }
  ]);

  res.json({
    totalReceived: received[0]?.total || 0,
    totalSent: sent[0]?.total || 0,
    monthlyIncome: monthly.map(m => ({ month: `Month ${m._id}`, total: m.total }))
  });
};
