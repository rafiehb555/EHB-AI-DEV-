import React, { useState, useEffect } from 'react';
import ContextualHelpSidebar from './ContextualHelpSidebar';
import HelpTriggerButton from './HelpTriggerButton';

/**
 * Contextual Help System
 * 
 * A complete system that combines the help trigger button and contextual
 * help sidebar. It automatically detects the current section based on the URL.
 */
const ContextualHelpSystem = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Detect current section based on URL
  useEffect(() => {
    const detectSection = () => {
      const path = window.location.pathname;
      if (path.includes('/phases')) {
        setCurrentSection('phases');
      } else if (path.includes('/analytics')) {
        setCurrentSection('analytics');
      } else if (path.includes('/learning')) {
        setCurrentSection('learning');
      } else {
        setCurrentSection('dashboard');
      }
    };

    detectSection();

    // Update section when URL changes
    window.addEventListener('popstate', detectSection);
    return () => {
      window.removeEventListener('popstate', detectSection);
    };
  }, []);

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  return (
    <>
      <HelpTriggerButton onClick={toggleHelp} />
      <ContextualHelpSidebar 
        isOpen={isHelpOpen} 
        onClose={closeHelp} 
        currentSection={currentSection} 
      />
    </>
  );
};

export default ContextualHelpSystem;