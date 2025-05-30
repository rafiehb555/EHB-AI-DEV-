const mongoose = require('mongoose');
const ChatLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ChatLog', ChatLogSchema);
