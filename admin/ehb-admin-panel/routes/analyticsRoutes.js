const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Client-side tracking endpoint (no auth required)
router.post('/track', analyticsController.trackEvent);

// All other routes require authentication
router.use(authMiddleware.protect);

// GET /api/analytics/user - Get current user's analytics
router.get('/user', analyticsController.getUserAnalytics);

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// GET /api/analytics/usage - Get usage analytics
router.get('/usage', analyticsController.getUsageAnalytics);

// GET /api/analytics/realtime - Get realtime analytics
router.get('/realtime', analyticsController.getRealtimeAnalytics);

// Admin-only analytics endpoints
router.use(authMiddleware.restrictTo('admin', 'analyst'));

// GET /api/analytics/users - Get all users analytics
router.get('/users', analyticsController.getAllUsersAnalytics);

// GET /api/analytics/system - Get system analytics
router.get('/system', analyticsController.getSystemAnalytics);

// GET /api/analytics/export - Export analytics data
router.get('/export', analyticsController.exportAnalyticsData);

module.exports = router;