import React from 'react';

const SystemHealthItem = ({ title, status, percentage }) => {
  const getStatusColor = () => {
    if (status === 'healthy') return '#38A169'; // green
    if (status === 'warning') return '#D69E2E'; // yellow
    if (status === 'critical') return '#E53E3E'; // red
    return '#718096'; // gray
  };

  const statusColor = getStatusColor();
  
  return (
    <div className="health-item">
      <div className="health-item-header">
        <span className="health-item-title">{title}</span>
        <span className="health-item-badge" style={{backgroundColor: statusColor}}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="health-item-progress-container">
        <div 
          className="health-item-progress" 
          style={{
            width: `${percentage}%`,
            backgroundColor: statusColor
          }} 
        />
      </div>
      
      <style jsx>{`
        .health-item {
          margin-bottom: 16px;
        }
        
        .health-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .health-item-title {
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .health-item-badge {
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 9999px;
          color: white;
          text-transform: capitalize;
        }
        
        .health-item-progress-container {
          height: 8px;
          width: 100%;
          background-color: #EDF2F7;
          border-radius: 9999px;
          overflow: hidden;
        }
        
        .health-item-progress {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  );
};

const SystemHealthCard = ({ healthData }) => {
  const {
    admin = { status: 'healthy', percentage: 98 },
    services = { status: 'healthy', percentage: 95 },
    system = { status: 'warning', percentage: 82 },
    api = { status: 'healthy', percentage: 96 },
    database = { status: 'healthy', percentage: 97 },
    storage = { status: 'warning', percentage: 78 },
  } = healthData || {};
  
  // Calculate overall health status
  const calculateOverallStatus = () => {
    const components = [admin, services, system, api, database, storage];
    const criticalCount = components.filter(c => c.status === 'critical').length;
    const warningCount = components.filter(c => c.status === 'warning').length;
    
    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };
  
  const calculateOverallPercentage = () => {
    const components = [admin, services, system, api, database, storage];
    const sum = components.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / components.length);
  };
  
  const overallStatus = calculateOverallStatus();
  const overallPercentage = calculateOverallPercentage();
  
  const getStatusColor = (status) => {
    if (status === 'healthy') return '#38A169'; // green
    if (status === 'warning') return '#D69E2E'; // yellow
    if (status === 'critical') return '#E53E3E'; // red
    return '#718096'; // gray
  };
  
  return (
    <div className="system-health-card">
      <h3 className="card-title">System Health</h3>
      
      <div className="overall-status">
        <div className="overall-header">
          <span className="overall-title">Overall Status</span>
          <span 
            className="overall-badge"
            style={{backgroundColor: getStatusColor(overallStatus)}}
          >
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </span>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{
              width: `${overallPercentage}%`,
              backgroundColor: getStatusColor(overallStatus)
            }}
          />
        </div>
        
        <span className="overall-percentage">{overallPercentage}% operational</span>
      </div>
      
      <div className="divider"></div>
      
      <div className="health-grid">
        <div className="grid-column">
          <SystemHealthItem title="Admin Modules" status={admin.status} percentage={admin.percentage} />
          <SystemHealthItem title="Services" status={services.status} percentage={services.percentage} />
          <SystemHealthItem title="System Core" status={system.status} percentage={system.percentage} />
        </div>
        <div className="grid-column">
          <SystemHealthItem title="API Endpoints" status={api.status} percentage={api.percentage} />
          <SystemHealthItem title="Database" status={database.status} percentage={database.percentage} />
          <SystemHealthItem title="Storage" status={storage.status} percentage={storage.percentage} />
        </div>
      </div>
      
      <style jsx>{`
        .system-health-card {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          background-color: white;
          padding: 16px;
          height: 100%;
        }
        
        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .overall-status {
          margin-bottom: 24px;
        }
        
        .overall-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .overall-title {
          font-weight: 600;
        }
        
        .overall-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 9999px;
          color: white;
          text-transform: capitalize;
        }
        
        .progress-container {
          height: 10px;
          width: 100%;
          background-color: #EDF2F7;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }
        
        .overall-percentage {
          font-size: 0.875rem;
          color: #718096;
        }
        
        .divider {
          height: 1px;
          width: 100%;
          background-color: #E2E8F0;
          margin: 16px 0;
        }
        
        .health-grid {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -8px;
        }
        
        .grid-column {
          flex: 1;
          min-width: 250px;
          padding: 0 8px;
        }
        
        @media (max-width: 768px) {
          .grid-column {
            flex: 0 0 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SystemHealthCard;