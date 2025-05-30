const mongoose = require('mongoose');
const APIServiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  endpoint: String,
  key: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('APIService', APIServiceSchema);
