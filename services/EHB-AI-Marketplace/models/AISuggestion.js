const mongoose = require('mongoose');

/**
 * AI Suggestion Schema
 * Stores user suggestions for improving the AI assistant
 */
const AISuggestionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true,
    enum: [
      'general',
      'knowledge',
      'accuracy',
      'responsiveness',
      'user_experience',
      'new_feature',
      'other'
    ],
    default: 'general'
  },
  suggestion: {
    type: String,
    required: [true, 'Suggestion content is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'implemented', 'rejected'],
    default: 'new'
  },
  adminComment: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
AISuggestionSchema.index({ userId: 1 });
AISuggestionSchema.index({ category: 1 });
AISuggestionSchema.index({ status: 1 });
AISuggestionSchema.index({ priority: 1 });
AISuggestionSchema.index({ timestamp: -1 });

// Skip this if mongoose is not available
let AISuggestion;
try {
  AISuggestion = mongoose.model('AISuggestion', AISuggestionSchema);
} catch (error) {
  console.log('Mongoose not available or model already defined', error.message);
}

module.exports = AISuggestion;