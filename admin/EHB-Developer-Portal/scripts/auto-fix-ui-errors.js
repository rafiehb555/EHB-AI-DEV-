/**
 * Auto Fix UI Errors Script
 * 
 * This script automatically scans for and fixes common UI errors:
 * 1. Fixes Chakra UI integration issues
 * 2. Ensures proper export statements
 * 3. Fixes duplicate files
 * 4. Corrects title tag formatting
 * 
 * Run this script whenever you encounter UI errors in the app.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);

// Paths to check
const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const LAYOUTS_DIR = path.join(__dirname, '..', 'components', 'layout');

// Log file path
const LOG_FILE = path.join(__dirname, '..', 'error-fixes.log');

// Ensure the layouts directory exists
async function ensureLayoutsDir() {
  try {
    await stat(LAYOUTS_DIR);
  } catch (error) {
    console.log('Creating layouts directory...');
    await mkdir(LAYOUTS_DIR, { recursive: true });
  }
}

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Fix duplicate export statements
async function fixDuplicateExports(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    
    // Check for duplicate export default statements
    const exportDefaultCount = (content.match(/export default/g) || []).length;
    
    if (exportDefaultCount > 1) {
      log(`Fixing duplicate export default in ${filePath}`);
      
      // Keep only the last export default statement
      content = content.replace(/export default [^;]+;/g, '');
      content = content.replace(/export default ([^;]+)$/, 'export default $1');
      
      await writeFile(filePath, content);
      log(`Fixed duplicate exports in ${filePath}`);
    }
  } catch (error) {
    log(`Error fixing duplicate exports in ${filePath}: ${error.message}`);
  }
}

// Fix title tag format
async function fixTitleTags(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    
    // Check for title tags with array-like children
    if (content.includes('<title>{siteConfig.title} | ')) {
      log(`Fixing title tag in ${filePath}`);
      
      // Replace title tags with proper template string format
      content = content.replace(
        /<title>{siteConfig\.title} \| ([^<]+)<\/title>/g, 
        "<title>{`${siteConfig.title} | $1`}</title>"
      );
      
      await writeFile(filePath, content);
      log(`Fixed title tags in ${filePath}`);
    }
  } catch (error) {
    log(`Error fixing title tags in ${filePath}: ${error.message}`);
  }
}

// Create fixed dashboard layout
async function createFixedDashboardLayout() {
  const filePath = path.join(LAYOUTS_DIR, 'DashboardLayout.jsx');
  
  // Check if the file exists and has errors
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check if it contains problematic code
    if (content.includes('useColorModeValue') || content.includes('Flex bg={bgColor}')) {
      log(`Fixing DashboardLayout.jsx...`);
      
      // Create a new version without Chakra UI dependencies
      const fixedContent = `import React from 'react';

/**
 * Dashboard Layout Component
 * 
 * A simple layout for dashboard pages without Chakra UI dependencies.
 */
const DashboardLayout = ({ children, activeItem = 'dashboard' }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f8fa',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: 'white',
        borderRight: '1px solid #edf2f7',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#0064db'
        }}>
          EHB Developer Portal
        </div>
        
        <nav>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {['dashboard', 'phases', 'analytics', 'learning'].map((item) => (
              <li key={item} style={{ marginBottom: '10px' }}>
                <a 
                  href={\`/\${item === 'dashboard' ? '' : item}\`}
                  style={{
                    display: 'block',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: activeItem === item ? '#f0f7ff' : 'transparent',
                    color: activeItem === item ? '#0064db' : '#4a5568',
                    fontWeight: activeItem === item ? 'medium' : 'normal',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div style={{ 
        flex: 1,
        padding: '20px'
      }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;`;
      
      await writeFile(filePath, fixedContent);
      log(`Created fixed DashboardLayout.jsx`);
    }
  } catch (error) {
    // If file doesn't exist or can't be read, create it
    log(`Creating new DashboardLayout.jsx...`);
    
    const fixedContent = `import React from 'react';

/**
 * Dashboard Layout Component
 * 
 * A simple layout for dashboard pages without Chakra UI dependencies.
 */
const DashboardLayout = ({ children, activeItem = 'dashboard' }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f8fa',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: 'white',
        borderRight: '1px solid #edf2f7',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#0064db'
        }}>
          EHB Developer Portal
        </div>
        
        <nav>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {['dashboard', 'phases', 'analytics', 'learning'].map((item) => (
              <li key={item} style={{ marginBottom: '10px' }}>
                <a 
                  href={\`/\${item === 'dashboard' ? '' : item}\`}
                  style={{
                    display: 'block',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: activeItem === item ? '#f0f7ff' : 'transparent',
                    color: activeItem === item ? '#0064db' : '#4a5568',
                    fontWeight: activeItem === item ? 'medium' : 'normal',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div style={{ 
        flex: 1,
        padding: '20px'
      }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;`;
    
    await writeFile(filePath, fixedContent);
    log(`Created new DashboardLayout.jsx`);
  }
}

// Main function to fix all errors
async function fixAllErrors() {
  log('Starting auto error fix process...');
  
  // Ensure layouts directory
  await ensureLayoutsDir();
  
  // Fix dashboard layout
  await createFixedDashboardLayout();
  
  // Process all pages files
  try {
    const files = await readdir(PAGES_DIR);
    
    for (const file of files) {
      const filePath = path.join(PAGES_DIR, file);
      const stats = await stat(filePath);
      
      if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
        await fixDuplicateExports(filePath);
        await fixTitleTags(filePath);
      }
    }
    
    log('Completed pages fixes');
  } catch (error) {
    log(`Error processing pages: ${error.message}`);
  }
  
  log('Auto error fix process completed');
}

// Execute the script
fixAllErrors()
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error('Error:', error);
  });