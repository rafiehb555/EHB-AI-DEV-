const mongoose = require('mongoose');
const TestLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  result: { type: String, enum: ['Pass', 'Fail'] },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('TestLog', TestLogSchema);
