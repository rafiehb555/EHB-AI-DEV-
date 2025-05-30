const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Dashboard = require('../models/Dashboard');

/**
 * Track event from client
 * @route POST /api/analytics/track
 */
exports.trackEvent = async (req, res) => {
  try {
    const { event, sessionId, page, widget, api, error, custom, device, location } = req.body;
    
    // Create analytics entry
    const analytics = {
      sessionId,
      event,
      timestamp: Date.now()
    };
    
    // Add user if authenticated
    if (req.user) {
      analytics.user = req.user._id;
    }
    
    // Add IP address
    analytics.ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Add optional fields if provided
    if (page) analytics.page = page;
    if (widget) analytics.widget = widget;
    if (api) analytics.api = api;
    if (error) analytics.error = error;
    if (custom) analytics.custom = custom;
    if (device) analytics.device = device;
    if (location) analytics.location = location;
    
    // Save analytics
    await Analytics.create(analytics);
    
    res.status(200).json({
      status: 'success',
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while tracking event'
    });
  }
};

/**
 * Get current user's analytics
 * @route GET /api/analytics/user
 */
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, event } = req.query;
    
    // Create filter
    const filter = { user: userId };
    
    // Add date range if provided
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    // Add event filter if provided
    if (event) filter.event = event;
    
    // Get analytics with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const analytics = await Analytics.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await Analytics.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: analytics.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        analytics
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching analytics'
    });
  }
};

/**
 * Get dashboard analytics
 * @route GET /api/analytics/dashboard
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dashboardId, startDate, endDate } = req.query;
    
    // Create date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    // Find dashboard if ID provided
    let dashboard;
    if (dashboardId) {
      dashboard = await Dashboard.findOne({
        _id: dashboardId,
        user: userId
      });
      
      if (!dashboard) {
        return res.status(404).json({
          status: 'error',
          message: 'Dashboard not found'
        });
      }
    }
    
    // Get widget interaction analytics
    const widgetFilter = { 
      user: userId,
      event: 'widgetInteraction'
    };
    
    if (Object.keys(dateFilter).length > 0) {
      widgetFilter.timestamp = dateFilter;
    }
    
    if (dashboard) {
      widgetFilter['widget.id'] = { $in: (dashboard.widgets || []).map(w => w._id.toString()) };
    }
    
    const widgetAnalytics = await Analytics.find(widgetFilter)
      .sort({ timestamp: -1 });
    
    // Get page view analytics
    const pageViewFilter = {
      user: userId,
      event: 'pageView'
    };
    
    if (Object.keys(dateFilter).length > 0) {
      pageViewFilter.timestamp = dateFilter;
    }
    
    const pageViewAnalytics = await Analytics.find(pageViewFilter)
      .sort({ timestamp: -1 });
    
    // Transform data for response
    const widgetInteractions = {};
    widgetAnalytics.forEach(a => {
      const widgetId = a.widget.id;
      if (!widgetInteractions[widgetId]) {
        widgetInteractions[widgetId] = {
          count: 0,
          actions: {}
        };
      }
      
      widgetInteractions[widgetId].count++;
      
      const action = a.widget.action;
      if (action) {
        if (!widgetInteractions[widgetId].actions[action]) {
          widgetInteractions[widgetId].actions[action] = 0;
        }
        widgetInteractions[widgetId].actions[action]++;
      }
    });
    
    const pageViews = {};
    pageViewAnalytics.forEach(a => {
      const pagePath = a.page.path;
      if (!pageViews[pagePath]) {
        pageViews[pagePath] = 0;
      }
      pageViews[pagePath]++;
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        widgetInteractions,
        pageViews,
        dashboard: dashboard ? dashboard._id : null
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching dashboard analytics'
    });
  }
};

/**
 * Get usage analytics
 * @route GET /api/analytics/usage
 */
exports.getUsageAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, interval } = req.query;
    
    // Create date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    if (!startDate && !endDate) {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }
    
    // Define interval (daily, weekly, monthly)
    const groupInterval = interval || 'daily';
    
    // Create aggregation pipeline based on interval
    let timeGrouping;
    if (groupInterval === 'daily') {
      timeGrouping = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
    } else if (groupInterval === 'weekly') {
      timeGrouping = {
        year: { $year: '$timestamp' },
        week: { $week: '$timestamp' }
      };
    } else if (groupInterval === 'monthly') {
      timeGrouping = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' }
      };
    }
    
    // Run aggregation
    const usageData = await Analytics.aggregate([
      {
        $match: {
          user: userId,
          timestamp: dateFilter
        }
      },
      {
        $group: {
          _id: timeGrouping,
          count: { $sum: 1 },
          pageViews: {
            $sum: {
              $cond: [{ $eq: ['$event', 'pageView'] }, 1, 0]
            }
          },
          widgetInteractions: {
            $sum: {
              $cond: [{ $eq: ['$event', 'widgetInteraction'] }, 1, 0]
            }
          },
          apiCalls: {
            $sum: {
              $cond: [{ $eq: ['$event', 'apiCall'] }, 1, 0]
            }
          },
          errors: {
            $sum: {
              $cond: [{ $eq: ['$event', 'error'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        interval: groupInterval,
        usage: usageData
      }
    });
  } catch (error) {
    console.error('Get usage analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching usage analytics'
    });
  }
};

/**
 * Get realtime analytics
 * @route GET /api/analytics/realtime
 */
exports.getRealtimeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get events in the last 5 minutes
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    const recentEvents = await Analytics.find({
      user: userId,
      timestamp: { $gte: fiveMinutesAgo }
    }).sort({ timestamp: -1 });
    
    // Count active sessions
    const activeSessions = new Set();
    recentEvents.forEach(event => {
      if (event.sessionId) {
        activeSessions.add(event.sessionId);
      }
    });
    
    // Count by event type
    const eventCounts = {
      pageView: 0,
      widgetInteraction: 0,
      apiCall: 0,
      error: 0,
      login: 0,
      logout: 0,
      custom: 0
    };
    
    recentEvents.forEach(event => {
      if (eventCounts[event.event] !== undefined) {
        eventCounts[event.event]++;
      } else {
        eventCounts.custom++;
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        activeSessionCount: activeSessions.size,
        recentEventCount: recentEvents.length,
        eventCounts,
        recentEvents: recentEvents.slice(0, 10) // Just return the 10 most recent events
      }
    });
  } catch (error) {
    console.error('Get realtime analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching realtime analytics'
    });
  }
};

