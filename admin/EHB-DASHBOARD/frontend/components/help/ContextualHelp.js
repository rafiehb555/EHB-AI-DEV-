/**
 * Contextual Help Component
 * 
 * Combines the contextual help button and sidebar components
 */

import React from 'react';
import ContextualHelpButton from './ContextualHelpButton';
import ContextualHelpSidebar from './ContextualHelpSidebar';

const ContextualHelp = () => {
  return (
    <>
      <ContextualHelpButton /></ContextualHelpButton>
      <ContextualHelpSidebar /></ContextualHelpSidebar>
    </>
  );
};

export default ContextualHelp;