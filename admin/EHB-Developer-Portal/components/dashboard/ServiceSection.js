import React from 'react';
import Link from 'next/link';
import ServiceCard from '../cards/ServiceCard';

/**
 * ServiceSection Component
 * 
 * Renders a section of service cards with filtering and grouping options
 */
const ServiceSection = ({ 
  title, 
  services = [], 
  description = '',
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  showViewAll = true,
  viewAllLink = '#',
  collapsible = true,
  filterKey = 'status',
  filterValue = 'all',
  collapsedByDefault = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsedByDefault);

  // Filter services if filterKey and filterValue are provided
  const filteredServices = React.useMemo(() => {
    if (filterKey === 'all' || filterValue === 'all') {
      return services;
    }
    
    return (services || []).filter(service => service[filterKey] === filterValue);
  }, [services, filterKey, filterValue]);

  // Handle collapse toggle
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Calculate grid classes based on columns prop
  const getGridClasses = () => {
    let classes = 'service-grid';
    if (columns.base) classes += ` grid-cols-${columns.base}`;
    if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
    if (columns.md) classes += ` md:grid-cols-${columns.md}`;
    if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
    return classes;
  };

  return (
    <div className="service-section">
      <div className="section-header">
        <div className="header-title-area">
          <h3 className="section-title">{title}</h3>
          {description && (
            <p className="section-description">{description}</p>
          )}
        </div>
        
        <div className="header-actions">
          {filteredServices.length > 0 && (
            <span className="badge">{filteredServices.length} items</span>
          )}
          
          {showViewAll && (
            <Link href={viewAllLink} className="view-all-link">
              View All
            </Link>
          )}
          
          {collapsible && (
            <button 
              className="collapse-toggle"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          {filteredServices.length > 0 ? (
            <div className={getGridClasses()}>
              {filteredServices.map((service, index) => (
                <ServiceCard 
                  key={`${service.name || 'service'}-${index}`} 
                  service={service} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">
                No services found in this category
              </p>
            </div>
          )}
        </>
      )}
      
      <style jsx>{`
        .service-section {
          margin-top: 32px;
          padding: 16px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          background-color: white;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .header-title-area {
          flex: 1;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }
        
        .section-description {
          color: #718096;
          font-size: 0.875rem;
          margin-top: 4px;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
        }
        
        .badge {
          background-color: #3182CE;
          color: white;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 0.75rem;
          margin-right: 16px;
        }
        
        .view-all-link {
          color: #3182CE;
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
        }
        
        .view-all-link:hover {
          text-decoration: underline;
        }
        
        .collapse-toggle {
          margin-left: 16px;
          font-size: 1.25rem;
          font-weight: bold;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          color: #4A5568;
        }
        
        .service-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
          margin-top: 8px;
        }
        
        @media (min-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .grid-cols-4 {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .empty-state {
          text-align: center;
          padding: 32px 24px;
        }
        
        .empty-message {
          font-size: 0.875rem;
          color: #718096;
        }
      `}</style>
    </div>
  );
};

export default ServiceSection;