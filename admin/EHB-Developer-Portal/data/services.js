/**
 * Mock service data for the Developer Portal dashboard
 */

// Core Modules
const coreModules = [
  {
    name: 'EHB-AI-Agent',
    description: 'Base AI agent integration system',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.3.0',
    url: '/services/ehb-ai-agent'
  },
  {
    name: 'CodeSuggest',
    description: 'AI-powered code suggestion system',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.2.0',
    url: '/services/code-suggest'
  },
  {
    name: 'AICodingChat',
    description: 'Interactive AI coding assistant',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.1.5',
    url: '/services/ai-coding-chat'
  },
  {
    name: 'EHB-HOME',
    description: 'Central integration hub for all EHB services',
    status: 'active',
    tag: 'HOME',
    progress: 100,
    version: '2.0.0',
    url: '/services/ehb-home'
  },
  {
    name: 'AI-Dashboard',
    description: 'AI-driven metrics dashboard',
    status: 'active',
    tag: 'DASHBOARD',
    progress: 100,
    version: '1.0.0',
    url: '/services/ai-dashboard'
  },
  {
    name: 'SmartAIAgent',
    description: 'Advanced conversational AI assistant',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.0.0',
    url: '/services/smart-ai-agent'
  }
];

// Service Extensions
const serviceExtensions = [
  {
    name: 'GoSellr',
    description: 'E-commerce platform for EHB users',
    status: 'active',
    tag: 'SERVICES',
    progress: 100,
    version: '2.1.0',
    url: '/services/gosellr'
  },
  {
    name: 'VoiceModuleGen',
    description: 'Voice-based module generation system',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.0.5',
    url: '/services/voice-module-gen'
  },
  {
    name: 'ReferralTree',
    description: 'Multi-level referral tracking system',
    status: 'active',
    tag: 'SERVICES',
    progress: 100,
    version: '1.4.0',
    url: '/services/referral-tree'
  },
  {
    name: 'AutoCardGen',
    description: 'AI-assisted card generation system',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.0.0',
    url: '/services/auto-card-gen'
  },
  {
    name: 'VoiceGPT-AIAgent',
    description: 'Voice-controlled AI assistant',
    status: 'development',
    tag: 'AI',
    progress: 15,
    version: '0.2.0',
    url: '/services/voice-gpt-ai-agent'
  },
  {
    name: 'EHB-MobileSync',
    description: 'Mobile device synchronization',
    status: 'development',
    tag: 'SERVICES',
    progress: 5,
    version: '0.1.0',
    url: '/services/ehb-mobile-sync'
  }
];

// Advanced Tools
const advancedTools = [
  {
    name: 'TestPassFail',
    description: 'Test result monitoring dashboard',
    status: 'active',
    tag: 'TOOLS',
    progress: 100,
    version: '1.0.0',
    url: '/tools/test-pass-fail'
  },
  {
    name: 'SQLBadgeSystem',
    description: 'SQL-based achievement system',
    status: 'active',
    tag: 'DATABASE',
    progress: 100,
    version: '1.2.0',
    url: '/tools/sql-badge-system'
  },
  {
    name: 'DashboardCommandAgent',
    description: 'Natural language dashboard control',
    status: 'development',
    tag: 'AI',
    progress: 25,
    version: '0.3.0',
    url: '/tools/dashboard-command-agent'
  },
  {
    name: 'APK-BuildFlow',
    description: 'Automated APK build system',
    status: 'maintenance',
    tag: 'TOOLS',
    progress: 80,
    version: '1.0.0',
    url: '/tools/apk-build-flow'
  },
  {
    name: 'SmartAccessControl',
    description: 'AI-driven access control system',
    status: 'development',
    tag: 'SERVICES',
    progress: 10,
    version: '0.1.0',
    url: '/tools/smart-access-control'
  }
];

// System Layer
const systemLayer = [
  {
    name: 'EHB-Blockchain',
    description: 'Core blockchain integration layer',
    status: 'active',
    tag: 'SYSTEM',
    progress: 100,
    version: '1.5.0',
    url: '/system/blockchain'
  },
  {
    name: 'EHB-API-Gateway',
    description: 'API gateway for all EHB services',
    status: 'active',
    tag: 'SYSTEM',
    progress: 100,
    version: '2.0.0',
    url: '/system/api-gateway'
  },
  {
    name: 'EHB-Event-Bus',
    description: 'Event messaging system for service communication',
    status: 'active',
    tag: 'SYSTEM',
    progress: 100,
    version: '1.2.0',
    url: '/system/event-bus'
  },
  {
    name: 'EHB-Authentication',
    description: 'Centralized authentication service',
    status: 'active',
    tag: 'SYSTEM',
    progress: 100,
    version: '1.3.0',
    url: '/system/authentication'
  }
];

// SQL Layers
const sqlLayers = [
  {
    name: 'EHB-SQL-PSS',
    description: 'Primary SQL Storage Service',
    status: 'active',
    tag: 'DATABASE',
    progress: 100,
    version: '2.1.0',
    url: '/system/sql/pss'
  },
  {
    name: 'EHB-SQL-EDR',
    description: 'Enterprise Data Repository',
    status: 'active',
    tag: 'DATABASE',
    progress: 100,
    version: '2.0.5',
    url: '/system/sql/edr'
  },
  {
    name: 'EHB-SQL-EMO',
    description: 'Entity Management Operations',
    status: 'active',
    tag: 'DATABASE',
    progress: 100,
    version: '1.8.0',
    url: '/system/sql/emo'
  }
];

// Admin Components
const adminComponents = [
  {
    name: 'EHB-DASHBOARD',
    description: 'Admin dashboard for EHB system management',
    status: 'active',
    tag: 'ADMIN',
    progress: 100,
    version: '2.0.0',
    url: '/admin/dashboard'
  },
  {
    name: 'EHB-Admin-Panel',
    description: 'Administrative control panel for EHB',
    status: 'active',
    tag: 'ADMIN',
    progress: 100,
    version: '1.5.0',
    url: '/admin/panel'
  },
  {
    name: 'EHB-Developer-Portal',
    description: 'Developer portal for EHB services and documentation',
    status: 'active',
    tag: 'ADMIN',
    progress: 100,
    version: '1.0.0',
    url: '/admin/developer-portal'
  },
  {
    name: 'EHB-User-Manager',
    description: 'User management and permissions system',
    status: 'active',
    tag: 'ADMIN',
    progress: 100,
    version: '1.2.0',
    url: '/admin/user-manager'
  },
  {
    name: 'EHB-Metrics',
    description: 'System metrics and analytics dashboard',
    status: 'active',
    tag: 'ADMIN',
    progress: 100,
    version: '1.1.0',
    url: '/admin/metrics'
  },
  {
    name: 'EHB-AI-Dev',
    description: 'AI development and training platform',
    status: 'active',
    tag: 'AI',
    progress: 100,
    version: '1.0.0',
    url: '/admin/ai-dev'
  }
];

export default {
  coreModules,
  serviceExtensions,
  advancedTools,
  systemLayer,
  sqlLayers,
  adminComponents
};