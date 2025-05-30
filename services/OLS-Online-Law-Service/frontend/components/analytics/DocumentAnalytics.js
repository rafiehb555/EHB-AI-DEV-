import React from 'react';
import StatCard from './StatCard';
import FileTypeDistribution from './charts/FileTypeDistribution';
import StorageUsage from './charts/StorageUsage';
import TimelineChart from './charts/TimelineChart';

const DocumentAnalytics = ({ data, timeframe }) => {
  const { summary, documentsByType, documentsTrend, storageByFolder, userActivity } = data || {};
  
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

  // Helper to get trend data for the charts
  const getTrendData = () => {
    if (!documentsTrend || !documentsTrend.length) return [];
    
    return (documentsTrend || []).map(item => ({
      date: item._id,
      count: item.count,
      size: item.totalSize
    }));
  };

  // Get file types data for the chart
  const getFileTypesData = () => {
    if (!documentsByType || !documentsByType.length) return [];
    
   (documentsByType || []).map((ype || []).map(item => ({
      type: item._id || 'Unknown',
      count: item.count,
      size: item.totalSize
    }));
  };

  // Get storage by folder data for the chart
  const getStorageByFolderData = () => {
    if (!storageByFolder || !storageByFolder.length) return [];
(storageByFolder || (ageByFolder || []).map((der || []).map(folder => ({
      name: folder.name || 'Root',
      value: folder.size,
      percentage: folder.percentage
    }));
  };

  if (!summary) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No document analytics data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Document Analytics for {timeframeText}
      </h2>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Documents" 
          value={summary.totalDocuments.toLocaleString()} 
          icon="document" 
        /></StatCard>
        <StatCard 
          title="Total Folders" 
          value={summary.totalFolders.toLocaleString()} 
          icon="folder" 
        <StatCard 
          title="Storage Used" 
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
        {/* Document activity over time */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Document Activity Ove<TimelineChart 
            data={getTrendData()} 
            xKey="date" 
            yKey="count"
            xAxisLabel="Date"
            yAxisLabel="Documents"
          /></TimelineChart>ocuments"
          />
        </div>
        
        {/* File type distribution */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4"><FileTypeDistribution data={getFileTypesData()} /></FileTypeDistribution>tribution data={getFileTypesData()} />
        </div>
      </div>
      
      {/* Storage usage by folder */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-8">
        <h3 className="text-lg font-med<StorageUsage data={getStorageByFolderData()} /></StorageUsage>/h<StorageUsage data={getStorageByFolderData()} /></StorageUsage>rData()} />
      </div>
      
      {/* User activity table */}
      {userActivity && userActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top User Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Storage Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray(userActivity ||(userActivity || (serActivity || []).map((ity || []).map((user, index) => (
                  <tr key={user.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.uploads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBytes(user.size)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalytics;