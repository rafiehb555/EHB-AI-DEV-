const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true,
    enum: ['pageView', 'login', 'logout', 'widgetInteraction', 'apiCall', 'error', 'custom']
  },
  page: {
    path: String,
    title: String,
    referrer: String
  },
  widget: {
    id: String,
    type: String,
    action: String
  },
  api: {
    endpoint: String,
    method: String,
    statusCode: Number,
    responseTime: Number
  },
  error: {
    message: String,
    stack: String,
    code: String
  },
  custom: {
    name: String,
    category: String,
    value: mongoose.Schema.Types.Mixed
  },
  device: {
    type: String,
    browser: String,
    os: String,
    screenSize: String
  },
  ip: String,
  location: {
    country: String,
    region: String,
    city: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
AnalyticsSchema.index({ user: 1, timestamp: -1 });
AnalyticsSchema.index({ event: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1 });

// Create a model from the schema
const Analytics = mongoose.model('Analytics', AnalyticsSchema);

module.exports = Analytics;