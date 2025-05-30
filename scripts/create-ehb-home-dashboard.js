/**
 * Create EHB-HOME Dashboard
 * 
 * This script creates a modern, functional dashboard for the EHB-HOME module.
 * It serves as the central hub for all EHB services and departments.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const BASE_DIR = process.cwd();
const EHB_HOME_DIR = path.join(BASE_DIR, 'EHB-HOME');
const COMPONENTS_DIR = path.join(EHB_HOME_DIR, 'components');
const PAGES_DIR = path.join(EHB_HOME_DIR, 'pages');
const STYLES_DIR = path.join(EHB_HOME_DIR, 'styles');
const PUBLIC_DIR = path.join(EHB_HOME_DIR, 'public');
const UTILS_DIR = path.join(EHB_HOME_DIR, 'utils');
const HOOKS_DIR = path.join(EHB_HOME_DIR, 'hooks');
const DATA_DIR = path.join(EHB_HOME_DIR, 'data');

/**
 * Console log with color
 * @param {string} message - Message to log
 * @param {string} type - Type of message (info, success, error, warning)
 */
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m', // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m' // Reset
  };
  
  console.log(`${colors[type]}[${type.toUpperCase()}] ${message}${colors.reset}`);
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, 'success');
  }
}

/**
 * Create file with content
 * @param {string} filePath - File path
 * @param {string} content - File content
 */
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  log(`Created file: ${filePath}`, 'success');
}

/**
 * Create the package.json file
 */
function createPackageJson() {
  const packageJsonPath = path.join(EHB_HOME_DIR, 'package.json');
  
  const packageJson = {
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
      'react-dom': '18.2.0',
      'react-feather': '^2.0.10',
      'recharts': '^2.5.0',
      axios: '^1.5.0',
      'react-dnd': '^16.0.1',
      'react-dnd-html5-backend': '^16.0.1',
      'date-fns': '^2.30.0',
      'chart.js': '^4.3.0',
      'react-chartjs-2': '^5.2.0'
    },
    devDependencies: {
      autoprefixer: '^10.4.15',
      postcss: '^8.4.29',
      tailwindcss: '^3.3.3'
    }
  };
  
  createFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Create Next.js configuration file
 */
function createNextConfig() {
  const nextConfigPath = path.join(EHB_HOME_DIR, 'next.config.js');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
`;
  
  createFile(nextConfigPath, nextConfig);
}

/**
 * Create Tailwind CSS configuration file
 */
function createTailwindConfig() {
  const tailwindConfigPath = path.join(EHB_HOME_DIR, 'tailwind.config.js');
  
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};
`;
  
  createFile(tailwindConfigPath, tailwindConfig);
}

/**
 * Create PostCSS configuration file
 */
function createPostcssConfig() {
  const postcssConfigPath = path.join(EHB_HOME_DIR, 'postcss.config.js');
  
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  
  createFile(postcssConfigPath, postcssConfig);
}

/**
 * Create global styles
 */
function createGlobalStyles() {
  const globalStylesPath = path.join(STYLES_DIR, 'globals.css');
  
  const globalStyles = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 249, 250, 251;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

.card-shadow {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.draggable-card {
  cursor: grab;
}

.draggable-card:active {
  cursor: grabbing;
}

.drag-over {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgba(59, 130, 246, 0.5);
}
`;
  
  createFile(globalStylesPath, globalStyles);
}

/**
 * Create the Layout component
 */
function createLayoutComponent() {
  const layoutPath = path.join(COMPONENTS_DIR, 'Layout.js');
  
  const layoutContent = `import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as Icons from 'react-feather';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: Icons.Home },
  { name: 'Services', href: '/services', icon: Icons.Server },
  { name: 'Departments', href: '/departments', icon: Icons.Grid },
  { name: 'Status', href: '/status', icon: Icons.Activity },
  { name: 'Data Flow', href: '/data-flow', icon: Icons.Database },
  { name: 'Analytics', href: '/analytics', icon: Icons.BarChart2 },
  { name: 'Settings', href: '/settings', icon: Icons.Settings },
];

// Secondary navigation items
const secondaryNavigation = [
  { name: 'Developer Portal', href: 'http://localhost:5000', icon: Icons.Code, external: true },
  { name: 'Integration Hub', href: 'http://localhost:5003', icon: Icons.Share2, external: true },
  { name: 'Documentation', href: 'http://localhost:5000/docs', icon: Icons.FileText, external: true },
];

const Layout = ({ children, title = 'Dashboard' }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if a navigation item is active
  const isActive = (href) => router.pathname === href;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | EHB System</title>
        <meta name="description" content="EHB System HOME - Central dashboard for all EHB modules and services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={
        \`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 transform \${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto\`
      }>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-primary-600 p-2">
                <Icons.Grid className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">EHB System</span>
            </div>
          </div>
          
          {/* Main navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  \`flex items-center px-2 py-2 text-sm font-medium rounded-md \${
                    isActive(item.href)
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }\`
                }
              >
                <item.icon className={
                  \`mr-3 h-5 w-5 \${isActive(item.href) ? 'text-white' : 'text-gray-400'}\`
                } />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Secondary navigation */}
          <div className="px-2 py-4 space-y-1 border-t border-gray-200">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              External Links
            </p>
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : '_self'}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                {item.name}
                {item.external && (
                  <Icons.ExternalLink className="ml-1 h-4 w-4 text-gray-400" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icons.Info className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">EHB System v1.0</p>
                <p className="text-xs text-gray-500">© 2025 EHB Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="flex justify-between h-16 px-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Icons.Menu className="h-6 w-6" />
              </button>
              
              <div className="ml-4 md:ml-0">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Search */}
              <div className="w-80 max-w-xs mr-4 hidden sm:block">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Icons.Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full bg-gray-100 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
              
              {/* Notifications */}
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">View notifications</span>
                <Icons.Bell className="h-6 w-6" />
              </button>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <button
                  type="button"
                  className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <Icons.User className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
`;
  
  createFile(layoutPath, layoutContent);
}

