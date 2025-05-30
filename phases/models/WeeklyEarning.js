const mongoose = require('mongoose');
const WeeklyEarningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  week: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('WeeklyEarning', WeeklyEarningSchema);
