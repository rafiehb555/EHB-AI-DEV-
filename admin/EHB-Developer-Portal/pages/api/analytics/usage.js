/**
 * API endpoint for analytics usage metrics data
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
    apiRequests: [
      { name: 'Total Requests', value: '3,245,897', change: 12.3 },
      { name: 'Success Rate', value: '99.7%', change: 0.2 },
      { name: 'Avg. Response Time', value: '125ms', change: -8.4 },
      { name: 'Bandwidth Used', value: '1.45 TB', change: 22.1 },
      { name: 'Cache Hit Rate', value: '78.3%', change: 5.7 }
    ],
    serverUsage: [
      { name: 'CPU Utilization', value: '42%', change: -2.3 },
      { name: 'Memory Usage', value: '6.8 GB', change: 1.8 },
      { name: 'Disk I/O', value: '245 MB/s', change: 4.5 },
      { name: 'Network Traffic', value: '320 Mbps', change: 15.2 },
      { name: 'Avg. Server Load', value: '0.72', change: -3.1 }
    ],
    databaseMetrics: [
      { name: 'Query Count', value: '725,431', change: 8.9 },
      { name: 'Avg. Query Time', value: '18ms', change: -12.4 },
      { name: 'Active Connections', value: '84', change: 5.2 },
      { name: 'Index Usage', value: '92.1%', change: 0.8 },
      { name: 'Storage Used', value: '512 GB', change: 25.3 }
    ],
    serviceUsageData: [
      { 
        service: 'User Authentication',
        requests: '852,432',
        avg_time: '45ms',
        error_rate: '0.05%',
        peak_usage: '2,310 req/min'
      },
      { 
        service: 'API Gateway',
        requests: '1,243,564',
        avg_time: '12ms',
        error_rate: '0.02%',
        peak_usage: '4,520 req/min'
      },
      { 
        service: 'Data Processing',
        requests: '523,987',
        avg_time: '86ms',
        error_rate: '0.12%',
        peak_usage: '1,860 req/min'
      },
      { 
        service: 'AI Service',
        requests: '342,671',
        avg_time: '210ms',
        error_rate: '0.34%',
        peak_usage: '980 req/min'
      },
      { 
        service: 'Storage Service',
        requests: '283,243',
        avg_time: '65ms',
        error_rate: '0.08%',
        peak_usage: '1,240 req/min'
      }
    ]
  };
  
  // Send the response
  res.status(200).json(data);
}