const mongoose = require('mongoose');
const AgentLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AgentLog', AgentLogSchema);
