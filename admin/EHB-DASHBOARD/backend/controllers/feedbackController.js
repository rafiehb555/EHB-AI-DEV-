const Feedback = require('../models/Feedback');

/**
 * Submit a new feedback entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { content, category, rating, source, page_url } = req.body;
    
    // Validation
    if (!content) {
      return res.status(400).json({ error: 'Feedback content is required' });
    }
    
    // Get user_id from authenticated session if available
    const user_id = req.user ? req.user.id : null;
    
    const feedbackData = {
      user_id,
      content,
      category,
      rating,
      source,
      page_url
    };
    
    const feedback = await Feedback.create(feedbackData);
    
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Error submitting feedback' });
  }
};

/**
 * Get all feedback entries with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllFeedback = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { user_id, category, rating } = req.query;
    
    const filters = {};
    
    if (user_id) filters.user_id = parseInt(user_id);
    if (category) filters.category = category;
    if (rating) filters.rating = parseInt(rating);
    
    const feedback = await Feedback.getAll(filters);
    
    res.json(feedback);
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ error: 'Error retrieving feedback' });
  }
};

/**
 * Get a specific feedback entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.getById(parseInt(id));
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error(`Error getting feedback with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error retrieving feedback' });
  }
};

/**
 * Get analytics about feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const analytics = await Feedback.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error getting feedback analytics:', error);
    res.status(500).json({ error: 'Error retrieving feedback analytics' });
  }
};