const mongoose = require('mongoose');

/**
 * Affiliate Schema
 * Stores information about affiliates in the EHB Affiliate Management System
 */
const AffiliateSchema = new mongoose.Schema({
  // User who is the affiliate
  userId: {
    type: String,  // In production, would be mongoose.Schema.Types.ObjectId with ref
    required: true,
    unique: true
  },
  
  // General affiliate information
  username: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true
  },
  
  // The affiliate's code that they share
  affiliateCode: {
    type: String,
    required: true,
    unique: true
  },
  
  // Business information
  companyName: {
    type: String
  },
  
  website: {
    type: String
  },
  
  // Account status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'terminated'],
    default: 'active'
  },
  
  // Payout information
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'paypal', 'crypto', 'check', 'other'],
    default: 'bank_transfer'
  },
  
  paymentDetails: {
    accountName: String,
    accountNumber: String,
    routingNumber: String,
    paypalEmail: String,
    cryptoAddress: String,
    otherDetails: String
  },
  
  // Commission rates and tiers
  commissionRate: {
    type: Number,
    default: 10 // Default 10%
  },
  
  tierLevel: {
    type: Number,
    default: 1
  },
  
  // Referrals and earnings
  referrals: {
    total: {
      type: Number,
      default: 0
    },
    successful: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    },
    lastPayout: {
      amount: Number,
      date: Date
    }
  },
  
  // Performance metrics
  metrics: {
    conversionRate: {
      type: Number,
      default: 0
    },
    averageEarningsPerReferral: {
      type: Number,
      default: 0
    },
    clickThroughRate: {
      type: Number,
      default: 0
    }
  },
  
  // Marketing materials and resources
  marketingMaterials: [{
    type: {
      type: String,
      enum: ['banner', 'email_template', 'social_post', 'text_link']
    },
    name: String,
    url: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Integration with other EHB systems
  externalSystems: {
    jpsJobService: {
      connected: {
        type: Boolean,
        default: false
      },
      referralCount: {
        type: Number,
        default: 0
      },
      lastSyncDate: Date
    },
    trustyWallet: {
      connected: {
        type: Boolean,
        default: false
      },
      walletAddress: String,
      lastSyncDate: Date
    }
  },
  
  // Tracking data
  trackingUrls: [{
    name: String,
    baseUrl: String,
    parameters: String,
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
AffiliateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate metrics if there are referrals
  if (this.referrals.total > 0) {
    // Calculate conversion rate
    this.metrics.conversionRate = (this.referrals.successful / this.referrals.total) * 100;
    
    // Calculate average earnings per referral
    if (this.referrals.successful > 0) {
      this.metrics.averageEarningsPerReferral = this.earnings.total / this.referrals.successful;
    }
  }
  
  next();
});

// Create a model from the schema
const Affiliate = mongoose.model('Affiliate', AffiliateSchema);

module.exports = Affiliate;