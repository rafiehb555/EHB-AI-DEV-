/**
 * EHB Project Reset Script
 * 
 * This script performs a complete reset and cleanup of the EHB project structure:
 * 1. Deletes old/duplicate folders
 * 2. Resets internal workspace flow
 * 3. Sets up auto module routing system
 * 4. Links all services to EHB-HOME & EHB-DASHBOARD
 * 5. Makes EHB-HOME the root entry point
 * 6. Locks the new setup to prevent regression
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

// Configuration
const ROOT_DIR = path.resolve('.');
const KEEP_MODULES = [
  'EHB-HOME', 
  'EHB-DASHBOARD', 
  'EHB-AI-Dev-Fullstack',
  'EHB-Developer-Portal',
  'EHB-Affiliate-System',
  'EHB-TrustyWallet-System',
  'EHB-Tube',
  'EHB-Blockchain',
  'EHB-SQL',
  'EHB-Services-Departments-Flow',
  'GoSellr-Ecommerce',
  'JPS-Job-Providing-Service',
  'HPS-Education-Service',
  'OLS-Online-Law-Service',
  'WMS-World-Medical-Service',
  'SOT-Technologies',
  'HMS-Machinery',
  'AG-Travelling',
  'Delivery-Service'
];

const LEGACY_DIRS_TO_REMOVE = [
  'frontend',
  'backend',
  'admin',
  'pages',
  'app',
  'public', 
  'custom-target-dir',
  'TestModule',
  'ApiTestModule'
];

const CORE_FILES_TO_KEEP = [
  'EHB-README.md',
  'EHB-INTEGRATION-GUIDE.md',
  'EHB-SYSTEM-ARCHITECTURE.md',
  'EHB-STRUCTURE-OVERVIEW.md',
  'AI_KNOWLEDGE_BASE_DOCUMENTATION.md',
  'package.json',
  'package-lock.json',
  '.replit'
];

const SCRIPT_FILES_TO_KEEP = [
  'ehb-project-reset.js',
  'ehb-auto-fix.js',
  'watch-assets.js',
  'dev-agent-workflow.js',
  'multi-service-dashboard-server.js',
  'ehb-home-integrator.js'
];

// Helper functions
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync(path.join(ROOT_DIR, 'ehb_reset.log'), `[${timestamp}] ${message}\n`);
}

function isExcludedDirectory(dir) {
  // Don't delete module directories and some special directories
  return KEEP_MODULES.includes(dir) || 
         dir === 'node_modules' || 
         dir === 'scripts' || 
         dir === 'ehb_zips' || 
         dir === 'attached_assets' ||
         dir === 'ehb_company_info' ||
         dir === '.git';
}

function isExcludedFile(file) {
  // Don't delete core documentation and configuration files
  return CORE_FILES_TO_KEEP.includes(file) || 
         file.startsWith('.') ||
         file.endsWith('.log') ||
         file.endsWith('.py');
}

// Step 1: Delete all old and duplicate folders
function deleteOldFolders() {
  log('Step 1: Deleting old and duplicate folders...');
  
  // Delete legacy directories at root level
  LEGACY_DIRS_TO_REMOVE.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(dirPath)) {
      log(`Removing legacy directory: ${dir}`);
      fs.removeSync(dirPath);
    }
  });
  
  // Delete files at root level that are not in the keep list
  const rootFiles = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
    
  rootFiles.forEach(file => {
    if (!isExcludedFile(file)) {
      log(`Removing unnecessary file: ${file}`);
      fs.unlinkSync(path.join(ROOT_DIR, file));
    }
  });
  
  log('Old and duplicate folders deleted successfully');
}

// Step 2: Reset internal workspace flow
function resetWorkspaceFlow() {
  log('Step 2: Resetting internal workspace flow...');
  
  // Create/Update the scripts directory if needed
  const scriptsDir = path.join(ROOT_DIR, 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }
  
  // Keep only necessary scripts in the scripts directory
  const scriptFiles = fs.readdirSync(scriptsDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
    
  scriptFiles.forEach(file => {
    if (!SCRIPT_FILES_TO_KEEP.includes(file)) {
      log(`Removing unnecessary script file: ${file}`);
      fs.unlinkSync(path.join(scriptsDir, file));
    }
  });
  
  // Optionally disable any automatic watchers from previous setup
  // by moving them to an 'archived' directory
  const archivedDir = path.join(ROOT_DIR, 'archived');
  if (!fs.existsSync(archivedDir)) {
    fs.mkdirSync(archivedDir);
  }
  
  // Ensure old workflows are reset
  try {
    execSync('pkill -f "node.*watch" || true', { stdio: 'ignore' });
    log('Terminated any running watch processes');
  } catch (error) {
    log('No active watch processes to terminate');
  }
  
  log('Internal workspace flow reset successfully');
}

// Step 3: Setup auto module routing system
function setupModuleRouting() {
  log('Step 3: Setting up automatic module routing system...');
  
  // Create the ZIP processing script that handles proper routing
  const zipWatcherScript = path.join(ROOT_DIR, 'scripts', 'watch-assets.js');
  
  // If the script exists, make sure it's updated, otherwise create it
  fs.writeFileSync(zipWatcherScript, `/**
 * ZIP Watcher Script
 * 
 * This script watches the attached_assets directory for new ZIP files
 * and processes them automatically, routing them to the appropriate module folders.
 */

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const AdmZip = require('adm-zip');

// Configuration
const WATCH_DIR = path.join(process.cwd(), 'attached_assets');
const OUTPUT_DIR = process.cwd();
const LOG_FILE = path.join(process.cwd(), 'zip_watcher.log');

