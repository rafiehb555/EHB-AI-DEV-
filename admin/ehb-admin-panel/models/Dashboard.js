const mongoose = require('mongoose');

// Widget Schema
const WidgetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Widget type is required'],
    enum: [
      'chart', 'stats', 'table', 'list', 
      'calendar', 'map', 'weather', 
      'clock', 'notes', 'tasks', 
      'links', 'feed', 'custom'
    ]
  },
  title: {
    type: String,
    required: [true, 'Widget title is required'],
    trim: true,
    maxlength: [100, 'Widget title cannot exceed 100 characters']
  },
  size: {
    w: {
      type: Number,
      default: 2,
      min: [1, 'Widget width must be at least 1'],
      max: [6, 'Widget width cannot exceed 6']
    },
    h: {
      type: Number,
      default: 2,
      min: [1, 'Widget height must be at least 1'],
      max: [6, 'Widget height cannot exceed 6']
    }
  },
  position: {
    x: {
      type: Number,
      default: 0,
      min: [0, 'Widget x-position cannot be negative']
    },
    y: {
      type: Number,
      default: 0,
      min: [0, 'Widget y-position cannot be negative']
    }
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Dashboard Schema
const DashboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dashboard name is required'],
    trim: true,
    maxlength: [100, 'Dashboard name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Dashboard description cannot exceed 500 characters']
  },
  layout: {
    type: String,
    enum: ['grid', 'free', 'fixed', 'list'],
    default: 'grid'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  widgets: [WidgetSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt timestamp
DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update widget timestamps if modified
  if (this.isModified('widgets')) {
    this.widgets.forEach(widget => {
      if (widget.isModified()) {
        widget.updatedAt = Date.now();
      }
    });
  }
  
  next();
});

// Create indexes for better query performance
DashboardSchema.index({ user: 1, isDefault: 1 });
DashboardSchema.index({ createdAt: -1 });

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports = Dashboard;