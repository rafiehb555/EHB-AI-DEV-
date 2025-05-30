const mongoose = require('mongoose');
const CodePromptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  input: String,
  suggestion: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CodePrompt', CodePromptSchema);
