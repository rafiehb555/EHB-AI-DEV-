const mongoose = require('mongoose');
const ValidatorEarningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderIncome: Number,
  loyaltyBonus: Number,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ValidatorEarning', ValidatorEarningSchema);
