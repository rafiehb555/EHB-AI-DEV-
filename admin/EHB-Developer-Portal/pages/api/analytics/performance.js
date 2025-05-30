/**
 * API endpoint for analytics performance metrics data
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
    performanceStats: [
      {
        title: "Average Response Time",
        value: 125,
        unit: "ms",
        trend: "decrease",
        trendValue: "8.32%"
      },
      {
        title: "CPU Utilization",
        value: 42,
        unit: "%",
        trend: "decrease",
        trendValue: "2.3%"
      },
      {
        title: "Memory Usage",
        value: 6.8,
        unit: "GB",
        trend: "increase",
        trendValue: "1.8%"
      },
      {
        title: "Avg. Server Load",
        value: 0.72,
        unit: "",
        trend: "decrease",
        trendValue: "3.1%"
      }
    ],
    resourceUtilization: [
      {
        title: "Database Connections",
        value: 84,
        max: 250
      },
      {
        title: "API Rate Limit",
        value: 4520,
        max: 10000
      },
      {
        title: "Storage Utilization",
        value: 512,
        max: 1024
      }
    ],
    systemHealthSummary: {
      status: "healthy",
      message: "The EHB system is performing well within expected parameters. Response times continue to improve with an 8.32% decrease compared to the previous period. CPU utilization remains low at 42%, indicating sufficient headroom for increased load. Storage utilization is currently at 50% of capacity, with an estimated 6 months before additional storage allocation may be required based on current growth rates. Database connections are well below the configured maximum, ensuring optimal query performance."
    }
  };
  
  // Send the response
  res.status(200).json(data);
}