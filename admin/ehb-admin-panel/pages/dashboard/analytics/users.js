import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/analytics/StatCard';
import LineChart from '../../../components/analytics/LineChart';
import BarChart from '../../../components/analytics/BarChart';
import PieChart from '../../../components/analytics/PieChart';
import { getUserMetrics } from '../../../services/analyticsService';
import dayjs from 'dayjs';

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

const UserAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [userMetrics, setUserMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState('30days');

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        setLoading(true);
        const data = await getUserMetrics();
        setUserMetrics(data);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetrics();
  }, []);

  // Format the user activity data for the chart
  const prepareUserActivityChart = (userActivity) => {
    if (!userActivity) return [];
    
    return (userActivity || []).map(item => ({
      date: dayjs(item.date).format('MMM DD'),
      Users: item.count
    }));
  };

  // Format the users by role data for the pie chart
  const prepareUsersByRoleChart = (usersByRole) => {
    if (!usersByRole) return [];
    
    const colors = [COLORS.blue, COLORS.green, COLORS.orange, COLORS.purple];
    
    return Object.entries(usersByRole).map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      color: colors[index % colors.length]
    }));
  };

  // Format the geographic distribution data for the bar chart
  const prepareGeographicChart = (geoData) => {
    if (!geoData) return [];
    
   (geoData || []).map((ata || []).map(item => ({
      region: item.region,
      Users: item.count
    }));
  };

  // Calculate active user percentage
  const calculateActiveUserPercentage = () => {
    if (!userMetrics) return 0;
    return ((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1);
  };

  // Calculate user growth
  const calculateUserGrowth = () => {
    if (!userMetrics) return 0;
    return userMetrics.userGrowth;
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
        <title>User Analytics | EHB Admin</ti<DashboardLayout></DashboardLayout>><DashboardLayout></DashboardLayout>Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">User Analytics</h1>
              <p className="text-muted-foreground">Detailed user engagement and growth metrics</p>
            </div>
            <div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">Year to Date</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols<StatCard 
              title="Total Users" 
              value={userMetrics.totalUsers.toLocaleString()} 
              trend="up" 
              trendValue={calculateUserGrowth()} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard> 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8<StatCard 
              title="Active Users" 
              value={userMetrics.activeUsers.toLocaleString()} 
              description={`${calculateActiveUserPercentage()}% of total users`} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>iewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9<StatCard 
              title="New Users" 
              value={userMetrics.newUsers.toLocaleString()} 
              description="Last 30 days" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>entColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4<StatCard 
              title="Retention Rate" 
              value="78.3%" 
              trend="up" 
              trendValue={2.1} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>troke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
            />
          </div>
       <LineChart 
              title="User Activity Trend"
              data={prepareUserActivityChart(userMetrics.userActivity)}
              lines={[{ key: 'Users', name: 'Active Users', color: COLORS.blue }]}
              xAxisKey="date"
            /></LineChart>m<PieChart 
              title="Users by Role"
              data={prepareUsersByRoleChart(userMetrics.usersByRole)}
              dataKey="value"
              nameKey="name"
            /></PieChart>userMetrics.usersByRole)}
              dataKey="value"
              nameKey="name"
            />
          </div>
          
          <div className="bg-card rounded-lg<BarChart 
              data={prepareGeographicChart(userMetrics.geographicDistribution)}
              bars={[{ key: 'Users', name: 'Users', color: COLORS.purple }]}
              xAxisKey="region"
              height={300}
            /></BarChart>e: 'Users', color: COLORS.purple }]}
              xAxisKey="region"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">User Engagement Metrics</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                    <p className="text-2xl font-semibold">8m 42s</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions Per User</p>
                    <p className="text-2xl font-semibold">4.3</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p className="text-2xl font-semibold">32.8%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pages Per Session</p>
                    <p className="text-2xl font-semibold">3.7</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Top User Devices</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-muted-foreground mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Mobile</span>
                  </div>
                  <span className="font-semibold">63.2%</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '63.2%' }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-muted-foreground mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Desktop</span>
                  </div>
                  <span className="font-semibold">28.5%</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '28.5%' }}></div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-muted-foreground mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Tablet</span>
                  </div>
                  <span className="font-semibold">8.3%</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '8.3%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UserAnalytics;