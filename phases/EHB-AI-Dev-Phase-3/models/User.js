const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  tokens: { type: Number, default: 5 }
});
module.exports = mongoose.model('User', UserSchema);