/**
 * Create the ServiceCard component
 */
function createServiceCardComponent() {
  const serviceCardPath = path.join(COMPONENTS_DIR, 'ServiceCard.js');
  
  const serviceCardContent = `import React from 'react';
import Link from 'next/link';
import * as Icons from 'react-feather';

// Icon mapping for different service types
const typeIconMap = {
  frontend: Icons.Monitor,
  backend: Icons.Server,
  fullstack: Icons.Layers,
  dashboard: Icons.PieChart,
  wallet: Icons.CreditCard,
  ecommerce: Icons.ShoppingCart,
  media: Icons.Film,
  database: Icons.Database,
  affiliate: Icons.Users,
  service: Icons.Tool,
  blockchain: Icons.Link,
  education: Icons.BookOpen,
  law: Icons.Shield,
  medical: Icons.Activity,
  job: Icons.Briefcase,
  default: Icons.Box
};

// Color mapping for different service types
const typeColorMap = {
  frontend: 'bg-blue-100 text-blue-800',
  backend: 'bg-green-100 text-green-800',
  fullstack: 'bg-purple-100 text-purple-800',
  dashboard: 'bg-indigo-100 text-indigo-800',
  wallet: 'bg-yellow-100 text-yellow-800',
  ecommerce: 'bg-pink-100 text-pink-800',
  media: 'bg-red-100 text-red-800',
  database: 'bg-gray-100 text-gray-800',
  affiliate: 'bg-orange-100 text-orange-800',
  service: 'bg-teal-100 text-teal-800',
  blockchain: 'bg-cyan-100 text-cyan-800',
  education: 'bg-emerald-100 text-emerald-800',
  law: 'bg-violet-100 text-violet-800',
  medical: 'bg-rose-100 text-rose-800',
  job: 'bg-amber-100 text-amber-800',
  default: 'bg-gray-100 text-gray-800'
};

// Badge color mapping for status
const statusColorMap = {
  online: 'bg-green-100 text-green-800',
  offline: 'bg-red-100 text-red-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  unknown: 'bg-gray-100 text-gray-800'
};

const ServiceCard = ({ service, onDragStart, draggable = false }) => {
  const { name, type, description, url, status = 'online', dataFiles = 0 } = service;
  
  // Get the icon component based on service type
  const IconComponent = typeIconMap[type] || typeIconMap.default;
  
  // Get card color based on service type
  const cardTypeColor = typeColorMap[type] || typeColorMap.default;
  
  // Get status badge color
  const statusBadgeColor = statusColorMap[status] || statusColorMap.unknown;
  
  // Format service name for display
  const displayName = name.replace(/-/g, ' ').replace(/([A-Z])/g, ' $1').trim();
  
  // Handle drag start if draggable
  const handleDragStart = (e) => {
    if (draggable && onDragStart) {
      onDragStart(e, service);
    }
  };
  
  return (
    <div 
      className={\`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden card-hover \${draggable ? 'draggable-card' : ''}\`} 
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={\`p-2 rounded-md \${cardTypeColor.split(' ')[0]}\`}>
              <IconComponent className={\`h-5 w-5 \${cardTypeColor.split(' ')[1]}\`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{displayName}</h3>
              <p className="text-xs text-gray-500">{type}</p>
            </div>
          </div>
          <div>
            <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium \${statusBadgeColor}\`}>
              {status}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 line-clamp-2">
            {description || \`\${type.charAt(0).toUpperCase() + type.slice(1)} module for EHB system\`}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Icons.Database className="h-4 w-4 mr-1" />
            <span>{dataFiles} files</span>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              href={\`/service/\${name}\`}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              Details
            </Link>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
`;
  
  createFile(serviceCardPath, serviceCardContent);
}

/**
 * Create the ServiceGrid component
 */
function createServiceGridComponent() {
  const serviceGridPath = path.join(COMPONENTS_DIR, 'ServiceGrid.js');
  
  const serviceGridContent = `import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import axios from 'axios';

const ServiceGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Try to fetch from EHB-HOME data first
        const serviceInfoPath = '/EHB-HOME/data/service_info.json';
        const response = await axios.get(serviceInfoPath);
        setServices(response.data);
      } catch (error) {
        console.error('Error loading services data:', error);
        // Fallback to static data if file not found
        setServices([
          {
            name: 'EHB-HOME',
            type: 'frontend',
            description: 'Central dashboard for all EHB modules and services',
            url: 'http://localhost:5005',
            status: 'online',
            dataFiles: 12
          },
          {
            name: 'EHB-AI-Dev-Fullstack',
            type: 'fullstack',
            description: 'Central integration hub for AI development services',
            url: 'http://localhost:5003',
            status: 'online',
            dataFiles: 24
          },
          {
            name: 'EHB-Developer-Portal',
            type: 'frontend',
            description: 'Documentation and resources for developers',
            url: 'http://localhost:5000',
            status: 'online',
            dataFiles: 8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Get unique service types
  const serviceTypes = ['all', ...new Set(services.map(service => service.type))];
  
  // Filter services based on selected type and search term
  const filteredServices = services.filter(service => {
    // Filter by type
    const typeMatch = selectedType === 'all' || service.type === selectedType;
    
    // Filter by search term
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = service.name.toLowerCase().includes(searchTermLower);
    const descriptionMatch = service.description && service.description.toLowerCase().includes(searchTermLower);
    
    return typeMatch && (nameMatch || descriptionMatch);
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        {/* Filter by type */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {serviceTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={\`whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium \${
                selectedType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }\`}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Search input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No services match your current filters. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
`;
  
  createFile(serviceGridPath, serviceGridContent);
}

