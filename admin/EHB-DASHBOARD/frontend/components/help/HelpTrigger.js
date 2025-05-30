/**
 * Help Trigger Component
 * 
 * A small help icon that can be placed next to UI elements to provide contextual help
 */

import React, { useRef } from 'react';
import { useContextualHelp } from '../../context/ContextualHelpContext';

const HelpTrigger = ({ topic, placement = 'right', size = 'sm', children, className = '' }) => {
  const { getHelpForTopic } = useContextualHelp();
  const triggerRef = useRef(null);
  
  // Size classes for the icon
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  // Get the placement classes
  const getPlacementClasses = () => {
    switch (placement) {
      case 'left':
        return 'mr-2';
      case 'right':
        return 'ml-2';
      case 'top':
        return 'mb-2';
      case 'bottom':
        return 'mt-2';
      default:
        return 'ml-2';
    }
  };
  
  // Handle click on the help icon
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    getHelpForTopic(topic, triggerRef.current);
  };
  
  return (
    <span 
      ref={triggerRef} 
      className={`inline-flex items-center cursor-help ${getPlacementClasses()} ${className}`}
      onClick={handleClick}
      title={`Get help about ${topic}`}
    >
      {children || (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${sizeClasses[size]} text-gray-500 hover:text-blue-600`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </span>
  );
};

export default HelpTrigger;