/**
 * Onboarding Test Utilities
 * 
 * This file contains utility functions for testing the onboarding system
 */

import onboardingService from '../services/onboardingService';

/**
 * Generate a mock onboarding flow for testing
 * @param {Object} options - Test options
 * @returns {Array} Mock onboarding steps
 */
export const generateMockFlow = (options = {}) => {
  const defaultOptions = {
    stepCount: 3,
    role: 'seller',
    stepTypes: ['text', 'multiple-choice', 'rating']
  };
  
  const settings = { ...defaultOptions, ...options };
  const steps = [];
  
  // Generate steps based on settings
  for (let i = 0; i < settings.stepCount; i++) {
    const stepType = settings.stepTypes[i % settings.stepTypes.length];
    const step = createMockStep(i + 1, stepType, settings.role);
    steps.push(step);
  }
  
  return steps;
};

/**
 * Create a mock step for the given type
 * @param {number} index - Step index
 * @param {string} type - Step type
 * @param {string} role - User role
 * @returns {Object} Mock step
 */
const createMockStep = (index, type, role) => {
  const baseStep = {
    id: `step-${index}`,
    title: `Step ${index}: ${getTitleForType(type, role)}`,
    description: `This is a ${type} step for ${role} users.`,
    type
  };
  
  switch (type) {
    case 'text':
      return {
        ...baseStep,
        placeholder: 'Enter your response here...'
      };
    case 'multiple-choice':
      return {
        ...baseStep,
        options: getOptionsForRole(role),
        allowMultiple: true
      };
    case 'rating':
      return {
        ...baseStep,
        minRating: 1,
        maxRating: 5
      };
    default:
      return baseStep;
  }
};

/**
 * Get a title for the step based on its type and user role
 * @param {string} type - Step type
 * @param {string} role - User role
 * @returns {string} Step title
 */
const getTitleForType = (type, role) => {
  const titles = {
    text: {
      seller: 'Tell us about your business',
      buyer: 'Tell us about your interests',
      franchise: 'Tell us about your franchise experience'
    },
    'multiple-choice': {
      seller: 'Select your product categories',
      buyer: 'Select your shopping preferences',
      franchise: 'Select your franchise locations'
    },
    rating: {
      seller: 'Rate your experience with online selling',
      buyer: 'Rate your online shopping experience',
      franchise: 'Rate your franchise management experience'
    }
  };
  
  return titles[type]?.[role] || `Default ${type} title`;
};

/**
 * Get options for a multiple-choice step based on user role
 * @param {string} role - User role
 * @returns {Array} Options for multiple-choice
 */
const getOptionsForRole = (role) => {
  const options = {
    seller: ['Electronics', 'Clothing', 'Home Goods', 'Food & Beverage', 'Services'],
    buyer: ['Free Shipping', 'Discounts', 'New Arrivals', 'Exclusive Deals'],
    franchise: ['Urban', 'Suburban', 'Rural', 'International']
  };
  
  return options[role] || ['Option 1', 'Option 2', 'Option 3'];
};

/**
 * Simulate an API call with a mock response
 * @param {string} endpoint - API endpoint
 * @param {Object} mockData - Mock response data
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise<Object>} Mock response
 */
export const simulateApiCall = (endpoint, mockData, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, delay);
  });
};

export default {
  generateMockFlow,
  simulateApiCall
};