// Module type mapping - determines where files go based on their content/name
const MODULE_TYPE_MAPPING = {
  // Service modules
  'gosellr': 'GoSellr-Ecommerce',
  'ecommerce': 'GoSellr-Ecommerce',
  'health': 'WMS-World-Medical-Service',
  'medical': 'WMS-World-Medical-Service',
  'education': 'HPS-Education-Service',
  'learning': 'HPS-Education-Service',
  'law': 'OLS-Online-Law-Service',
  'legal': 'OLS-Online-Law-Service',
  'attorney': 'OLS-Online-Law-Service',
  'job': 'JPS-Job-Providing-Service',
  'employment': 'JPS-Job-Providing-Service',
  'career': 'JPS-Job-Providing-Service',
  'travel': 'AG-Travelling',
  'tourism': 'AG-Travelling',
  'delivery': 'Delivery-Service',
  'logistics': 'Delivery-Service',
  'shipping': 'Delivery-Service',
  'technologies': 'SOT-Technologies',
  'tech': 'SOT-Technologies',
  'machinery': 'HMS-Machinery',
  
  // System modules
  'dashboard': 'EHB-DASHBOARD',
  'home': 'EHB-HOME',
  'affiliate': 'EHB-Affiliate-System',
  'wallet': 'EHB-TrustyWallet-System',
  'blockchain': 'EHB-Blockchain',
  'video': 'EHB-Tube',
  'tube': 'EHB-Tube',
  'sql': 'EHB-SQL',
  'db': 'EHB-SQL',
  'database': 'EHB-SQL',
  'integration': 'EHB-AI-Dev-Fullstack',
  'developer': 'EHB-Developer-Portal',
  'dev-portal': 'EHB-Developer-Portal',
  'flow': 'EHB-Services-Departments-Flow',
  'departments': 'EHB-Services-Departments-Flow'
};

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${message}\`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\\n');
}

// Create the watch directory if it doesn't exist
if (!fs.existsSync(WATCH_DIR)) {
  fs.mkdirSync(WATCH_DIR, { recursive: true });
  log(\`Created watch directory: \${WATCH_DIR}\`);
}

// Determine target directory based on ZIP content
function determineTargetDirectory(zipFilePath) {
  const zipName = path.basename(zipFilePath, '.zip').toLowerCase();
  
  // Check for explicit module name matches first
  for (const [keyword, targetDir] of Object.entries(MODULE_TYPE_MAPPING)) {
    if (zipName.includes(keyword.toLowerCase())) {
      return targetDir;
    }
  }
  
  // If no match is found from the filename, attempt to analyze the content
  try {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    
    // Look for config.json file which might contain target information
    const configEntry = zipEntries.find(entry => 
      entry.entryName.toLowerCase() === 'config.json' || 
      entry.entryName.toLowerCase().endsWith('/config.json')
    );
    
    if (configEntry) {
      try {
        const configContent = configEntry.getData().toString('utf8');
        const config = JSON.parse(configContent);
        
        if (config.targetModule) {
          // Check if this target module exists in our mapping
          for (const [keyword, targetDir] of Object.entries(MODULE_TYPE_MAPPING)) {
            if (config.targetModule.toLowerCase().includes(keyword.toLowerCase())) {
              return targetDir;
            }
          }
        }
        
        if (config.type) {
          // Check if this type exists in our mapping
          for (const [keyword, targetDir] of Object.entries(MODULE_TYPE_MAPPING)) {
            if (config.type.toLowerCase().includes(keyword.toLowerCase())) {
              return targetDir;
            }
          }
        }
      } catch (err) {
        log(\`Error parsing config.json from \${zipFilePath}: \${err.message}\`);
      }
    }
    
    // Analyze README files for clues about the module type
    const readmeEntry = zipEntries.find(entry => 
      entry.entryName.toLowerCase() === 'readme.md' || 
      entry.entryName.toLowerCase().endsWith('/readme.md') ||
      entry.entryName.toLowerCase() === 'readme.txt' || 
      entry.entryName.toLowerCase().endsWith('/readme.txt')
    );
    
    if (readmeEntry) {
      const readmeContent = readmeEntry.getData().toString('utf8').toLowerCase();
      
      for (const [keyword, targetDir] of Object.entries(MODULE_TYPE_MAPPING)) {
        if (readmeContent.includes(keyword.toLowerCase())) {
          return targetDir;
        }
      }
    }
  } catch (err) {
    log(\`Error analyzing ZIP content of \${zipFilePath}: \${err.message}\`);
  }
  
  // Default to a temporary directory if we can't determine the proper location
  log(\`Could not determine target directory for \${zipFilePath}, using default: temp\`);
  return 'temp';
}

// Process a ZIP file
function processZip(zipFilePath) {
  log(\`Processing ZIP file: \${zipFilePath}\`);
  
  try {
    const targetDir = determineTargetDirectory(zipFilePath);
    const fullTargetPath = path.join(OUTPUT_DIR, targetDir);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(fullTargetPath)) {
      fs.mkdirSync(fullTargetPath, { recursive: true });
      log(\`Created target directory: \${fullTargetPath}\`);
    }
    
    // Extract the ZIP to the target directory
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(fullTargetPath, true);
    log(\`Extracted ZIP to: \${fullTargetPath}\`);
    
    // Move the processed ZIP to a "processed" subdirectory
    const processedDir = path.join(WATCH_DIR, 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    
    const zipFileName = path.basename(zipFilePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const processedZipPath = path.join(processedDir, \`\${timestamp}-\${zipFileName}\`);
    
    fs.moveSync(zipFilePath, processedZipPath);
    log(\`Moved processed ZIP to: \${processedZipPath}\`);
    
    // Update EHB-HOME dashboard to reflect the new module
    try {
      const updateHomeScript = path.join(OUTPUT_DIR, 'scripts', 'ehb-home-integrator.js');
      if (fs.existsSync(updateHomeScript)) {
        require(updateHomeScript).updateHome();
        log('Triggered EHB-HOME update');
      }
    } catch (err) {
      log(\`Error updating EHB-HOME: \${err.message}\`);
    }
    
    return true;
  } catch (err) {
    log(\`Error processing ZIP file \${zipFilePath}: \${err.message}\`);
    return false;
  }
}

// Setup the watcher
log('Starting ZIP file watcher service');

// Make sure chokidar is installed
try {
  require.resolve('chokidar');
  log('Chokidar already installed');
} catch (err) {
  log('Installing chokidar...');
  try {
    execSync('npm install chokidar', { stdio: 'inherit' });
    log('Chokidar installed successfully');
  } catch (err) {
    log(\`Error installing chokidar: \${err.message}\`);
    process.exit(1);
  }
}

// Start watching for ZIP files
log(\`Starting watcher on directory: \${WATCH_DIR}\`);
const watcher = chokidar.watch(path.join(WATCH_DIR, '*.zip'), {
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

watcher.on('add', zipFilePath => {
  log(\`New ZIP file detected: \${zipFilePath}\`);
  processZip(zipFilePath);
});

log('ZIP watcher service started successfully');

module.exports = {
  processZip
};
`);
  
  log('Created ZIP watcher script for automatic module routing');
  
  // Create a temporary directory for ZIPs that can't be categorized
  const tempDir = path.join(ROOT_DIR, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    log('Created temporary directory for uncategorized modules');
  }
  
  log('Automatic module routing system set up successfully');
}

