/**
 * Dashboard Service
 * 
 * This service handles data fetching for the integrated dashboard,
 * aggregating information from all EHB phases and systems.
 */

import axios from 'axios';

// Base URLs for different services
const API_URLS = {
  autoCardGen: process.env.AUTO_CARD_GEN_API || 'http://localhost:5001/api',
  testPassFail: process.env.TEST_PASS_FAIL_API || 'http://localhost:5001/api',
  aiDashboard: process.env.AI_DASHBOARD_API || 'http://localhost:5001/api',
  smartAIAgent: process.env.SMART_AI_AGENT_API || 'http://localhost:5001/api',
  centralSystem: process.env.CENTRAL_SYSTEM_API || 'http://localhost:5001/api'
};

// Authentication token handling
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('ehb_auth_token');
  }
  return null;
};

// Create authenticated API instances
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token to requests
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// API instances for each service
const apis = Object.entries(API_URLS).reduce((acc, [key, url]) => {
  acc[key] = createApiInstance(url);
  return acc;
}, {});

// Get system stats from all services
export const getSystemStats = async () => {
  try {
    // Fetch stats from multiple services in parallel
    const [
      autoCardGenStats,
      testPassFailStats,
      aiDashboardStats,
      smartAIAgentStats,
      centralSystemStats
    ] = await Promise.all([
      apis.autoCardGen.get('/stats').catch(() => ({ data: { success: false } })),
      apis.testPassFail.get('/stats').catch(() => ({ data: { success: false } })),
      apis.aiDashboard.get('/stats').catch(() => ({ data: { success: false } })),
      apis.smartAIAgent.get('/status').catch(() => ({ data: { success: false } })),
      apis.centralSystem.get('/system/stats').catch(() => ({ data: { success: false } }))
    ]);

    // Aggregate stats
    return {
      userStats: centralSystemStats.data.success ? centralSystemStats.data.userStats : null,
      serviceStats: {
        autoCardGen: autoCardGenStats.data.success ? autoCardGenStats.data : null,
        testPassFail: testPassFailStats.data.success ? testPassFailStats.data : null,
        aiDashboard: aiDashboardStats.data.success ? aiDashboardStats.data : null,
        smartAIAgent: smartAIAgentStats.data.success ? smartAIAgentStats.data : null
      },
      systemHealth: centralSystemStats.data.success ? centralSystemStats.data.health : null
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};

// Get module status for all phases
export const getModuleStatus = async () => {
  try {
    const response = await apis.centralSystem.get('/modules/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching module status:', error);
    throw error;
  }
};

// Get phase implementation progress
export const getPhaseProgress = async () => {
  try {
    const response = await apis.centralSystem.get('/phases/progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching phase progress:', error);
    throw error;
  }
};

// Get AI insights from various services
export const getAIInsights = async (limit = 5) => {
  try {
    // Fetch insights from AI Dashboard and SmartAIAgent
    const [aiDashboardInsights, smartAIAgentInsights] = await Promise.all([
      apis.aiDashboard.get(`/insights?limit=${limit}`).catch(() => ({ data: { insights: [] } })),
      apis.smartAIAgent.get(`/agent/insights?limit=${limit}`).catch(() => ({ data: { insights: [] } }))
    ]);

    // Combine and sort insights by timestamp
    const allInsights = [
      ...(aiDashboardInsights.data.insights || []).map(insight => ({
        ...insight,
        source: 'AI Dashboard'
      })),
      ...(smartAIAgentInsights.data.insights || []).map(insight => ({
        ...insight,
        source: 'Smart AI Agent'
      }))
    ];

    // Sort by timestamp (most recent first)
    allInsights.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return allInsights.slice(0, limit);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    throw error;
  }
};

// Get recent activities from the system
export const getRecentActivities = async (limit = 10) => {
  try {
    const response = await apis.centralSystem.get(`/activities?limit=${limit}`);
    return response.data.activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// Get server and database health metrics
export const getSystemHealth = async () => {
  try {
    const response = await apis.centralSystem.get('/system/health');
    return response.data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw error;
  }
};

// Get deployment status
export const getDeploymentStatus = async () => {
  try {
    const response = await apis.centralSystem.get('/deployments/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching deployment status:', error);
    throw error;
  }
};

// Fetch all dashboard data in a single call
export const getDashboardData = async () => {
  try {
    const [
      systemStats,
      moduleStatus,
      phaseProgress,
      aiInsights,
      recentActivities,
      systemHealth,
      deploymentStatus
    ] = await Promise.all([
      getSystemStats().catch(() => null),
      getModuleStatus().catch(() => []),
      getPhaseProgress().catch(() => []),
      getAIInsights().catch(() => []),
      getRecentActivities().catch(() => []),
      getSystemHealth().catch(() => null),
      getDeploymentStatus().catch(() => null)
    ]);

    return {
      systemStats,
      moduleStatus,
      phaseProgress,
      aiInsights,
      recentActivities,
      systemHealth,
      deploymentStatus,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Detailed data for specific modules
export const getAutoCardGenStats = async () => {
  try {
    const response = await apis.autoCardGen.get('/stats/detailed');
    return response.data;
  } catch (error) {
    console.error('Error fetching AutoCardGen stats:', error);
    throw error;
  }
};

export const getTestPassFailStats = async () => {
  try {
    const response = await apis.testPassFail.get('/metrics/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching TestPassFail stats:', error);
    throw error;
  }
};

export const getAIDashboardMetrics = async () => {
  try {
    const response = await apis.aiDashboard.get('/metrics/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI Dashboard metrics:', error);
    throw error;
  }
};

export const getSmartAIAgentStats = async () => {
  try {
    const response = await apis.smartAIAgent.get('/agent/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching SmartAIAgent stats:', error);
    throw error;
  }
};

export default {
  getSystemStats,
  getModuleStatus,
  getPhaseProgress,
  getAIInsights,
  getRecentActivities,
  getSystemHealth,
  getDeploymentStatus,
  getDashboardData,
  getAutoCardGenStats,
  getTestPassFailStats,
  getAIDashboardMetrics,
  getSmartAIAgentStats
};