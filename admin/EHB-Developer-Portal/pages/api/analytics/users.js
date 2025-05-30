/**
 * API endpoint for analytics user statistics data
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
    userStats: {
      totalUsers: {
        value: 61503,
        previous: 50247,
        change: 22.4
      },
      activeUsers: {
        value: 52355,
        previous: 44108,
        change: 18.7
      },
      newRegistrations: {
        value: 12875,
        previous: 9718,
        change: 32.5
      },
      churnRate: {
        value: 3.2,
        previous: 3.26,
        change: -1.8
      }
    },
    userTypeData: [
      { 
        type: 'Administrators', 
        total: 152, 
        active: 138, 
        growth: 4.2, 
        retention: 96.5 
      },
      { 
        type: 'Developers', 
        total: 3245, 
        active: 2840, 
        growth: 12.8, 
        retention: 88.2 
      },
      { 
        type: 'End Users', 
        total: 56890, 
        active: 48320, 
        growth: 23.5, 
        retention: 78.6 
      },
      { 
        type: 'Enterprise Clients', 
        total: 427, 
        active: 412, 
        growth: 8.7, 
        retention: 94.3 
      },
      { 
        type: 'API Integrators', 
        total: 789, 
        active: 645, 
        growth: 15.2, 
        retention: 85.7 
      }
    ],
    geoDistribution: [
      { region: 'North America', users: '32,450', percentage: 57.2, growth: 8.4 },
      { region: 'Europe', users: '12,835', percentage: 22.6, growth: 12.7 },
      { region: 'Asia Pacific', users: '8,753', percentage: 15.4, growth: 28.5 },
      { region: 'South America', users: '1,842', percentage: 3.2, growth: 14.2 },
      { region: 'Africa', users: '810', percentage: 1.4, growth: 35.8 },
      { region: 'Other Regions', users: '123', percentage: 0.2, growth: 5.1 }
    ],
    userGrowthSummary: {
      highlights: [
        "User growth exceeds projections with a 22.4% increase across all categories",
        "Highest growth in End Users (23.5%) and API Integrators (15.2%)",
        "Geographic expansion showing 35.8% growth in Africa and 28.5% in Asia Pacific",
        "Enterprise retention rate of 94.3% exceeds 90% target goal"
      ]
    }
  };
  
  // Send the response
  res.status(200).json(data);
}