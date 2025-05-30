/**
 * AI Feedback Routes
 * 
 * This module defines API routes for handling AI feedback operations:
 * - Submitting feedback on AI responses
 * - Submitting improvement suggestions
 * - Getting feedback statistics
 * - Admin operations for managing feedback
 */

const express = require('express');
const router = express.Router();
const aiFeedbackController = require('../controllers/aiFeedbackController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');
const validateFields = require('../middleware/validateFields');

// Public routes (no authentication required)
// These routes can be used anonymously to collect feedback

// Submit feedback on an AI response
router.post('/submit-feedback', 
  validateFields(['responseId', 'rating']),
  aiFeedbackController.submitFeedback
);

// Submit an improvement suggestion
router.post('/submit-suggestion',
  validateFields(['category', 'description']),
  aiFeedbackController.submitSuggestion
);

// Temporarily public route for testing
// Get my feedback and suggestions
router.get('/my-feedback', aiFeedbackController.getMyFeedbackAndSuggestions);

// Temporarily public routes for testing
// Get feedback statistics
router.get('/stats', aiFeedbackController.getFeedbackStats);

// Get all feedback with filtering options
router.get('/all-feedback', aiFeedbackController.getAllFeedback);

// Get all suggestions with filtering options
router.get('/all-suggestions', aiFeedbackController.getAllSuggestions);

// Update suggestion status (implemented, declined, under review)
router.patch('/suggestion/:id/status',
  validateFields(['status']),
  aiFeedbackController.updateSuggestionStatus
);

// Get feedback by id
router.get('/feedback/:id', aiFeedbackController.getFeedbackById);

// Get suggestion by id
router.get('/suggestion/:id', aiFeedbackController.getSuggestionById);

module.exports = router;