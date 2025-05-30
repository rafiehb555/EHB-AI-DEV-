const mongoose = require('mongoose');
const AILogSchema = new mongoose.Schema({
  trainingType: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AILog', AILogSchema);
