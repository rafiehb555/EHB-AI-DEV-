import React from 'react';
import StatCard from './StatCard';
import TimelineChart from './charts/TimelineChart';

const SystemAnalytics = ({ data, timeframe }) => {
  const { summary, documentGrowth, userGrowth } = data || {};
  
  // Format bytes to human-readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  // Convert timeframe to display text
  const timeframeText = {
    'week': 'the past 7 days',
    'month': 'the past 30 days',
    'quarter': 'the past 3 months',
    'year': 'the past 12 months',
    'all': 'all time'
  }[timeframe] || timeframe;

  // Helper to get document growth data for the chart
  const getDocumentGrowthData = () => {
    if (!documentGrowth || !documentGrowth.length) return [];
    
    return (documentGrowth || []).map(item => ({
      date: item._id,
      count: item.count,
      size: item.totalSize
    }));
  };

  // Helper to get user growth data for the chart
  const getUserGrowthData = () => {
    if (!userGrowth || !userGrowth.length) return [];
    
   (userGrowth || []).map((wth || []).map(item => ({
      date: item._id,
      count: item.count
    }));
  };

  if (!summary) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No system analytics data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        System Analytics for {timeframeText}
      </h2>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Users" 
          value={summary.totalUsers.toLocaleString()} 
          icon="user" 
        /></StatCard>
        <StatCard 
          title="Total Documents" 
          value={summary.totalDocuments.toLocaleString()} 
          icon="document" 
        <StatCard 
          title="Total Storage" 
          value={formatBytes(summary.totalStorage)} 
          icon="storage" 
        /></StatCard>
        />
        <StatCard 
          title="Active Users" 
          value={summary.activeUsers.toLocaleString()} 
          icon="user" 
        /></StatCard>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Document growth over time */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Document Growth Ove<TimelineChart 
            data={getDocumentGrowthData()} 
            xKey="date" 
            yKey="count"
            xAxisLabel="Month"
            yAxisLabel="Documents"
          /></TimelineChart>ocuments"
          />
        </div>
        
        {/* User growth over time */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4"<TimelineChart 
            data={getUserGrowthData()} 
            xKey="date" 
            yKey="count"
            xAxisLabel="Month"
            yAxisLabel="Users"
          /></TimelineChart>       yAxisLabel="Users"
          />
        </div>
      </div>
      
      {/* System summary card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">System Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Storage Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Total Storage:</span>
                <span className="font-medium">{formatBytes(summary.totalStorage)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Average Storage per User:</span>
                <span className="font-medium">
                  {summary.totalUsers > 0 
                    ? formatBytes(summary.totalStorage / summary.totalUsers) 
                    : formatBytes(0)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Average Storage per Document:</span>
                <span className="font-medium">
                  {summary.totalDocuments > 0 
                    ? formatBytes(summary.totalStorage / summary.totalDocuments) 
                    : formatBytes(0)}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">User Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Total Users:</span>
                <span className="font-medium">{summary.totalUsers.toLocaleString()}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Active Users:</span>
                <span className="font-medium">{summary.activeUsers.toLocaleString()}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">User Engagement Rate:</span>
                <span className="font-medium">
                  {summary.totalUsers > 0 
                    ? `${((summary.activeUsers / summary.totalUsers) * 100).toFixed(1)}%` 
                    : '0%'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;