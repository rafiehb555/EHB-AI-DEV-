import React, { createContext, useContext } from 'react';
import siteConfig from '../siteConfig';

// Create the context with a default value (not null)
const SiteConfigContext = createContext(siteConfig);

// Provider component
export const SiteConfigProvider = ({ children }) => {
  return (
    <SiteConfigContext.Provider value={siteConfig}>
      {children}
    </SiteConfigContext.Provider>
  );
};

// Hook for using the context - safer implementation
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  
  // Return default siteConfig if context is not available
  if (!context) {
    console.warn('useSiteConfig: SiteConfigProvider not found, using default config');
    return siteConfig;
  }
  
  return context;
};

export default SiteConfigContext;