/**
 * Create the StatCard component
 */
function createStatCardComponent() {
  const statCardPath = path.join(COMPONENTS_DIR, 'StatCard.js');
  
  const statCardContent = `import React from 'react';
import * as Icons from 'react-feather';

// Color map for different card types
const typeColorMap = {
  primary: {
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    iconBgColor: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  success: {
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  error: {
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  info: {
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  gray: {
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    iconBgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
};

// Get the icon component based on the name
const getIconComponent = (iconName) => {
  if (typeof iconName === 'string') {
    return Icons[iconName] || Icons.Activity;
  }
  return Icons.Activity;
};

const StatCard = ({ 
  title, 
  value, 
  icon = 'Activity', 
  type = 'primary', 
  change, 
  direction = 'up', 
  suffix, 
  onClick 
}) => {
  // Get colors based on card type
  const colors = typeColorMap[type] || typeColorMap.primary;
  
  // Get icon component
  const IconComponent = getIconComponent(icon);
  
  // Determine change indicator colors
  const changeColorClass = direction === 'up' 
    ? 'text-green-600' 
    : direction === 'down' 
      ? 'text-red-600' 
      : 'text-gray-600';
  
  // Get change icon
  const ChangeIcon = direction === 'up' 
    ? Icons.TrendingUp 
    : direction === 'down' 
      ? Icons.TrendingDown 
      : Icons.Minus;
  
  return (
    <div 
      className={\`rounded-lg shadow-sm border border-gray-200 \${colors.bgColor} overflow-hidden \${onClick ? 'cursor-pointer card-hover' : ''}\`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={\`flex-shrink-0 rounded-md \${colors.iconBgColor} p-3\`}>
            <IconComponent className={\`h-6 w-6 \${colors.iconColor}\`} />
          </div>
          
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="flex items-baseline">
                  <div className={\`text-2xl font-semibold \${colors.textColor}\`}>
                    {value}{suffix && <span className="text-sm font-normal">{suffix}</span>}
                  </div>
                  
                  {change && (
                    <div className={\`ml-2 flex items-baseline text-sm font-semibold \${changeColorClass}\`}>
                      <ChangeIcon className="self-center flex-shrink-0 h-5 w-5 mr-1" />
                      {change}
                    </div>
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
`;
  
  createFile(statCardPath, statCardContent);
}

/**
 * Create the StatusBadge component
 */
function createStatusBadgeComponent() {
  const statusBadgePath = path.join(COMPONENTS_DIR, 'StatusBadge.js');
  
  const statusBadgeContent = `import React from 'react';
import * as Icons from 'react-feather';

// Define status colors and icons
const statusConfig = {
  operational: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
    icon: Icons.Check,
  },
  degraded: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500',
    icon: Icons.AlertTriangle,
  },
  maintenance: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    icon: Icons.Tool,
  },
  outage: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
    icon: Icons.X,
  },
  unknown: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-500',
    icon: Icons.HelpCircle,
  },
};

const StatusBadge = ({ status = 'unknown', withText = true, size = 'md' }) => {
  // Get status configuration
  const config = statusConfig[status] || statusConfig.unknown;
  
  // Get size-specific classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';
  
  // Get icon size
  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size] || 14;
  
  const IconComponent = config.icon;
  
  return (
    <span className={\`inline-flex items-center rounded-full \${config.bgColor} \${config.textColor} \${sizeClasses}\`}>
      <IconComponent size={iconSize} className={\`\${config.iconColor} \${withText ? 'mr-1' : ''}\`} />
      {withText && status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
`;
  
  createFile(statusBadgePath, statusBadgeContent);
}

/**
 * Create the DataFlowDiagram component
 */
