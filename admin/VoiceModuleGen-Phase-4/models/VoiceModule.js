const mongoose = require('mongoose');
const VoiceModuleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: String,
  moduleGenerated: Boolean,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('VoiceModule', VoiceModuleSchema);
