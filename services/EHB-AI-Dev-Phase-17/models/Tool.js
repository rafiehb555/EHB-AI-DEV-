const mongoose = require('mongoose');
const ToolSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  promptTemplate: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Tool', ToolSchema);
