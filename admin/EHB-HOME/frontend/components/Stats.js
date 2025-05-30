import React from 'react';

/**
 * Stats Component
 * 
 * A standardized stats card component for displaying metrics with an icon and optional change indicator.
 * 
 * @param {string} title - The title of the statistic
 * @param {string|number} value - The value to display
 * @param {React.ReactNode} icon - The icon to display
 * @param {string} change - Change value (e.g. "+12.5%") 
 * @param {string} changeType - Type of change ("increase" or "decrease")
 * @param {string} bgColor - Background color CSS class (defaults to "bg-blue-600")
 */
export default function Stats({ title, value, icon, change, changeType = 'increase', bgColor = 'bg-blue-600' }) {
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className={`p-5 ${bgColor}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-white">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <div className={`flex items-center font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? (
                <svg className="h-5 w-5 flex-shrink-0 self-center" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="h-5 w-5 flex-shrink-0 self-center" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="ml-1">{change}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}