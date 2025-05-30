const Referral = require('../models/Referral');
const integrationService = require('../services/integrationService');

/**
 * Controller for managing referrals in the JPS Job Providing Service
 */
const referralController = {
  /**
   * Generate a new referral code for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  generateReferralCode: async (req, res) => {
    try {
      const { userId, username } = req.body;
      
      if (!userId || !username) {
        return res.status(400).json({
          success: false,
          message: 'User ID and username are required'
        });
      }
      
      // Generate a unique referral code based on username and random string
      const randomStr = Math.random().toString(36).substring(2, 8);
      const referralCode = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${randomStr}`;
      
      // Check if code already exists (very unlikely but good practice)
      const existingCode = await Referral.findOne({ code: referralCode });
      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: 'Failed to generate a unique referral code, please try again'
        });
      }
      
      // Create new referral record
      const newReferral = new Referral({
        referrer: userId,
        code: referralCode,
        referredUsers: [],
        isActive: true
      });
      
      await newReferral.save();
      
      // Notify Integration Hub about new referral code
      try {
        await integrationService.notifyNewReferral({
          referralCode,
          referrerId: userId,
          event: 'new-referral-code'
        });
      } catch (error) {
        console.error('Failed to notify Integration Hub:', error);
        // Continue despite notification failure
      }
      
      res.status(201).json({
        success: true,
        message: 'Referral code generated successfully',
        referralCode,
        isActive: true
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating referral code',
        error: error.message
      });
    }
  },
  
  /**
   * Get all referrals for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserReferrals: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const referrals = await Referral.find({ referrer: userId });
      
      res.json({
        success: true,
        count: referrals.length,
        referrals: (referrals || []).map(ref => ({
          code: ref.code,
          isActive: ref.isActive,
          stats: ref.stats,
          createdAt: ref.createdAt,
          referredUsers: (ref.referredUsers || []).map(user => ({
            username: user.username,
            status: user.status,
            registeredAt: user.registeredAt
          }))
        }))
      });
    } catch (error) {
      console.error('Error fetching user referrals:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user referrals',
        error: error.message
      });
    }
  },
  
  /**
   * Validate a referral code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  validateReferralCode: async (req, res) => {
    try {
      const { code } = req.params;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Referral code is required'
        });
      }
      
      const referral = await Referral.findOne({ code });
      
      if (!referral) {
        return res.status(404).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
      
      if (!referral.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This referral code is no longer active'
        });
      }
      
      if (referral.expiresAt && new Date(referral.expiresAt) < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'This referral code has expired'
        });
      }
      
      res.json({
        success: true,
        message: 'Valid referral code',
        referralCode: code,
        isActive: true
      });
    } catch (error) {
      console.error('Error validating referral code:', error);
      res.status(500).json({
        success: false,
        message: 'Error validating referral code',
        error: error.message
      });
    }
  },
  
  /**
   * Update a referral user's status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateReferralStatus: async (req, res) => {
    try {
      const { code, userId, status } = req.body;
      
      if (!code || !userId || !status) {
        return res.status(400).json({
          success: false,
          message: 'Referral code, user ID, and status are required'
        });
      }
      
      // Validate status
      const validStatuses = ['registered', 'active', 'completed', 'expired'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      // Find the referral
      const referral = await Referral.findOne({ code });
      
      if (!referral) {
        return res.status(404).json({
          success: false,
          message: 'Referral code not found'
        });
      }
      
      // Find the referred user
      const referredUserIndex = referral.referredUsers.findIndex(
        user => user.userId === userId
      );
      
      if (referredUserIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'User not found in referral'
        });
      }
      
      // Update the status
      referral.referredUsers[referredUserIndex].status = status;
      
      // Check if this is a status change that needs to be synced with Hub
      const needsSync = ['active', 'completed'].includes(status);
      if (needsSync) {
        referral.referredUsers[referredUserIndex].syncedWithHub = false;
      }
      
      await referral.save();
      
      // Notify Integration Hub about status change
      try {
        await integrationService.notifyNewReferral({
          referralCode: code,
          referredUserId: userId,
          status,
          event: 'referral-status-update'
        });
        
        // Mark as synced
        referral.referredUsers[referredUserIndex].syncedWithHub = true;
        await referral.save();
      } catch (error) {
        console.error('Failed to notify Integration Hub:', error);
        // Continue despite notification failure
      }
      
      res.json({
        success: true,
        message: 'Referral status updated successfully',
        referralCode: code,
        status
      });
    } catch (error) {
      console.error('Error updating referral status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating referral status',
        error: error.message
      });
    }
  },
  
  /**
   * Get referral statistics for the system
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getReferralStats: async (req, res) => {
    try {
      const totalReferrals = await Referral.countDocuments();
      const activeReferrals = await Referral.countDocuments({ isActive: true });
      
      const allReferrals = await Referral.find();
      
      // Calculate total referred users
      const referredUsers = allReferrals.reduce((total, ref) => 
        total + ref.referredUsers.length, 0);
      
      // Calculate active, completed referrals
      let activeUsers = 0;
      let completedUsers = 0;
      
      allReferrals.forEach(ref => {
        ref.referredUsers.forEach(user => {
          if (user.status === 'active') activeUsers++;
          if (user.status === 'completed') completedUsers++;
        });
      });
      
      // Calculate conversion rate
      const conversionRate = referredUsers > 0 
        ? (completedUsers / referredUsers) * 100 
        : 0;
      
      res.json({
        success: true,
        stats: {
          totalReferralCodes: totalReferrals,
          activeReferralCodes: activeReferrals,
          totalReferredUsers: referredUsers,
          activeUsers,
          completedUsers,
          conversionRate
        }
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching referral statistics',
        error: error.message
      });
    }
  }
};

module.exports = referralController;