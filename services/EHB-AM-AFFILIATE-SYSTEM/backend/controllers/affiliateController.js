const Affiliate = require('../models/Affiliate');
const integrationService = require('../services/integrationService');

/**
 * Controller for managing affiliates in the EHB Affiliate Management System
 */
const affiliateController = {
  /**
   * Get affiliate details by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAffiliateByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const affiliate = await Affiliate.findOne({ userId });
      
      if (!affiliate) {
        return res.status(404).json({
          success: false,
          message: 'Affiliate not found'
        });
      }
      
      // Fetch job referral data from JPS service if connected
      let jobReferrals = null;
      if (affiliate.externalSystems.jpsJobService.connected) {
        try {
          jobReferrals = await integrationService.getJobReferralData();
        } catch (error) {
          console.error('Failed to fetch job referrals:', error);
        }
      }
      
      res.json({
        success: true,
        affiliate: {
          userId: affiliate.userId,
          username: affiliate.username,
          email: affiliate.email,
          affiliateCode: affiliate.affiliateCode,
          companyName: affiliate.companyName,
          website: affiliate.website,
          status: affiliate.status,
          commissionRate: affiliate.commissionRate,
          tierLevel: affiliate.tierLevel,
          referrals: affiliate.referrals,
          earnings: affiliate.earnings,
          metrics: affiliate.metrics,
          externalSystems: affiliate.externalSystems,
          createdAt: affiliate.createdAt,
          updatedAt: affiliate.updatedAt
        },
        externalReferrals: {
          jobReferrals
        }
      });
    } catch (error) {
      console.error('Error fetching affiliate:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching affiliate details',
        error: error.message
      });
    }
  },
  
  /**
   * Update affiliate details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateAffiliate: async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Find the affiliate
      const affiliate = await Affiliate.findOne({ userId });
      
      if (!affiliate) {
        return res.status(404).json({
          success: false,
          message: 'Affiliate not found'
        });
      }
      
      // Fields that can be updated
      const allowedUpdates = [
        'companyName',
        'website',
        'status',
        'paymentMethod',
        'paymentDetails',
        'commissionRate',
        'tierLevel'
      ];
      
      // Apply updates
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          affiliate[field] = updates[field];
        }
      });
      
      // Handle nested payment details if present
      if (updates.paymentDetails) {
        Object.keys(updates.paymentDetails).forEach(key => {
          if (updates.paymentDetails[key] !== undefined) {
            affiliate.paymentDetails[key] = updates.paymentDetails[key];
          }
        });
      }
      
      await affiliate.save();
      
      // Notify Integration Hub about affiliate update
      try {
        await integrationService.notifyAffiliateUpdate({
          affiliateId: userId,
          affiliateCode: affiliate.affiliateCode,
          status: affiliate.status,
          event: 'affiliate-update'
        });
        console.log('Notified Integration Hub about affiliate update');
      } catch (error) {
        console.error('Failed to notify about affiliate update:', error);
      }
      
      res.json({
        success: true,
        message: 'Affiliate updated successfully',
        affiliate: {
          userId: affiliate.userId,
          username: affiliate.username,
          email: affiliate.email,
          affiliateCode: affiliate.affiliateCode,
          status: affiliate.status,
          commissionRate: affiliate.commissionRate,
          tierLevel: affiliate.tierLevel,
          updatedAt: affiliate.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating affiliate:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating affiliate',
        error: error.message
      });
    }
  },
  
  /**
   * Add a new marketing material
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addMarketingMaterial: async (req, res) => {
    try {
      const { userId } = req.params;
      const { type, name, url } = req.body;
      
      if (!userId || !type || !name || !url) {
        return res.status(400).json({
          success: false,
          message: 'User ID, type, name, and URL are required'
        });
      }
      
      // Validate type
      const validTypes = ['banner', 'email_template', 'social_post', 'text_link'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
        });
      }
      
      // Find the affiliate
      const affiliate = await Affiliate.findOne({ userId });
      
      if (!affiliate) {
        return res.status(404).json({
          success: false,
          message: 'Affiliate not found'
        });
      }
      
      // Add new marketing material
      affiliate.marketingMaterials.push({
        type,
        name,
        url,
        createdAt: new Date()
      });
      
      await affiliate.save();
      
      res.json({
        success: true,
        message: 'Marketing material added successfully',
        material: {
          type,
          name,
          url
        }
      });
    } catch (error) {
      console.error('Error adding marketing material:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding marketing material',
        error: error.message
      });
    }
  },
  
  /**
   * Connect to external JPS system
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  connectToJpsSystem: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Find the affiliate
      const affiliate = await Affiliate.findOne({ userId });
      
      if (!affiliate) {
        return res.status(404).json({
          success: false,
          message: 'Affiliate not found'
        });
      }
      
      // Get job referral data
      try {
        const referralData = await integrationService.getJobReferralData();
        
        // Update affiliate with JPS connection
        affiliate.externalSystems.jpsJobService.connected = true;
        affiliate.externalSystems.jpsJobService.lastSyncDate = new Date();
        
        // Update referral count if data is available
        if (referralData && referralData.data && referralData.data.referrals) {
          affiliate.externalSystems.jpsJobService.referralCount = 
            referralData.data.referrals.total || 0;
        }
        
        await affiliate.save();
        
        res.json({
          success: true,
          message: 'Successfully connected to JPS Job Service',
          jpsConnection: {
            connected: true,
            referralCount: affiliate.externalSystems.jpsJobService.referralCount,
            lastSyncDate: affiliate.externalSystems.jpsJobService.lastSyncDate
          },
          jpsData: referralData
        });
      } catch (error) {
        console.error('Failed to connect to JPS service:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to connect to JPS Job Service',
          error: error.message
        });
      }
    } catch (error) {
      console.error('Error connecting to JPS system:', error);
      res.status(500).json({
        success: false,
        message: 'Error connecting to JPS system',
        error: error.message
      });
    }
  },
  
  /**
   * Get affiliate statistics for the system
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAffiliateStats: async (req, res) => {
    try {
      const totalAffiliates = await Affiliate.countDocuments();
      const activeAffiliates = await Affiliate.countDocuments({ status: 'active' });
      
      const allAffiliates = await Affiliate.find();
      
      // Calculate total referrals and earnings
      let totalReferrals = 0;
      let totalEarnings = 0;
      let pendingEarnings = 0;
      let paidEarnings = 0;
      
      allAffiliates.forEach(aff => {
        totalReferrals += aff.referrals.total || 0;
        totalEarnings += aff.earnings.total || 0;
        pendingEarnings += aff.earnings.pending || 0;
        paidEarnings += aff.earnings.paid || 0;
      });
      
      // Calculate average metrics
      const avgCommissionRate = allAffiliates.reduce((sum, aff) => 
        sum + aff.commissionRate, 0) / (totalAffiliates || 1);
      
      const avgReferralsPerAffiliate = totalReferrals / (totalAffiliates || 1);
      
      const avgEarningsPerAffiliate = totalEarnings / (totalAffiliates || 1);
      
      res.json({
        success: true,
        stats: {
          totalAffiliates,
          activeAffiliates,
          totalReferrals,
          totalEarnings,
          pendingEarnings,
          paidEarnings,
          avgCommissionRate,
          avgReferralsPerAffiliate,
          avgEarningsPerAffiliate
        }
      });
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching affiliate statistics',
        error: error.message
      });
    }
  }
};

module.exports = affiliateController;