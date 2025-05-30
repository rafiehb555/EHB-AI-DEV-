import React, { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';

/**
 * Contextual Help Sidebar Component
 * 
 * This component provides real-time AI explanations based on the current context.
 * It detects the user's current view and provides relevant help and information.
 */
const ContextualHelpSidebar = ({ currentSection, isOpen, onClose }) => {
  const siteConfig = useSiteConfig();
  const [helpContent, setHelpContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const containerRef = useRef(null);

  // Sample FAQ data - would be replaced with actual data from API
  const faqData = {
    dashboard: [
      { 
        question: 'What metrics are shown on the dashboard?', 
        answer: 'The dashboard displays key metrics including active users, service count, AI requests, and database size. These metrics provide an overview of system usage and performance.'
      },
      { 
        question: 'How is system health determined?', 
        answer: 'System health is calculated based on the status of all system components including frontend, backend API, database, AI services, blockchain, and more. Components with response times under threshold and proper connectivity are considered healthy.'
      },
      { 
        question: 'How do I refresh the dashboard data?', 
        answer: 'You can refresh the dashboard data by clicking the refresh button in the top right corner of the dashboard. The dashboard also auto-refreshes every few minutes.'
      }
    ],
    phases: [
      { 
        question: 'What are EHB phases?', 
        answer: 'EHB phases represent the modular components of the EHB system. Each phase implements specific functionality and follows a standardized structure for consistency and maintainability.'
      },
      { 
        question: 'How are phases organized?', 
        answer: 'Each phase follows a standard structure with frontend, backend, models, admin, and config directories. This organization ensures consistency across phases and makes integration simpler.'
      },
      { 
        question: 'How do I add a new phase?', 
        answer: 'New phases can be added through the Developer Portal by using the "Create New Phase" button in the Phases section. Follow the guided workflow to specify the phase details and required components.'
      }
    ],
    analytics: [
      { 
        question: 'What analytics are tracked?', 
        answer: 'The analytics system tracks user activity, service usage, API calls, database operations, and system performance metrics. These analytics help in understanding system usage patterns and identifying optimization opportunities.'
      },
      { 
        question: 'Can I export analytics data?', 
        answer: 'Yes, you can export analytics data in various formats including CSV, JSON, and PDF. Use the export button in the top right corner of the analytics dashboard.'
      }
    ],
    learning: [
      { 
        question: 'What is the Learning Path?', 
        answer: 'The Learning Path is a structured educational journey through the EHB system. It provides step-by-step tutorials, interactive challenges, and documentation to help developers understand and work with the system.'
      },
      { 
        question: 'How do I track my learning progress?', 
        answer: 'Your learning progress is automatically tracked as you complete modules and challenges. You can view your progress on the Learning Path dashboard.'
      }
    ]
  };

  // Load help content based on current section
  useEffect(() => {
    if (currentSection) {
      setIsLoading(true);
      // Simulate API call to get contextual help
      setTimeout(() => {
        setHelpContent({
          title: getSectionTitle(currentSection),
          description: getSectionDescription(currentSection),
          faqs: faqData[currentSection] || [],
        });
        setIsLoading(false);
      }, 500);
    }
  }, [currentSection]);

  // Helper functions to get section title and description
  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard Help',
      phases: 'Phases Help',
      analytics: 'Analytics Help',
      learning: 'Learning Path Help',
    };
    return titles[section] || 'EHB Help';
  };

  const getSectionDescription = (section) => {
    const descriptions = {
      dashboard: 'The dashboard provides an overview of system status, metrics, and activity.',
      phases: 'The phases view shows all EHB phases and their implementation status.',
      analytics: 'The analytics section provides insights into system usage and performance.',
      learning: 'The learning path offers guided tutorials and interactive challenges.',
    };
    return descriptions[section] || 'Get help and information about the EHB system.';
  };

  // Handle AI help request
  const handleAIHelp = () => {
    alert('AI Help feature will be implemented in the next phase.');
  };

  // Toggle FAQ item expansion
  const toggleFaqItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!isOpen) return null;

  // Animation class
  const slideInClass = isOpen ? 'slide-in-right' : '';

  const sidebarStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '320px',
    height: '100vh',
    backgroundColor: 'white',
    boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    overflowY: 'auto',
    padding: '20px',
    animation: isOpen ? 'slideInRight 0.3s forwards' : 'none'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '5px',
    color: '#666'
  };

  const descriptionStyle = {
    marginBottom: '20px',
    color: '#666'
  };

  const faqHeadingStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '12px'
  };

  const faqListStyle = {
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '24px'
  };

  const faqItemStyle = (index) => ({
    borderBottom: index < (helpContent?.faqs.length - 1) ? '1px solid #eee' : 'none'
  });

  const faqButtonStyle = (isExpanded) => ({
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: isExpanded ? '#e3f2fd' : 'white',
    color: isExpanded ? '#0064db' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: isExpanded ? 'bold' : 'normal',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });

  const faqContentStyle = (isExpanded) => ({
    padding: isExpanded ? '12px 16px' : '0 16px',
    maxHeight: isExpanded ? '500px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, padding 0.3s ease',
    backgroundColor: '#f5f8ff',
    color: '#666'
  });

  const aiSectionStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  };

  const aiHeadingStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const aiDescriptionStyle = {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '16px'
  };

  const aiButtonStyle = {
    backgroundColor: '#0064db',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'medium'
  };

  const spinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    height: '200px'
  };

  return (
    <div ref={containerRef} style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {helpContent?.title || 'Loading...'}
        </h2>
        <button style={closeButtonStyle} onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={spinnerStyle}>
          <div className="spinner" style={{
            width: '30px',
            height: '30px',
            border: '3px solid rgba(0, 100, 219, 0.2)',
            borderRadius: '50%',
            borderTop: '3px solid #0064db',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div>
          <p style={descriptionStyle}>
            {helpContent?.description}
          </p>

          {/* FAQ Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={faqHeadingStyle}>
              Frequently Asked Questions
            </h3>
            <div style={faqListStyle}>
              {helpContent?.faqs.map((faq, index) => (
                <div key={index} style={faqItemStyle(index)}>
                  <button 
                    style={faqButtonStyle(expandedItems[index])}
                    onClick={() => toggleFaqItem(index)}
                  >
                    {faq.question}
                    <span>{expandedItems[index] ? '▲' : '▼'}</span>
                  </button>
                  <div style={faqContentStyle(expandedItems[index])}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Section */}
          <div style={aiSectionStyle}>
            <h3 style={aiHeadingStyle}>
              Need More Help?
            </h3>
            <p style={aiDescriptionStyle}>
              Ask our AI assistant for real-time help with any questions about the EHB system.
            </p>
            <button 
              style={aiButtonStyle}
              onClick={handleAIHelp}
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .slide-in-right {
          animation: slideInRight 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default ContextualHelpSidebar;