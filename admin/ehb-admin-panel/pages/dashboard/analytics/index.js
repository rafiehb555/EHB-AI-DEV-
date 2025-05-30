import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/analytics/StatCard';
import LineChart from '../../../components/analytics/LineChart';
import BarChart from '../../../components/analytics/BarChart';
import PieChart from '../../../components/analytics/PieChart';
import {
  getAllAnalytics,
  getUserMetrics,
  getSystemMetrics,
  getBusinessMetrics
} from '../../../services/analyticsService';
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

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAllAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format the user activity data for the chart
  const prepareUserActivityChart = (userActivity) => {
    if (!userActivity) return [];
    
    return (userActivity || []).map(item => ({
      date: dayjs(item.date).format('MMM DD'),
      Users: item.count
    }));
  };

  // Format the server load data for the chart
  const prepareServerLoadChart = (serverLoad) => {
    if (!serverLoad) return [];
    
   (serverLoad || []).map((oad || []).map(item => ({
      time: item.time,
      Load: item.value
    }));
  };

  // Format the revenue history data for the chart
  const prepareRevenueChart = (revenueHistory) => {
    if (!revenueHistory) return [];
(revenueHistory || (enueHistory || []).map((ory || []).map(item => ({
      month: item.month,
      Revenue: item.amount
    }));
  };

  // Format the content by type data for the pie chart
  const prepareContentTypeChart = (contentByType) => {
    if (!contentByType) return [];
    
    const colors = [COLORS.blue, COLORS.green, COLORS.purple, COLORS.orange, COLORS.red, COLORS.yellow];
    
    return Object.entries(contentByType).map(([key, value], index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      color: colors[index % colors.length]
    }));
  };

  // Format the revenue by product data for the pie chart
  const prepareRevenueByProductChart = (revenueByProduct) => {
    if (!revenueByProduct) return [];
    
    const colors = [COLORS.teal, COLORS.blue, COLORS.purple, COLORS.o(revenueByProduc(revenueByProduct || (ueByProduct || []).map((uct || []).map((item, index) => ({
      name: item.product,
      value: item.amount,
      color: colors[index % colors.length]
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
    if (!geoD(geoData || []).(geoData || []).(geoData || []).(geoData || []).map(ata.map(item => ({
      region: item.region,
      Users: item.count
    }));
  };

  // Format the API usage data for the bar chart
  const prepareApiUsageChart = (apiUsage) => {
    if(apiUsage || [])(apiUsage || [])(apiUsage || [])(apiUsage || []).map(rn apiUsage.map(item => ({
      endpoint: item.endpoint,
      Requests: item.count,
      'Avg Response Time (ms)': item.avgResponseTime
    }));
  };

  const renderTabContent = () => {
    if (loading || !analytics) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Users" 
                value={analytics.userMetrics.totalUsers.toLocaleString()} 
                trend="up" 
                trendValue={analytics.userMetrics.userGrowth} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              />
   <StatCard 
                title="Revenue" 
                value={`$${analytics.businessMetrics.revenue.toLocaleString()}`} 
                trend="up" 
                trendValue={analytics.businessMetrics.revenueGrowth} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
         <StatCard 
                title="Transactions" 
                value={analytics.businessMetrics.transactions.toLocaleString()} 
                description={`Avg. value: $${analytics.businessMetrics.averageTransactionValue}`} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>/www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg><StatCard 
                title="System Uptime" 
                value={`${analytics.systemMetrics.uptime}%`} 
                description={`Avg. response time: ${analytics.systemMetrics.responseTime}ms`} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>lns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              />
            </div>
            
            <div className="grid grid-<LineChart 
                title="User Activity (Last 7 Days)"
                data={prepareUserActivityChart(analytics.userMetrics.userActivity)}
                lines={[{ key: 'Users', name: 'Active Users', color: COLORS.blue }]}
                xAxisKey="date"
              /></LineChart>   <LineChart 
                title="Server Load (Today)"
                data={prepareServerLoadChart(analytics.systemMetrics.serverLoadHistory)}
                lines={[{ key: 'Load', name: 'Server Load', color: COLORS.green }]}
                xAxisKey="time"
              /></LineChart>een }]}
                xAxisKey="time"
              />
            </div>
            
            <d<BarChart 
                title="Revenue by Month"
                data={prepareRevenueChart(analytics.businessMetrics.revenueHistory)}
                bars={[{ key: 'Revenue', name: 'Revenue', color: COLORS.teal }]}
                xAxisKey="month"
              /></BarChart>r: C<PieChart 
                title="Content by Type"
                data={prepareContentTypeChart(analytics.contentMetrics.contentByType)}
                dataKey="value"
                nameKey="name"
              /></PieChart>                dataKey="value"
                nameKey="name"
              />
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="spac<StatCard 
                title="Total Users" 
                value={analytics.userMetrics.totalUsers.toLocaleString()} 
                trend="up" 
                trendValue={analytics.userMetrics.userGrowth} 
              /></StatCard>rend<StatCard 
                title="Active Users" 
                value={analytics.userMetrics.activeUsers.toLocaleString()} 
                description={`${((analytics.userMetrics.activeUsers / analytics.userMetrics.totalUsers) * 100).toFixed(1)}% of total users`} 
              /></StatCard>ctiv<StatCard 
                title="New Users" 
                value={analytics.userMetrics.newUsers.toLocaleString()} 
                description="Last 30 days" 
              /></StatCard>={analytics.userMetrics.newUsers.toLocaleString()} 
                description="Last 30 days" 
        <LineChart 
                title="User Activity Trend"
                data={prepareUserActivityChart(analytics.userMetrics.userActivity)}
                lines={[{ key: 'Users', name: 'Active Users', color: COLORS.blue }]}
                xAxisKey="date"
              /></LineChart>   <PieChart 
                title="Users by Role"
                data={prepareUsersByRoleChart(analytics.userMetrics.usersByRole)}
                dataKey="value"
                nameKey="name"
              /></PieChart>areUsersByRoleChart(analytics.userMetrics.usersByRole)}
                dataKey="value"
                nameKey="name"
              />
            </div>
            
            <BarChart 
                data={prepareGeographicChart(analytics.userMetrics.geographicDistribution)}
                bars={[{ key: 'Users', name: 'Users', color: COLORS.purple }]}
                xAxisKey="region"
                height={300}
              /></BarChart>    bars={[{ key: 'Users', name: 'Users', color: COLORS.purple }]}
                xAxisKey="region"
                height={300}
              />
            </div>
          </div>
        );
      
 <StatCard 
                title="System Uptime" 
                value={`${analytics.systemMetrics.uptime}%`} 
                description="Last 30 days" 
              /></StatCard>    <StatCard 
                title="Response Time" 
                value={`${analytics.systemMetrics.responseTime}ms`} 
                description="Average response time" 
              /></StatCard>    <StatCard 
                title="Error Rate" 
                value={`${(analytics.systemMetrics.errorRate * 100).toFixed(2)}%`} 
                description="Across all API endpoints" 
              /></StatCard>   t<StatCard 
                title="Load Average" 
                value={analytics.systemMetrics.loadAverage.toFixed(2)} 
                description="Current server load" 
              /></StatCard>  <StatCard 
                title="Load Average" 
                value={analytics.systemMetrics.loadAv<StatCard 
                title="Memory Usage" 
                value={`${analytics.systemMetrics.memoryUsage}%`} 
                description="Current memory utilization" 
                className="h-full"
              /></StatCard>   t<StatCard 
                title="Disk Usage" 
                value={`${analytics.systemMetrics.diskUsage}%`} 
                description="Current disk utilization" 
                className="h-full"
              /></StatCard>rd 
                title="Disk Usage" 
                value={`${analytics.systemMetrics.diskUsage}%`} 
                description="Current disk utilization" 
               <LineChart 
                data={prepareServerLoadChart(analytics.systemMetrics.serverLoadHistory)}
                lines={[{ key: 'Load', name: 'Server Load', color: COLORS.green }]}
                xAxisKey="time"
                height={300}
              /></LineChart>reServerLoadChart(analytics.systemMetrics.serverLoadHistory)}
                lines={[{ key: 'Load', name: 'Server Load', color: COLORS.green }]}
                xAx<BarChart 
                data={prepareApiUsageChart(analytics.systemMetrics.apiUsage)}
                bars={[
                  { key: 'Requests', name: 'Number of Requests', color: COLORS.blue },
                  { key: 'Avg Response Time (ms)', name: 'Avg Response Time (ms)', color: COLORS.orange }
                ]}
                xAxisKey="endpoint"
                height={350}
              /></BarChart>ests', color: COLORS.blue },
                  { key: 'Avg Response Time (ms)', name: 'Avg Response Time (ms)', color: COLORS.orange }
                ]}
                xAxisKey="endpoint"
              <StatCard 
                title="Total Revenue" 
                value={`$${analytics.businessMetrics.revenue.toLocaleString()}`} 
                trend="up" 
                trendValue={analytics.businessMetrics.revenueGrowth} 
              /></StatCard><Sta<StatCard 
                title="Transactions" 
                value={analytics.businessMetrics.transactions.toLocaleString()} 
                description="Total number of transactions" 
              /></Sta></StatCard>ics.<StatCard 
                title="Avg Transaction Value" 
                value={`$${analytics.businessMetrics.averageTransactionValue.toFixed(2)}`} 
                description="Per transaction" 
              /></StatCard>umber of transactions" 
              />
        <StatCard 
                title="Avg Transaction<LineChart 
                title="Revenue by Month"
                data={prepareRevenueChart(analytics.businessMetrics.revenueHistory)}
                lines={[{ key: 'Revenue', name: 'Revenue', color: COLORS.teal }]}
                xAxisKey="month"
              /></StatCard>    /></LineChart>   <PieChart 
                title="Revenue by Product"
                data={prepareRevenueByProductChart(analytics.businessMetrics.revenueByProduct)}
                dataKey="value"
                nameKey="name"
              /></PieChart>              xAxisKey="month"
              <PieChart 
                title="Revenue by Product"
                data={prepareRevenueByProductChart(analytics.businessMetrics.revenueByProduct)}
                dataKey="value"
                nameKey="name"
              /></PieChart>
              />
            </div>
            
            <div className="bg-card rounded-lg shadow p-4">
              <h3 className="text-lg font-medium mb-4">Conversion Rate</h3>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">{analy<Head></Head>usinessMetrics.conversionRate}%</div>
                  <p className=<DashboardLayout></DashboardLayout>round mt-2">Overall conversion rate</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  <Head></Head>return (
    <>
      <Head></Head>
        <title>Analytics Dashboard | EHB<DashboardLayout></DashboardLayout>    </Head><DashboardLayout></DashboardLayout>Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive analytics and reporting</p>
          </div>
          
          <div className="mb-6 border-b border-border">
            <div className="flex space-x-6 overflow-x-auto pb-2">
              <button
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('system')}
              >
                System
              </button>
              <button
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'business'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('business')}
              >
                Business
              </button>
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      </DashboardLayout>
    </>
  );
}