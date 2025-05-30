import axios from 'axios';

/**
 * Utility functions for analytics API endpoints
 */

// Base API URL - in a real production app, this might come from environment variables
const API_BASE_URL = '/api/analytics';

/**
 * Get analytics overview data
 * @param {string} timeRange - The time range for analytics (e.g., '7d', '30d')
 * @returns {Promise} - The API response promise
 */
export const getAnalyticsOverview = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/overview`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
};

/**
 * Get usage metrics data
 * @param {string} timeRange - The time range for analytics (e.g., '7d', '30d')
 * @returns {Promise} - The API response promise
 */
export const getUsageMetrics = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usage`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching usage metrics:', error);
    throw error;
  }
};

/**
 * Get performance metrics data
 * @param {string} timeRange - The time range for analytics (e.g., '7d', '30d')
 * @returns {Promise} - The API response promise
 */
export const getPerformanceMetrics = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/performance`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};

/**
 * Get user statistics data
 * @param {string} timeRange - The time range for analytics (e.g., '7d', '30d')
 * @returns {Promise} - The API response promise
 */
export const getUserStats = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

/**
 * Get AI usage data
 * @param {string} timeRange - The time range for analytics (e.g., '7d', '30d')
 * @returns {Promise} - The API response promise
 */
export const getAiUsageData = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ai-usage`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI usage data:', error);
    throw error;
  }
};

/**
 * Generate a report
 * @param {Object} reportConfig - The report configuration
 * @returns {Promise} - The API response promise
 */
export const generateReport = async (reportConfig) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-report`, reportConfig);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

/**
 * Download a report
 * @param {string} reportId - The ID of the report to download
 * @returns {Promise} - The API response promise
 */
export const downloadReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download-report/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};

// Export all functions as a single object
export const analyticsApi = {
  getAnalyticsOverview,
  getUsageMetrics,
  getPerformanceMetrics,
  getUserStats,
  getAiUsageData,
  generateReport,
  downloadReport
};