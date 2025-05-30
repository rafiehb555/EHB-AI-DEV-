/**
 * Analytics Controller
 * Handles analytics data requests for the admin dashboard
 */

const analyticsData = {
  // User analytics
  userMetrics: {
    totalUsers: 1250,
    activeUsers: 875,
    newUsers: 125,
    userGrowth: 8.5,
    usersByRole: {
      admin: 15,
      manager: 35,
      employee: 450,
      client: 750
    },
    userActivity: [
      { date: '2025-05-01', count: 680 },
      { date: '2025-05-02', count: 720 },
      { date: '2025-05-03', count: 750 },
      { date: '2025-05-04', count: 790 },
      { date: '2025-05-05', count: 805 },
      { date: '2025-05-06', count: 840 },
      { date: '2025-05-07', count: 860 },
      { date: '2025-05-08', count: 875 },
      { date: '2025-05-09', count: 865 },
      { date: '2025-05-10', count: 875 },
      { date: '2025-05-11', count: 875 }
    ],
    geographicDistribution: [
      { region: 'North America', count: 450 },
      { region: 'Europe', count: 350 },
      { region: 'Asia', count: 250 },
      { region: 'South America', count: 120 },
      { region: 'Africa', count: 50 },
      { region: 'Oceania', count: 30 }
    ]
  },

  // System performance analytics
  systemMetrics: {
    uptime: 99.98,
    responseTime: 230,
    errorRate: 0.05,
    loadAverage: 0.65,
    serverLoadHistory: [
      { time: '09:00', value: 0.45 },
      { time: '10:00', value: 0.52 },
      { time: '11:00', value: 0.75 },
      { time: '12:00', value: 0.85 },
      { time: '13:00', value: 0.76 },
      { time: '14:00', value: 0.82 },
      { time: '15:00', value: 0.90 },
      { time: '16:00', value: 0.87 },
      { time: '17:00', value: 0.65 }
    ],
    memoryUsage: 45.5,
    diskUsage: 68.2,
    apiUsage: [
      { endpoint: '/api/users', count: 12500, avgResponseTime: 210 },
      { endpoint: '/api/dashboard', count: 9800, avgResponseTime: 180 },
      { endpoint: '/api/transactions', count: 7600, avgResponseTime: 320 },
      { endpoint: '/api/reports', count: 4200, avgResponseTime: 450 },
      { endpoint: '/api/settings', count: 3100, avgResponseTime: 150 }
    ]
  },

  // Business metrics
  businessMetrics: {
    revenue: 125000,
    revenueGrowth: 12.5,
    transactions: 3500,
    averageTransactionValue: 35.71,
    conversionRate: 3.2,
    revenueByProduct: [
      { product: 'Premium Subscription', amount: 45000 },
      { product: 'Standard Subscription', amount: 35000 },
      { product: 'Basic Subscription', amount: 25000 },
      { product: 'One-time Services', amount: 20000 }
    ],
    revenueHistory: [
      { month: 'Jan', amount: 65000 },
      { month: 'Feb', amount: 72000 },
      { month: 'Mar', amount: 78000 },
      { month: 'Apr', amount: 92000 },
      { month: 'May', amount: 125000 }
    ]
  },

  // Content metrics
  contentMetrics: {
    totalContent: 1850,
    contentByType: {
      articles: 650,
      videos: 320,
      podcasts: 180,
      ebooks: 75,
      courses: 45,
      other: 580
    },
    popularContent: [
      { title: 'Blockchain Fundamentals', views: 12500, engagement: 8.7 },
      { title: 'Smart Contract Development', views: 9800, engagement: 9.2 },
      { title: 'Crypto Wallets Explained', views: 8900, engagement: 7.8 },
      { title: 'NFT Creation Guide', views: 7800, engagement: 8.5 },
      { title: 'Web3 Integration Tutorial', views: 7200, engagement: 9.0 }
    ],
    contentGrowth: 15.2
  }
};

// Get all analytics data
const getAllAnalytics = (req, res) => {
  try {
    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
  }
};

// Get user metrics
const getUserMetrics = (req, res) => {
  try {
    res.status(200).json(analyticsData.userMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user metrics', error: error.message });
  }
};

// Get system metrics
const getSystemMetrics = (req, res) => {
  try {
    res.status(200).json(analyticsData.systemMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system metrics', error: error.message });
  }
};

// Get business metrics
const getBusinessMetrics = (req, res) => {
  try {
    res.status(200).json(analyticsData.businessMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business metrics', error: error.message });
  }
};

// Get content metrics
const getContentMetrics = (req, res) => {
  try {
    res.status(200).json(analyticsData.contentMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content metrics', error: error.message });
  }
};

module.exports = {
  getAllAnalytics,
  getUserMetrics,
  getSystemMetrics,
  getBusinessMetrics,
  getContentMetrics
};