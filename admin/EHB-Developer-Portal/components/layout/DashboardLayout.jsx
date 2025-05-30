import React from 'react';

/**
 * Dashboard Layout Component
 * 
 * A dashboard layout without Chakra UI dependencies.
 */
const DashboardLayout = ({ children, activeItem = 'dashboard' }) => {
  // Static colors without using Chakra hooks
  const bgColor = '#f5f8fa';
  const sidebarBgColor = 'white';
  const borderColor = '#edf2f7';
  const highlightBgColor = '#f0f7ff';
  const textColor = '#0064db';
  const navTextColor = '#4a5568';
  const activeTextColor = '#0064db';
  
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: bgColor,
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: sidebarBgColor,
        borderRight: `1px solid ${borderColor}`,
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          marginBottom: '30px',
          color: textColor
        }}>
          EHB Developer Portal
        </div>
        
        <nav>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {['dashboard', 'phases', 'analytics', 'learning', 'ai-search', 'ai-code-assistant', 'ai-integration-hub'].map((item) => (
              <li key={item} style={{ marginBottom: '10px' }}>
                <a 
                  href={`/${item === 'dashboard' ? '' : item}`}
                  style={{
                    display: 'block',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: activeItem === item ? highlightBgColor : 'transparent',
                    color: activeItem === item ? activeTextColor : navTextColor,
                    fontWeight: activeItem === item ? 'medium' : 'normal',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {item === 'ai-search' ? 'AI Search' : 
                   item === 'ai-code-assistant' ? 'AI Code Assistant' : 
                   item === 'ai-integration-hub' ? 'AI Integration Hub' : 
                   item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div style={{ 
        flex: 1,
        padding: '20px'
      }}>
        {children}
        
        {/* Help button - simplified version */}
        <button
          onClick={() => alert('Help system will be implemented without Chakra UI.')}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#0064db',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 999,
            fontSize: '20px',
            fontWeight: 'bold',
          }}
          aria-label="Get help"
          title="Get help"
        >
          ?
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;