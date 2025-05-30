/**
 * EHB Wallet System
 * 
 * Main entry point for the EHB Wallet system that integrates standard, trusty, and crypto wallets
 */

const { settings, walletConfig } = require('./config/config');

// Import wallet modules
const StandardWallet = require('./wallet');
const TrustyWallet = require('./trusty-wallet');
const CryptoWallet = require('./crypto-wallet');

// Registration information
const moduleInfo = {
  name: 'EHB Wallet System',
  version: '1.0.0',
  description: settings.description,
  modules: settings.registerModules,
  type: settings.moduleType,
  linkedWith: settings.linkedWith,
  protected: settings.protected
};

// Factory function to create the appropriate wallet type
function createWallet(userId, type = settings.walletConfig.defaultWallet) {
  switch (type) {
    case 'standard':
      return StandardWallet.createWallet(userId);
    case 'trusty':
      return TrustyWallet.createWallet(userId);
    case 'crypto':
      return CryptoWallet.createWallet(userId);
    default:
      throw new Error(`Unknown wallet type: ${type}`);
  }
}

// Route initializer for Express
function initializeRoutes(app) {
  // Import route modules
  const standardWalletRoutes = require('./wallet/api/routes');
  const trustyWalletRoutes = require('./trusty-wallet/api/routes');
  const cryptoWalletRoutes = require('./crypto-wallet/api/routes');
  
  // Register routes
  app.use(`${walletConfig.api.basePath}${walletConfig.api.routes.standard}`, standardWalletRoutes);
  app.use(`${walletConfig.api.basePath}${walletConfig.api.routes.trusty}`, trustyWalletRoutes);
  app.use(`${walletConfig.api.basePath}${walletConfig.api.routes.crypto}`, cryptoWalletRoutes);
  
  console.log('EHB Wallet routes initialized');
  
  return app;
}

// Module exports
module.exports = {
  moduleInfo,
  walletConfig,
  createWallet,
  initializeRoutes,
  StandardWallet,
  TrustyWallet,
  CryptoWallet
};

console.log('EHB Wallet System loaded successfully');
console.log(`Available wallet types: ${settings.walletConfig.activeWalletTypes.join(', ')}`);
console.log(`Blockchain support: ${settings.walletConfig.blockchainSupport.join(', ')}`);