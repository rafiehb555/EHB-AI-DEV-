/**
 * Fix Common EHB System Errors
 * 
 * This script automatically fixes common errors in the EHB system,
 * including 404 errors and connection issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');

// Constants
const LOG_FILE = 'ehb_fix_common_errors.log';
const ROOT_DIR = process.cwd();

// Logger
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    console.log(logMessage);
    
    try {
        fs.appendFileSync(path.join(ROOT_DIR, LOG_FILE), logMessage + '\n');
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
    }
}

// Fix 404 errors in Backend Server
function fixBackendRoutes() {
    log('Fixing Backend Server route issues...');
    
    // Create missing route files if they don't exist
    const routesDir = path.join(ROOT_DIR, 'EHB-DASHBOARD', 'backend', 'routes');
    
    if (!fs.existsSync(routesDir)) {
        log('Creating routes directory...', 'FIX');
        fs.mkdirSync(routesDir, { recursive: true });
    }
    
    // Fix health endpoint
    const serverJsPath = path.join(ROOT_DIR, 'EHB-DASHBOARD', 'backend', 'server.js');
    
    if (fs.existsSync(serverJsPath)) {
        let serverContent = fs.readFileSync(serverJsPath, 'utf8');
        
        // Check if health endpoint is correctly defined
        if (serverContent.includes('app.get(\'/api/health\'')) {
            log('Health endpoint is correctly defined in server.js');
        } else if (serverContent.includes('app.get(\'/health\'')) {
            log('Fixing health endpoint URL...', 'FIX');
            serverContent = serverContent.replace(
                'app.get(\'/health\'',
                'app.get(\'/api/health\''
            );
            fs.writeFileSync(serverJsPath, serverContent);
            log('Health endpoint URL fixed in server.js');
        } else {
            // Add health endpoint if missing completely
            log('Adding missing health endpoint...', 'FIX');
            
            const healthEndpoint = `
// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});
`;
            
            // Insert after middleware but before routes
            if (serverContent.includes('// Apply Middleware')) {
                const parts = serverContent.split('// Apply Middleware');
                const middlewareParts = parts[1].split('// Setup API Routes');
                
                serverContent = parts[0] + 
                                '// Apply Middleware' + 
                                middlewareParts[0] + 
                                healthEndpoint + 
                                '// Setup API Routes' + 
                                middlewareParts[1];
            } else {
                // Just add before the first route
                serverContent = serverContent.replace(
                    'app.listen(',
                    healthEndpoint + 'app.listen('
                );
            }
            
            fs.writeFileSync(serverJsPath, serverContent);
            log('Health endpoint added to server.js');
        }
    }
}

// Fix connection issues to frontend
function fixFrontendConnection() {
    log('Fixing Frontend connection issues...');
    
    // Check if frontend directory exists
    const frontendDir = path.join(ROOT_DIR, 'EHB-DASHBOARD', 'frontend');
    
    if (!fs.existsSync(frontendDir)) {
        log('Creating frontend directory...', 'FIX');
        fs.mkdirSync(frontendDir, { recursive: true });
    }
    
    // Create package.json if it doesn't exist
    const packageJsonPath = path.join(frontendDir, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        log('Creating frontend package.json...', 'FIX');
        
        const packageJsonContent = {
            "name": "ehb-dashboard-frontend",
            "version": "1.0.0",
            "private": true,
            "scripts": {
                "dev": "next dev -p 5006",
                "build": "next build",
                "start": "next start",
                "lint": "next lint"
            },
            "dependencies": {
                "next": "^14.1.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "axios": "^1.6.5",
                "tailwindcss": "^3.4.1"
            }
        };
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
        log('Frontend package.json created');
    }
    
    // Create next.config.js if it doesn't exist
    const nextConfigPath = path.join(frontendDir, 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
        log('Creating frontend next.config.js...', 'FIX');
        
        const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  port: 5006,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
`;
        
        fs.writeFileSync(nextConfigPath, nextConfigContent);
        log('Frontend next.config.js created');
    }
    
    // Create pages directory and placeholder
    const pagesDir = path.join(frontendDir, 'pages');
    
    if (!fs.existsSync(pagesDir)) {
        log('Creating frontend pages directory...', 'FIX');
        fs.mkdirSync(pagesDir, { recursive: true });
        
        // Create index.js
        const indexPath = path.join(pagesDir, 'index.js');
        
        const indexContent = `import { useState, useEffect } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiError, setApiError] = useState(null);
  
  useEffect(() => {
    async function checkBackendStatus() {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.status === 'success') {
          setApiStatus('Connected');
          setApiError(null);
        } else {
          setApiStatus('Error');
          setApiError('Unexpected response: ' + JSON.stringify(data));
        }
      } catch (err) {
        setApiStatus('Error');
        setApiError(err.message);
      }
    }
    
    checkBackendStatus();
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">EHB Dashboard</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">System Status</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Backend API</span>
              <span className={apiStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}>
                {apiStatus}
              </span>
            </div>
            {apiError && (
              <div className="text-sm text-red-500 mt-1">{apiError}</div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          EHB System Dashboard - {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
`;
        
        fs.writeFileSync(indexPath, indexContent);
        log('Frontend index.js created');
        
        // Create _app.js
        const appPath = path.join(pagesDir, '_app.js');
        
        const appContent = `import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`;
        
        fs.writeFileSync(appPath, appContent);
        log('Frontend _app.js created');
    }
    
    // Create styles directory and globals.css
    const stylesDir = path.join(frontendDir, 'styles');
    
    if (!fs.existsSync(stylesDir)) {
        log('Creating frontend styles directory...', 'FIX');
        fs.mkdirSync(stylesDir, { recursive: true });
        
        // Create globals.css
        const globalsPath = path.join(stylesDir, 'globals.css');
        
        const globalsContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 246, 248, 250;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
`;
        
        fs.writeFileSync(globalsPath, globalsContent);
        log('Frontend globals.css created');
    }
    
    // Create tailwind.config.js
    const tailwindConfigPath = path.join(frontendDir, 'tailwind.config.js');
    
    if (!fs.existsSync(tailwindConfigPath)) {
        log('Creating frontend tailwind.config.js...', 'FIX');
        
        const tailwindContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
        
        fs.writeFileSync(tailwindConfigPath, tailwindContent);
        log('Frontend tailwind.config.js created');
    }
    
    // Create postcss.config.js
    const postcssConfigPath = path.join(frontendDir, 'postcss.config.js');
    
    if (!fs.existsSync(postcssConfigPath)) {
        log('Creating frontend postcss.config.js...', 'FIX');
        
        const postcssContent = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
        
        fs.writeFileSync(postcssConfigPath, postcssContent);
        log('Frontend postcss.config.js created');
    }
}

// Fix mongoose warnings
function fixMongooseWarnings() {
    log('Fixing Mongoose warning issues...');
    
    // Check for User model files that might have duplicate index definitions
    const userModelPath = path.join(ROOT_DIR, 'EHB-DASHBOARD', 'backend', 'models', 'User.js');
    
    if (fs.existsSync(userModelPath)) {
        let modelContent = fs.readFileSync(userModelPath, 'utf8');
        
        // Check for duplicate index definitions
        const hasExplicitIndexes = modelContent.includes('.index(');
        const hasIndexInSchema = (
            modelContent.includes('username: { type: String, required: true, unique: true, index: true }') ||
            modelContent.includes('email: { type: String, required: true, unique: true, index: true }')
        );
        
        if (hasExplicitIndexes && hasIndexInSchema) {
            log('Fixing duplicate Mongoose index definitions...', 'FIX');
            
            // Remove index: true from the schema
            modelContent = modelContent.replace(
                /username:.*unique: true, index: true.*}/,
                'username: { type: String, required: true, unique: true }'
            );
            
            modelContent = modelContent.replace(
                /email:.*unique: true, index: true.*}/,
                'email: { type: String, required: true, unique: true }'
            );
            
            fs.writeFileSync(userModelPath, modelContent);
            log('Removed duplicate index definitions in User model');
        }
    }
}

// Main function
function main() {
    log('Starting common error fixes...');
    
    try {
        // Fix backend routes and 404 issues
        fixBackendRoutes();
        
        // Fix frontend connection issues
        fixFrontendConnection();
        
        // Fix mongoose warnings
        fixMongooseWarnings();
        
        log('All common errors fixed successfully!');
    } catch (err) {
        log(`Error during fix process: ${err.message}`, 'ERROR');
        log(err.stack, 'ERROR');
    }
}

// Run the main function
main();