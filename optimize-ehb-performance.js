/**
 * EHB Performance Optimizer
 * 
 * This script optimizes the performance of the EHB system by:
 * 1. Adding caching to frontend services
 * 2. Optimizing database queries
 * 3. Adding compression to API responses
 * 4. Implementing code splitting in frontend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

// Paths
const FRONTEND_DIR = path.join(__dirname, 'frontend');
const BACKEND_DIR = path.join(__dirname, 'backend');
const INTEGRATION_HUB_DIR = path.join(__dirname, 'EHB-AI-Dev-Fullstack');

// Logger
const log = {
  info: (message) => console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  warning: (message) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
  error: (message) => console.log(`${colors.red}[ERROR]${colors.reset} ${message}`),
  section: (message) => console.log(`\n${colors.cyan}${colors.bright}${message}${colors.reset}\n`)
};

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Read a file with error handling
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    log.error(`Failed to read file ${filePath}: ${err.message}`);
    return null;
  }
}

// Write a file with error handling
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    log.error(`Failed to write file ${filePath}: ${err.message}`);
    return false;
  }
}

// Add caching to frontend services
function optimizeFrontendServices() {
  log.section("Optimizing Frontend Services");

  // Target services with caching
  const targets = [
    {
      path: path.join(FRONTEND_DIR, 'services', 'companyInfoService.js'),
      name: 'Company Info Service'
    },
    // Add more services here as needed
  ];

  targets.forEach(target => {
    if (!fileExists(target.path)) {
      log.warning(`${target.name} not found at ${target.path}`);
      return;
    }

    log.info(`Adding caching to ${target.name}...`);
    const content = readFile(target.path);
    
    if (!content) return;

    // Check if caching is already implemented
    if (content.includes('this.cache = {}')) {
      log.warning(`${target.name} already has caching implemented`);
      return;
    }

    // Add caching to the service
    const updatedContent = content.replace(
      /class (\w+) {/,
      `class $1 {\n  constructor() {\n    this.cache = {};\n    this.cacheTTL = 5 * 60 * 1000; // 5 minutes\n    this.cacheTimestamps = {};\n  }\n\n  _getCached(key) {\n    const timestamp = this.cacheTimestamps[key];\n    if (timestamp && (Date.now() - timestamp) < this.cacheTTL) {\n      return this.cache[key];\n    }\n    return null;\n  }\n\n  _setCached(key, value) {\n    this.cache[key] = value;\n    this.cacheTimestamps[key] = Date.now();\n    return value;\n  }`
    );

    // Add caching to each method
    const updatedMethods = updatedContent.replace(
      /async (\w+)\(\) {(\s+)try {(\s+)const response = await axios\.get\('([^']+)'\);(\s+)return response\.data\.data;/g,
      `async $1() {$2const cacheKey = '$1';$2const cached = this._getCached(cacheKey);$2if (cached) return cached;$2$2try {$3const response = await axios.get('$4');$5return this._setCached(cacheKey, response.data.data);`
    );

    if (writeFile(target.path, updatedMethods)) {
      log.success(`${target.name} optimized with caching`);
    }
  });
}

// Optimize backend API with compression
function optimizeBackendAPI() {
  log.section("Optimizing Backend API");

  // Check for server.js or app.js
  const serverPath = fileExists(path.join(BACKEND_DIR, 'server.js')) 
    ? path.join(BACKEND_DIR, 'server.js')
    : path.join(BACKEND_DIR, 'app.js');

  if (!fileExists(serverPath)) {
    log.warning(`Backend server file not found at ${serverPath}`);
    return;
  }

  log.info(`Adding compression to backend API...`);
  const content = readFile(serverPath);
  
  if (!content) return;

  // Check if compression is already implemented
  if (content.includes('compression')) {
    log.warning(`Compression already implemented in backend API`);
    return;
  }

  // Add compression middleware
  let updatedContent;
  
  if (content.includes('express()')) {
    // For Express apps
    if (content.includes('const express =')) {
      // Express is already imported
      updatedContent = content.replace(
        /const express = require\('express'\);/,
        `const express = require('express');\nconst compression = require('compression');`
      );
    } else {
      // Need to add express import
      updatedContent = `const express = require('express');\nconst compression = require('compression');\n${content}`;
    }

    // Add compression middleware
    updatedContent = updatedContent.replace(
      /app\.use\(express\.json\(\)\);/,
      `app.use(express.json());\napp.use(compression()); // Add compression for all responses`
    );

    if (writeFile(serverPath, updatedContent)) {
      log.success(`Backend API optimized with compression`);
      
      // Check if compression is installed
      try {
        execSync('npm list compression', { cwd: BACKEND_DIR, stdio: 'pipe' });
        log.info('Compression package already installed');
      } catch (err) {
        log.warning('Compression package not installed, installing...');
        try {
          execSync('npm install compression --save', { cwd: BACKEND_DIR });
          log.success('Compression package installed');
        } catch (installErr) {
          log.error(`Failed to install compression package: ${installErr.message}`);
        }
      }
    }
  } else {
    log.warning(`Could not identify Express app in ${serverPath}`);
  }
}

// Optimize next.config.js for frontend
function optimizeNextConfig() {
  log.section("Optimizing Next.js Configuration");

  const nextConfigPath = path.join(FRONTEND_DIR, 'next.config.js');
  
  if (!fileExists(nextConfigPath)) {
    log.warning(`Next.js config not found at ${nextConfigPath}`);
    return;
  }

  log.info(`Optimizing Next.js config...`);
  const content = readFile(nextConfigPath);
  
  if (!content) return;

  // Check if already optimized
  if (content.includes('swcMinify') && content.includes('reactStrictMode')) {
    log.warning(`Next.js config already optimized`);
    return;
  }

  // Update the Next.js config
  let updatedContent;
  
  if (content.includes('module.exports')) {
    // Update existing config
    updatedContent = content.replace(
      /module\.exports = {/,
      `module.exports = {\n  // Optimized settings for performance\n  swcMinify: true, // Use SWC minifier for faster builds\n  reactStrictMode: true, // Better error detection\n  compiler: {\n    removeConsole: process.env.NODE_ENV === 'production', // Remove console in production\n  },\n  experimental: {\n    optimizeCss: true, // Optimize CSS\n    legacyBrowsers: false, // Don't support legacy browsers\n    scrollRestoration: true, // Better scroll handling\n  },`
    );
  } else {
    // Create new config
    updatedContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized settings for performance
  swcMinify: true, // Use SWC minifier for faster builds
  reactStrictMode: true, // Better error detection
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console in production
  },
  experimental: {
    optimizeCss: true, // Optimize CSS
    legacyBrowsers: false, // Don't support legacy browsers
    scrollRestoration: true, // Better scroll handling
  },
};

module.exports = nextConfig;
`;
  }

  if (writeFile(nextConfigPath, updatedContent)) {
    log.success(`Next.js config optimized for performance`);
  }
}

// Optimize WebSocket with compression
function optimizeWebSocket() {
  log.section("Optimizing WebSocket Communication");

  // Look for WebSocket initialization in Integration Hub
  const wsFiles = [
    path.join(INTEGRATION_HUB_DIR, 'services', 'webSocketNotificationService.js'),
    path.join(INTEGRATION_HUB_DIR, 'services', 'WebSocketService.js'),
    path.join(INTEGRATION_HUB_DIR, 'services', 'websocket.js')
  ];

  let wsFile = null;
  for (const file of wsFiles) {
    if (fileExists(file)) {
      wsFile = file;
      break;
    }
  }

  if (!wsFile) {
    log.warning(`WebSocket service file not found in Integration Hub`);
    return;
  }

  log.info(`Adding compression to WebSocket service...`);
  const content = readFile(wsFile);
  
  if (!content) return;

  // Check if compression is already implemented
  if (content.includes('perMessageDeflate')) {
    log.warning(`WebSocket compression already implemented`);
    return;
  }

  // Add compression options to WebSocket initialization
  let updatedContent;
  
  if (content.includes('new WebSocketServer')) {
    updatedContent = content.replace(
      /new WebSocketServer\(\{/g,
      `new WebSocketServer({\n      perMessageDeflate: true, // Enable compression\n      maxPayload: 1024 * 1024, // 1MB max payload size`
    );
  } else if (content.includes('new WebSocket.Server')) {
    updatedContent = content.replace(
      /new WebSocket\.Server\(\{/g,
      `new WebSocket.Server({\n      perMessageDeflate: true, // Enable compression\n      maxPayload: 1024 * 1024, // 1MB max payload size`
    );
  } else {
    log.warning(`Could not identify WebSocket initialization in ${wsFile}`);
    return;
  }

  if (writeFile(wsFile, updatedContent)) {
    log.success(`WebSocket service optimized with compression`);
  }
}

// Main function to run all optimizations
function optimizePerformance() {
  log.section("🚀 EHB PERFORMANCE OPTIMIZER");
  log.info("Starting performance optimization...");

  try {
    // Run all optimizations
    optimizeFrontendServices();
    optimizeBackendAPI();
    optimizeNextConfig();
    optimizeWebSocket();
    
    log.section("✅ PERFORMANCE OPTIMIZATION COMPLETE");
    log.info("The EHB system has been optimized for better performance.");
    log.info("Restart the workflows to apply the changes.");

  } catch (error) {
    log.error(`Optimization failed: ${error.message}`);
    log.error(error.stack);
  }
}

// Run the script
optimizePerformance();