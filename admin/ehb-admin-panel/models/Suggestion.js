const { pool } = require('../db/db');

/**
 * Suggestion model that interacts with the PostgreSQL database
 */
class Suggestion {
  /**
   * Create a new suggestion entry
   * @param {Object} suggestionData - Suggestion details
   * @returns {Promise<Object>} The created suggestion
   */
  static async create(suggestionData) {
    const { 
      user_id, 
      content, 
      category, 
      status = 'pending', 
      estimated_complexity = 'medium',
      source
    } = suggestionData;
    
    try {
      const result = await pool.query(
        `INSERT INTO suggestions (
          user_id, content, category, status, 
          estimated_complexity, source
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [user_id, content, category, status, estimated_complexity, source]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  /**
   * Get all suggestion entries
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of suggestions
   */
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM suggestions';
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
      
      if (filters.status) {
        whereConditions.push(`status = $${queryParams.length + 1}`);
        queryParams.push(filters.status);
      }
      
      if (filters.implemented !== undefined) {
        whereConditions.push(`implemented = $${queryParams.length + 1}`);
        queryParams.push(filters.implemented);
      }
      
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add ordering
      query += ' ORDER BY upvotes DESC, created_at DESC';
      
      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  /**
   * Get suggestion by ID
   * @param {number} id - Suggestion ID 
   * @returns {Promise<Object>} The suggestion entry
   */
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM suggestions WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error getting suggestion with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a suggestion
   * @param {number} id - Suggestion ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated suggestion
   */
  static async update(id, updateData) {
    try {
      const { status, upvotes, implemented, estimated_complexity } = updateData;
      
      // Build the update query dynamically
      let updateQuery = 'UPDATE suggestions SET updated_at = NOW()';
      const queryParams = [];
      let paramIndex = 1;
      
      if (status !== undefined) {
        updateQuery += `, status = $${paramIndex++}`;
        queryParams.push(status);
      }
      
      if (upvotes !== undefined) {
        updateQuery += `, upvotes = $${paramIndex++}`;
        queryParams.push(upvotes);
      }
      
      if (implemented !== undefined) {
        updateQuery += `, implemented = $${paramIndex++}`;
        queryParams.push(implemented);
      }
      
      if (estimated_complexity !== undefined) {
        updateQuery += `, estimated_complexity = $${paramIndex++}`;
        queryParams.push(estimated_complexity);
      }
      
      updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
      queryParams.push(id);
      
      const result = await pool.query(updateQuery, queryParams);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error updating suggestion with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upvote a suggestion
   * @param {number} id - Suggestion ID
   * @returns {Promise<Object>} Updated suggestion with new upvote count
   */
  static async upvote(id) {
    try {
      const result = await pool.query(
        'UPDATE suggestions SET upvotes = upvotes + 1, updated_at = NOW() WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error upvoting suggestion with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark a suggestion as implemented
   * @param {number} id - Suggestion ID
   * @returns {Promise<Object>} Updated suggestion
   */
  static async markAsImplemented(id) {
    try {
      const result = await pool.query(
        `UPDATE suggestions 
         SET implemented = TRUE, status = 'completed', updated_at = NOW() 
         WHERE id = $1 RETURNING *`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error marking suggestion with id ${id} as implemented:`, error);
      throw error;
    }
  }

  /**
   * Get analytics about suggestions
   * @returns {Promise<Object>} Suggestion analytics
   */
  static async getAnalytics() {
    try {
      // Count by status
      const statusCountResult = await pool.query(
        'SELECT status, COUNT(*) as count FROM suggestions GROUP BY status'
      );
      
      // Count by category
      const categoryCountResult = await pool.query(
        'SELECT category, COUNT(*) as count FROM suggestions GROUP BY category'
      );
      
      // Implementation rate
      const implementationResult = await pool.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN implemented = TRUE THEN 1 ELSE 0 END) as implemented
        FROM suggestions`
      );
      
      // Top voted suggestions
      const topVotedResult = await pool.query(
        'SELECT * FROM suggestions ORDER BY upvotes DESC LIMIT 5'
      );
      
      return {
        statusBreakdown: statusCountResult.rows,
        categoryBreakdown: categoryCountResult.rows,
        implementationRate: {
          total: parseInt(implementationResult.rows[0].total),
          implemented: parseInt(implementationResult.rows[0].implemented),
          rate: implementationResult.rows[0].total > 0 
            ? (implementationResult.rows[0].implemented / implementationResult.rows[0].total)
            : 0
        },
        topVoted: topVotedResult.rows
      };
    } catch (error) {
      console.error('Error getting suggestion analytics:', error);
      throw error;
    }
  }
}

module.exports = Suggestion;