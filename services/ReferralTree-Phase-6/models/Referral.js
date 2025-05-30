const mongoose = require('mongoose');
const ReferralSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referredBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Referral', ReferralSchema);
