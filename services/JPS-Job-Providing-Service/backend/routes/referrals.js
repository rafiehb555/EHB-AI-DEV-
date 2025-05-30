const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

/**
 * @route   POST /api/referrals/generate
 * @desc    Generate a new referral code
 * @access  Private
 */
router.post('/generate', referralController.generateReferralCode);

/**
 * @route   GET /api/referrals/user/:userId
 * @desc    Get all referrals for a user
 * @access  Private
 */
router.get('/user/:userId', referralController.getUserReferrals);

/**
 * @route   GET /api/referrals/validate/:code
 * @desc    Validate a referral code
 * @access  Public
 */
router.get('/validate/:code', referralController.validateReferralCode);

/**
 * @route   PUT /api/referrals/status
 * @desc    Update a referral user's status
 * @access  Private
 */
router.put('/status', referralController.updateReferralStatus);

/**
 * @route   GET /api/referrals/stats
 * @desc    Get referral statistics
 * @access  Private (Admin)
 */
router.get('/stats', referralController.getReferralStats);

module.exports = router;