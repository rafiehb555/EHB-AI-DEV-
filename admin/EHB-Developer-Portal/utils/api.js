import axios from 'axios';

// Create a base axios instance with defaults
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Handle API responses and errors
const handleResponse = (response) => {
  return response.data;
};

const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with an error
    console.error('API Error Response:', error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error Request:', error.request);
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request
    console.error('API Error:', error.message);
    throw new Error(error.message || 'An error occurred');
  }
};

// API utility functions
export const getServices = async (category) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/services', { params });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await api.get('/health');
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getBackendStatus = async () => {
  try {
    const response = await api.get('/backend/status');
    return handleResponse(response);
  } catch (error) {
    // If the backend is not available, return a default status
    return {
      status: 'offline',
      message: 'Backend service is currently unavailable',
    };
  }
};

export const getServiceStatus = async (serviceId) => {
  try {
    const response = await api.get(`/service/${serviceId}/status`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export default {
  getServices,
  getSystemHealth,
  getBackendStatus,
  getServiceStatus,
};