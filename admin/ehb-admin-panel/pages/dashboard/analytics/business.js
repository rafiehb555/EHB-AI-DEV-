import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/analytics/StatCard';
import LineChart from '../../../components/analytics/LineChart';
import BarChart from '../../../components/analytics/BarChart';
import PieChart from '../../../components/analytics/PieChart';
import { getBusinessMetrics } from '../../../services/analyticsService';

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

const BusinessAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [businessMetrics, setBusinessMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    const fetchBusinessMetrics = async () => {
      try {
        setLoading(true);
        const data = await getBusinessMetrics();
        setBusinessMetrics(data);
      } catch (error) {
        console.error('Error fetching business metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessMetrics();
  }, []);

  // Format the revenue history data for the chart
  const prepareRevenueChart = (revenueHistory) => {
    if (!revenueHistory) return [];
    
    return (revenueHistory || []).map(item => ({
      month: item.month,
      Revenue: item.amount
    }));
  };

  // Format the revenue by product data for the pie chart
  const prepareRevenueByProductChart = (revenueByProduct) => {
    if (!revenueByProduct) return [];
    
    const colors = [COLORS.teal, COLORS.blue, COLORS.purple, COLORS.orange];
    
   (revenueByProduct || []).map((uct || []).map((item, index) => ({
      name: item.product,
      value: item.amount,
      color: colors[index % colors.length]
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
        <title>Business Metrics | EHB Admin</ti<DashboardLayout></DashboardLayout>><DashboardLayout></DashboardLayout>Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Business Metrics</h1>
              <p className="text-muted-foreground">Revenue, transactions, and business performance metrics</p>
            </div>
            <div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols<StatCard 
              title="Total Revenue" 
              value={`$${businessMetrics.revenue.toLocaleString()}`} 
              trend="up" 
              trendValue={businessMetrics.revenueGrowth} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard> 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 <StatCard 
              title="Transactions" 
              value={businessMetrics.transactions.toLocaleString()} 
              description="Total number of transactions" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>iewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5<StatCard 
              title="Avg Transaction Value" 
              value={`$${businessMetrics.averageTransactionValue.toFixed(2)}`} 
              description="Per transaction" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>entColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-<StatCard 
              title="Conversion Rate" 
              value={`${businessMetrics.conversionRate}%`} 
              description="Overall conversion rate" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></StatCard>troke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            />
          </div>
       <LineChart 
              title="Revenue by Month"
              data={prepareRevenueChart(businessMetrics.revenueHistory)}
              lines={[{ key: 'Revenue', name: 'Revenue ($)', color: COLORS.teal }]}
              xAxisKey="month"
            /></LineChart>m<PieChart 
              title="Revenue by Product"
              data={prepareRevenueByProductChart(businessMetrics.revenueByProduct)}
              dataKey="value"
              nameKey="name"
            /></PieChart>etrics.revenueByProduct)}
              dataKey="value"
              nameKey="name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Monthly Target Progress</span>
                    <span className="text-sm font-medium text-muted-foreground">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    $97,500 of $125,000 monthly target
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Quarterly Target Progress</span>
                    <span className="text-sm font-medium text-muted-foreground">65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    $234,000 of $360,000 quarterly target
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Annual Target Progress</span>
                    <span className="text-sm font-medium text-muted-foreground">42%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    $630,000 of $1,500,000 annual target
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Key Business Indicators</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Acquisition Cost</p>
                    <p className="text-2xl font-semibold">$42.50</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lifetime Value</p>
                    <p className="text-2xl font-semibold">$850</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-semibold">2.8%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-semibold">79.5%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Repeat Purchase Rate</p>
                    <p className="text-2xl font-semibold">38.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate (MoM)</p>
                    <p className="text-2xl font-semibold">+8.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Units Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Premium Subscription</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">450</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">$45,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12.3%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Standard Subscription</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">700</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">$35,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8.7%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Basic Subscription</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">1250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">$25,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+5.2%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">One-time Services</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">$20,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-2.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default BusinessAnalytics;