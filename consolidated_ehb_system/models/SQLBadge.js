const mongoose = require('mongoose');
const SQLBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  badge: String,
  earnedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SQLBadge', SQLBadgeSchema);
