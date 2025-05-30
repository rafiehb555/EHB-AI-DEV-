/**
 * Onboarding Service
 * 
 * This service provides methods to interact with the onboarding API
 */

import { getRequest, postRequest } from '../utils/apiHelper';

/**
 * Check if a user has completed onboarding
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Whether onboarding is completed
 */
export const checkOnboardingStatus = async (userId) => {
  try {
    const data = await getRequest(`/api/onboarding/status/${userId}`);
    return data.completed;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Get the onboarding flow for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} The onboarding steps
 */
export const getOnboardingFlow = async (userId) => {
  try {
    const data = await getRequest(`/api/onboarding/flow/${userId}`);
    return data.steps;
  } catch (error) {
    console.error('Error getting onboarding flow:', error);
    return [];
  }
};

/**
 * Generate a new onboarding flow for a user
 * @param {Object} userInfo - The user information
 * @returns {Promise<Array>} The onboarding steps
 */
export const generateOnboardingFlow = async (userInfo) => {
  try {
    const data = await postRequest('/api/onboarding/flow', userInfo);
    return data.steps;
  } catch (error) {
    console.error('Error generating onboarding flow:', error);
    return [];
  }
};

/**
 * Submit a response to an onboarding step
 * @param {string} userId - The user ID
 * @param {string} stepId - The step ID
 * @param {Object} response - The user's response
 * @returns {Promise<Object>} The AI guidance
 */
export const submitStepResponse = async (userId, stepId, response) => {
  try {
    return await postRequest(`/api/onboarding/step/${userId}/${stepId}`, response);
  } catch (error) {
    console.error('Error submitting step response:', error);
    return {};
  }
};

/**
 * Mark onboarding as completed for a user
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const completeOnboarding = async (userId) => {
  try {
    const data = await postRequest(`/api/onboarding/complete/${userId}`);
    return data.completed;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return false;
  }
};

/**
 * Generate a demo onboarding flow for testing
 * @param {Object} options - Options for the demo flow
 * @param {string} options.role - The user role (seller, buyer, franchise)
 * @param {string} options.skillLevel - The user skill level (beginner, intermediate, expert)
 * @param {Object} options.preferences - User preferences
 * @returns {Promise<Object>} The demo user ID and flow steps
 */
export const generateDemoFlow = async (options = {}) => {
  try {
    return await postRequest('/api/onboarding/generate-demo', options);
  } catch (error) {
    console.error('Error generating demo flow:', error);
    return { userId: null, steps: [] };
  }
};

// Export all methods as a service object
export default {
  checkOnboardingStatus,
  getOnboardingFlow,
  generateOnboardingFlow,
  submitStepResponse,
  completeOnboarding,
  generateDemoFlow
};