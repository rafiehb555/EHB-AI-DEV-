import React from 'react';
import Link from 'next/link';

/**
 * ServiceCard Component
 * 
 * Displays a card for a service with its name, description, and status
 */
const ServiceCard = ({ service }) => {
  const {
    name,
    description,
    path,
    icon,
    tag,
    status = 'active'
  } = service || {};

  // Status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return '#38A169'; // green
      case 'maintenance':
        return '#D69E2E'; // yellow
      case 'inactive':
        return '#E53E3E'; // red
      default:
        return '#718096'; // gray
    }
  };

  // Get tag color based on tag name
  const getTagColor = () => {
    switch (tag) {
      case 'ADMIN':
        return '#805AD5'; // purple
      case 'SERVICES':
        return '#3182CE'; // blue
      case 'SYSTEM':
        return '#DD6B20'; // orange
      case 'TOOLS':
        return '#319795'; // teal
      case 'AI':
        return '#D53F8C'; // pink
      case 'BLOCKCHAIN':
        return '#00B5D8'; // cyan
      case 'DATABASE':
        return '#38A169'; // green
      default:
        return '#718096'; // gray
    }
  };

  return (
    <div className="service-card">
      <Link href={path || '/'}>
        <div className="card-content">
          <div className="card-header">
            <div className="title-row">
              <div className="icon">{icon || '🔹'}</div>
              <h3 className="title">{name || 'Service'}</h3>
              <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
                {status}
              </div>
            </div>
            <p className="description">{description || 'No description available'}</p>
          </div>
          <div className="card-footer">
            <div className="tag" style={{ backgroundColor: `${getTagColor()}22`, color: getTagColor() }}>
              {tag || 'MISC'}
            </div>
            <div className="path">
              {path ? path.split('/').filter(Boolean).join(' → ') : '/'}
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .service-card {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
          background-color: white;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-color: ${getTagColor()}33;
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: pointer;
        }
        
        .card-header {
          padding: 16px;
          flex: 1;
        }
        
        .title-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .icon {
          font-size: 1.5rem;
          margin-right: 8px;
        }
        
        .title {
          font-weight: 600;
          font-size: 1.15rem;
          margin: 0;
          flex: 1;
        }
        
        .description {
          color: #718096;
          font-size: 0.875rem;
          margin: 4px 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          border-top: 1px solid #E2E8F0;
          background-color: #F7FAFC;
          margin-top: auto;
        }
        
        .status-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 9999px;
          color: white;
          text-transform: capitalize;
        }
        
        .tag {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 500;
        }
        
        .path {
          font-size: 0.7rem;
          color: #718096;
        }
      `}</style>
    </div>
  );
};

export default ServiceCard;