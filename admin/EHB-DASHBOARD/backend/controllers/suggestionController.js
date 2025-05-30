const Suggestion = require('../models/Suggestion');

/**
 * Submit a new suggestion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitSuggestion = async (req, res) => {
  try {
    const { content, category, estimated_complexity, source } = req.body;
    
    // Validation
    if (!content) {
      return res.status(400).json({ error: 'Suggestion content is required' });
    }
    
    // Get user_id from authenticated session if available
    const user_id = req.user ? req.user.id : null;
    
    const suggestionData = {
      user_id,
      content,
      category,
      estimated_complexity,
      source
    };
    
    const suggestion = await Suggestion.create(suggestionData);
    
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    res.status(500).json({ error: 'Error submitting suggestion' });
  }
};

/**
 * Get all suggestions with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllSuggestions = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { user_id, category, status, implemented } = req.query;
    
    const filters = {};
    
    if (user_id) filters.user_id = parseInt(user_id);
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (implemented !== undefined) {
      filters.implemented = implemented.toLowerCase() === 'true';
    }
    
    const suggestions = await Suggestion.getAll(filters);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Error retrieving suggestions' });
  }
};

/**
 * Get a specific suggestion by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSuggestionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const suggestion = await Suggestion.getById(parseInt(id));
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error(`Error getting suggestion with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error retrieving suggestion' });
  }
};

/**
 * Update a suggestion's status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimated_complexity } = req.body;
    
    // Validate the status value
    const validStatuses = ['pending', 'in_progress', 'rejected', 'approved', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value. Must be one of: ' + validStatuses.join(', ') 
      });
    }
    
    const updateData = {};
    if (status) updateData.status = status;
    if (estimated_complexity) updateData.estimated_complexity = estimated_complexity;
    
    const suggestion = await Suggestion.update(parseInt(id), updateData);
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error(`Error updating suggestion with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error updating suggestion' });
  }
};

/**
 * Upvote a suggestion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.upvoteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const suggestion = await Suggestion.upvote(parseInt(id));
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error(`Error upvoting suggestion with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error upvoting suggestion' });
  }
};

/**
 * Mark a suggestion as implemented
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsImplemented = async (req, res) => {
  try {
    const { id } = req.params;
    
    const suggestion = await Suggestion.markAsImplemented(parseInt(id));
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error(`Error marking suggestion with id ${req.params.id} as implemented:`, error);
    res.status(500).json({ error: 'Error marking suggestion as implemented' });
  }
};

/**
 * Get analytics about suggestions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSuggestionAnalytics = async (req, res) => {
  try {
    const analytics = await Suggestion.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error getting suggestion analytics:', error);
    res.status(500).json({ error: 'Error retrieving suggestion analytics' });
  }
};