function createDataFlowDiagramComponent() {
  const dataFlowDiagramPath = path.join(COMPONENTS_DIR, 'DataFlowDiagram.js');
  
  const dataFlowDiagramContent = `import React from 'react';
import * as Icons from 'react-feather';

const DataFlowDiagram = ({ services = [] }) => {
  // Group services by type
  const servicesByType = services.reduce((acc, service) => {
    const type = service.type || 'default';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {});
  
  // Define the column structure for the diagram
  const columns = [
    { 
      name: 'Data Sources', 
      types: ['database', 'service', 'backend'], 
      icon: Icons.Database 
    },
    { 
      name: 'Integration Layer', 
      types: ['fullstack', 'media'], 
      icon: Icons.Share2 
    },
    { 
      name: 'Applications', 
      types: ['frontend', 'dashboard', 'ecommerce', 'wallet', 'affiliate'], 
      icon: Icons.Layers 
    },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Data Flow Diagram</h3>
        <p className="mt-1 text-sm text-gray-500">
          How data flows between different services in the EHB system
        </p>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-4">
          {columns.map((column, colIndex) => (
            <div 
              key={column.name} 
              className="flex-1 flex flex-col border border-gray-200 rounded-lg bg-gray-50"
            >
              {/* Column header */}
              <div className="p-3 border-b border-gray-200 bg-gray-100 flex items-center rounded-t-lg">
                <column.icon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">{column.name}</span>
              </div>
              
              {/* Column content */}
              <div className="p-3 flex-1 flex flex-col space-y-2">
                {column.types.flatMap(type => {
                  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
                  return servicesByType[type]?.map((service, serviceIndex) => (
                    <div 
                      key={\`\${type}-\${serviceIndex}\`}
                      className="p-2 bg-white rounded border border-gray-200 text-sm"
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-gray-500">{typeName}</div>
                    </div>
                  )) || [];
                })}
                
                {column.types.flatMap(type => servicesByType[type] || []).length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-sm text-gray-500">No services of these types</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Arrows connecting columns */}
        <div className="hidden md:flex justify-center items-center mt-4">
          <div className="flex-1 flex justify-center">
            <Icons.ArrowRight className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <Icons.ArrowRight className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Object.keys(servicesByType).map(type => (
              <div key={type} className="flex items-center">
                <div className={\`w-3 h-3 rounded-full bg-\${
                  type === 'frontend' ? 'blue' :
                  type === 'backend' ? 'green' :
                  type === 'fullstack' ? 'purple' :
                  type === 'dashboard' ? 'indigo' :
                  type === 'wallet' ? 'yellow' :
                  type === 'ecommerce' ? 'pink' :
                  type === 'media' ? 'red' :
                  type === 'database' ? 'gray' :
                  type === 'affiliate' ? 'orange' :
                  'gray'
                }-500 mr-1\`} />
                <span className="text-xs text-gray-600">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowDiagram;
`;
  
  createFile(dataFlowDiagramPath, dataFlowDiagramContent);
}

/**
 * Create the DashboardStats component
 */
function createDashboardStatsComponent() {
  const dashboardStatsPath = path.join(COMPONENTS_DIR, 'DashboardStats.js');
  
  const dashboardStatsContent = `import React from 'react';
import StatCard from './StatCard';

const DashboardStats = ({ stats = {} }) => {
  // Default stats if none provided
  const defaultStats = {
    totalServices: stats.totalServices || 0,
    activeServices: stats.activeServices || 0,
    totalDataFiles: stats.totalDataFiles || 0,
    integrations: stats.integrations || 0,
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Services"
        value={defaultStats.totalServices}
        icon="Server"
        type="primary"
      />
      
      <StatCard
        title="Active Services"
        value={defaultStats.activeServices}
        icon="CheckCircle"
        type="success"
        change={
          defaultStats.totalServices 
            ? \`\${Math.round((defaultStats.activeServices / defaultStats.totalServices) * 100)}%\` 
            : '0%'
        }
      />
      
      <StatCard
        title="Data Files"
        value={defaultStats.totalDataFiles}
        icon="Database"
        type="info"
      />
      
      <StatCard
        title="Integrations"
        value={defaultStats.integrations}
        icon="Link"
        type="gray"
      />
    </div>
  );
};

export default DashboardStats;
`;
  
  createFile(dashboardStatsPath, dashboardStatsContent);
}

/**
 * Create the ChartSection component
 */
function createChartSectionComponent() {
  const chartSectionPath = path.join(COMPONENTS_DIR, 'ChartSection.js');
  
  const chartSectionContent = `import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Generate random data for demonstration
const getRandomData = (count, max) => Array.from({ length: count }, () => Math.floor(Math.random() * max));

const ChartSection = ({ serviceTypes = {} }) => {
  // Convert service types object to arrays for charts
  const labels = Object.keys(serviceTypes).map(type => type.charAt(0).toUpperCase() + type.slice(1));
  const data = Object.values(serviceTypes);
  
  // Bar chart configuration
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Service Count by Type',
        data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // blue
          'rgba(16, 185, 129, 0.6)', // green
          'rgba(139, 92, 246, 0.6)', // purple
          'rgba(79, 70, 229, 0.6)',  // indigo
          'rgba(245, 158, 11, 0.6)', // yellow
          'rgba(236, 72, 153, 0.6)', // pink
          'rgba(239, 68, 68, 0.6)',  // red
          'rgba(107, 114, 128, 0.6)', // gray
          'rgba(249, 115, 22, 0.6)', // orange
          'rgba(20, 184, 166, 0.6)',  // teal
          'rgba(6, 182, 212, 0.6)',   // cyan
          'rgba(16, 185, 129, 0.6)',  // emerald
          'rgba(124, 58, 237, 0.6)',  // violet
          'rgba(244, 63, 94, 0.6)',   // rose
          'rgba(217, 119, 6, 0.6)',   // amber
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(217, 119, 6, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text: 'Service Types Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  // Sample data for line chart (simulating data over time)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Data Files',
        data: getRandomData(7, 200),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'API Calls',
        data: getRandomData(7, 1000),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Line chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'System Activity Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Prepare data for pie chart
  const pieChartData = {
    labels: ['Frontend', 'Backend', 'Fullstack', 'Dashboard', 'Other'],
    datasets: [
      {
        label: 'Distribution',
        data: [
          serviceTypes.frontend || 0,
          serviceTypes.backend || 0,
          serviceTypes.fullstack || 0,
          serviceTypes.dashboard || 0,
          Object.entries(serviceTypes)
            .filter(([key]) => !['frontend', 'backend', 'fullstack', 'dashboard'].includes(key))
            .reduce((sum, [, count]) => sum + count, 0),
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',  // blue
          'rgba(16, 185, 129, 0.6)',  // green
          'rgba(139, 92, 246, 0.6)',  // purple
          'rgba(79, 70, 229, 0.6)',   // indigo
          'rgba(107, 114, 128, 0.6)', // gray
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Service Type Breakdown',
      },
    },
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-4">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
      
      <div className="lg:col-span-3 bg-white rounded-lg shadow border border-gray-200 p-4">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default ChartSection;
`;
  
  createFile(chartSectionPath, chartSectionContent);
}

