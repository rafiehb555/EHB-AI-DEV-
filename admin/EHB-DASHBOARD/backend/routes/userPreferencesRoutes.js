const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Initialize the user_preferences table if it doesn't exist
router.use(async (req, res, next) => {
  try {
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_preferences'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      await pool.query(`
        CREATE TABLE user_preferences (
          id UUID PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL UNIQUE,
          preferences JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('Created user_preferences table');
    }
    next();
  } catch (error) {
    console.error('Error initializing user_preferences table:', error);
    next(error);
  }
});

/**
 * @route GET /api/preferences
 * @desc Get user preferences
 */
router.get('/', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    const result = await pool.query(
      'SELECT preferences FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    if (result.rowCount === 0) {
      return res.json({ preferences: {} });
    }
    
    res.json({ preferences: result.rows[0].preferences });
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/preferences
 * @desc Save user preferences
 */
router.post('/', async (req, res) => {
  const { userId, preferences } = req.body;
  
  if (!userId || !preferences) {
    return res.status(400).json({ error: 'User ID and preferences are required' });
  }
  
  try {
    // Check if user already has preferences
    const existingPrefs = await pool.query(
      'SELECT id FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    if (existingPrefs.rowCount === 0) {
      // Insert new preferences
      await pool.query(
        'INSERT INTO user_preferences (id, user_id, preferences) VALUES ($1, $2, $3)',
        [uuidv4(), userId, preferences]
      );
    } else {
      // Update existing preferences
      await pool.query(
        'UPDATE user_preferences SET preferences = $1, updated_at = NOW() WHERE user_id = $2',
        [preferences, userId]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PATCH /api/preferences
 * @desc Update specific preference fields
 */
router.patch('/', async (req, res) => {
  const { userId, updates } = req.body;
  
  if (!userId || !updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'User ID and preference updates object are required' });
  }
  
  try {
    // Get existing preferences
    const result = await pool.query(
      'SELECT preferences FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    let preferences = {};
    
    if (result.rowCount > 0) {
      preferences = result.rows[0].preferences;
    }
    
    // Merge updates with existing preferences
    const updatedPreferences = { ...preferences, ...updates };
    
    if (result.rowCount === 0) {
      // Insert new preferences
      await pool.query(
        'INSERT INTO user_preferences (id, user_id, preferences) VALUES ($1, $2, $3)',
        [uuidv4(), userId, updatedPreferences]
      );
    } else {
      // Update existing preferences
      await pool.query(
        'UPDATE user_preferences SET preferences = $1, updated_at = NOW() WHERE user_id = $2',
        [updatedPreferences, userId]
      );
    }
    
    res.json({ success: true, preferences: updatedPreferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/preferences
 * @desc Reset user preferences to defaults
 */
router.delete('/', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    await pool.query(
      'DELETE FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting user preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;