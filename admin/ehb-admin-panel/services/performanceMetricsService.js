/**
 * Performance Metrics Service
 * Handles requests for real-time performance metrics data
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get real-time performance metrics
 * @returns {Promise<Object>} Real-time performance metrics
 */
export const getRealTimeMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/performance/realtime`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    
    // For development/demo purposes, return simulated data
    // In production, this should be removed and proper error handling should be implemented
    return generateSimulatedMetrics();
  }
};

/**
 * Get historical performance metrics
 * @param {string} timeframe - Timeframe for data (today, week, month)
 * @returns {Promise<Object>} Historical performance metrics
 */
export const getHistoricalMetrics = async (timeframe = 'today') => {
  try {
    const response = await axios.get(`${API_URL}/performance/historical?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    
    // For development/demo purposes, return simulated data
    // In production, this should be removed and proper error handling should be implemented
    return generateSimulatedHistoricalMetrics(timeframe);
  }
};

/**
 * Get application-specific performance metrics
 * @param {string} applicationId - Application identifier
 * @returns {Promise<Object>} Application performance metrics
 */
export const getApplicationMetrics = async (applicationId) => {
  try {
    const response = await axios.get(`${API_URL}/performance/application/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metrics for application ${applicationId}:`, error);
    
    // For development/demo purposes, return simulated data
    // In production, this should be removed and proper error handling should be implemented
    return generateSimulatedAppMetrics(applicationId);
  }
};

/**
 * Get database performance metrics
 * @returns {Promise<Object>} Database performance metrics
 */