/**
 * Create the DraggableDashboard component
 */
function createDraggableDashboardComponent() {
  const draggableDashboardPath = path.join(COMPONENTS_DIR, 'DraggableDashboard.js');
  
  const draggableDashboardContent = `import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ServiceCard from './ServiceCard';
import StatCard from './StatCard';
import * as Icons from 'react-feather';

// Dashboard item types
const ItemTypes = {
  CARD: 'card',
  STAT: 'stat',
  CHART: 'chart',
};

/**
 * Draggable Card component
 */
const DraggableCard = ({ item, index, moveCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });
  
  return (
    <div 
      ref={(node) => drag(drop(node))} 
      className={\`${isDragging ? 'opacity-50' : 'opacity-100'} cursor-move\`}
    >
      {item.type === 'service' && <ServiceCard service={item.data} draggable={false} />}
      {item.type === 'stat' && (
        <StatCard
          title={item.data.title}
          value={item.data.value}
          icon={item.data.icon}
          type={item.data.type}
          suffix={item.data.suffix}
          change={item.data.change}
          direction={item.data.direction}
        />
      )}
      {item.type === 'chart' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">{item.data.title}</h3>
          <p className="text-sm text-gray-500">Chart placeholder</p>
          <div className="h-40 flex items-center justify-center bg-gray-50 mt-2 rounded border border-gray-200">
            <Icons.BarChart2 className="h-12 w-12 text-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Main DraggableDashboard component
 */
const DraggableDashboard = ({ services = [] }) => {
  // Initialize with some default cards
  const [cards, setCards] = useState([]);
  
  // Set initial cards when services data changes
  useEffect(() => {
    if (services.length > 0 && cards.length === 0) {
      // Add stat cards
      const initialCards = [
        {
          id: 'total-services',
          type: 'stat',
          data: {
            title: 'Total Services',
            value: services.length,
            icon: 'Server',
            type: 'primary',
          },
        },
        {
          id: 'active-services',
          type: 'stat',
          data: {
            title: 'Active Services',
            value: services.filter(s => s.status === 'online').length,
            icon: 'CheckCircle',
            type: 'success',
            change: \`\${Math.round((services.filter(s => s.status === 'online').length / services.length) * 100)}%\`,
          },
        },
        {
          id: 'data-files',
          type: 'stat',
          data: {
            title: 'Data Files',
            value: services.reduce((sum, service) => sum + (service.dataFiles || 0), 0),
            icon: 'Database',
            type: 'info',
          },
        },
      ];
      
      // Add service cards (max 6)
      const serviceCards = services.slice(0, 6).map(service => ({
        id: \`service-\${service.name}\`,
        type: 'service',
        data: service,
      }));
      
      // Add chart card
      const chartCard = {
        id: 'activity-chart',
        type: 'chart',
        data: {
          title: 'System Activity',
        },
      };
      
      setCards([...initialCards, ...serviceCards, chartCard]);
    }
  }, [services]);
  
  /**
   * Move a card from one position to another
   */
  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Customizable Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop cards to customize your view
            </p>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                // Reset card order to default
                const defaultOrder = [...cards].sort((a, b) => {
                  // Stats first, then services, then charts
                  if (a.type === 'stat' && b.type !== 'stat') return -1;
                  if (a.type !== 'stat' && b.type === 'stat') return 1;
                  if (a.type === 'service' && b.type === 'chart') return -1;
                  if (a.type === 'chart' && b.type === 'service') return 1;
                  return 0;
                });
                setCards(defaultOrder);
              }}
            >
              <Icons.RefreshCw className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Reset Layout
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, index) => (
              <DraggableCard
                key={card.id}
                item={card}
                index={index}
                moveCard={moveCard}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default DraggableDashboard;
`;
  
  createFile(draggableDashboardPath, draggableDashboardContent);
}

/**
 * Create the QuickAccess component
 */
function createQuickAccessComponent() {
  const quickAccessPath = path.join(COMPONENTS_DIR, 'QuickAccess.js');
  
  const quickAccessContent = `import React from 'react';
import Link from 'next/link';
import * as Icons from 'react-feather';

// Define quick access links
const quickLinks = [
  { name: 'Developer Portal', href: 'http://localhost:5000', icon: Icons.Code, external: true },
  { name: 'Integration Hub', href: 'http://localhost:5003', icon: Icons.Share2, external: true },
  { name: 'API Explorer', href: 'http://localhost:5000/api', icon: Icons.Terminal, external: true },
  { name: 'Documentation', href: 'http://localhost:5000/docs', icon: Icons.FileText, external: true },
  { name: 'Analytics', href: '/analytics', icon: Icons.BarChart2 },
  { name: 'Services', href: '/services', icon: Icons.Server },
  { name: 'Departments', href: '/departments', icon: Icons.Grid },
  { name: 'Status', href: '/status', icon: Icons.Activity }
];

const QuickAccess = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Access</h3>
        <p className="mt-1 text-sm text-gray-500">
          Quick links to important EHB system resources
        </p>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {quickLinks.map((link) => (
            <div key={link.name} className="flex flex-col items-center">
              {link.external ? (
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-100">
                    <link.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-700 group-hover:text-blue-700 text-center">
                    {link.name}
                  </span>
                </a>
              ) : (
                <Link 
                  href={link.href}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-100">
                    <link.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-700 group-hover:text-blue-700 text-center">
                    {link.name}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;
`;
  
  createFile(quickAccessPath, quickAccessContent);
}

