const mongoose = require('mongoose');

/**
 * Referral Schema
 * Stores information about user referrals in the job providing service
 */
const ReferralSchema = new mongoose.Schema({
  // User who created the referral code
  referrer: {
    type: String,  // In production, would be mongoose.Schema.Types.ObjectId with ref
    required: true
  },
  
  // The referral code itself
  code: {
    type: String,
    required: true,
    unique: true
  },
  
  // Users who signed up using this referral code
  referredUsers: [{
    userId: {
      type: String, // In production, would be mongoose.Schema.Types.ObjectId with ref
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['registered', 'active', 'completed', 'expired'],
      default: 'registered'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    // Whether this referral was synchronized with Integration Hub
    syncedWithHub: {
      type: Boolean,
      default: false
    }
  }],
  
  // Overall referral statistics
  stats: {
    totalReferrals: {
      type: Number,
      default: 0
    },
    activeReferrals: {
      type: Number,
      default: 0
    },
    completedReferrals: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Integration with the Affiliate System
  affiliateInfo: {
    syncedWithAffiliate: {
      type: Boolean,
      default: false
    },
    lastSyncDate: {
      type: Date
    },
    affiliateCommission: {
      type: Number,
      default: 0
    }
  },
  
  // Status of this referral code
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Expiration date if any
  expiresAt: {
    type: Date
  },
  
  // Standard timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ReferralSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate statistics
  if (this.referredUsers && this.referredUsers.length > 0) {
    const total = this.referredUsers.length;
    const active = (this.referredUsers || []).filter(user => user.status === 'active').length;
    const completed = (this.referredUsers || []).filter(user => user.status === 'completed').length;
    
    this.stats.totalReferrals = total;
    this.stats.activeReferrals = active;
    this.stats.completedReferrals = completed;
    this.stats.conversionRate = total > 0 ? (completed / total) * 100 : 0;
  }
  
  next();
});

// Create a model from the schema
const Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;