import React from 'react';

/**
 * Stat Card Component
 * Displays a statistic with a title, value, and optional icon
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Statistic value
 * @param {string} props.description - Optional description text
 * @param {ReactNode} props.icon - Optional icon
 * @param {string} props.trend - Optional trend indicator (up, down, neutral)
 * @param {number} props.trendValue - Optional trend value (percentage)
 * @param {string} props.className - Additional CSS classes
 */
const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue,
  className = '' 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <span className="text-green-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {trendValue && `${trendValue}%`}
        </span>
      );
    } else if (trend === 'down') {
      return (
        <span className="text-red-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {trendValue && `${trendValue}%`}
        </span>
      );
    } else if (trend === 'neutral') {
      return (
        <span className="text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
          {trendValue && `${trendValue}%`}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`bg-card p-4 rounded-lg shadow ${className}`}>
      <div className="flex justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-semibold">{value}</div>
        {trend && (
          <div className="ml-2 text-sm">
            {getTrendIcon()}
          </div>
        )}
      </div>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};

export default StatCard;