/**
 * Create the data hooks
 */
function createDataHooks() {
  const useServicesPath = path.join(HOOKS_DIR, 'useServices.js');
  
  const useServicesContent = `import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook to fetch services data
 * @param {Object} options - Options for the hook
 * @param {boolean} options.includeStats - Whether to include statistics
 * @returns {Object} Services data and stats
 */
export default function useServices({ includeStats = false } = {}) {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({});
  const [serviceTypes, setServiceTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Try to fetch from EHB-HOME data first
        const serviceInfoPath = '/EHB-HOME/data/service_info.json';
        const response = await axios.get(serviceInfoPath);
        const servicesData = response.data;
        setServices(servicesData);
        
        if (includeStats) {
          // Calculate statistics
          const activeServices = servicesData.filter(service => service.status !== 'offline').length;
          const totalDataFiles = servicesData.reduce((sum, service) => sum + (service.dataFiles || 0), 0);
          
          // Count service types
          const types = servicesData.reduce((acc, service) => {
            const type = service.type || 'default';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});
          
          setServiceTypes(types);
          
          // Set stats
          setStats({
            totalServices: servicesData.length,
            activeServices,
            totalDataFiles,
            integrations: Object.keys(types).length,
          });
        }
      } catch (error) {
        console.error('Error loading services data:', error);
        setError(error);
        
        // Fallback to static data
        const fallbackServices = [
          {
            name: 'EHB-HOME',
            type: 'frontend',
            description: 'Central dashboard for all EHB modules and services',
            url: 'http://localhost:5005',
            status: 'online',
            dataFiles: 12
          },
          {
            name: 'EHB-AI-Dev-Fullstack',
            type: 'fullstack',
            description: 'Central integration hub for AI development services',
            url: 'http://localhost:5003',
            status: 'online',
            dataFiles: 24
          },
          {
            name: 'EHB-Developer-Portal',
            type: 'frontend',
            description: 'Documentation and resources for developers',
            url: 'http://localhost:5000',
            status: 'online',
            dataFiles: 8
          }
        ];
        
        setServices(fallbackServices);
        
        if (includeStats) {
          // Calculate statistics for fallback data
          const types = fallbackServices.reduce((acc, service) => {
            const type = service.type || 'default';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});
          
          setServiceTypes(types);
          
          // Set stats
          setStats({
            totalServices: fallbackServices.length,
            activeServices: fallbackServices.filter(service => service.status !== 'offline').length,
            totalDataFiles: fallbackServices.reduce((sum, service) => sum + (service.dataFiles || 0), 0),
            integrations: Object.keys(types).length,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [includeStats]);
  
  return { services, stats, serviceTypes, loading, error };
}
`;
  
  createFile(useServicesPath, useServicesContent);
}

/**
 * Create the main index page
 */
function createIndexPage() {
  const indexPath = path.join(PAGES_DIR, 'index.js');
  
  const indexContent = `import React from 'react';
import Layout from '../components/Layout';
import DashboardStats from '../components/DashboardStats';
import DraggableDashboard from '../components/DraggableDashboard';
import DataFlowDiagram from '../components/DataFlowDiagram';
import ServiceGrid from '../components/ServiceGrid';
import QuickAccess from '../components/QuickAccess';
import useServices from '../hooks/useServices';

export default function Home() {
  const { services, stats, serviceTypes, loading } = useServices({ includeStats: true });
  
  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Section */}
        <DashboardStats stats={stats} />
        
        {/* Featured Services Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Featured Services</h2>
            <p className="mt-1 text-sm text-gray-500">
              Key services from the EHB ecosystem
            </p>
          </div>
          <div className="p-5">
            <ServiceGrid />
          </div>
        </div>
        
        {/* Quick Access Section */}
        <QuickAccess />
        
        {/* Data Flow Diagram */}
        <DataFlowDiagram services={services} />
        
        {/* Draggable Dashboard */}
        <DraggableDashboard services={services} />
      </div>
    </Layout>
  );
}
`;
  
  createFile(indexPath, indexContent);
}

/**
 * Create the services page
 */
function createServicesPage() {
  const servicesPath = path.join(PAGES_DIR, 'services.js');
  
  const servicesContent = `import React from 'react';
import Layout from '../components/Layout';
import ServiceGrid from '../components/ServiceGrid';
import ChartSection from '../components/ChartSection';
import useServices from '../hooks/useServices';

export default function Services() {
  const { serviceTypes, loading } = useServices({ includeStats: true });
  
  return (
    <Layout title="Services">
      <div className="space-y-6">
        {/* Services Grid */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Services</h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse all available services in the EHB ecosystem
            </p>
          </div>
          <div className="p-5">
            <ServiceGrid />
          </div>
        </div>
        
        {/* Services Analysis Charts */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Analytics</h2>
            <p className="mt-1 text-sm text-gray-500">
              Visual breakdown of service types and distribution
            </p>
          </div>
          <div className="p-5">
            <ChartSection serviceTypes={serviceTypes} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
`;
  
  createFile(servicesPath, servicesContent);
}

/**
 * Create the departments page
 */
