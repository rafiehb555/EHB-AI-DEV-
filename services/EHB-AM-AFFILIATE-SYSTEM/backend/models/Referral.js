const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referredUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JPSUser',
    required: true
  },
  referredBy: { 
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending'
  },
  rewards: {
    pointsEarned: {
      type: Number,
      default: 0
    },
    bonusEarned: {
      type: Number,
      default: 0
    },
    rewardClaimed: {
      type: Boolean,
      default: false
    },
    rewardClaimedAt: {
      type: Date,
      default: null
    }
  },
  milestones: {
    profileCompleted: {
      type: Boolean,
      default: false,
      completedAt: {
        type: Date,
        default: null
      }
    },
    firstJobApplication: {
      type: Boolean,
      default: false,
      completedAt: {
        type: Date,
        default: null
      }
    },
    firstJobInterviewAttended: {
      type: Boolean,
      default: false,
      completedAt: {
        type: Date,
        default: null
      }
    }
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

// Update timestamp when document is updated
ReferralSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JPSReferral', ReferralSchema);
