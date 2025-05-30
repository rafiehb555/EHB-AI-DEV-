export { default as AnalyticsOverview } from './AnalyticsOverview';
export { default as UsageMetrics } from './UsageMetrics';
export { default as PerformanceMetrics } from './PerformanceMetrics';
export { default as UserStats } from './UserStats';
export { default as AiUsageReports } from './AiUsageReports';
export { default as ReportGenerator } from './ReportGenerator';

// Analytics utility functions
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getPercentageChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export const getTimeRangeLabel = (timeRange) => {
  switch (timeRange) {
    case '24h':
      return 'Last 24 Hours';
    case '7d':
      return 'Last 7 Days';
    case '30d':
      return 'Last 30 Days';
    case '90d':
      return 'Last 90 Days';
    case '1y':
      return 'Last Year';
    case 'all':
      return 'All Time';
    default:
      return 'Custom Period';
  }
};

export const getChangeType = (value) => {
  if (value > 0) return 'increase';
  if (value < 0) return 'decrease';
  return 'no-change';
};

// Common chart colors
export const chartColors = [
  '#3182CE', // blue.500
  '#38B2AC', // teal.500
  '#805AD5', // purple.500
  '#DD6B20', // orange.500
  '#E53E3E', // red.500
  '#38A169', // green.500
  '#D69E2E', // yellow.500
  '#00B5D8', // cyan.500
  '#ED64A6', // pink.500
  '#667EEA', // indigo.500
];