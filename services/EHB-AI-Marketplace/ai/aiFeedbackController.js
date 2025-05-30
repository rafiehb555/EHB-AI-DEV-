/**
 * AI Feedback Controller
 * 
 * This controller handles operations related to user feedback on AI responses
 * and suggestions for improving the AI assistant.
 * 
 * It integrates with Supabase for data storage and includes functions for:
 * - Submitting feedback on AI responses (rating, comments)
 * - Submitting improvement suggestions
 * - Retrieving feedback statistics
 * - Admin operations for managing feedback and suggestions
 */

const { aiFeedbackOperations, aiSuggestionOperations } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Utility function to handle Supabase errors
const handleSupabaseError = (error, defaultMessage = 'Database operation failed') => {
  console.error('Supabase Error:', error);
  return {
    message: error.message || defaultMessage,
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || {}
  };
};

// Controller methods
const aiFeedbackController = {
  /**
   * Submit feedback for an AI response
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async submitFeedback(req, res) {
    const { responseId, rating, comment, userId, responseText, context, userRole } = req.body;
    
    try {
      // Format the feedback data according to our schema
      const feedbackData = {
        responseId,
        rating: parseInt(rating),
        comment: comment || null,
        responseText: responseText || null,
        context: context || null,
        userId: userId || (req.user ? req.user.id : null),
        userRole: userRole || (req.user ? req.user.role : 'anonymous')
      };
      
      // Use the Supabase operations to create the feedback
      const feedback = await aiFeedbackOperations.createFeedback(feedbackData);
      
      if (!feedback) {
        return res.status(500).json({ message: 'Failed to submit feedback' });
      }
      
      res.status(201).json({ 
        message: 'Feedback submitted successfully',
        feedback
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      res.status(500).json({ 
        message: 'Failed to submit feedback',
        error: err.message 
      });
    }
  },
  
  /**
   * Submit improvement suggestion for the AI assistant
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async submitSuggestion(req, res) {
    const { category, description, userId, userRole, priority } = req.body;
    
    try {
      // Format the suggestion data according to our schema
      const suggestionData = {
        category,
        description,
        userId: userId || (req.user ? req.user.id : null),
        userRole: userRole || (req.user ? req.user.role : 'anonymous'),
        priority: priority || 'medium'
      };
      
      // Use the Supabase operations to create the suggestion
      const suggestion = await aiSuggestionOperations.createSuggestion(suggestionData);
      
      if (!suggestion) {
        return res.status(500).json({ message: 'Failed to submit suggestion' });
      }
      
      res.status(201).json({ 
        message: 'Suggestion submitted successfully',
        suggestion
      });
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      res.status(500).json({ 
        message: 'Failed to submit suggestion',
        error: err.message 
      });
    }
  },
  
  /**
   * Get my feedback and suggestions
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMyFeedbackAndSuggestions(req, res) {
    // For testing purposes, we'll allow anonymous access with a mock user ID
    // This will be replaced with proper authentication later
    const userId = req.user ? req.user.id : 'anonymous-user-for-testing';
    
    try {
      // Get user's feedback
      const feedback = await aiFeedbackOperations.getAllFeedback({ userId });
      
      // Get user's suggestions
      const suggestions = await aiSuggestionOperations.getAllSuggestions({ userId });
      
      res.status(200).json({
        feedback: feedback || [],
        suggestions: suggestions || []
      });
    } catch (err) {
      console.error('Error fetching user feedback and suggestions:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback and suggestions',
        error: err.message 
      });
    }
  },
  
  /**
   * Get all feedback (for admin users)
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllFeedback(req, res) {
    try {
      // Get query parameters for filtering
      const { rating, userRole, startDate, endDate, limit = 100, offset = 0 } = req.query;
      
      // Build query
      let query = supabase
        .from('ai_feedback')
        .select('*');
      
      // Apply filters if provided
      if (rating) {
        query = query.eq('rating', parseInt(rating));
      }
      
      if (userRole) {
        query = query.eq('userRole', userRole);
      }
      
      if (startDate) {
        query = query.gte('createdAt', startDate);
      }
      
      if (endDate) {
        query = query.lte('createdAt', endDate);
      }
      
      // Apply pagination and ordering
      query = query
        .order('createdAt', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) {
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      res.status(200).json({
        feedback: data || [],
        count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (err) {
      console.error('Error fetching all feedback:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback',
        error: err.message 
      });
    }
  },
  
  /**
   * Get all suggestions (for admin users)
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllSuggestions(req, res) {
    try {
      // Get query parameters for filtering
      const { category, status, priority, userRole, startDate, endDate, limit = 100, offset = 0 } = req.query;
      
      // Build query
      let query = supabase
        .from('ai_suggestions')
        .select('*');
      
      // Apply filters if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (priority) {
        query = query.eq('priority', priority);
      }
      
      if (userRole) {
        query = query.eq('userRole', userRole);
      }
      
      if (startDate) {
        query = query.gte('createdAt', startDate);
      }
      
      if (endDate) {
        query = query.lte('createdAt', endDate);
      }
      
      // Apply pagination and ordering
      query = query
        .order('createdAt', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) {
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      res.status(200).json({
        suggestions: data || [],
        count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (err) {
      console.error('Error fetching all suggestions:', err);
      res.status(500).json({ 
        message: 'Failed to fetch suggestions',
        error: err.message 
      });
    }
  },
  
  /**
   * Get feedback by ID
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFeedbackById(req, res) {
    const { id } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('ai_feedback')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return res.status(404).json({ message: 'Feedback not found' });
        }
        
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      // Check if user has permission to view this feedback
      if (!req.user.isAdmin && data.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this feedback' });
      }
      
      res.status(200).json({ feedback: data });
    } catch (err) {
      console.error('Error fetching feedback by ID:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback',
        error: err.message 
      });
    }
  },
  
  /**
   * Get suggestion by ID
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSuggestionById(req, res) {
    const { id } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return res.status(404).json({ message: 'Suggestion not found' });
        }
        
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      // Check if user has permission to view this suggestion
      if (!req.user.isAdmin && data.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this suggestion' });
      }
      
      res.status(200).json({ suggestion: data });
    } catch (err) {
      console.error('Error fetching suggestion by ID:', err);
      res.status(500).json({ 
        message: 'Failed to fetch suggestion',
        error: err.message 
      });
    }
  },
  
  /**
   * Update suggestion status (admin only)
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateSuggestionStatus(req, res) {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'under_review', 'implemented', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    try {
      const timestamp = new Date().toISOString();
      
      // Update the suggestion
      const { data, error } = await supabase
        .from('ai_suggestions')
        .update({ 
          status, 
          adminComment: adminComment || null,
          updatedAt: timestamp,
          adminId: req.user.id,
          adminName: req.user.name || req.user.username
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return res.status(404).json({ message: 'Suggestion not found' });
        }
        
        const formattedError = handleSupabaseError(error, 'Failed to update suggestion status');
        return res.status(500).json({ error: formattedError });
      }
      
      res.status(200).json({
        message: 'Suggestion status updated successfully',
        suggestion: data
      });
    } catch (err) {
      console.error('Error updating suggestion status:', err);
      res.status(500).json({ 
        message: 'Failed to update suggestion status',
        error: err.message 
      });
    }
  },
  
  /**
   * Get AI feedback statistics
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFeedbackStats(req, res) {
    try {
      // Get total counts
      const { count: totalFeedback, error: feedbackError } = await supabase
        .from('ai_feedback')
        .select('*', { count: 'exact', head: true });
      
      if (feedbackError) {
        const formattedError = handleSupabaseError(feedbackError);
        return res.status(500).json({ error: formattedError });
      }
      
      const { count: totalSuggestions, error: suggestionsError } = await supabase
        .from('ai_suggestions')
        .select('*', { count: 'exact', head: true });
      
      if (suggestionsError) {
        const formattedError = handleSupabaseError(suggestionsError);
        return res.status(500).json({ error: formattedError });
      }
      
      // Get average rating
      const { data: ratingData, error: ratingError } = await supabase
        .from('ai_feedback')
        .select('rating');
      
      if (ratingError) {
        const formattedError = handleSupabaseError(ratingError);
        return res.status(500).json({ error: formattedError });
      }
      
      // Calculate average rating
      let averageRating = 0;
      if (ratingData && ratingData.length > 0) {
        const sum = ratingData.reduce((acc, item) => acc + item.rating, 0);
        averageRating = sum / ratingData.length;
      }
      
      // Get suggestion status counts
      const { data: statusData, error: statusError } = await supabase
        .from('ai_suggestions')
        .select('status');
      
      if (statusError) {
        const formattedError = handleSupabaseError(statusError);
        return res.status(500).json({ error: formattedError });
      }
      
      // Count suggestions by status
      const suggestionStatusCounts = {
        pending: 0,
        under_review: 0,
        implemented: 0,
        declined: 0
      };
      
      statusData.forEach(item => {
        if (suggestionStatusCounts[item.status] !== undefined) {
          suggestionStatusCounts[item.status]++;
        }
      });
      
      // Get feedback rating distribution
      const { data: ratingDistData, error: ratingDistError } = await supabase
        .from('ai_feedback')
        .select('rating');
      
      if (ratingDistError) {
        const formattedError = handleSupabaseError(ratingDistError);
        return res.status(500).json({ error: formattedError });
      }
      
      // Count feedback by rating
      const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      
      ratingDistData.forEach(item => {
        if (ratingDistribution[item.rating] !== undefined) {
          ratingDistribution[item.rating]++;
        }
      });
      
      // Return the statistics
      res.status(200).json({
        stats: {
          totalFeedback,
          totalSuggestions,
          averageRating,
          suggestionStatusCounts,
          ratingDistribution,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error fetching feedback statistics:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback statistics',
        error: err.message 
      });
    }
  },
  
  /**
   * Get my feedback and suggestions
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMyFeedbackAndSuggestions(req, res) {
    try {
      // Allow anonymous requests with a fallback empty response
      if (!req.user || !req.user.id) {
        return res.status(200).json({
          feedback: [],
          suggestions: []
        });
      }
      
      // Get user's feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('ai_feedback')
        .select('*')
        .eq('userId', req.user.id)
        .order('createdAt', { ascending: false });
      
      if (feedbackError) {
        const formattedError = handleSupabaseError(feedbackError);
        return res.status(500).json({ error: formattedError });
      }
      
      // Get user's suggestions
      const { data: suggestions, error: suggestionsError } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('userId', req.user.id)
        .order('createdAt', { ascending: false });
      
      if (suggestionsError) {
        const formattedError = handleSupabaseError(suggestionsError);
        return res.status(500).json({ error: formattedError });
      }
      
      res.status(200).json({
        feedback: feedback || [],
        suggestions: suggestions || []
      });
    } catch (err) {
      console.error('Error fetching user feedback and suggestions:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback and suggestions',
        error: err.message 
      });
    }
  },
  
  /**
   * Get feedback by ID
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFeedbackById(req, res) {
    const { id } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('ai_feedback')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return res.status(404).json({ message: 'Feedback not found' });
        }
        
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      // Check if user has permission to view this feedback
      if (req.user && !req.user.isAdmin && data.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this feedback' });
      }
      
      res.status(200).json({ feedback: data });
    } catch (err) {
      console.error('Error fetching feedback by ID:', err);
      res.status(500).json({ 
        message: 'Failed to fetch feedback',
        error: err.message 
      });
    }
  },
  
  /**
   * Get suggestion by ID
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSuggestionById(req, res) {
    const { id } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return res.status(404).json({ message: 'Suggestion not found' });
        }
        
        const formattedError = handleSupabaseError(error);
        return res.status(500).json({ error: formattedError });
      }
      
      // Check if user has permission to view this suggestion
      if (req.user && !req.user.isAdmin && data.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this suggestion' });
      }
      
      res.status(200).json({ suggestion: data });
    } catch (err) {
      console.error('Error fetching suggestion by ID:', err);
      res.status(500).json({ 
        message: 'Failed to fetch suggestion',
        error: err.message 
      });
    }
  }
};

// Check for missing methods
if (!aiFeedbackController.submitFeedback) {
  console.error('ERROR: submitFeedback method is missing');
}
if (!aiFeedbackController.submitSuggestion) {
  console.error('ERROR: submitSuggestion method is missing');
}
if (!aiFeedbackController.getMyFeedbackAndSuggestions) {
  console.error('ERROR: getMyFeedbackAndSuggestions method is missing');
}
if (!aiFeedbackController.getFeedbackStats) {
  console.error('ERROR: getFeedbackStats method is missing');
}
if (!aiFeedbackController.getAllFeedback) {
  console.error('ERROR: getAllFeedback method is missing');
}
if (!aiFeedbackController.getAllSuggestions) {
  console.error('ERROR: getAllSuggestions method is missing');
}
if (!aiFeedbackController.updateSuggestionStatus) {
  console.error('ERROR: updateSuggestionStatus method is missing');
}
if (!aiFeedbackController.getFeedbackById) {
  console.error('ERROR: getFeedbackById method is missing');
}
if (!aiFeedbackController.getSuggestionById) {
  console.error('ERROR: getSuggestionById method is missing');
}

module.exports = aiFeedbackController;