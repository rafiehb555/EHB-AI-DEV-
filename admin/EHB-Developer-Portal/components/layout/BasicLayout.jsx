import React from 'react';

/**
 * Basic Layout Component
 * 
 * A simple layout without Chakra UI dependencies.
 * This layout can be used by any page that doesn't require specific layout components.
 */
const BasicLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Main content */}
      <main style={{ padding: '20px' }}>
        {children}
      </main>
      
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
  );
};

export default BasicLayout;