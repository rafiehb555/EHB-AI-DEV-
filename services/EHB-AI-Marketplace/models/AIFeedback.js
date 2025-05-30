const mongoose = require('mongoose');

/**
 * AI Feedback Schema
 * Stores user feedback on AI assistant responses
 */
const AIFeedbackSchema = new mongoose.Schema({
  responseId: {
    type: String,
    required: [true, 'Response ID is required'],
    trim: true
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  helpful: {
    type: Boolean,
    default: null
  },
  accurate: {
    type: Boolean,
    default: null
  },
  context: {
    type: String,
    trim: true,
    default: 'general'
  },
  comments: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
AIFeedbackSchema.index({ userId: 1 });
AIFeedbackSchema.index({ responseId: 1 });
AIFeedbackSchema.index({ context: 1 });
AIFeedbackSchema.index({ rating: 1 });
AIFeedbackSchema.index({ timestamp: -1 });

// Skip this if mongoose is not available
let AIFeedback;
try {
  AIFeedback = mongoose.model('AIFeedback', AIFeedbackSchema);
} catch (error) {
  console.log('Mongoose not available or model already defined', error.message);
}

module.exports = AIFeedback;