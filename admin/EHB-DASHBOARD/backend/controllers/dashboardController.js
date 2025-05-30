/**
 * Dashboard Controller
 * Handles dashboard data and statistics
 */

// Dashboard stats data 
const getDashboardStats = (req, res) => {
  try {
    const dashboardStats = {
      summary: {
        totalUsers: 1250,
        activeUsers: 875,
        transactions: 3500,
        revenue: 125000
      },
      performanceStats: {
        uptime: 99.98,
        responseTime: 230,
        errorRate: 0.05
      },
      activity: [
        { date: '2025-05-05', users: 805, transactions: 320, revenue: 11200 },
        { date: '2025-05-06', users: 840, transactions: 385, revenue: 13500 },
        { date: '2025-05-07', users: 860, transactions: 415, revenue: 14800 },
        { date: '2025-05-08', users: 875, transactions: 435, revenue: 15200 },
        { date: '2025-05-09', users: 865, transactions: 410, revenue: 14100 },
        { date: '2025-05-10', users: 875, transactions: 425, revenue: 14800 },
        { date: '2025-05-11', users: 875, transactions: 430, revenue: 15000 }
      ],
      recentTransactions: [
        { id: 'tx-12345', user: 'John Smith', amount: 199.99, date: '2025-05-11T10:45:22Z', status: 'completed' },
        { id: 'tx-12346', user: 'Sarah Johnson', amount: 149.99, date: '2025-05-11T09:32:15Z', status: 'completed' },
        { id: 'tx-12347', user: 'Robert Lee', amount: 99.99, date: '2025-05-11T08:18:47Z', status: 'pending' },
        { id: 'tx-12348', user: 'Emily Chen', amount: 299.99, date: '2025-05-10T23:55:01Z', status: 'completed' },
        { id: 'tx-12349', user: 'Michael Brown', amount: 199.99, date: '2025-05-10T22:42:39Z', status: 'completed' }
      ],
      alerts: [
        { id: 'alert-1', type: 'warning', message: 'System load over 80% for the past 30 minutes', timestamp: '2025-05-11T11:15:00Z' },
        { id: 'alert-2', type: 'info', message: 'New system update available (v2.5)', timestamp: '2025-05-11T10:00:00Z' },
        { id: 'alert-3', type: 'error', message: 'API endpoint /api/transactions experienced 5% error rate', timestamp: '2025-05-11T08:30:00Z' }
      ]
    };

    res.status(200).json(dashboardStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = {
  getDashboardStats
};