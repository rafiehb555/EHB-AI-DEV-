/**
 * Analytics Service
 * Handles requests for analytics data
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all analytics data
 * @returns {Promise<Object>} Analytics data
 */
export const getAllAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

/**
 * Fetch user metrics
 * @returns {Promise<Object>} User metrics data
 */
export const getUserMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    throw error;
  }
};

/**
 * Fetch system metrics
 * @returns {Promise<Object>} System metrics data
 */
export const getSystemMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/system`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
};

/**
 * Fetch business metrics
 * @returns {Promise<Object>} Business metrics data
 */
export const getBusinessMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/business`);
    return response.data;
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    throw error;
  }
};

/**
 * Fetch content metrics
 * @returns {Promise<Object>} Content metrics data
 */
export const getContentMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/content`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content metrics:', error);
    throw error;
  }
};

/**
 * Fetch dashboard stats
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};