import React from 'react';
import { useTheme } from '../hooks/useWorkspace';

/**
 * MetricCard Component
 * 
 * A card component for displaying key metrics or KPIs on the dashboard
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number|string} props.value - The main value to display
 * @param {string} props.icon - Icon to display (emoji or component)
 * @param {number} props.change - Percentage change (positive or negative)
 * @param {string} props.timeframe - Timeframe for the change (e.g., "vs last week")
 * @param {string} props.color - Card accent color
 * @param {Function} props.onClick - Click handler for the card
 */
const MetricCard = ({
  title,
  value,
  icon,
  change,
  timeframe = 'vs last period',
  color = '#3B82F6',
  onClick
}) => {
  const { theme } = useTheme();
  
  // Format large numbers with commas
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };
  
  // Determine if change is positive, negative or neutral
  const getChangeType = () => {
    if (!change || change === 0) return 'neutral';
    return change > 0 ? 'positive' : 'negative';
  };
  
  const changeType = getChangeType();
  
  // Get appropriate change icon and class
  const getChangeIcon = () => {
    if (changeType === 'positive') return '↑';
    if (changeType === 'negative') return '↓';
    return '→';
  };
  
  return (
    <div 
      className={`metric-card ${theme}`} 
      onClick={onClick}
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
      
      <div className="card-body">
        <div className="metric-value">{formatValue(value)}</div>
        
        {change !== undefined && (
          <div className={`metric-change ${changeType}`}>
            <span className="change-icon">{getChangeIcon()}</span>
            <span className="change-value">
              {Math.abs(change)}%
            </span>
            <span className="change-timeframe">
              {timeframe}
            </span>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .metric-card {
          background-color: ${theme === 'dark' ? '#1F2937' : 'white'};
          color: ${theme === 'dark' ? '#F9FAFB' : '#1F2937'};
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: ${onClick ? 'pointer' : 'default'};
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .card-title {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'};
        }
        
        .card-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }
        
        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .metric-change {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .positive {
          color: #10B981;
        }
        
        .negative {
          color: #EF4444;
        }
        
        .neutral {
          color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'};
        }
        
        .change-timeframe {
          color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'};
          margin-left: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default MetricCard;