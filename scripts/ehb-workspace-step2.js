/**
 * EHB Workspace Organizer - Step 2: Fix EHB-HOME Dashboard
 * 
 * This script fixes the EHB-HOME dashboard to properly display all services.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const BASE_DIR = process.cwd();
const LOG_FILE = path.join(BASE_DIR, 'ehb_workspace_step2.log');

/**
 * Log a message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Log to file
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

/**
 * Fix the EHB-HOME dashboard
 */
function fixEhbHomeDashboard() {
  log('Fixing EHB-HOME dashboard...');
  
  // Target directories
  const ehbHomePath = path.join(BASE_DIR, 'EHB-HOME');
  const pagesDir = path.join(ehbHomePath, 'pages');
  const stylesDir = path.join(ehbHomePath, 'styles');
  
  // Create directories if needed
  createDirIfNotExists(pagesDir);
  createDirIfNotExists(stylesDir);
  
  // Create a simple index.js in pages directory
  const indexPath = path.join(pagesDir, 'index.js');
  
  const indexContent = `import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// Card color mapping based on service type
const typeColorMap = {
  frontend: 'bg-blue-100',
  backend: 'bg-green-100',
  fullstack: 'bg-purple-100',
  dashboard: 'bg-indigo-100',
  wallet: 'bg-yellow-100',
  ecommerce: 'bg-pink-100',
  media: 'bg-red-100',
  database: 'bg-gray-100',
  affiliate: 'bg-orange-100',
  blockchain: 'bg-cyan-100',
  marketplace: 'bg-emerald-100',
  service: 'bg-teal-100',
  default: 'bg-gray-100'
};

/**
 * Home Page Component
 */
export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/EHB-HOME/data/service_info.json');
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback data if fetch fails
        setServices([
          {
            name: 'EHB-HOME',
            type: 'frontend',
            description: 'Central dashboard for EHB system',
            url: 'http://localhost:5005',
            status: 'online'
          },
          {
            name: 'EHB-AI-Dev-Fullstack',
            type: 'fullstack',
            description: 'AI development hub and integration services',
            url: 'http://localhost:5003',
            status: 'online'
          },
          {
            name: 'EHB-Developer-Portal',
            type: 'frontend',
            description: 'Documentation and resources for developers',
            url: 'http://localhost:5000',
            status: 'online'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>EHB System Dashboard</title>
        <meta name="description" content="EHB System Dashboard" />
      </Head>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            EHB System Dashboard
          </h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Services Section */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Services & Departments</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p>Loading services...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map(service => (
                  <div 
                    key={service.name}
                    className={\`\${typeColorMap[service.type] || typeColorMap.default} shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow\`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                        {service.type}
                      </span>
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Links Section */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Links</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Quick access to key resources</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a 
                      href="http://localhost:5000" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                        <span className="text-lg">DP</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Developer Portal</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5003" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-500 text-white">
                        <span className="text-lg">IH</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Integration Hub</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5001/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white">
                        <span className="text-lg">API</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">API Explorer</span>
                    </a>
                    
                    <a 
                      href="http://localhost:5000/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                        <span className="text-lg">DOC</span>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Documentation</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Departments Section */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Departments</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Key departments in the EHB system</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-medium text-blue-800">AI Development</h3>
                      <p className="mt-1 text-sm text-blue-600">AI services and development tools</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-medium text-green-800">Finance</h3>
                      <p className="mt-1 text-sm text-green-600">Financial services and payments</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-medium text-purple-800">Commerce</h3>
                      <p className="mt-1 text-sm text-purple-600">E-commerce and marketplace</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="font-medium text-yellow-800">Healthcare</h3>
                      <p className="mt-1 text-sm text-yellow-600">Medical services and health</p>
                    </div>
                    
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h3 className="font-medium text-pink-800">Education</h3>
                      <p className="mt-1 text-sm text-pink-600">Educational services and learning</p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <h3 className="font-medium text-indigo-800">Legal</h3>
                      <p className="mt-1 text-sm text-indigo-600">Legal services and consultation</p>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h3 className="font-medium text-red-800">Media</h3>
                      <p className="mt-1 text-sm text-red-600">Media streaming and content</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="font-medium text-orange-800">Employment</h3>
                      <p className="mt-1 text-sm text-orange-600">Job services and careers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-6 sm:px-0 mt-8">
            <div className="border-t border-gray-200 pt-8">
              <p className="text-center text-sm text-gray-500">
                EHB System Dashboard &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
  
  fs.writeFileSync(indexPath, indexContent);
  log(`Created index.js for EHB-HOME: ${indexPath}`);
  
  // Create _app.js
  const appPath = path.join(pagesDir, '_app.js');
  
  const appContent = `import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;`;
  
  fs.writeFileSync(appPath, appContent);
  log(`Created _app.js for EHB-HOME: ${appPath}`);
  
  // Create globals.css
  const globalsCssPath = path.join(stylesDir, 'globals.css');
  
  const globalsCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 249, 250, 251;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`;
  
  fs.writeFileSync(globalsCssPath, globalsCssContent);
  log(`Created globals.css for EHB-HOME: ${globalsCssPath}`);
  
  // Create tailwind.config.js
  const tailwindConfigPath = path.join(ehbHomePath, 'tailwind.config.js');
  
  const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
  
  fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
  log(`Created tailwind.config.js for EHB-HOME: ${tailwindConfigPath}`);
  
  // Create postcss.config.js
  const postcssConfigPath = path.join(ehbHomePath, 'postcss.config.js');
  
  const postcssConfigContent = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
  
  fs.writeFileSync(postcssConfigPath, postcssConfigContent);
  log(`Created postcss.config.js for EHB-HOME: ${postcssConfigPath}`);
  
  // Create next.config.js
  const nextConfigPath = path.join(ehbHomePath, 'next.config.js');
  
  const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync(nextConfigPath, nextConfigContent);
  log(`Created next.config.js for EHB-HOME: ${nextConfigPath}`);
  
  // Update package.json
  const packageJsonPath = path.join(ehbHomePath, 'package.json');
  
  const packageJsonContent = {
    name: 'ehb-home',
    version: '1.0.0',
    description: 'EHB HOME - Central Dashboard for all EHB modules and services',
    main: 'index.js',
    scripts: {
      dev: 'next dev -p 5005',
      build: 'next build',
      start: 'next start -p 5005',
      lint: 'next lint'
    },
    dependencies: {
      next: '13.4.19',
      react: '18.2.0',
      'react-dom': '18.2.0'
    },
    devDependencies: {
      autoprefixer: '^10.4.15',
      postcss: '^8.4.29',
      tailwindcss: '^3.3.3'
    }
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
  log(`Updated package.json for EHB-HOME: ${packageJsonPath}`);
  
  log('Successfully fixed EHB-HOME dashboard');
}

/**
 * Try to restart EHB-HOME workflow
 */
function restartEhbHomeWorkflow() {
  log('Attempting to restart EHB-HOME workflow...');
  
  // Kill any existing Node.js processes related to EHB-HOME
  exec('pkill -f "cd EHB-HOME && npm run dev" || true', (error, stdout, stderr) => {
    log('Stopped any existing EHB-HOME processes');
    
    // Add a small delay before starting new process
    setTimeout(() => {
      // Start EHB-HOME in a new process
      exec('cd EHB-HOME && npm run dev', (err, out, serr) => {
        if (err) {
          log(`Error starting EHB-HOME: ${err.message}`);
          return;
        }
        log('Started EHB-HOME workflow');
      });
    }, 1000);
  });
}

/**
 * Main function: Execute steps
 */
function main() {
  log('Starting EHB Workspace Organizer - Step 2');
  
  try {
    // Fix EHB-HOME dashboard
    fixEhbHomeDashboard();
    
    // Try to restart EHB-HOME workflow
    restartEhbHomeWorkflow();
    
    log('EHB Workspace Organizer - Step 2 completed successfully');
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
  }
}

// Run the main function
main();