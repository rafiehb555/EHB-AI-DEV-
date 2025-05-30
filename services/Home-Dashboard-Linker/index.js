/**
 * Home-Dashboard-Linker
 * 
 * This service integrates EHB-HOME with the various dashboards and admin panels
 * in the EHB system, providing unified navigation, state management, and more.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Initialize logging
const logDir = path.dirname(config.log.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const log = (message, level = 'info') => {
  if (['error', 'warn', 'info', 'debug'].indexOf(level) < ['error', 'warn', 'info', 'debug'].indexOf(config.log.level)) {
    return;
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${level.toUpperCase()}: ${message}\n`;
  
  console.log(logEntry.trim());
  fs.appendFileSync(config.log.file, logEntry);
};

// Initialize cache
const cache = {
  dashboards: null,
  navigation: null,
  lastUpdated: {
    dashboards: 0,
    navigation: 0
  }
};

// Initialize the service
const app = express();

// Configure middleware
app.use(express.json());

if (config.api.cors.enabled) {
  app.use(cors({
    origin: config.api.cors.origins
  }));
}

// Rate limiting middleware
if (config.api.rateLimit.enabled) {
  const rateLimit = {};
  
  app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!rateLimit[ip]) {
      rateLimit[ip] = {
        count: 1,
        reset: now + config.api.rateLimit.timeWindow
      };
      return next();
    }
    
    if (now > rateLimit[ip].reset) {
      rateLimit[ip] = {
        count: 1,
        reset: now + config.api.rateLimit.timeWindow
      };
      return next();
    }
    
    if (rateLimit[ip].count >= config.api.rateLimit.max) {
      return res.status(429).json({
        error: 'Too many requests',
        retry: Math.ceil((rateLimit[ip].reset - now) / 1000)
      });
    }
    
    rateLimit[ip].count++;
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    name: config.name,
    version: config.version
  });
});

// Get list of available dashboards
app.get('/api/dashboards', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return from cache if available and not expired
    if (cache.dashboards && (now - cache.lastUpdated.dashboards < config.settings.cacheTimeout)) {
      return res.json(cache.dashboards);
    }
    
    // Build dashboard list from configuration
    const dashboards = Object.entries(config.interfaces)
      .filter(([, details]) => details.enabled)
      .map(([name, details]) => ({
        name,
        url: details.url,
        type: details.type,
        priority: details.priority
      }))
      .sort((a, b) => b.priority - a.priority);
    
    // Check dashboard availability
    const dashboardsWithStatus = await Promise.all(
      dashboards.map(async (dashboard) => {
        try {
          const response = await axios.get(`${dashboard.url}/health`, { timeout: 2000 });
          return {
            ...dashboard,
            status: response.status === 200 ? 'online' : 'error',
            version: response.data.version || 'unknown'
          };
        } catch (error) {
          return {
            ...dashboard,
            status: 'offline',
            error: error.message
          };
        }
      })
    );
    
    // Update cache
    cache.dashboards = dashboardsWithStatus;
    cache.lastUpdated.dashboards = now;
    
    res.json(dashboardsWithStatus);
  } catch (error) {
    log(`Error fetching dashboards: ${error.message}`, 'error');
    res.status(500).json({ error: 'Error fetching dashboards' });
  }
});

// Get unified navigation structure
app.get('/api/navigation', (req, res) => {
  try {
    const now = Date.now();
    
    // Return from cache if available and not expired
    if (cache.navigation && (now - cache.lastUpdated.navigation < config.settings.cacheTimeout)) {
      return res.json(cache.navigation);
    }
    
    // Build navigation from configuration
    const navigation = {
      primary: config.navigation.primaryItems,
      utilities: config.navigation.utilitiesItems
    };
    
    // Update cache
    cache.navigation = navigation;
    cache.lastUpdated.navigation = now;
    
    res.json(navigation);
  } catch (error) {
    log(`Error fetching navigation: ${error.message}`, 'error');
    res.status(500).json({ error: 'Error fetching navigation' });
  }
});

// Update user preferences across dashboards
app.post('/api/preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    if (!userId || !preferences) {
      return res.status(400).json({ error: 'userId and preferences are required' });
    }
    
    if (!config.settings.syncPreferences) {
      return res.status(403).json({ error: 'Preference syncing is disabled' });
    }
    
    // Propagate preferences to all enabled interfaces
    const results = await Promise.allSettled(
      Object.entries(config.interfaces)
        .filter(([, details]) => details.enabled)
        .map(async ([name, details]) => {
          try {
            const response = await axios.post(
              `${details.url}/api/preferences`,
              { userId, preferences },
              { timeout: 5000 }
            );
            
            return {
              interface: name,
              success: true,
              status: response.status
            };
          } catch (error) {
            return {
              interface: name,
              success: false,
              error: error.message
            };
          }
        })
    );
    
    res.json({
      success: true,
      results: results.map(result => result.value || result.reason)
    });
  } catch (error) {
    log(`Error syncing preferences: ${error.message}`, 'error');
    res.status(500).json({ error: 'Error syncing preferences' });
  }
});

// Start the server
const PORT = config.port || 5040;
app.listen(PORT, () => {
  log(`Home-Dashboard-Linker service running on port ${PORT}`);
  log(`API enabled: ${config.api.cors.enabled}`);
  log(`Single Sign-On enabled: ${config.settings.singleSignOn}`);
  log(`Preference syncing enabled: ${config.settings.syncPreferences}`);
  log(`Unified notifications enabled: ${config.settings.unifiedNotifications}`);
});

// Periodic status check for all interfaces
if (config.settings.pollingInterval > 0) {
  setInterval(async () => {
    try {
      log('Performing periodic status check of interfaces...', 'debug');
      
      const statusChecks = await Promise.allSettled(
        Object.entries(config.interfaces)
          .filter(([, details]) => details.enabled)
          .map(async ([name, details]) => {
            try {
              const response = await axios.get(`${details.url}/health`, { timeout: 2000 });
              return {
                interface: name,
                status: response.status === 200 ? 'online' : 'error',
                data: response.data
              };
            } catch (error) {
              return {
                interface: name,
                status: 'offline',
                error: error.message
              };
            }
          })
      );
      
      const offlineInterfaces = statusChecks
        .filter(result => result.status === 'fulfilled' && result.value.status === 'offline')
        .map(result => result.value.interface);
      
      if (offlineInterfaces.length > 0) {
        log(`Interfaces currently offline: ${offlineInterfaces.join(', ')}`, 'warn');
      }
    } catch (error) {
      log(`Error in periodic status check: ${error.message}`, 'error');
    }
  }, config.settings.pollingInterval);
}