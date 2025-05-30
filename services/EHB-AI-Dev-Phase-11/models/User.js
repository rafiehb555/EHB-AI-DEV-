const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  tokens: { type: Number, default: 5 },
  lockedCoins: { type: Number, default: 0 },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  testScore: { type: String, default: 'Pending' },
  sqlBadge: { type: String, default: 'Free' },
  avatar: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  walletCoins: { type: Number, default: 10 }
});
module.exports = mongoose.model('User', UserSchema);
