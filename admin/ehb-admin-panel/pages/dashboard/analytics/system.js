import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/analytics/StatCard';
import LineChart from '../../../components/analytics/LineChart';
import BarChart from '../../../components/analytics/BarChart';
import { getSystemMetrics } from '../../../services/analyticsService';

// Custom color palette
const COLORS = {
  blue: '#3498db',
  green: '#2ecc71',
  purple: '#9b59b6',
  orange: '#e67e22',
  red: '#e74c3c',
  yellow: '#f1c40f',
  gray: '#95a5a6',
  teal: '#1abc9c',
  darkBlue: '#34495e',
  pink: '#fd79a8'
};

const SystemAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState('today');

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      try {
        setLoading(true);
        const data = await getSystemMetrics();
        setSystemMetrics(data);
      } catch (error) {
        console.error('Error fetching system metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemMetrics();
  }, []);

  // Format the server load data for the chart
  const prepareServerLoadChart = (serverLoad) => {
    if (!serverLoad) return [];
    
    return (serverLoad || []).map(item => ({
      time: item.time,
      Load: item.value
    }));
  };

  // Format the API usage data for the bar chart
  const prepareApiUsageChart = (apiUsage) => {
    if (!apiUsage) return [];
    
   (apiUsage || []).map((age || []).map(item => ({
      endpoint: item.endpoint,
      Requests: item.count,
      'Avg Response Time (ms)': item.avgResponseTime
    }));
  };

  if (loading) {
    return (
      <DashboardLayout></DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  retu<Head></Head>   <>
      <Head></Head>
        <title>System Performance | EHB Admin</ti<DashboardLayout></DashboardLayout>><DashboardLayout></DashboardLayout>Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">System Performance</h1>
              <p className="text-muted-foreground">Server metrics, response times, and resource utilization</p>
            </div>
            <div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols<StatCard 
              title="System Uptime" 
              value={`${systemMetrics.uptime}%`} 
              description="Last 30 days" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard> 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.<StatCard 
              title="Response Time" 
              value={`${systemMetrics.responseTime}ms`} 
              description="Average response time" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>iewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9<StatCard 
              title="Error Rate" 
              value={`${(systemMetrics.errorRate * 100).toFixed(2)}%`} 
              description="Across all API endpoints" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>entColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h<StatCard 
              title="Load Average" 
              value={systemMetrics.loadAverage.toFixed(2)} 
              description="Current server load" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>troke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            />
          </div>
       <StatCard 
              title="Memory Usage" 
              value={`${systemMetrics.memoryUsage}%`} 
              description="Current memory utilization" 
              className="h-full"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>ll="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1<StatCard 
              title="Disk Usage" 
              value={`${systemMetrics.diskUsage}%`} 
              description="Current disk utilization" 
              className="h-full"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
            />
          </div>
          
          <div className="bg-card rounded-lg s<LineChart 
              data={prepareServerLoadChart(systemMetrics.serverLoadHistory)}
              lines={[{ key: 'Load', name: 'Server Load', color: COLORS.green }]}
              xAxisKey="time"
              height={300}
            /></LineChart>Server Load', color: COLORS.green }]}
              xAxisKey="time"
              height={300}
            />
          </div>
          
          <div className="bg-card r<BarChart 
              data={prepareApiUsageChart(systemMetrics.apiUsage)}
              bars={[
                { key: 'Requests', name: 'Number of Requests', color: COLORS.blue },
                { key: 'Avg Response Time (ms)', name: 'Avg Response Time (ms)', color: COLORS.orange }
              ]}
              xAxisKey="endpoint"
              height={350}
            /></BarChart>ms)', color: COLORS.orange }
              ]}
              xAxisKey="endpoint"
              height={350}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Error Distribution</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>500 Internal Server Error</span>
                  </div>
                  <span className="font-semibold">48%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '48%' }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>404 Not Found</span>
                  </div>
                  <span className="font-semibold">32%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>401 Unauthorized</span>
                  </div>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Other Errors</span>
                  </div>
                  <span className="font-semibold">5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Network Traffic</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Inbound Traffic</span>
                  <span className="font-medium">452 GB</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '72%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">Outbound Traffic</span>
                  <span className="font-medium">318 GB</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '55%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">Bandwidth Usage</span>
                  <span className="font-medium">64%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: '64%' }}></div>
                </div>

                <div className="mt-6 pt-6 border-t border-muted">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Monthly Traffic</span>
                    <span className="font-semibold">770 GB / 1200 GB</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-500 h-full" style={{ width: '64.2%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Monthly allocation: 64.2% used (430 GB remaining)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SystemAnalytics;