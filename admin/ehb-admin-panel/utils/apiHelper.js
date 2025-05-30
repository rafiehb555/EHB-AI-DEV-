/**
 * API Helper Functions
 */

// Base API URL - in production this would be based on environment
const API_BASE_URL = 'http://localhost:5000';

/**
 * Make an API request
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint (starting with /)
 * @param {Object} data - Data to send (for POST, PUT)
 * @returns {Promise<Response>} - Fetch response
 */
export const apiRequest = async (method, endpoint, data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers here if needed
    },
    credentials: 'include', // Include cookies for authentication
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Handle unauthorized or forbidden responses
    if (response.status === 401 || response.status === 403) {
      // Handle authentication errors
      console.error('Authentication error');
      // Redirect to login or display error message
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * GET request shorthand
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - JSON response
 */
export const getRequest = async (endpoint) => {
  const response = await apiRequest('GET', endpoint);
  return response.json();
};

/**
 * POST request shorthand
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<Object>} - JSON response
 */
export const postRequest = async (endpoint, data) => {
  const response = await apiRequest('POST', endpoint, data);
  return response.json();
};

/**
 * PUT request shorthand
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<Object>} - JSON response
 */
export const putRequest = async (endpoint, data) => {
  const response = await apiRequest('PUT', endpoint, data);
  return response.json();
};

/**
 * DELETE request shorthand
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - JSON response
 */
export const deleteRequest = async (endpoint) => {
  const response = await apiRequest('DELETE', endpoint);
  return response.json();
};