function createDepartmentsPage() {
  const departmentsPath = path.join(PAGES_DIR, 'departments.js');
  
  const departmentsContent = `import React from 'react';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import * as Icons from 'react-feather';

// Define departments
const departments = [
  {
    name: 'AI Development',
    description: 'Advanced AI services and development tools',
    icon: Icons.Cpu,
    services: [
      {
        name: 'EHB-AI-Dev-Fullstack',
        type: 'fullstack',
        description: 'Central integration hub for AI development services',
        url: 'http://localhost:5003',
        status: 'online',
        dataFiles: 24
      },
      {
        name: 'EHB-AI-Marketplace',
        type: 'frontend',
        description: 'Marketplace for AI models and services',
        url: '#',
        status: 'online',
        dataFiles: 0
      }
    ]
  },
  {
    name: 'Finance',
    description: 'Financial services and payment processing',
    icon: Icons.DollarSign,
    services: [
      {
        name: 'EHB-TrustyWallet-System',
        type: 'wallet',
        description: 'Secure wallet and payment system',
        url: '#',
        status: 'online',
        dataFiles: 5
      },
      {
        name: 'EHB-Blockchain',
        type: 'blockchain',
        description: 'Blockchain integration and smart contracts',
        url: '#',
        status: 'online',
        dataFiles: 3
      }
    ]
  },
  {
    name: 'E-Commerce',
    description: 'Online shopping and marketplace services',
    icon: Icons.ShoppingCart,
    services: [
      {
        name: 'GoSellr-Ecommerce',
        type: 'ecommerce',
        description: 'E-commerce platform for online stores',
        url: '#',
        status: 'online',
        dataFiles: 8
      },
      {
        name: 'EHB-Affiliate-System',
        type: 'affiliate',
        description: 'Affiliate marketing and referral system',
        url: '#',
        status: 'online',
        dataFiles: 6
      }
    ]
  },
  {
    name: 'Healthcare',
    description: 'Medical services and healthcare solutions',
    icon: Icons.Activity,
    services: [
      {
        name: 'WMS-World-Medical-Service',
        type: 'service',
        description: 'Global medical services platform',
        url: '#',
        status: 'online',
        dataFiles: 10
      }
    ]
  },
  {
    name: 'Education',
    description: 'Educational services and learning platforms',
    icon: Icons.BookOpen,
    services: [
      {
        name: 'HPS-Education-Service',
        type: 'service',
        description: 'Educational services and courses',
        url: '#',
        status: 'online',
        dataFiles: 7
      }
    ]
  },
  {
    name: 'Legal',
    description: 'Legal services and consultation',
    icon: Icons.Shield,
    services: [
      {
        name: 'OLS-Online-Law-Service',
        type: 'service',
        description: 'Online legal services and consultation',
        url: '#',
        status: 'online',
        dataFiles: 4
      }
    ]
  },
  {
    name: 'Employment',
    description: 'Job services and career opportunities',
    icon: Icons.Briefcase,
    services: [
      {
        name: 'JPS-Job-Providing-Service',
        type: 'service',
        description: 'Job matching and career services',
        url: '#',
        status: 'online',
        dataFiles: 9
      }
    ]
  },
  {
    name: 'Media',
    description: 'Media streaming and content services',
    icon: Icons.Film,
    services: [
      {
        name: 'EHB-Tube',
        type: 'media',
        description: 'Video streaming and media services',
        url: '#',
        status: 'online',
        dataFiles: 3
      }
    ]
  }
];

export default function Departments() {
  return (
    <Layout title="Departments">
      <div className="space-y-8">
        {departments.map((department, index) => (
          <div 
            key={department.name}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="rounded-md bg-gray-100 p-2 mr-3">
                  <department.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{department.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {department.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {department.services.map((service) => (
                  <ServiceCard key={service.name} service={service} />
                ))}
              </div>
              
              {department.services.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services in this department yet.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
`;
  
  createFile(departmentsPath, departmentsContent);
}

/**
 * Create the status page
 */
function createStatusPage() {
  const statusPath = path.join(PAGES_DIR, 'status.js');
  
  const statusContent = `import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import * as Icons from 'react-feather';
import useServices from '../hooks/useServices';

export default function Status() {
  const { services, loading } = useServices();
  const [refreshing, setRefreshing] = useState(false);
  
  // Refresh status data
  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <Layout title="System Status">
      <div className="space-y-6">
        {/* Overall System Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">System Status</h2>
              <p className="mt-1 text-sm text-gray-500">
                Current operational status of all EHB services
              </p>
            </div>
            <div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={refreshData}
                disabled={refreshing}
              >
                <Icons.RefreshCw className={\`-ml-0.5 mr-2 h-4 w-4 \${refreshing ? 'animate-spin' : ''}\`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="px-4 py-5">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <Icons.Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">All Systems Operational</h3>
                  <div className="mt-1 text-sm text-green-700">
                    All services are functioning normally
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-green-700">
                  Last checked: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Status Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Status</h2>
            <p className="mt-1 text-sm text-gray-500">
              Detailed status of individual services
            </p>
          </div>
          
          <div className="p-5">
            {loading || refreshing ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{service.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={service.status || 'operational'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={service.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-900"
                        >
                          {service.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date().toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
`;
  
  createFile(statusPath, statusContent);
}

/**
 * Create the data flow page
 */