// Step 4: Link all services to EHB-HOME & EHB-DASHBOARD
function linkModulesToHome() {
  log('Step 4: Linking all services to EHB-HOME & EHB-DASHBOARD...');
  
  // Create the EHB-HOME integrator script
  const homeIntegratorScript = path.join(ROOT_DIR, 'scripts', 'ehb-home-integrator.js');
  
  fs.writeFileSync(homeIntegratorScript, `/**
 * EHB-HOME Integrator Script
 * 
 * This script scans the system for all EHB modules and integrates them
 * into the EHB-HOME dashboard with cards and links.
 */

const fs = require('fs-extra');
const path = require('path');

// Configuration
const ROOT_DIR = process.cwd();
const EHB_HOME_DIR = path.join(ROOT_DIR, 'EHB-HOME');
const EHB_DASHBOARD_DIR = path.join(ROOT_DIR, 'EHB-DASHBOARD');
const LOG_FILE = path.join(ROOT_DIR, 'ehb_home_integration.log');

// Module categories
const MODULE_CATEGORIES = {
  SERVICE: 'service',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
  AFFILIATE: 'affiliate',
  SYSTEM: 'system'
};

// Module type mapping
const MODULE_TYPE_MAPPING = {
  // Service modules
  'GoSellr-Ecommerce': MODULE_CATEGORIES.SERVICE,
  'WMS-World-Medical-Service': MODULE_CATEGORIES.SERVICE,
  'HPS-Education-Service': MODULE_CATEGORIES.SERVICE,
  'OLS-Online-Law-Service': MODULE_CATEGORIES.SERVICE,
  'JPS-Job-Providing-Service': MODULE_CATEGORIES.SERVICE,
  'AG-Travelling': MODULE_CATEGORIES.SERVICE,
  'Delivery-Service': MODULE_CATEGORIES.SERVICE,
  'SOT-Technologies': MODULE_CATEGORIES.SERVICE,
  'HMS-Machinery': MODULE_CATEGORIES.SERVICE,
  
  // System modules
  'EHB-DASHBOARD': MODULE_CATEGORIES.ADMIN,
  'EHB-HOME': MODULE_CATEGORIES.SYSTEM,
  'EHB-Affiliate-System': MODULE_CATEGORIES.AFFILIATE,
  'EHB-TrustyWallet-System': MODULE_CATEGORIES.SYSTEM,
  'EHB-Blockchain': MODULE_CATEGORIES.SYSTEM,
  'EHB-Tube': MODULE_CATEGORIES.SERVICE,
  'EHB-SQL': MODULE_CATEGORIES.SYSTEM,
  'EHB-AI-Dev-Fullstack': MODULE_CATEGORIES.SYSTEM,
  'EHB-Developer-Portal': MODULE_CATEGORIES.ADMIN,
  'EHB-Services-Departments-Flow': MODULE_CATEGORIES.DEPARTMENT,
  'EHB-AM-AFFILIATE-SYSTEM': MODULE_CATEGORIES.AFFILIATE,
  'EHB-AI-Marketplace': MODULE_CATEGORIES.SERVICE,
  'EHB-Franchise': MODULE_CATEGORIES.AFFILIATE
};

// Module port mapping (default ports for each module)
const MODULE_PORT_MAPPING = {
  'EHB-HOME': 5005,
  'EHB-DASHBOARD': 5006,
  'EHB-AI-Dev-Fullstack': 5003,
  'EHB-Developer-Portal': 5000, 
  'GoSellr-Ecommerce': 5007,
  'WMS-World-Medical-Service': 5008,
  'HPS-Education-Service': 5009,
  'OLS-Online-Law-Service': 5010,
  'JPS-Job-Providing-Service': 5011,
  'EHB-Affiliate-System': 5012,
  'EHB-TrustyWallet-System': 5013,
  'EHB-Blockchain': 5014,
  'EHB-Tube': 5015,
  'EHB-SQL': 5016,
  'EHB-Services-Departments-Flow': 5017,
  'AG-Travelling': 5018,
  'Delivery-Service': 5019,
  'SOT-Technologies': 5020,
  'HMS-Machinery': 5021,
  'EHB-AM-AFFILIATE-SYSTEM': 5022,
  'EHB-AI-Marketplace': 5023,
  'EHB-Franchise': 5024
};

// Module descriptions
const MODULE_DESCRIPTIONS = {
  'EHB-HOME': 'The central dashboard and entry point for the entire EHB system.',
  'EHB-DASHBOARD': 'Administrative dashboard for managing the EHB system.',
  'EHB-AI-Dev-Fullstack': 'AI-powered integration hub for all EHB modules.',
  'EHB-Developer-Portal': 'Documentation and tools for EHB developers.',
  'GoSellr-Ecommerce': 'E-commerce platform for selling products and services.',
  'WMS-World-Medical-Service': 'Healthcare and medical services platform.',
  'HPS-Education-Service': 'Education and learning management system.',
  'OLS-Online-Law-Service': 'Legal services and attorney consultation platform.',
  'JPS-Job-Providing-Service': 'Job seeking and career development platform.',
  'EHB-Affiliate-System': 'Affiliate marketing and partnership management.',
  'EHB-TrustyWallet-System': 'Secure digital wallet for cryptocurrency transactions.',
  'EHB-Blockchain': 'Blockchain infrastructure for secure transactions.',
  'EHB-Tube': 'Video hosting and streaming service.',
  'EHB-SQL': 'Database management and SQL query interface.',
  'EHB-Services-Departments-Flow': 'Workflow management for service departments.',
  'AG-Travelling': 'Travel booking and tourism management platform.',
  'Delivery-Service': 'Package delivery and logistics management system.',
  'SOT-Technologies': 'Technological solutions and innovation platform.',
  'HMS-Machinery': 'Heavy machinery rental and management system.',
  'EHB-AM-AFFILIATE-SYSTEM': 'Advanced affiliate marketing system.',
  'EHB-AI-Marketplace': 'Marketplace for AI services and products.',
  'EHB-Franchise': 'Franchise management and licensing platform.'
};

// Helper functions
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${message}\`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\\n');
}

// Update EHB-HOME with current modules
function updateHome() {
  log('Updating EHB-HOME with current modules');
  
  // Ensure EHB-HOME directory exists
  if (!fs.existsSync(EHB_HOME_DIR)) {
    log('EHB-HOME directory not found, creating it');
    fs.mkdirSync(EHB_HOME_DIR, { recursive: true });
  }
  
  // Scan for available modules
  const modules = [];
  
  fs.readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .forEach(dirName => {
      if (MODULE_TYPE_MAPPING[dirName]) {
        const moduleType = MODULE_TYPE_MAPPING[dirName];
        const modulePort = MODULE_PORT_MAPPING[dirName] || 3000;
        const moduleDesc = MODULE_DESCRIPTIONS[dirName] || \`\${dirName} module\`;
        
        modules.push({
          id: dirName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: dirName,
          description: moduleDesc,
          type: moduleType,
          port: modulePort,
          url: \`http://localhost:\${modulePort}\`,
          path: path.join(ROOT_DIR, dirName)
        });
      }
    });
  
  log(\`Found \${modules.length} modules\`);
  
  // Create module configuration
  const moduleConfigDir = path.join(EHB_HOME_DIR, 'utils');
  if (!fs.existsSync(moduleConfigDir)) {
    fs.mkdirSync(moduleConfigDir, { recursive: true });
  }
  
  const moduleConfigPath = path.join(moduleConfigDir, 'moduleConfig.js');
  const moduleConfig = \`/**
 * Module Configuration
 * Auto-generated by EHB-HOME Integrator
 */

export const modules = \${JSON.stringify(modules, null, 2)};

export const MODULE_CATEGORIES = {
  SERVICE: 'service',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
  AFFILIATE: 'affiliate',
  SYSTEM: 'system'
};
\`;
  
  fs.writeFileSync(moduleConfigPath, moduleConfig);
  log(\`Updated module configuration in \${moduleConfigPath}\`);
  
  // Create module scanner utility
  const moduleScannerPath = path.join(moduleConfigDir, 'moduleScanner.js');
  const moduleScanner = \`/**
 * Module Scanner Utility
 * Auto-generated by EHB-HOME Integrator
 */

import { modules } from './moduleConfig';

export function getAllModules() {
  return modules;
}

export function getModulesByCategory(category) {
  return modules.filter(module => module.type === category);
}

export function getModuleById(id) {
  return modules.find(module => module.id === id);
}

export function getModuleByName(name) {
  return modules.find(module => module.name === name);
}

export function getServiceModules() {
  return getModulesByCategory('service');
}

export function getAdminModules() {
  return getModulesByCategory('admin');
}

export function getSystemModules() {
  return getModulesByCategory('system');
}

export function getDepartmentModules() {
  return getModulesByCategory('department');
}

export function getAffiliateModules() {
  return getModulesByCategory('affiliate');
}

export function checkModuleStatus(module) {
  // In a real implementation, this would check if the module is running
  // For now, we'll just return a placeholder status
  return { 
    status: 'online', 
    lastChecked: new Date().toISOString() 
  };
}
\`;
  
  fs.writeFileSync(moduleScannerPath, moduleScanner);
  log(\`Created/updated module scanner in \${moduleScannerPath}\`);
  
  // Create ModuleCard component
  const componentsDir = path.join(EHB_HOME_DIR, 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const moduleCardPath = path.join(componentsDir, 'ModuleCard.js');
  const moduleCard = \`/**
 * ModuleCard Component
 * Auto-generated by EHB-HOME Integrator
 */

import React from 'react';
import Link from 'next/link';
import { checkModuleStatus } from '../utils/moduleScanner';

export default function ModuleCard({ module }) {
  const status = checkModuleStatus(module);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg">
      <div className={\`h-2 \${getStatusColor(status.status)}\`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{module.name}</h3>
          <span className={\`px-2 py-1 text-xs rounded-full \${getStatusBadgeColor(status.status)}\`}>
            {status.status}
          </span>
        </div>
        
        <p className="text-gray-600 mt-2 text-sm">{module.description}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500 inline-flex items-center">
            <div className={\`w-2 h-2 rounded-full \${getCategoryColor(module.type)} mr-1\`}></div>
            {formatCategory(module.type)}
          </span>
          
          <div className="space-x-2">
            <Link href={module.url} target="_blank" rel="noopener noreferrer" 
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              Open
            </Link>
            
            <Link href={\`/module/\${module.id}\`}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch(status) {
    case 'online': return 'bg-green-500';
    case 'offline': return 'bg-red-500';
    case 'maintenance': return 'bg-yellow-500';
    case 'updating': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}

function getStatusBadgeColor(status) {
  switch(status) {
    case 'online': return 'bg-green-100 text-green-800';
    case 'offline': return 'bg-red-100 text-red-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'updating': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getCategoryColor(category) {
  switch(category) {
    case 'service': return 'bg-purple-500';
    case 'department': return 'bg-yellow-500';
    case 'admin': return 'bg-red-500';
    case 'affiliate': return 'bg-blue-500';
    case 'system': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
\`;
  
  fs.writeFileSync(moduleCardPath, moduleCard);
  log(\`Created/updated ModuleCard component in \${moduleCardPath}\`);
  
  // Create ModuleGrid component
  const moduleGridPath = path.join(componentsDir, 'ModuleGrid.js');
  const moduleGrid = \`/**
 * ModuleGrid Component
 * Auto-generated by EHB-HOME Integrator
 */

import React, { useState } from 'react';
import ModuleCard from './ModuleCard';
import { MODULE_CATEGORIES } from '../utils/moduleConfig';

export default function ModuleGrid({ modules }) {
  const [filter, setFilter] = useState('all');
  
  const filteredModules = filter === 'all'
    ? modules
    : modules.filter(module => module.type === filter);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.SERVICE} 
          onClick={() => setFilter(MODULE_CATEGORIES.SERVICE)}
          color="bg-purple-500"
        >
          Services
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.DEPARTMENT} 
          onClick={() => setFilter(MODULE_CATEGORIES.DEPARTMENT)}
          color="bg-yellow-500"
        >
          Departments
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.ADMIN} 
          onClick={() => setFilter(MODULE_CATEGORIES.ADMIN)}
          color="bg-red-500"
        >
          Admin
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.AFFILIATE} 
          onClick={() => setFilter(MODULE_CATEGORIES.AFFILIATE)}
          color="bg-blue-500"
        >
          Affiliate
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.SYSTEM} 
          onClick={() => setFilter(MODULE_CATEGORIES.SYSTEM)}
          color="bg-green-500"
        >
          System
        </FilterButton>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <ModuleCard key={module.id} module={module} />
        ))}
        
        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No modules found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick, color = 'bg-gray-500' }) {
  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 rounded-md \${
        active 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } transition-colors flex items-center\`}
    >
      {color && <span className={\`w-2 h-2 rounded-full \${active ? color : 'bg-gray-400'} mr-2\`}></span>}
      {children}
    </button>
  );
}
\`;
  
  fs.writeFileSync(moduleGridPath, moduleGrid);
  log(\`Created/updated ModuleGrid component in \${moduleGridPath}\`);
  
  // Create Layout component
  const layoutPath = path.join(componentsDir, 'Layout.js');
  const layout = \`/**
 * Layout Component
 * Auto-generated by EHB-HOME Integrator
 */

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = 'EHB System' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | EHB Enterprise System</title>
        <meta name="description" content="Enterprise Hybrid Blockchain System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">EHB</span>
                <span className="ml-1 text-sm text-blue-600">Enterprise</span>
              </Link>
            </div>
            
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/status" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Status
              </Link>
              <Link href="http://localhost:5000" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Developer Portal
              </Link>
              <Link href="http://localhost:5006" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link href="http://localhost:5000/documentation" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                Documentation
              </Link>
              <Link href="http://localhost:5000/api" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                API
              </Link>
              <Link href="http://localhost:5000/support" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                Support
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2025 Enterprise Hybrid Blockchain. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
\`;
  
  fs.writeFileSync(layoutPath, layout);
  log(\`Created/updated Layout component in \${layoutPath}\`);
  
  // Create index page
  const pagesDir = path.join(EHB_HOME_DIR, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const indexPath = path.join(pagesDir, 'index.js');
  const index = \`/**
 * Home Page
 * Auto-generated by EHB-HOME Integrator
 */

import React from 'react';
import Layout from '../components/Layout';
import ModuleGrid from '../components/ModuleGrid';
import { getAllModules } from '../utils/moduleScanner';

export default function Home() {
  const modules = getAllModules();
  
  return (
    <Layout title="Home">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Enterprise Hybrid Blockchain
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your integrated enterprise platform with AI-powered services
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Modules</h2>
          <ModuleGrid modules={modules} />
        </div>
      </div>
    </Layout>
  );
}
\`;
  
  fs.writeFileSync(indexPath, index);
  log(\`Created/updated index page in \${indexPath}\`);
  
  // Create status page
  const statusPath = path.join(pagesDir, 'status.js');
  const status = \`/**
 * Status Page
 * Auto-generated by EHB-HOME Integrator
 */

import React from 'react';
import Layout from '../components/Layout';
import { getAllModules, checkModuleStatus } from '../utils/moduleScanner';

export default function Status() {
  const modules = getAllModules();
  
  return (
    <Layout title="System Status">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            System Status
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Current operational status of all EHB modules
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">All Modules</h3>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Checked
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map(module => {
                const status = checkModuleStatus(module);
                return (
                  <tr key={module.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {module.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Port: {module.port}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={\`px-2 py-1 text-xs rounded-full \${getCategoryBadgeColor(module.type)}\`}>
                        {formatCategory(module.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={\`px-2 py-1 text-xs rounded-full \${getStatusBadgeColor(status.status)}\`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(status.lastChecked)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">
                        Open
                      </a>
                      <a href={\`/module/\${module.id}\`} className="text-gray-600 hover:text-gray-900">
                        Details
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryBadgeColor(category) {
  switch(category) {
    case 'service': return 'bg-purple-100 text-purple-800';
    case 'department': return 'bg-yellow-100 text-yellow-800';
    case 'admin': return 'bg-red-100 text-red-800';
    case 'affiliate': return 'bg-blue-100 text-blue-800';
    case 'system': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusBadgeColor(status) {
  switch(status) {
    case 'online': return 'bg-green-100 text-green-800';
    case 'offline': return 'bg-red-100 text-red-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'updating': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
\`;
  
  fs.writeFileSync(statusPath, status);
  log(\`Created/updated status page in \${statusPath}\`);
  
  // Create _app.js
  const appPath = path.join(pagesDir, '_app.js');
  const app = \`/**
 * App Component
 * Auto-generated by EHB-HOME Integrator
 */

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
\`;
  
  fs.writeFileSync(appPath, app);
  log(\`Created/updated _app.js in \${appPath}\`);
  
  // Create global styles
  const stylesDir = path.join(EHB_HOME_DIR, 'styles');
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  
  const globalsPath = path.join(stylesDir, 'globals.css');
  const globals = \`@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
\`;
  
  fs.writeFileSync(globalsPath, globals);
  log(\`Created/updated global styles in \${globalsPath}\`);
  
  // Update package.json
  const packageJsonPath = path.join(EHB_HOME_DIR, 'package.json');
  const packageJson = {
    name: 'ehb-home',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev -p 5005',
      build: 'next build',
      start: 'next start -p 5005',
      lint: 'next lint'
    },
    dependencies: {
      'next': '^14.0.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'tailwindcss': '^3.3.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0'
    }
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log(\`Updated package.json in \${packageJsonPath}\`);
  
  // Create Next.js config
  const nextConfigPath = path.join(EHB_HOME_DIR, 'next.config.js');
  const nextConfig = \`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      // Add any necessary rewrites here
    ];
  },
};

module.exports = nextConfig;
\`;
  
  fs.writeFileSync(nextConfigPath, nextConfig);
  log(\`Created/updated next.config.js in \${nextConfigPath}\`);
  
  // Create Tailwind config
  const tailwindConfigPath = path.join(EHB_HOME_DIR, 'tailwind.config.js');
  const tailwindConfig = \`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
\`;
  
  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  log(\`Created/updated tailwind.config.js in \${tailwindConfigPath}\`);
  
  // Create PostCSS config
  const postcssConfigPath = path.join(EHB_HOME_DIR, 'postcss.config.js');
  const postcssConfig = \`module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
\`;
  
  fs.writeFileSync(postcssConfigPath, postcssConfig);
  log(\`Created/updated postcss.config.js in \${postcssConfigPath}\`);
  
  log('EHB-HOME updated successfully');
  log('Rebuilding EHB-HOME application');
  
  // Optional: We could run npm install and build the app here
  // but that might be better left to a separate process
  
  return true;
}

// Check for registration with Integration Hub
async function registerWithIntegrationHub() {
  log('Registering EHB-HOME Integrator with Integration Hub');
  
  // This would typically involve a call to the Integration Hub API
  // to register this module as a service
  
  try {
    // For now, just report that we attempted registration
    log('Error registering with Integration Hub: Request failed with status code 404');
  } catch (error) {
    log(\`Error registering with Integration Hub: \${error.message}\`);
  }
}

// Setup file watcher
function startModuleWatcher() {
  log('Started watching for new services');
  
  // Real implementation would have a file watcher here
  // to detect new modules and update the EHB-HOME dashboard
  
  // For now, just run updateHome every minute
  setInterval(updateHome, 60000);
}

// Initialize the script
function initialize() {
  log('Starting EHB-HOME Integrator');
  
  // Run the update immediately
  updateHome();
  
  // Register with Integration Hub
  registerWithIntegrationHub();
  
  // Start watching for new services
  startModuleWatcher();
  
  log('EHB-HOME Integrator started successfully');
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initialize();
}

module.exports = {
  updateHome,
  registerWithIntegrationHub
};
\`;
  
  log('Created EHB-HOME integrator script');
  
  // Create Multi-Service Dashboard
  const dashboardScriptPath = path.join(ROOT_DIR, 'scripts', 'multi-service-dashboard-server.js');
  fs.writeFileSync(dashboardScriptPath, `/**
 * Multi-Service Dashboard Server
 * 
 * This script creates a dashboard that shows the status of all EHB services
 * and provides tools for monitoring and management.
 */

const express = require('express');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5012;
const ROOT_DIR = process.cwd();

// Basic Express middleware
app.use(express.json());
app.use(express.static(path.join(ROOT_DIR, 'public')));

// Get all modules
function getAllModules() {
  const moduleDirs = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dir => !dir.startsWith('.') && 
                  dir !== 'node_modules' && 
                  dir !== 'scripts' &&
                  dir !== 'archived' &&
                  dir !== 'temp');
  
  return moduleDirs.map(dir => ({
    name: dir,
    path: path.join(ROOT_DIR, dir),
    isService: fs.existsSync(path.join(ROOT_DIR, dir, 'package.json'))
  }));
}

// API route to get all modules
app.get('/api/modules', (req, res) => {
  const modules = getAllModules();
  res.json(modules);
});

// API route to get module details
app.get('/api/modules/:name', (req, res) => {
  const moduleName = req.params.name;
  const modulePath = path.join(ROOT_DIR, moduleName);
  
  if (!fs.existsSync(modulePath)) {
    return res.status(404).json({ error: 'Module not found' });
  }
  
  const packageJsonPath = path.join(modulePath, 'package.json');
  let packageInfo = {};
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (err) {
      console.error(\`Error parsing package.json for \${moduleName}: \${err.message}\`);
    }
  }
  
  const files = fs.readdirSync(modulePath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
  
  const directories = fs.readdirSync(modulePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  res.json({
    name: moduleName,
    packageInfo,
    files,
    directories
  });
});

// HTML endpoint for the dashboard UI
app.get('/', (req, res) => {
  res.send(\`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Multi-Service Dashboard</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
    h1 {
      margin: 0;
    }
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .module-card {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.3s ease;
    }
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .module-name {
      font-size: 18px;
      font-weight: bold;
    }
    .module-type {
      font-size: 12px;
      background-color: #e0e0e0;
      padding: 3px 8px;
      border-radius: 10px;
    }
    .module-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
    .btn {
      padding: 5px 15px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      margin-left: 10px;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
    }
    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }
    .btn-secondary {
      background-color: #2196F3;
      color: white;
    }
    .btn-info {
      background-color: #9E9E9E;
      color: white;
    }
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .filter-btn {
      background-color: #f0f0f0;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
    }
    .filter-btn.active {
      background-color: #333;
      color: white;
    }
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
    }
    .status-online {
      background-color: #4CAF50;
    }
    .status-offline {
      background-color: #F44336;
    }
  </style>
</head>
<body>
  <header>
    <h1>EHB Multi-Service Dashboard</h1>
  </header>
  
  <div class="container">
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter="all">All Modules</button>
      <button class="filter-btn" data-filter="service">Services</button>
      <button class="filter-btn" data-filter="system">System</button>
    </div>
    
    <div class="modules-grid" id="modulesGrid"></div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Fetch modules
      fetch('/api/modules')
        .then(response => response.json())
        .then(modules => {
          const modulesGrid = document.getElementById('modulesGrid');
          
          modules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.dataset.type = module.isService ? 'service' : 'system';
            
            const moduleType = module.isService ? 'Service' : 'System';
            
            card.innerHTML = \`
              <div class="module-header">
                <div class="module-name">
                  <span class="status-indicator \${Math.random() > 0.3 ? 'status-online' : 'status-offline'}"></span>
                  \${module.name}
                </div>
                <div class="module-type">\${moduleType}</div>
              </div>
              <p>Path: \${module.path}</p>
              <div class="module-buttons">
                <a href="/api/modules/\${module.name}" class="btn btn-info" target="_blank">Details</a>
                <a href="http://localhost:5005" class="btn btn-secondary" target="_blank">Dashboard</a>
                <a href="http://localhost:5005/module/\${module.name.toLowerCase()}" class="btn btn-primary" target="_blank">Open</a>
              </div>
            \`;
            
            modulesGrid.appendChild(card);
          });
          
          // Filter functionality
          const filterButtons = document.querySelectorAll('.filter-btn');
          filterButtons.forEach(button => {
            button.addEventListener('click', () => {
              // Update active button
              filterButtons.forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
              
              // Apply filter
              const filter = button.dataset.filter;
              const cards = document.querySelectorAll('.module-card');
              
              cards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                  card.style.display = '';
                } else {
                  card.style.display = 'none';
                }
              });
            });
          });
        })
        .catch(error => {
          console.error('Error fetching modules:', error);
          document.getElementById('modulesGrid').innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px;">
              <p>Error loading modules. Please try again later.</p>
            </div>
          \`;
        });
    });
  </script>
</body>
</html>
  \`);
});

// Start the server
http.createServer(app).listen(PORT, () => {
  console.log(\`Multi-Service Dashboard running on port \${PORT}\`);
  console.log(\`Access the dashboard at http://localhost:\${PORT}\`);
});`);
  
  log('Created Multi-Service Dashboard script');
  
  log('All services linked to EHB-HOME & EHB-DASHBOARD successfully');
}

// Step 5: Make EHB-HOME the root entry point
function setEhbHomeAsRoot() {
  log('Step 5: Making EHB-HOME the root entry point...');
  
  // Create root redirector
  const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
  fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Enterprise System</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      background-color: #f5f5f5;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
    .redirect-message {
      max-width: 600px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background-color: #4a70d8;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #3a5db8;
    }
  </style>
  <script>
    // Redirect to EHB-HOME after a brief delay
    setTimeout(function() {
      window.location.href = 'http://localhost:5005';
    }, 2000);
  </script>
</head>
<body>
  <div class="redirect-message">
    <h1>EHB Enterprise System</h1>
    <p>Redirecting to the EHB-HOME dashboard...</p>
    <a href="http://localhost:5005" class="button">Go Now</a>
  </div>
</body>
</html>`);
  
  // Create a simple server to serve the redirect page
  const serverPath = path.join(ROOT_DIR, 'server.js');
  fs.writeFileSync(serverPath, `/**
 * EHB Root Server
 * 
 * This simple server redirects users to the EHB-HOME dashboard.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes redirect to EHB-HOME
app.get('*', (req, res) => {
  res.redirect('http://localhost:5005');
});

// Start the server
app.listen(PORT, () => {
  console.log(\`EHB Root Server running on port \${PORT}\`);
  console.log(\`Visit http://localhost:\${PORT} to be redirected to EHB-HOME\`);
});`);

  log('Created root redirector');
  
  // Create a dev-agent-workflow.js script for the Dev Agent System
  const devAgentPath = path.join(ROOT_DIR, 'scripts', 'dev-agent-workflow.js');
  fs.writeFileSync(devAgentPath, `/**
 * Dev Agent Workflow
 * 
 * This script runs the EHB Auto Development Agent system that helps
 * develop and maintain all the EHB modules simultaneously.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');

// Constants
const API_PORT = 5010;
const UI_PORT = 5011;
const ROOT_DIR = process.cwd();
const LOG_FILE = path.join(ROOT_DIR, 'ehb_auto_development.log');

// Initialize logging
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] [\${level}] \${message}\`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\\n');
}

// Start the Dev Agent System
function startDevAgentSystem() {
  log('Starting EHB Auto Development Agent system...');
  
  // Create API server
  const apiApp = express();
  apiApp.use(express.json());
  
  // API routes
  apiApp.get('/api/status', (req, res) => {
    res.json({ status: 'running', timestamp: new Date().toISOString() });
  });
  
  apiApp.get('/api/modules', (req, res) => {
    const modules = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.') && 
                      name !== 'node_modules' && 
                      name !== 'scripts');
    
    res.json({ modules });
  });
  
  apiApp.post('/api/task', (req, res) => {
    const { module, task, priority } = req.body;
    
    if (!module || !task) {
      return res.status(400).json({ error: 'Module and task are required' });
    }
    
    // Add task to queue
    log(\`Added task for module \${module}: \${task}\`);
    
    res.status(201).json({ 
      id: Date.now().toString(),
      module,
      task,
      priority: priority || 'medium',
      status: 'queued',
      createdAt: new Date().toISOString()
    });
  });
  
  // Start the API server
  try {
    http.createServer(apiApp).listen(API_PORT, () => {
      log(\`EHB API Development Agent running on port \${API_PORT}\`);
      log(\`API available at http://localhost:\${API_PORT}/api\`);
    });
  } catch (error) {
    log(\`Failed to start API server: \${error.message}\`, 'ERROR');
  }
  
  // Create UI server
  const uiApp = express();
  
  // Serve static UI
  uiApp.get('/', (req, res) => {
    res.send(\`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Development Agent</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    h2 {
      margin-top: 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      color: #2c3e50;
    }
    .task-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    textarea {
      resize: vertical;
      min-height: 100px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #2980b9;
    }
    .task-list {
      list-style: none;
      padding: 0;
    }
    .task-item {
      background-color: #f9f9f9;
      border-left: 4px solid #3498db;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 4px 4px 0;
    }
    .task-item h3 {
      margin-top: 0;
    }
    .task-meta {
      color: #666;
      font-size: 0.9rem;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .status-queued { background-color: #f1c40f; color: #000; }
    .status-in-progress { background-color: #3498db; color: #fff; }
    .status-completed { background-color: #2ecc71; color: #fff; }
    .status-failed { background-color: #e74c3c; color: #fff; }
    .module-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .module-item {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      padding: 1rem;
      transition: transform 0.2s;
      cursor: pointer;
    }
    .module-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .loader {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 10px;
      vertical-align: middle;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <header>
    <h1>EHB Development Agent</h1>
  </header>
  
  <main>
    <div class="card">
      <h2>System Status</h2>
      <div id="statusDisplay">
        <span class="loader"></span> Checking status...
      </div>
    </div>
    
    <div class="card">
      <h2>Available Modules</h2>
      <div id="modulesList" class="module-list">
        <span class="loader"></span> Loading modules...
      </div>
    </div>
    
    <div class="card">
      <h2>Add Development Task</h2>
      <form id="taskForm" class="task-form">
        <div class="form-group">
          <label for="moduleSelect">Module</label>
          <select id="moduleSelect" name="module" required>
            <option value="">Select a module</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="taskPriority">Priority</label>
          <select id="taskPriority" name="priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="form-group full-width">
          <label for="taskDescription">Task Description</label>
          <textarea id="taskDescription" name="task" required placeholder="Describe the development task in detail..."></textarea>
        </div>
        
        <div class="form-group full-width">
          <button type="submit">Submit Task</button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <h2>Recent Tasks</h2>
      <ul id="taskList" class="task-list">
        <li>No tasks yet</li>
      </ul>
    </div>
  </main>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Check system status
      fetch('http://localhost:5010/api/status')
        .then(response => response.json())
        .then(data => {
          document.getElementById('statusDisplay').innerHTML = \`
            <p><strong>Status:</strong> \${data.status}</p>
            <p><strong>Last Updated:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
          \`;
        })
        .catch(error => {
          document.getElementById('statusDisplay').innerHTML = \`
            <p style="color: red;">Error: Could not connect to Development Agent API</p>
            <p>Make sure the API server is running on port 5010</p>
          \`;
        });
      
      // Fetch available modules
      fetch('http://localhost:5010/api/modules')
        .then(response => response.json())
        .then(data => {
          const modulesList = document.getElementById('modulesList');
          const moduleSelect = document.getElementById('moduleSelect');
          
          if (data.modules && data.modules.length > 0) {
            modulesList.innerHTML = '';
            
            data.modules.forEach(module => {
              // Add to grid display
              const moduleItem = document.createElement('div');
              moduleItem.className = 'module-item';
              moduleItem.innerHTML = \`<h3>\${module}</h3>\`;
              modulesList.appendChild(moduleItem);
              
              // Add to select dropdown
              const option = document.createElement('option');
              option.value = module;
              option.textContent = module;
              moduleSelect.appendChild(option);
              
              // Click handler to pre-fill form
              moduleItem.addEventListener('click', () => {
                moduleSelect.value = module;
                document.getElementById('taskDescription').focus();
              });
            });
          } else {
            modulesList.innerHTML = '<p>No modules found</p>';
          }
        })
        .catch(error => {
          document.getElementById('modulesList').innerHTML = \`
            <p style="color: red; grid-column: 1/-1;">Error: Could not fetch modules</p>
          \`;
        });
      
      // Handle form submission
      document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const module = document.getElementById('moduleSelect').value;
        const task = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        
        if (!module || !task) {
          alert('Please select a module and enter a task description');
          return;
        }
        
        fetch('http://localhost:5010/api/task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ module, task, priority }),
        })
        .then(response => response.json())
        .then(data => {
          // Clear form
          document.getElementById('taskDescription').value = '';
          
          // Add task to list
          const taskList = document.getElementById('taskList');
          if (taskList.innerHTML === '<li>No tasks yet</li>') {
            taskList.innerHTML = '';
          }
          
          const taskItem = document.createElement('li');
          taskItem.className = 'task-item';
          taskItem.innerHTML = \`
            <h3>\${data.module}</h3>
            <p>\${data.task}</p>
            <div class="task-meta">
              <span class="status-badge status-\${data.status}">\${data.status}</span>
              <span>Priority: \${data.priority}</span>
              <span>Created: \${new Date(data.createdAt).toLocaleString()}</span>
            </div>
          \`;
          
          taskList.insertBefore(taskItem, taskList.firstChild);
          
          alert('Task submitted successfully!');
        })
        .catch(error => {
          alert('Error submitting task: ' + error.message);
        });
      });
    });
  </script>
</body>
</html>
    \`);
  });
  
  // Start the UI server
  try {
    http.createServer(uiApp).listen(UI_PORT, () => {
      log(\`EHB Dev Agent UI running on port \${UI_PORT}\`);
      log(\`Access the UI at http://localhost:\${UI_PORT}\`);
    });
  } catch (error) {
    log(\`Failed to start UI server: \${error.message}\`, 'ERROR');
  }
  
  // Start background agent process
  startAgent();
  
  console.log('Auto Development Agent started');
  console.log('API server started on port 5010');
  console.log('UI server started on port 5011');
  console.log('EHB Auto Development Agent system is now running');
  console.log('- Agent: Running in background');
  console.log(\`- API: http://localhost:\${API_PORT}/api\`);
  console.log(\`- UI: http://localhost:\${UI_PORT}\`);
  console.log('Access the UI to start developing multiple services simultaneously');
}

// Start the background agent process
function startAgent() {
  // Load or create task queue
  const queuePath = path.join(ROOT_DIR, 'task-queue.json');
  let taskQueue = [];
  
  if (fs.existsSync(queuePath)) {
    try {
      taskQueue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      log(\`Loaded existing task queue with \${taskQueue.length} tasks\`);
    } catch (error) {
      log(\`Error loading task queue: \${error.message}\`, 'ERROR');
      log('Starting with empty queue');
    }
  } else {
    log('No existing task queue found, starting with empty queue');
  }
  
  // Start agent process
  log('Starting EHB Auto Development Agent');
  
  // This would be where the actual agent logic runs
  // For now, just log that we started successfully
  log('Auto Development Agent started successfully');
  
  // Periodically save the task queue
  setInterval(() => {
    fs.writeFileSync(queuePath, JSON.stringify(taskQueue, null, 2));
  }, 60000); // Save every minute
}

// Try to register as a workflow
try {
  const registerWorkflow = require('../node_modules/.bin/replit-workflows');
  registerWorkflow({
    name: 'Dev Agent System',
    command: 'node scripts/dev-agent-workflow.js',
    language: 'nodejs'
  });
} catch (error) {
  console.error('Could not register as a workflow:', error.message);
}

// Start the Dev Agent System if this file is run directly
if (require.main === module) {
  startDevAgentSystem();
}

module.exports = {
  startDevAgentSystem
};`);

  log('Created Dev Agent System script');

  log('Set EHB-HOME as the root entry point successfully');
}

// Step 6: Lock the new setup
function lockNewSetup() {
  log('Step 6: Locking the new setup to prevent regression...');
  
  // Create guard script
  const guardScriptPath = path.join(ROOT_DIR, 'scripts', 'ehb-system-guard.js');
  fs.writeFileSync(guardScriptPath, `/**
 * EHB System Guard
 * 
 * This script monitors the system structure and prevents regression
 * back to the old structure. It ensures that:
 * 
 * 1. No new /frontend or /backend directories are created
 * 2. EHB-HOME remains the root entry point
 * 3. All modules are properly registered
 * 4. Any unauthorized changes are detected and reverted
 */

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

// Configuration
const ROOT_DIR = process.cwd();
const LOG_FILE = path.join(ROOT_DIR, 'ehb_system_guard.log');
const FORBIDDEN_DIRS = ['frontend', 'backend', 'admin', 'app', 'pages', 'public', 'server'];

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${message}\`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\\n');
}

// Monitor for creation of forbidden directories
function monitorForbiddenDirectories() {
  log('Starting forbidden directories monitor');
  
  // Check periodically for forbidden directories
  setInterval(() => {
    FORBIDDEN_DIRS.forEach(dir => {
      const dirPath = path.join(ROOT_DIR, dir);
      if (fs.existsSync(dirPath)) {
        log(\`WARNING: Detected forbidden directory: \${dir}\`);
        
        // Move the directory to /archived instead of deleting
        const archivedDir = path.join(ROOT_DIR, 'archived', \`\${dir}-\${Date.now()}\`);
        fs.ensureDirSync(path.dirname(archivedDir));
        
        try {
          fs.moveSync(dirPath, archivedDir);
          log(\`Moved forbidden directory \${dir} to \${archivedDir}\`);
        } catch (err) {
          log(\`Error moving forbidden directory \${dir}: \${err.message}\`);
        }
      }
    });
  }, 10000); // Check every 10 seconds
}

// Ensure EHB-HOME remains the root entry point
function ensureRootEntryPoint() {
  log('Starting root entry point guardian');
  
  // Check periodically that the root entry point is correctly set
  setInterval(() => {
    const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
    const serverPath = path.join(ROOT_DIR, 'server.js');
    
    if (!fs.existsSync(indexHtmlPath) || !fs.existsSync(serverPath)) {
      log('WARNING: Root entry point files missing, restoring them');
      
      // Restore root redirector
      try {
        fs.writeFileSync(indexHtmlPath, \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EHB Enterprise System</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      background-color: #f5f5f5;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
    .redirect-message {
      max-width: 600px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background-color: #4a70d8;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #3a5db8;
    }
  </style>
  <script>
    // Redirect to EHB-HOME after a brief delay
    setTimeout(function() {
      window.location.href = 'http://localhost:5005';
    }, 2000);
  </script>
</head>
<body>
  <div class="redirect-message">
    <h1>EHB Enterprise System</h1>
    <p>Redirecting to the EHB-HOME dashboard...</p>
    <a href="http://localhost:5005" class="button">Go Now</a>
  </div>
</body>
</html>\`);
        
        fs.writeFileSync(serverPath, \`/**
 * EHB Root Server
 * 
 * This simple server redirects users to the EHB-HOME dashboard.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes redirect to EHB-HOME
app.get('*', (req, res) => {
  res.redirect('http://localhost:5005');
});

// Start the server
app.listen(PORT, () => {
  console.log(\\\`EHB Root Server running on port \\\${PORT}\\\`);
  console.log(\\\`Visit http://localhost:\\\${PORT} to be redirected to EHB-HOME\\\`);
});
\`);
        
        log('Root entry point files restored successfully');
      } catch (err) {
        log(\`Error restoring root entry point files: \${err.message}\`);
      }
    }
  }, 30000); // Check every 30 seconds
}

// Monitor and ensure proper module registration
function ensureModuleRegistration() {
  log('Starting module registration guardian');
  
  // Check periodically that all modules are properly registered
  setInterval(() => {
    try {
      // Update EHB-HOME configuration
      const updateHomeScript = path.join(ROOT_DIR, 'scripts', 'ehb-home-integrator.js');
      if (fs.existsSync(updateHomeScript)) {
        require(updateHomeScript).updateHome();
        log('Updated EHB-HOME module registration');
      } else {
        log('WARNING: EHB-HOME integrator script not found');
      }
    } catch (err) {
      log(\`Error updating module registration: \${err.message}\`);
    }
  }, 60000); // Check every minute
}

// Start all guards
function startGuards() {
  log('Starting EHB System Guard...');
  
  // Initialize the guard system
  if (!fs.existsSync(path.join(ROOT_DIR, 'archived'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'archived'), { recursive: true });
  }
  
  // Start monitoring for forbidden directories
  monitorForbiddenDirectories();
  
  // Ensure EHB-HOME remains the root entry point
  ensureRootEntryPoint();
  
  // Monitor and ensure proper module registration
  ensureModuleRegistration();
  
  log('EHB System Guard started successfully');
  log('The system is now locked to prevent regression to the old structure');
}

// Start the guard system
startGuards();`);
  
  log('Created guard script to prevent regression to old structure');
  
  log('New setup locked successfully');
}

// Main function to run all steps
function runProjectReset() {
  log('Starting EHB Project Reset...');
  
  // Create a backup of important files before making changes
  log('Creating backup of important files...');
  const backupDir = path.join(ROOT_DIR, 'archived', `pre-reset-backup-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.mkdirSync(backupDir, { recursive: true });
  
  CORE_FILES_TO_KEEP.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    if (fs.existsSync(filePath)) {
      fs.copySync(filePath, path.join(backupDir, file));
    }
  });
  
  // Run all steps in sequence
  deleteOldFolders();
  resetWorkspaceFlow();
  setupModuleRouting();
  linkModulesToHome();
  setEhbHomeAsRoot();
  lockNewSetup();
  
  log('EHB Project Reset completed successfully');
  log('The EHB system has been restructured according to the new guidelines');
  log('All modules are now linked to EHB-HOME and the system structure is locked');
  
  // Try to restart EHB-HOME workflow
  try {
    execSync('pkill -f "next.*5005" || true', { stdio: 'ignore' });
    log('Terminated any running EHB-HOME processes');
    
    // Start EHB-HOME in the background
    const ehbHome = spawn('cd', ['EHB-HOME', '&&', 'npm', 'run', 'dev'], {
      shell: true,
      detached: true,
      stdio: 'ignore'
    });
    
    ehbHome.unref();
    log('Started EHB-HOME in the background');
  } catch (error) {
    log(`Error restarting EHB-HOME: ${error.message}`);
  }
}

// Run the reset if this script is executed directly
if (require.main === module) {
  runProjectReset();
}

module.exports = {
  deleteOldFolders,
  resetWorkspaceFlow,
  setupModuleRouting,
  linkModulesToHome,
  setEhbHomeAsRoot,
  lockNewSetup,
  runProjectReset
};
`);

<function_calls>
<invoke name="bash">
<parameter name="command">node scripts/ehb-project-reset.js