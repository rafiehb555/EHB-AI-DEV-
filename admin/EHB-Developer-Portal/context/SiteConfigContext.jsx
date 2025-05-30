import React, { createContext, useContext } from 'react';

// Create the context with a default empty value
export const SiteConfigContext = createContext({});

// Custom hook to use the site config context
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    console.warn('useSiteConfig was used outside of its Provider');
    return {}; // Return empty object to avoid crashes
  }
  return context;
};

// Provider component with default configuration
export const SiteConfigProvider = ({ children }) => {
  // Default site configuration
  const config = {
    title: 'EHB Developer Portal',
    description: 'Centralized dashboard for EHB development',
    version: '1.0.0',
    apiEndpoint: '/api',
    features: {
      contextualHelp: true,
      aiAssistant: true,
      analytics: true,
      smartWorkspaceLayout: true,
    },
    navigation: {
      main: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'phases', label: 'Phases' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'learning', label: 'Learning Path' }
      ],
      ai: [
        { id: 'ai-dashboard', label: 'AI Dashboard' },
        { id: 'smart-agent', label: 'Smart Agent' },
        { id: 'auto-card-gen', label: 'Auto Card Gen' }
      ],
      system: [
        { id: 'integration', label: 'Integration' },
        { id: 'services', label: 'Services' },
        { id: 'database', label: 'Database' }
      ],
      management: [
        { id: 'users', label: 'Users' },
        { id: 'settings', label: 'Settings' }
      ]
    },
    workspaceDefaults: {
      sidebarWidth: 250,
      collapsedSidebarWidth: 64,
      mobileBreakpoint: 768,
      defaultTheme: 'light'
    }
  };
  
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};