const mongoose = require('mongoose');
const RewardSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toEmail: String,
  amount: Number,
  type: { type: String, default: 'transfer' },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Reward', RewardSchema);
