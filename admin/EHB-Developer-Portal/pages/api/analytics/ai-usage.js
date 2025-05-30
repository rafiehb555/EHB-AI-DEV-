/**
 * API endpoint for analytics AI usage data
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
    aiStats: {
      totalRequests: {
        value: 842651,
        previous: 709615,
        change: 18.74
      },
      avgResponseTime: {
        value: 2.12,
        previous: 2.32,
        change: -8.6
      },
      successRate: {
        value: 98.9,
        previous: 98.4,
        change: 0.5
      },
      costEfficiency: {
        value: 0.0032,
        previous: 0.00366,
        change: -12.5
      }
    },
    modelUsageData: [
      { 
        name: 'GPT-4o', 
        requests: '324,852', 
        success_rate: 99.7, 
        avg_tokens: 1842, 
        response_time: '2.45s',
        usage_share: 42
      },
      { 
        name: 'Claude 3.5', 
        requests: '245,318', 
        success_rate: 99.5, 
        avg_tokens: 1945, 
        response_time: '2.32s',
        usage_share: 31
      },
      { 
        name: 'Llama-3', 
        requests: '145,762', 
        success_rate: 98.8, 
        avg_tokens: 1532, 
        response_time: '1.85s',
        usage_share: 18
      },
      { 
        name: 'Mistral-8x22B', 
        requests: '54,327', 
        success_rate: 97.2, 
        avg_tokens: 1252, 
        response_time: '1.42s',
        usage_share: 7
      },
      { 
        name: 'Custom Models', 
        requests: '12,892', 
        success_rate: 95.8, 
        avg_tokens: 842, 
        response_time: '0.95s',
        usage_share: 2
      }
    ],
    aiUsageByCategoryData: [
      { name: 'Content Generation', requests: '235,421', percentage: 30, growth: 24.5 },
      { name: 'Data Analysis', requests: '198,237', percentage: 25, growth: 18.2 },
      { name: 'Customer Support', requests: '142,738', percentage: 18, growth: 32.7 },
      { name: 'Code Generation', requests: '102,346', percentage: 13, growth: 42.8 },
      { name: 'Image Analysis', requests: '65,421', percentage: 8, growth: 28.4 },
      { name: 'Audio Transcription', requests: '34,728', percentage: 4, growth: 15.3 },
      { name: 'Other', requests: '15,250', percentage: 2, growth: 7.8 }
    ],
    aiUsageInsights: {
      highlights: [
        "Code generation showing highest growth rate at 42.8%",
        "GPT-4o remains most utilized model (42% of requests)",
        "Customer support category shows significant growth (32.7%)",
        "Cost efficiency improved by 12.5% due to strategic model selection and optimized prompt engineering"
      ]
    }
  };
  
  // Send the response
  res.status(200).json(data);
}