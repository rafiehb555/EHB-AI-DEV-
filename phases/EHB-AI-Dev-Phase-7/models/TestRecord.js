const mongoose = require('mongoose');
const TestRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('TestRecord', TestRecordSchema);
