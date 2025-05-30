const mongoose = require('mongoose');
const CoinLockSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  lockPeriod: String,
  bonusRate: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CoinLock', CoinLockSchema);
