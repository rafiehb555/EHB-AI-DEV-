const mongoose = require('mongoose');
const CardSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  status: { type: String, enum: ['Live', 'Coming Soon', 'Offline'], default: 'Live' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Card', CardSchema);
