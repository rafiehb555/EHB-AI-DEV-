const { pool } = require('../db/db');

/**
 * Feedback model that interacts with the PostgreSQL database
 */
class Feedback {
  /**
   * Create a new feedback entry
   * @param {Object} feedbackData - Feedback details
   * @returns {Promise<Object>} The created feedback
   */
  static async create(feedbackData) {
    const { user_id, content, category, rating, source, page_url } = feedbackData;
    
    try {
      const result = await pool.query(
        `INSERT INTO feedback (user_id, content, category, rating, source, page_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, content, category, rating, source, page_url]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }

  /**
   * Get all feedback entries
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of feedbacks
   */
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM feedback';
      const queryParams = [];
      let whereConditions = [];
      
      // Add any filters
      if (filters.user_id) {
        whereConditions.push(`user_id = $${queryParams.length + 1}`);
        queryParams.push(filters.user_id);
      }
      
      if (filters.category) {
        whereConditions.push(`category = $${queryParams.length + 1}`);
        queryParams.push(filters.category);
      }
      
      if (filters.rating) {
        whereConditions.push(`rating = $${queryParams.length + 1}`);
        queryParams.push(filters.rating);
      }
      
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add ordering
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  }

  /**
   * Get feedback by ID
   * @param {number} id - Feedback ID 
   * @returns {Promise<Object>} The feedback entry
   */
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM feedback WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error getting feedback with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get analytics about feedback
   * @returns {Promise<Object>} Feedback analytics
   */
  static async getAnalytics() {
    try {
      // Average rating
      const avgRatingResult = await pool.query('SELECT AVG(rating) as average_rating FROM feedback');
      
      // Count by category
      const categoryCountResult = await pool.query(
        'SELECT category, COUNT(*) as count FROM feedback GROUP BY category'
      );
      
      // Count by rating
      const ratingCountResult = await pool.query(
        'SELECT rating, COUNT(*) as count FROM feedback GROUP BY rating ORDER BY rating'
      );
      
      // Total count
      const totalCountResult = await pool.query('SELECT COUNT(*) as total FROM feedback');
      
      return {
        averageRating: avgRatingResult.rows[0].average_rating || 0,
        categoryBreakdown: categoryCountResult.rows,
        ratingBreakdown: ratingCountResult.rows,
        totalCount: totalCountResult.rows[0].total
      };
    } catch (error) {
      console.error('Error getting feedback analytics:', error);
      throw error;
    }
  }
}

module.exports = Feedback;