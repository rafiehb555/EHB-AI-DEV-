const express = require('express');
const { 
  submitSuggestion, 
  getAllSuggestions,
  getSuggestionById,
  updateSuggestionStatus,
  upvoteSuggestion,
  markAsImplemented,
  getSuggestionAnalytics
} = require('../controllers/suggestionController');

const router = express.Router();

// Submit new suggestion
router.post('/', submitSuggestion);

// Get all suggestions (with optional filters)
router.get('/', getAllSuggestions);

// Get specific suggestion by id
router.get('/:id', getSuggestionById);

// Update suggestion status
router.patch('/:id/status', updateSuggestionStatus);

// Upvote a suggestion
router.post('/:id/upvote', upvoteSuggestion);

// Mark a suggestion as implemented
router.post('/:id/implement', markAsImplemented);

// Get suggestion analytics
router.get('/analytics/summary', getSuggestionAnalytics);

module.exports = router;