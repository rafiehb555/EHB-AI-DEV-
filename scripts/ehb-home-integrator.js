/**
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
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
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
        const moduleDesc = MODULE_DESCRIPTIONS[dirName] || `${dirName} module`;
        
        modules.push({
          id: dirName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: dirName,
          description: moduleDesc,
          type: moduleType,
          port: modulePort,
          url: `http://localhost:${modulePort}`,
          path: path.join(ROOT_DIR, dirName)
        });
      }
    });
  
  log(`Found ${modules.length} modules`);
  
  // Create module configuration
  const moduleConfigDir = path.join(EHB_HOME_DIR, 'utils');
  if (!fs.existsSync(moduleConfigDir)) {
    fs.mkdirSync(moduleConfigDir, { recursive: true });
  }
  
  const moduleConfigPath = path.join(moduleConfigDir, 'moduleConfig.js');
  const moduleConfig = `/**
 * Module Configuration
 * Auto-generated by EHB-HOME Integrator
 */

export const modules = ${JSON.stringify(modules, null, 2)};

export const MODULE_CATEGORIES = {
  SERVICE: 'service',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
  AFFILIATE: 'affiliate',
  SYSTEM: 'system'
};
`;
  
  fs.writeFileSync(moduleConfigPath, moduleConfig);
  log(`Updated module configuration in ${moduleConfigPath}`);
  
  // Create module scanner utility
  const moduleScannerPath = path.join(moduleConfigDir, 'moduleScanner.js');
  const moduleScanner = `/**
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
`;
  
  fs.writeFileSync(moduleScannerPath, moduleScanner);
  log(`Created/updated module scanner in ${moduleScannerPath}`);
  
  // Create ModuleCard component
  const componentsDir = path.join(EHB_HOME_DIR, 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const moduleCardPath = path.join(componentsDir, 'ModuleCard.js');
  const moduleCard = `/**
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
`;
  
  fs.writeFileSync(moduleCardPath, moduleCard);
  log(`Created/updated ModuleCard component in ${moduleCardPath}`);
  
  // Create ModuleGrid component
  const moduleGridPath = path.join(componentsDir, 'ModuleGrid.js');
  const moduleGrid = `/**
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
`;
  
  fs.writeFileSync(moduleGridPath, moduleGrid);
  log(`Created/updated ModuleGrid component in ${moduleGridPath}`);
  
  // Create Layout component
  const layoutPath = path.join(componentsDir, 'Layout.js');
  const layout = `/**
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
`;
  
  fs.writeFileSync(layoutPath, layout);
  log(`Created/updated Layout component in ${layoutPath}`);
  
  // Create index page
  const pagesDir = path.join(EHB_HOME_DIR, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const indexPath = path.join(pagesDir, 'index.js');
  const index = `/**
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
`;
  
  fs.writeFileSync(indexPath, index);
  log(`Created/updated index page in ${indexPath}`);
  
  // Create status page
  const statusPath = path.join(pagesDir, 'status.js');
  const status = `/**
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
`;
  
  fs.writeFileSync(statusPath, status);
  log(`Created/updated status page in ${statusPath}`);
  
  // Create _app.js
  const appPath = path.join(pagesDir, '_app.js');
  const app = `/**
 * App Component
 * Auto-generated by EHB-HOME Integrator
 */

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`;
  
  fs.writeFileSync(appPath, app);
  log(`Created/updated _app.js in ${appPath}`);
  
  // Create global styles
  const stylesDir = path.join(EHB_HOME_DIR, 'styles');
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  
  const globalsPath = path.join(stylesDir, 'globals.css');
  const globals = `@tailwind base;
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
`;
  
  fs.writeFileSync(globalsPath, globals);
  log(`Created/updated global styles in ${globalsPath}`);
  
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
  log(`Updated package.json in ${packageJsonPath}`);
  
  // Create Next.js config
  const nextConfigPath = path.join(EHB_HOME_DIR, 'next.config.js');
  const nextConfig = `/** @type {import('next').NextConfig} */
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
`;
  
  fs.writeFileSync(nextConfigPath, nextConfig);
  log(`Created/updated next.config.js in ${nextConfigPath}`);
  
  // Create Tailwind config
  const tailwindConfigPath = path.join(EHB_HOME_DIR, 'tailwind.config.js');
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
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
`;
  
  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  log(`Created/updated tailwind.config.js in ${tailwindConfigPath}`);
  
  // Create PostCSS config
  const postcssConfigPath = path.join(EHB_HOME_DIR, 'postcss.config.js');
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  
  fs.writeFileSync(postcssConfigPath, postcssConfig);
  log(`Created/updated postcss.config.js in ${postcssConfigPath}`);
  
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
    log(`Error registering with Integration Hub: ${error.message}`);
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