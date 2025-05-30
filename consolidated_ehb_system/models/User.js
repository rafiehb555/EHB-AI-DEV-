const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roi: { type: Number, default: 0 }
});
module.exports = mongoose.model('User', UserSchema);