function createDataFlowPage() {
  const dataFlowPath = path.join(PAGES_DIR, 'data-flow.js');
  
  const dataFlowContent = `import React, { useState } from 'react';
import Layout from '../components/Layout';
import DataFlowDiagram from '../components/DataFlowDiagram';
import useServices from '../hooks/useServices';
import * as Icons from 'react-feather';

export default function DataFlow() {
  const { services, loading } = useServices();
  const [selectedService, setSelectedService] = useState(null);
  
  // Get data file counts by type
  const getDataFileCounts = () => {
    const counts = {};
    
    services.forEach(service => {
      if (service.dataStats) {
        Object.entries(service.dataStats).forEach(([type, count]) => {
          counts[type] = (counts[type] || 0) + count;
        });
      }
    });
    
    return counts;
  };
  
  const dataFileCounts = getDataFileCounts();
  
  // Service details modal
  const ServiceDetailsModal = ({ service, onClose }) => {
    if (!service) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Overview</h4>
              <p className="mt-1 text-sm text-gray-500">{service.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Type</h4>
              <p className="mt-1 text-sm text-gray-500">{service.type}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">URL</h4>
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-1 text-sm text-primary-600 hover:text-primary-900"
              >
                {service.url}
              </a>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Data Files</h4>
              <div className="mt-1">
                {service.dataStats ? (
                  <ul className="list-disc pl-5 text-sm text-gray-500">
                    {Object.entries(service.dataStats).map(([type, count]) => (
                      <li key={type}>{type}: {count} files</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Total files: {service.dataFiles || 0}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Layout title="Data Flow">
      <div className="space-y-6">
        {/* Data Flow Diagram */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Data Flow Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              How data flows between different services in the EHB system
            </p>
          </div>
          
          <div className="p-5">
            <DataFlowDiagram services={services} />
          </div>
        </div>
        
        {/* Data Types and Stats */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Data Types</h2>
            <p className="mt-1 text-sm text-gray-500">
              Types of data stored across services
            </p>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(dataFileCounts).map(([type, count]) => (
                <div 
                  key={type}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center">
                    <div className="rounded-md bg-gray-100 p-2 mr-3">
                      {type === 'company_info' && <Icons.Briefcase className="h-5 w-5 text-blue-500" />}
                      {type === 'user_data' && <Icons.User className="h-5 w-5 text-green-500" />}
                      {type === 'analytics' && <Icons.PieChart className="h-5 w-5 text-purple-500" />}
                      {type === 'transactions' && <Icons.DollarSign className="h-5 w-5 text-yellow-500" />}
                      {type === 'media' && <Icons.Image className="h-5 w-5 text-red-500" />}
                      {type === 'documents' && <Icons.File className="h-5 w-5 text-gray-500" />}
                      {!['company_info', 'user_data', 'analytics', 'transactions', 'media', 'documents'].includes(type) && 
                        <Icons.FileText className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h3>
                      <p className="text-sm text-gray-500">{count} files</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Service Data Details */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Data Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Details of data stored in each service
            </p>
          </div>
          
          <div className="p-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Files
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{service.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{service.dataFiles || 0} files</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </Layout>
  );
}
`;
  
  createFile(dataFlowPath, dataFlowContent);
}

/**
 * Create the _app.js file
 */
function createAppJs() {
  const appJsPath = path.join(PAGES_DIR, '_app.js');
  
  const appJsContent = `import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`;
  
  createFile(appJsPath, appJsContent);
}

/**
 * Install dependencies
 */
function installDependencies() {
  log('Installing dependencies...', 'info');
  
  const installCommand = `cd ${EHB_HOME_DIR} && npm install`;
  
  exec(installCommand, (error, stdout, stderr) => {
    if (error) {
      log(`Error installing dependencies: ${error.message}`, 'error');
      return;
    }
    
    log('Dependencies installed successfully', 'success');
    log('Starting development server...', 'info');
    
    // Start the development server
    const startCommand = `cd ${EHB_HOME_DIR} && npm run dev`;
    
    exec(startCommand, (error, stdout, stderr) => {
      if (error) {
        log(`Error starting development server: ${error.message}`, 'error');
        return;
      }
      
      log('Development server started successfully', 'success');
      log('EHB-HOME Dashboard is now available at http://localhost:5005', 'success');
    });
  });
}

/**
 * Main function
 */
function main() {
  try {
    log('Creating EHB-HOME Dashboard...', 'info');
    
    // Create necessary directories
    createDirIfNotExists(EHB_HOME_DIR);
    createDirIfNotExists(COMPONENTS_DIR);
    createDirIfNotExists(PAGES_DIR);
    createDirIfNotExists(STYLES_DIR);
    createDirIfNotExists(PUBLIC_DIR);
    createDirIfNotExists(UTILS_DIR);
    createDirIfNotExists(HOOKS_DIR);
    createDirIfNotExists(DATA_DIR);
    
    // Create configuration files
    createPackageJson();
    createNextConfig();
    createTailwindConfig();
    createPostcssConfig();
    createGlobalStyles();
    
    // Create components
    createLayoutComponent();
    createServiceCardComponent();
    createServiceGridComponent();
    createStatCardComponent();
    createStatusBadgeComponent();
    createDataFlowDiagramComponent();
    createDashboardStatsComponent();
    createChartSectionComponent();
    createDraggableDashboardComponent();
    createQuickAccessComponent();
    
    // Create hooks
    createDataHooks();
    
    // Create pages
    createIndexPage();
    createServicesPage();
    createDepartmentsPage();
    createStatusPage();
    createDataFlowPage();
    createAppJs();
    
    // Install dependencies
    installDependencies();
    
    log('EHB-HOME Dashboard created successfully!', 'success');
  } catch (error) {
    log(`Error creating EHB-HOME Dashboard: ${error.message}`, 'error');
  }
}

// Run the main function
main();