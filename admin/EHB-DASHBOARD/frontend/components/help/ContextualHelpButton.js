/**
 * Contextual Help Button Component
 * 
 * A button that opens the contextual help sidebar with AI-powered real-time explanations
 */

import React, { useEffect, useState } from 'react';
import { useContextualHelp } from '../../context/ContextualHelpContext';

const ContextualHelpButton = ({ topic, context, mode = 'topics' }) => {
  const { isHelpOpen, toggleHelp, getHelp, getPageHelp } = useContextualHelp();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // When the component mounts, set pageLoaded after a delay to ensure we don't load topics immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Optionally load topic-specific help when the page loads
  useEffect(() => {
    if (pageLoaded && topic && !isHelpOpen) {
      // Don't auto-load the help unless specified
      // getHelp(topic, context);
    }
  }, [pageLoaded, topic, context, isHelpOpen, getHelp]);
  
  // Handle button click - open the sidebar and load help content if specified
  const handleClick = () => {
    // Toggle the sidebar
    toggleHelp();
    
    // If we're opening the sidebar and have a topic, load that topic
    if (!isHelpOpen && topic) {
      getHelp(topic, context);
    }
    
    // If we're opening the sidebar and don't have a topic, load page-specific help
    if (!isHelpOpen && !topic) {
      getPageHelp(window.location.pathname);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`fixed right-6 bottom-6 rounded-full p-3 shadow-lg z-40 transition-all ${
        isHelpOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      aria-label={isHelpOpen ? "Close help" : "Get help"}
      title={isHelpOpen ? "Close help" : "Get help"}
    >
      {isHelpOpen ? (
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