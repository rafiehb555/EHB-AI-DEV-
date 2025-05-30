/**
 * User Preferences Service
 * Handles API calls to the user preferences endpoint
 */

// Default API URL - can be overridden by environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get user preferences from the server
 * @param {string} userId User ID
 * @returns {Promise<Object>} User preferences
 */
export const getUserPreferences = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/preferences?userId=${encodeURIComponent(userId)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
};

/**
 * Save user preferences to the server
 * @param {string} userId User ID
 * @param {Object} preferences User preferences
 * @returns {Promise<Object>} Result
 */
export const saveUserPreferences = async (userId, preferences) => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, preferences }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save user preferences: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

/**
 * Update specific user preference fields
 * @param {string} userId User ID
 * @param {Object} updates Preference updates
 * @returns {Promise<Object>} Result
 */
export const updateUserPreferences = async (userId, updates) => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, updates }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user preferences: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Reset user preferences to defaults
 * @param {string} userId User ID
 * @returns {Promise<Object>} Result
 */
export const resetUserPreferences = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/preferences?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reset user preferences: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error resetting user preferences:', error);
    throw error;
  }
};