const mongoose = require('mongoose');
const KYCSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documentPath: String,
  status: { type: String, default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('KYC', KYCSchema);
