/**
 * User Flow Management Module
 * 
 * This module provides user flow management capabilities for the EHB platform,
 * including user journey mapping, funnel analysis, and flow optimization.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Create config directory if it doesn't exist
const configDir = path.join(__dirname, 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Default configuration
const defaultConfig = {
  name: 'User-flow',
  version: '1.0.0',
  description: 'User flow management for EHB platform',
  port: 5015,
  api: {
    basePath: '/api/user-flow',
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  flows: {
    types: [
      'onboarding',
      'registration',
      'checkout',
      'conversion',
      'support',
      'admin'
    ],
    defaultFlow: 'onboarding',
    analytics: {
      enabled: true,
      trackSteps: true,
      trackTime: true,
      trackDropoffs: true
    },
    persistence: {
      enabled: true,
      provider: 'database',
      storageKey: 'ehb-user-flows'
    }
  },
  ui: {
    componentLibrary: 'chakra-ui',
    defaultTheme: 'light',
    flowEditor: {
      enabled: true,
      allowCustomComponents: true,
      showGrid: true,
      snapToGrid: true
    },
    analytics: {
      charts: true,
      heatmaps: true,
      funnelVisualization: true
    }
  },
  integrations: {
    developer_portal: {
      url: 'http://localhost:5010',
      enabled: true
    },
    ehb_home: {
      url: 'http://localhost:5005',
      enabled: true
    },
    ehb_dashboard: {
      url: 'http://localhost:5006',
      enabled: true
    }
  },
  logging: {
    level: 'info',
    file: '../logs/user-flow.log',
    console: true
  }
};

// Ensure config file exists
const configPath = path.join(configDir, 'config.json');
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
}

// Load configuration
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize express app
const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.api.cors.origin);
  res.header('Access-Control-Allow-Methods', config.api.cors.methods.join(', '));
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    name: config.name,
    version: config.version,
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get(config.api.basePath, (req, res) => {
  res.json({
    name: config.name,
    version: config.version,
    description: config.description,
    flowTypes: config.flows.types
  });
});

// Flow types endpoint
app.get(`${config.api.basePath}/types`, (req, res) => {
  res.json({
    types: config.flows.types,
    defaultFlow: config.flows.defaultFlow
  });
});

// Integration information
app.get(`${config.api.basePath}/integrations`, (req, res) => {
  res.json({
    integrations: config.integrations
  });
});

// Start server if this module is run directly
if (require.main === module) {
  const PORT = config.port || 5015;
  app.listen(PORT, () => {
    console.log(`User Flow module running on port ${PORT}`);
    console.log(`API available at ${config.api.basePath}`);
  });
}

// Export the Express app
module.exports = app;