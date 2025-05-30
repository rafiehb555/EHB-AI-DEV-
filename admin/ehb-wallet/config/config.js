/**
 * EHB Wallet System Configuration
 * 
 * This file provides configuration for the entire wallet system and its modules
 */

const path = require('path');
const fs = require('fs');

// Load settings from JSON file
const settingsPath = path.join(__dirname, 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Module paths
const modulePaths = {
  standard: path.join(__dirname, '..', 'wallet'),
  trusty: path.join(__dirname, '..', 'trusty-wallet'),
  crypto: path.join(__dirname, '..', 'crypto-wallet')
};

// Module access levels
const accessLevels = {
  admin: ['admin'],
  standard: ['admin', 'user'],
  premium: ['admin', 'premium_user'],
  all: ['admin', 'user', 'premium_user', 'guest']
};

// Wallet configuration
const walletConfig = {
  // Module configurations
  modules: {
    standard: {
      name: 'Standard Wallet',
      enabled: true,
      path: modulePaths.standard,
      accessLevel: accessLevels.standard,
      requireAuth: true
    },
    trusty: {
      name: 'Trusty Wallet',
      enabled: true,
      path: modulePaths.trusty,
      accessLevel: accessLevels.premium,
      requireAuth: true,
      validatorRequirements: settings.walletConfig.validatorRequirements
    },
    crypto: {
      name: 'Crypto Wallet',
      enabled: true,
      path: modulePaths.crypto,
      accessLevel: accessLevels.premium,
      requireAuth: true,
      supportedChains: settings.walletConfig.blockchainSupport
    }
  },
  
  // API configuration
  api: {
    basePath: '/api',
    routes: {
      standard: '/wallet',
      trusty: '/trusty-wallet',
      crypto: '/crypto-wallet'
    },
    // CORS settings
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  
  // Authentication configuration
  auth: {
    requireAuth: settings.walletConfig.requireAuth,
    authMiddleware: 'jwt',
    roleBasedAccess: true
  },
  
  // Default wallet type for new users
  defaultWallet: settings.walletConfig.defaultWallet,
  
  // Transaction limits
  transactionLimits: {
    standard: {
      daily: 5000,
      single: 1000
    },
    trusty: {
      daily: 20000,
      single: 5000
    },
    crypto: {
      daily: 10000,
      single: 2000
    }
  }
};

module.exports = {
  settings,
  walletConfig,
  accessLevels,
  modulePaths
};