const mongoose = require('mongoose');
const CommandLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  command: String,
  route: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CommandLog', CommandLogSchema);
