/**
 * Analytics Routes
 * Routes for analytics data
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET all analytics data
router.get('/', analyticsController.getAllAnalytics);

// GET user metrics
router.get('/users', analyticsController.getUserMetrics);

// GET system metrics
router.get('/system', analyticsController.getSystemMetrics);

// GET business metrics
router.get('/business', analyticsController.getBusinessMetrics);

// GET content metrics
router.get('/content', analyticsController.getContentMetrics);

module.exports = router;