/**
 * Get all users analytics (admin only)
 * @route GET /api/analytics/users
 */
exports.getAllUsersAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Create date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    if (!startDate && !endDate) {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }
    
    // Get user analytics summary
    const userAnalytics = await Analytics.aggregate([
      {
        $match: {
          timestamp: dateFilter
        }
      },
      {
        $group: {
          _id: '$user',
          eventCount: { $sum: 1 },
          pageViews: {
            $sum: {
              $cond: [{ $eq: ['$event', 'pageView'] }, 1, 0]
            }
          },
          firstSeen: { $min: '$timestamp' },
          lastSeen: { $max: '$timestamp' },
          sessions: { $addToSet: '$sessionId' },
          errors: {
            $sum: {
              $cond: [{ $eq: ['$event', 'error'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          userId: '$_id',
          username: '$userInfo.username',
          email: '$userInfo.email',
          eventCount: 1,
          pageViews: 1,
          firstSeen: 1,
          lastSeen: 1,
          sessionCount: { $size: '$sessions' },
          errorCount: '$errors'
        }
      },
      {
        $sort: { eventCount: -1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      results: userAnalytics.length,
      data: {
        userAnalytics
      }
    });
  } catch (error) {
    console.error('Get all users analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching users analytics'
    });
  }
};

/**
 * Get system analytics (admin only)
 * @route GET /api/analytics/system
 */
exports.getSystemAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Create date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    if (!startDate && !endDate) {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }
    
    // Get overall system statistics
    const totalEvents = await Analytics.countDocuments({ timestamp: dateFilter });
    const totalUsers = await Analytics.distinct('user', { timestamp: dateFilter }).then(users => users.length);
    const totalSessions = await Analytics.distinct('sessionId', { timestamp: dateFilter }).then(sessions => sessions.length);
    const totalErrors = await Analytics.countDocuments({ event: 'error', timestamp: dateFilter });
    
    // Get daily event counts
    const dailyEvents = await Analytics.aggregate([
      {
        $match: {
          timestamp: dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' },
          uniqueSessions: { $addToSet: '$sessionId' },
          errors: {
            $sum: {
              $cond: [{ $eq: ['$event', 'error'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          uniqueSessions: { $size: '$uniqueSessions' },
          errors: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);
    
    // Get event type distribution
    const eventTypes = await Analytics.aggregate([
      {
        $match: {
          timestamp: dateFilter
        }
      },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Get browser statistics
    const browsers = await Analytics.aggregate([
      {
        $match: {
          timestamp: dateFilter,
          'device.browser': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$device.browser',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          browser: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalEvents,
          totalUsers,
          totalSessions,
          totalErrors,
          errorRate: totalEvents > 0 ? (totalErrors / totalEvents) * 100 : 0
        },
        dailyEvents,
        eventTypes,
        browsers
      }
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching system analytics'
    });
  }
};

/**
 * Export analytics data (admin only)
 * @route GET /api/analytics/export
 */
exports.exportAnalyticsData = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    // Create date range filter
    const filter = {};
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    // Get analytics data
    const analytics = await Analytics.find(filter)
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
    
    // Format data for export
    let exportData;
    const exportFormat = format || 'json';
    
    if (exportFormat === 'csv') {
      // Convert to CSV
      const fields = ['id', 'event', 'sessionId', 'timestamp', 'user', 'page', 'widget', 'api', 'error', 'device', 'ip'];
      
      // Create CSV header
      let csv = fields.join(',') + '\n';
      
      // Add data rows
      analytics.forEach(record => {
        const row = [];
        fields.forEach(field => {
          if (field === 'user') {
            row.push(record.user ? record.user.username : '');
          } else if (field === 'page') {
            row.push(record.page ? record.page.path : '');
          } else if (field === 'widget') {
            row.push(record.widget ? record.widget.id : '');
          } else if (field === 'api') {
            row.push(record.api ? record.api.endpoint : '');
          } else if (field === 'error') {
            row.push(record.error ? record.error.message : '');
          } else if (field === 'device') {
            row.push(record.device ? record.device.browser : '');
          } else {
            row.push(record[field] || '');
          }
        });
        csv += row.join(',') + '\n';
      });
      
      exportData = csv;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-export-${Date.now()}.csv`);
    } else {
      // Default to JSON
      exportData = JSON.stringify(analytics, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-export-${Date.now()}.json`);
    }
    
    res.send(exportData);
  } catch (error) {
    console.error('Export analytics data error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while exporting analytics data'
    });
  }
};