/**
 * Site configuration for the EHB Developer Portal
 * This file contains configuration settings used throughout the application
 */

const siteConfig = {
  title: 'EHB Developer Portal',
  description: 'The central hub for EHB development and administration',
  version: '1.3.0',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5010',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api', // Using port 5001 for Backend Server
    timeout: 30000,
  },
  navigation: {
    main: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { id: 'phases', label: 'Phases', path: '/phases' },
      { id: 'analytics', label: 'Analytics', path: '/analytics' },
      { id: 'learning', label: 'Learning Path', path: '/learning' },
    ],
    ai: [
      { id: 'ai-dashboard', label: 'AI Dashboard', path: '/ai-dashboard' },
      { id: 'smart-agent', label: 'Smart AI Agent', path: '/smart-agent' },
      { id: 'auto-card-gen', label: 'Auto Card Gen', path: '/auto-card-gen' },
    ],
    system: [
      { id: 'integration', label: 'Integration', path: '/integration' },
      { id: 'services', label: 'Services', path: '/services' },
      { id: 'database', label: 'Database', path: '/database' },
    ],
    management: [
      { id: 'users', label: 'Users', path: '/users' },
      { id: 'settings', label: 'Settings', path: '/settings' },
    ],
  },
  services: {
    backendUrl: 'http://localhost:5001', // Backend Server on port 5001
    homeUrl: 'http://localhost:5005',    // EHB-HOME on port 5005
    goSellrUrl: 'http://localhost:5002', // GoSellr on port 5002
    aiDevUrl: 'http://localhost:5050',   // AI Playground on port 5050
    aiIntegrationHubUrl: 'http://localhost:5150', // AI Integration Hub on port 5150
  },
  theme: {
    colorMode: {
      defaultValue: 'light',
      storageKey: 'ehb-color-mode',
    },
    colors: {
      primary: 'blue',
      secondary: 'teal',
      accent: 'purple',
    },
  },
  auth: {
    loginUrl: '/auth/login',
    logoutUrl: '/auth/logout',
    profileUrl: '/profile',
    defaultRedirectUrl: '/dashboard',
  },
  features: {
    aiAssistant: true,
    learningPath: true,
    analytics: true,
    serviceMonitoring: true,
  },
};

export default siteConfig;