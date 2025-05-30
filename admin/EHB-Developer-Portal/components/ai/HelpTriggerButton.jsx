import React, { useState } from 'react';

/**
 * Help Trigger Button Component
 * 
 * A floating button that triggers the contextual help sidebar
 */
const HelpTriggerButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: isHovered ? '#0056b3' : '#0064db',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.2s ease'
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Get contextual help"
      title="Get contextual help"
    >
      ?
    </button>
  );
};

export default HelpTriggerButton;