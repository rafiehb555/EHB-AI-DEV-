const mongoose = require('mongoose');
const PromptLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prompt: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('PromptLog', PromptLogSchema);
