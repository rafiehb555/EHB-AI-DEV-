/**
 * Contextual Help Button Component
 * 
 * A button that opens the contextual help sidebar
 */

import React from 'react';
import { useContextualHelp } from '../../context/ContextualHelpContext';

const ContextualHelpButton = () => {
  const { isHelpVisible, toggleHelpSidebar } = useContextualHelp();
  
  return (
    <button
      onClick={toggleHelpSidebar}
      className={`fixed right-6 bottom-6 rounded-full p-3 shadow-lg z-40 transition-all ${
        isHelpVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      aria-label={isHelpVisible ? "Close help" : "Get help"}
      title={isHelpVisible ? "Close help" : "Get help"}
    >
      {isHelpVisible ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </button>
  );
};

export default ContextualHelpButton;