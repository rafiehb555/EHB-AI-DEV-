import React from 'react';
import GitHubIntegration from '../github/GitHubIntegration';

/**
 * GitHub Integration Section Component
 * 
 * A section in the dashboard dedicated to GitHub integration status and controls.
 */
const GitHubIntegrationSection = () => {
  return (
    <div className="service-section">
      <div className="section-header">
        <h2 className="section-title">GitHub Integration</h2>
        <p className="section-description">
          Manage GitHub repository synchronization and auto-push functionality
        </p>
      </div>
      
      <div className="section-content">
        <GitHubIntegration />
      </div>
      
      <style jsx>{`
        .service-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: #F7FAFC;
        }
        
        .section-header {
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .section-description {
          color: #4A5568;
          font-size: 0.875rem;
        }
        
        .section-content {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .section-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GitHubIntegrationSection;