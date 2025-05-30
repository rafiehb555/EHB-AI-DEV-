import React from 'react';
import DocumentAnalytics from './DocumentAnalytics';
import UserAnalytics from './UserAnalytics';
import SystemAnalytics from './SystemAnalytics';

const AnalyticsDashboard = ({ data, reportType, timeframe }) => {
  if (!data) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }

  // Check if we have a message about database not being connected
  if (data.noDatabase) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {data.message || 'Database not connected. Some features may be limited.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate analytics view based on reportType
  return (
    <div>
      {reportType === 'document' && data.analytics && (
        <DocumentAnalytics data={data.analytics} timeframe={timeframe} /></DocumentAnalytics>
      )}
      
      {reportType === 'user' && data.userAna<UserAnalytics data={data.userAnalytics} timeframe={timeframe} /></UserAnalytics>frame={timeframe} />
      )}
      
      {reportType === 'system' &<SystemAnalytics data={data.systemAnalytics} timeframe={timeframe} /></SystemAnalytics>mAnalytics} timeframe={timeframe} />
      )}
    </div>
  );
};

export default AnalyticsDashboard;