const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');

/**
 * @route   GET /api/affiliates/user/:userId
 * @desc    Get affiliate details by user ID
 * @access  Private
 */
router.get('/user/:userId', affiliateController.getAffiliateByUserId);

/**
 * @route   PUT /api/affiliates/user/:userId
 * @desc    Update affiliate details
 * @access  Private
 */
router.put('/user/:userId', affiliateController.updateAffiliate);

/**
 * @route   POST /api/affiliates/user/:userId/marketing
 * @desc    Add a new marketing material
 * @access  Private
 */
router.post('/user/:userId/marketing', affiliateController.addMarketingMaterial);

/**
 * @route   POST /api/affiliates/user/:userId/connect/jps
 * @desc    Connect to JPS job service
 * @access  Private
 */
router.post('/user/:userId/connect/jps', affiliateController.connectToJpsSystem);

/**
 * @route   GET /api/affiliates/stats
 * @desc    Get affiliate statistics
 * @access  Private (Admin)
 */
router.get('/stats', affiliateController.getAffiliateStats);

module.exports = router;