const express = require('express');
const { 
  submitFeedback, 
  getAllFeedback,
  getFeedbackById,
  getFeedbackAnalytics
} = require('../controllers/feedbackController');

const router = express.Router();

// Submit new feedback
router.post('/', submitFeedback);

// Get all feedback (with optional filters)
router.get('/', getAllFeedback);

// Get specific feedback by id
router.get('/:id', getFeedbackById);

// Get feedback analytics
router.get('/analytics/summary', getFeedbackAnalytics);

module.exports = router;