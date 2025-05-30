const express = require('express');
const router = express.Router();
const aiExplainController = require('../controllers/aiExplainController');
const { protect } = require('../middleware/authMiddleware');

/**
 * AI Explanation Routes
 * API endpoints for AI-powered contextual help explanations
 */

/**
 * @route   POST /api/ai/explain
 * @desc    Get AI explanation for a specific context
 * @access  Private
 */
router.post('/explain', protect, aiExplainController.getExplanation);

module.exports = router;