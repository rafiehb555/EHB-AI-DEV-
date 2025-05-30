/**
 * EHB React DOM Render Fix
 * 
 * This script specifically targets React 18 compatibility issues:
 * 1. Updates from render() to createRoot().render() for React 18
 * 2. Fixes import statements to use createRoot from react-dom/client
 * 3. Updates event handler patterns to comply with React 18 requirements
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Directories to scan
const SCAN_DIRS = [
  'admin',
  'services',
  'system',
  'ai-services'
];

// File extensions to scan
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Log utility
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Find all React files in a directory recursively
async function findFiles(dir) {
  let results = [];
  
  // Check if directory exists
  try {
    await stat(dir);
  } catch (err) {
    // Skip if directory doesn't exist
    return results;
  }
  
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip node_modules and .git folders
      if (item.name === 'node_modules' || item.name === '.git' || item.name === '.next') {
        continue;
      }
      
      const subDirFiles = await findFiles(itemPath);
      results = [...results, ...subDirFiles];
    } else if (EXTENSIONS.includes(path.extname(item.name))) {
      results.push(itemPath);
    }
  }
  
  return results;
}

// Check if a file contains React DOM render code
async function hasReactDOMRender(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return (
      content.includes('import React') && 
      (content.includes('import ReactDOM') || 
       content.includes('import { render }') ||
       content.includes('ReactDOM.render') ||
       content.includes('render(') ||
       content.includes('from "react-dom"') || 
       content.includes("from 'react-dom'"))
    );
  } catch (error) {
    return false;
  }
}

// Fix React DOM render code for React 18 compatibility
function fixReactDOMRenderForReact18(content) {
  let fixed = false;
  let newContent = content;
  
  // Fix ReactDOM imports - replace with createRoot
  if (content.includes('import ReactDOM from "react-dom"') || 
      content.includes("import ReactDOM from 'react-dom'")) {
    newContent = newContent.replace(
      /import\s+ReactDOM\s+from\s+['"]react-dom['"]/g,
      "import { createRoot } from 'react-dom/client'"
    );
    fixed = true;
  }
  
  // Fix render imports from react-dom
  if (content.includes('import { render } from "react-dom"') || 
      content.includes("import { render } from 'react-dom'")) {
    newContent = newContent.replace(
      /import\s*{\s*render\s*}\s*from\s*['"]react-dom['"]/g,
      "import { createRoot } from 'react-dom/client'"
    );
    fixed = true;
  }
  
  // Fix ReactDOM.render calls to use createRoot
  if (content.includes('ReactDOM.render(')) {
    // Match ReactDOM.render(<Component />, document.getElementById('root')) pattern
    const reactDOMRenderRegex = /ReactDOM\.render\(\s*(<[\s\S]+?\/?>)\s*,\s*document\.getElementById\(['"]([\w-]+)['"]\)\s*\)/g;
    let match;
    
    while ((match = reactDOMRenderRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const component = match[1];
      const elementId = match[2];
      
      // Replace with createRoot
      const replacement = `createRoot(document.getElementById('${elementId}')).render(${component})`;
      newContent = newContent.substring(0, match.index) + 
                  replacement + 
                  newContent.substring(match.index + fullMatch.length);
      
      fixed = true;
      // Update regex lastIndex due to replacement
      reactDOMRenderRegex.lastIndex += replacement.length - fullMatch.length;
    }
  }
  
  // Fix render() calls to use createRoot
  const renderCallRegex = /render\(\s*(<[^>]+>|[A-Za-z0-9_$]+)\s*,\s*document\.getElementById\(['"]([\w-]+)['"]\)\s*\)/g;
  let match;
  
  while ((match = renderCallRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const component = match[1];
    const elementId = match[2];
    
    // Replace with createRoot
    const replacement = `createRoot(document.getElementById('${elementId}')).render(${component})`;
    newContent = newContent.substring(0, match.index) + 
                replacement + 
                newContent.substring(match.index + fullMatch.length);
    
    fixed = true;
    // Update regex lastIndex due to replacement
    renderCallRegex.lastIndex += replacement.length - fullMatch.length;
  }
  
  return { content: newContent, fixed };
}

// Scan and fix a single file
async function scanAndFixFile(filePath) {
  try {
    // Check if it contains React DOM render code
    if (!(await hasReactDOMRender(filePath))) {
      return false;
    }
    
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let wasFixed = false;
    
    // Run the fix for React 18 compatibility
    const { content: contentAfterFix, fixed } = fixReactDOMRenderForReact18(newContent);
    newContent = contentAfterFix;
    wasFixed = wasFixed || fixed;
    
    // Write changes if fixes were made
    if (wasFixed) {
      await writeFile(filePath, newContent, 'utf8');
      log(`✅ Updated React DOM render in ${filePath} for React 18 compatibility`, 'green');
    }
    
    return wasFixed;
  } catch (error) {
    log(`❌ Error processing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Main function to scan all directories
async function scanAndFixReactDOMRender() {
  log('🔍 Starting EHB React DOM Render Fix for React 18...', 'cyan');
  let totalFixed = 0;
  let totalScanned = 0;
  
  for (const dir of SCAN_DIRS) {
    log(`📁 Scanning directory: ${dir}`, 'blue');
    
    try {
      const files = await findFiles(dir);
      log(`Found ${files.length} files to scan in ${dir}`, 'yellow');
      
      for (const file of files) {
        totalScanned++;
        const wasFixed = await scanAndFixFile(file);
        if (wasFixed) totalFixed++;
      }
    } catch (error) {
      log(`Error scanning directory ${dir}: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Scan Summary:`, 'magenta');
  log(`Total files scanned: ${totalScanned}`, 'white');
  log(`Files with React DOM render fixes applied: ${totalFixed}`, 'green');
  
  return { totalScanned, totalFixed };
}

// Run the fixer if called directly
if (require.main === module) {
  scanAndFixReactDOMRender()
    .then(({ totalScanned, totalFixed }) => {
      log(`\n✨ EHB React DOM Render Fix completed!`, 'cyan');
      log(`Scanned ${totalScanned} files, fixed ${totalFixed} files.`, 'green');
    })
    .catch(error => {
      log(`❌ Error running EHB React DOM Render Fix: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = {
  scanAndFixReactDOMRender,
  fixReactDOMRenderForReact18
};