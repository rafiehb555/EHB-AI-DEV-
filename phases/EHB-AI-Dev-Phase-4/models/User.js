const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  tokens: { type: Number, default: 5 },
  totalPrompts: { type: Number, default: 0 },
  sqlBadge: { type: String, default: 'Free' }
});
module.exports = mongoose.model('User', UserSchema);
