/**
 * Check Missing Components
 * 
 * This script checks for missing components, folders, and files in the Developer Portal
 * and creates them automatically if needed.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

// Required component directories
const REQUIRED_DIRS = [
  'components',
  'components/ai',
  'components/dashboard',
  'components/layout',
  'components/common',
  'pages',
  'context',
  'public',
  'scripts',
  'styles',
];

// Required component files
const REQUIRED_FILES = [
  {
    path: 'context/SiteConfigContext.jsx',
    content: `import React, { createContext, useContext } from 'react';

const SiteConfigContext = createContext(null);

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider = ({ children }) => {
  // Default site configuration
  const config = {
    title: 'EHB Developer Portal',
    description: 'Centralized dashboard for EHB development',
    version: '1.0.0',
    apiEndpoint: '/api',
    features: {
      contextualHelp: true,
      aiAssistant: true,
      analytics: true,
    },
  };
  
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};
`
  },
  {
    path: 'pages/_app.js',
    content: `import React from 'react';
import Head from 'next/head';
import { SiteConfigProvider } from '../context/SiteConfigContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function ErrorFallback({ error }) {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      backgroundColor: '#fff3f3', 
      borderRadius: '4px',
      border: '1px solid #ff8080'
    }}>
      <h2 style={{ color: '#d32f2f' }}>Something went wrong</h2>
      <pre style={{ 
        padding: '10px', 
        backgroundColor: '#f8f8f8', 
        borderRadius: '4px',
        overflow: 'auto' 
      }}>
        {error.message}
      </pre>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SiteConfigProvider>
          <Component {...pageProps} />
        </SiteConfigProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
`
  },
  {
    path: 'components/common/ErrorBoundary.jsx',
    content: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.FallbackComponent 
        ? <this.props.FallbackComponent error={this.state.error} /> 
        : <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
`
  }
];

// Log messages
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Check if directory exists and create it if not
async function ensureDirectory(dirPath) {
  const fullPath = path.join(__dirname, '..', dirPath);
  
  try {
    await stat(fullPath);
    return true; // Directory exists
  } catch (error) {
    if (error.code === 'ENOENT') {
      log(`Creating missing directory: ${dirPath}`);
      await mkdir(fullPath, { recursive: true });
      return true;
    } else {
      log(`Error checking directory ${dirPath}: ${error.message}`);
      return false;
    }
  }
}

// Check if file exists and create it if not
async function ensureFile(filePath, content) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  try {
    await stat(fullPath);
    return true; // File exists
  } catch (error) {
    if (error.code === 'ENOENT') {
      log(`Creating missing file: ${filePath}`);
      
      // Ensure the directory exists first
      const dirPath = path.dirname(fullPath);
      await mkdir(dirPath, { recursive: true });
      
      await writeFile(fullPath, content);
      return true;
    } else {
      log(`Error checking file ${filePath}: ${error.message}`);
      return false;
    }
  }
}

// Check for missing components
async function checkMissingComponents() {
  log('Starting missing components check...');
  
  // Check for required directories
  for (const dir of REQUIRED_DIRS) {
    await ensureDirectory(dir);
  }
  
  // Check for required files
  for (const file of REQUIRED_FILES) {
    await ensureFile(file.path, file.content);
  }
  
  log('Missing components check completed');
}

// Run the script
checkMissingComponents()
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error('Error:', error);
  });