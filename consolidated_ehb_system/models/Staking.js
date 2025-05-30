const mongoose = require('mongoose');
const StakingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  locked: { type: Number, default: 0 },
  unlocked: { type: Number, default: 0 },
  rewardRate: { type: Number, default: 0.05 }, // 5% monthly
  lastRewardDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Staking', StakingSchema);
