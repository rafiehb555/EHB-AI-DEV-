const mongoose = require('mongoose');
const ModuleSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String,
  status: { type: String, enum: ['Live', 'Coming Soon', 'Offline'], default: 'Live' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Module', ModuleSchema);