export const getDatabaseMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/performance/database`);
    return response.data;
  } catch (error) {
    console.error('Error fetching database metrics:', error);
    
    // For development/demo purposes, return simulated data
    // In production, this should be removed and proper error handling should be implemented
    return generateSimulatedDatabaseMetrics();
  }
};

/**
 * Generate simulated metrics for development/demo purposes
 * @returns {Object} Simulated metrics
 */
const generateSimulatedMetrics = () => {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString();
  
  return {
    timestamp,
    cpu: {
      usage: Math.floor(Math.random() * 40) + 15, // 15-55%
      temperature: Math.floor(Math.random() * 20) + 40, // 40-60°C
      cores: [
        Math.floor(Math.random() * 50) + 10,
        Math.floor(Math.random() * 50) + 10,
        Math.floor(Math.random() * 50) + 10,
        Math.floor(Math.random() * 50) + 10
      ]
    },
    memory: {
      used: Math.floor(Math.random() * 8) + 4, // 4-12 GB
      total: 16, // 16 GB
      usagePercent: Math.floor(Math.random() * 30) + 25 // 25-55%
    },
    network: {
      incoming: Math.floor(Math.random() * 50) + 10, // 10-60 Mbps
      outgoing: Math.floor(Math.random() * 30) + 5, // 5-35 Mbps
      latency: Math.floor(Math.random() * 40) + 20 // 20-60ms
    },
    disk: {
      readSpeed: Math.floor(Math.random() * 200) + 100, // 100-300 MB/s
      writeSpeed: Math.floor(Math.random() * 150) + 50, // 50-200 MB/s
      usagePercent: Math.floor(Math.random() * 20) + 40 // 40-60%
    },
    applications: [
      {
        id: 'frontend',
        name: 'Frontend Server',
        status: 'healthy',
        responseTime: Math.floor(Math.random() * 100) + 20, // 20-120ms
        cpuUsage: Math.floor(Math.random() * 25) + 5, // 5-30%
        memoryUsage: Math.floor(Math.random() * 300) + 100 // 100-400 MB
      },
      {
        id: 'backend',
        name: 'Backend Server',
        status: 'healthy',
        responseTime: Math.floor(Math.random() * 80) + 10, // 10-90ms
        cpuUsage: Math.floor(Math.random() * 20) + 10, // 10-30%
        memoryUsage: Math.floor(Math.random() * 400) + 200 // 200-600 MB
      },
      {
        id: 'database',
        name: 'Database',
        status: 'healthy',
        responseTime: Math.floor(Math.random() * 40) + 5, // 5-45ms
        cpuUsage: Math.floor(Math.random() * 15) + 5, // 5-20%
        memoryUsage: Math.floor(Math.random() * 500) + 300 // 300-800 MB
      }
    ]
  };
};

/**
 * Generate simulated historical metrics for development/demo purposes
 * @param {string} timeframe - Timeframe for data
 * @returns {Object} Simulated historical metrics
 */
const generateSimulatedHistoricalMetrics = (timeframe) => {
  let dataPoints = 24; // Default for 'today' (hourly data)
  
  if (timeframe === 'week') {
    dataPoints = 7; // 7 days
  } else if (timeframe === 'month') {
    dataPoints = 30; // 30 days
  }
  
  const cpuData = [];
  const memoryData = [];
  const responseTimeData = [];
  const networkData = [];
  
  let baseTime;
  if (timeframe === 'today') {
    baseTime = new Date();
    baseTime.setHours(0, 0, 0, 0);
  } else if (timeframe === 'week') {
    baseTime = new Date();
    baseTime.setDate(baseTime.getDate() - 7);
    baseTime.setHours(0, 0, 0, 0);
  } else if (timeframe === 'month') {
    baseTime = new Date();
    baseTime.setDate(baseTime.getDate() - 30);
    baseTime.setHours(0, 0, 0, 0);
  }
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(baseTime);
    
    if (timeframe === 'today') {
      timestamp.setHours(timestamp.getHours() + i);
    } else if (timeframe === 'week' || timeframe === 'month') {
      timestamp.setDate(timestamp.getDate() + i);
    }
    
    // CPU metrics (vary between 20-60%)
    cpuData.push({
      timestamp: timestamp.toISOString(),
      value: Math.floor(Math.random() * 40) + 20
    });
    
    // Memory metrics (vary between 30-70%)
    memoryData.push({
      timestamp: timestamp.toISOString(),
      value: Math.floor(Math.random() * 40) + 30
    });
    
    // Response time metrics (vary between 50-200ms)
    responseTimeData.push({
      timestamp: timestamp.toISOString(),
      value: Math.floor(Math.random() * 150) + 50
    });
    
    // Network traffic metrics (vary between 10-60Mbps)
    networkData.push({
      timestamp: timestamp.toISOString(),
      incoming: Math.floor(Math.random() * 50) + 10,
      outgoing: Math.floor(Math.random() * 40) + 10
    });
  }
  
  return {
    timeframe,
    dataPoints,
    metrics: {
      cpu: cpuData,
      memory: memoryData,
      responseTime: responseTimeData,
      network: networkData
    }
  };
};

/**
 * Generate simulated app metrics for development/demo purposes
 * @param {string} applicationId - Application identifier
 * @returns {Object} Simulated application metrics
 */
const generateSimulatedAppMetrics = (applicationId) => {
  const appNames = {
    'frontend': 'Frontend Server',
    'backend': 'Backend Server',
    'database': 'Database',
    'gosellr': 'GoSellr Service',
    'home': 'EHB-HOME Service'
  };
  
  const name = appNames[applicationId] || `Application ${applicationId}`;
  
  // Random status (mostly healthy, occasionally warning)
  const statuses = ['healthy', 'healthy', 'healthy', 'healthy', 'warning'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Generate "requests per minute" data for the last 60 minutes
  const requestsPerMinute = [];
  const errorRates = [];
  const baseTime = new Date();
  baseTime.setMinutes(baseTime.getMinutes() - 60);
  
  for (let i = 0; i < 60; i++) {
    const timestamp = new Date(baseTime);
    timestamp.setMinutes(timestamp.getMinutes() + i);
    
    // Random requests per minute (100-500)
    requestsPerMinute.push({
      timestamp: timestamp.toISOString(),
      value: Math.floor(Math.random() * 400) + 100
    });
    
    // Random error rate (0-5%)
    errorRates.push({
      timestamp: timestamp.toISOString(),
      value: Math.random() * 5
    });
  }
  
  return {
    id: applicationId,
    name,
    status,
    uptime: Math.floor(Math.random() * 500) + 100, // 100-600 hours
    metrics: {
      responseTime: Math.floor(Math.random() * 150) + 50, // 50-200ms
      cpuUsage: Math.floor(Math.random() * 40) + 10, // 10-50%
      memoryUsage: Math.floor(Math.random() * 500) + 200, // 200-700 MB
      threadCount: Math.floor(Math.random() * 15) + 5, // 5-20 threads
      requestsPerMinute,
      errorRates
    }
  };
};

/**
 * Generate simulated database metrics for development/demo purposes
 * @returns {Object} Simulated database metrics
 */
const generateSimulatedDatabaseMetrics = () => {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString();
  
  // Generate query metrics for the last 30 minutes
  const queryHistory = [];
  const baseTime = new Date();
  baseTime.setMinutes(baseTime.getMinutes() - 30);
  
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(baseTime);
    timestamp.setMinutes(timestamp.getMinutes() + i);
    
    queryHistory.push({
      timestamp: timestamp.toISOString(),
      reads: Math.floor(Math.random() * 300) + 100, // 100-400 reads per minute
      writes: Math.floor(Math.random() * 100) + 50, // 50-150 writes per minute
      avgQueryTime: Math.floor(Math.random() * 15) + 5 // 5-20ms
    });
  }
  
  // Generate tables with varying row counts
  const tables = [
    { name: 'users', rows: Math.floor(Math.random() * 5000) + 1000, size: Math.floor(Math.random() * 50) + 10 },
    { name: 'orders', rows: Math.floor(Math.random() * 10000) + 5000, size: Math.floor(Math.random() * 100) + 50 },
    { name: 'products', rows: Math.floor(Math.random() * 3000) + 1000, size: Math.floor(Math.random() * 30) + 20 },
    { name: 'payments', rows: Math.floor(Math.random() * 8000) + 3000, size: Math.floor(Math.random() * 80) + 40 },
    { name: 'subscriptions', rows: Math.floor(Math.random() * 2000) + 500, size: Math.floor(Math.random() * 20) + 10 }
  ];
  
  // Generate slow queries
  const slowQueries = [
    { query: 'SELECT * FROM orders WHERE created_at > ?', avgTime: Math.floor(Math.random() * 100) + 200, count: Math.floor(Math.random() * 50) + 10 },
    { query: 'SELECT users.*, subscriptions.* FROM users JOIN subscriptions ON users.id = subscriptions.user_id', avgTime: Math.floor(Math.random() * 150) + 250, count: Math.floor(Math.random() * 30) + 5 },
    { query: 'SELECT products.*, COUNT(orders.id) FROM products LEFT JOIN orders ON products.id = orders.product_id GROUP BY products.id', avgTime: Math.floor(Math.random() * 200) + 300, count: Math.floor(Math.random() * 20) + 3 }
  ];
  
  return {
    timestamp,
    status: 'connected',
    connectionPoolInfo: {
      maxConnections: 20,
      activeConnections: Math.floor(Math.random() * 10) + 5, // 5-15 active connections
      idleConnections: Math.floor(Math.random() * 5) + 1 // 1-6 idle connections
    },
    performance: {
      queryHistory,
      avgResponseTime: Math.floor(Math.random() * 10) + 5, // 5-15ms
      readsPerSecond: Math.floor(Math.random() * 50) + 20, // 20-70 reads/s
      writesPerSecond: Math.floor(Math.random() * 20) + 5, // 5-25 writes/s
      slowQueries
    },
    storage: {
      totalSize: Math.floor(Math.random() * 500) + 500, // 500-1000 MB
      freeSpace: Math.floor(Math.random() * 1000) + 2000, // 2000-3000 MB
      tables
    }
  };
};