/**
 * API endpoint for analytics overview data
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Get the time range from query parameters
  const { timeRange = '7d' } = req.query;
  
  // In a real application, this data would come from a database or external API
  // For demonstration, we're using static data
  const data = {
    timeRange,
    timestamp: new Date().toISOString(),
    stats: {
      activeUsers: {
        value: 5824,
        previous: 4720,
        change: 23.36
      },
      apiRequests: {
        value: 3200000,
        previous: 2855000,
        change: 12.05
      },
      aiQueries: {
        value: 842651,
        previous: 709615,
        change: 18.74
      },
      responseTime: {
        value: 125,
        previous: 136,
        change: -8.32
      }
    },
    systemStatus: {
      status: 'operational',
      uptime: '99.8% (30 days)',
      components: [
        { name: 'Frontend Services', status: 'operational' },
        { name: 'API Gateway', status: 'operational' },
        { name: 'Database Services', status: 'operational' },
        { name: 'Authentication Services', status: 'operational' },
        { name: 'AI Processing', status: 'operational' }
      ]
    },
    progress: {
      development: {
        value: 75,
        max: 100
      },
      apiIntegration: {
        value: 23,
        max: 30
      }
    }
  };
  
  // Send the response
  res.status(200).json(data);
}