import React from 'react';

const AnalyticsFilters = ({ 
  timeframe, 
  reportType, 
  onTimeframeChange, 
  onReportTypeChange,
  isAdmin = false 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0">
      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
          Time Period
        </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 3 months</option>
          <option value="year">Last 12 months</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div>
        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
          Report Type
        </label>
        <select
          id="reportType"
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="document">Document Analytics</option>
          <option value="user">User Analytics</option>
          {isAdmin && <option value="system">System Analytics</option>}
        </select>
      </div>
    </div>
  );
};

export default AnalyticsFilters;