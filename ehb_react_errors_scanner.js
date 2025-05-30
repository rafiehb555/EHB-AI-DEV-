/**
 * EHB React Errors Scanner and Auto-fixer
 * 
 * This script specifically targets React and React DOM related errors:
 * 1. Invalid render() calls from react-dom
 * 2. Chakra UI toast syntax issues
 * 3. JSX fragment errors
 * 4. Missing component closing tags
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

// Check if a file contains React code
async function isReactFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return (
      content.includes('import React') || 
      content.includes('from "react"') || 
      content.includes("from 'react'") ||
      content.includes('import { useState') ||
      content.includes('import { useEffect') ||
      content.includes('import { useContext') ||
      content.includes('<div') || 
      content.includes('</div') ||
      content.includes('<React.Fragment') ||
      content.includes('<>') ||
      content.includes('</>')
    );
  } catch (error) {
    return false;
  }
}

// Fix React DOM render calls
function fixReactDOMRender(content) {
  let fixed = false;
  let newContent = content;
  
  // Fix import of render from react-dom
  if (content.includes('import { render } from "react-dom"') || 
      content.includes("import { render } from 'react-dom'")) {
    newContent = newContent.replace(
      /import\s*{\s*render\s*}\s*from\s*['"]react-dom['"]/g,
      "import { createRoot } from 'react-dom/client'"
    );
    fixed = true;
  }
  
  // Fix render() calls
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

// Fix Chakra UI toast syntax
function fixChakraToastSyntax(content) {
  let fixed = false;
  let newContent = content;
  
  // Find problematic Chakra toast patterns
  const toastRegex = /toast\.(success|error|info|warning)\(\s*(['"].*?['"])\s*(?:,\s*(['"].*?['"])\s*)?\)/g;
  let match;
  
  while ((match = toastRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const status = match[1];
    const title = match[2];
    const description = match[3] || null;
    
    // Replace with correct toast syntax
    let replacement;
    if (description) {
      replacement = `toast({ title: ${title}, description: ${description}, status: "${status}" })`;
    } else {
      replacement = `toast({ title: ${title}, status: "${status}" })`;
    }
    
    newContent = newContent.substring(0, match.index) + 
                replacement + 
                newContent.substring(match.index + fullMatch.length);
    
    fixed = true;
    // Update regex lastIndex due to replacement
    toastRegex.lastIndex += replacement.length - fullMatch.length;
  }
  
  return { content: newContent, fixed };
}

// Fix missing JSX closing tags
function fixJSXClosingTags(content) {
  let fixed = false;
  let newContent = content;
  
  // Extract all JSX components with nested structures
  const jsxRegex = /<([A-Z][A-Za-z0-9]*)[^>]*>((?:(?!<\/\1>).)*?)(<\/\1>)?/gms;
  let match;
  
  while ((match = jsxRegex.exec(content)) !== null) {
    if (!match[3]) {  // Missing closing tag
      const elementName = match[1];
      const fullMatch = match[0];
      const replacement = `${fullMatch}</${elementName}>`;
      
      newContent = newContent.substring(0, match.index) + 
                  replacement + 
                  newContent.substring(match.index + fullMatch.length);
      
      fixed = true;
      // Update regex lastIndex due to replacement
      jsxRegex.lastIndex += replacement.length - fullMatch.length;
    }
  }
  
  return { content: newContent, fixed };
}

// Scan and fix a single file
async function scanAndFixFile(filePath) {
  try {
    // Check if it's a React file
    if (!(await isReactFile(filePath))) {
      return false;
    }
    
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let wasFixed = false;
    
    // Run all fixes
    const { content: contentAfterRender, fixed: fixedRender } = fixReactDOMRender(newContent);
    newContent = contentAfterRender;
    wasFixed = wasFixed || fixedRender;
    
    const { content: contentAfterToast, fixed: fixedToast } = fixChakraToastSyntax(newContent);
    newContent = contentAfterToast;
    wasFixed = wasFixed || fixedToast;
    
    const { content: contentAfterJSX, fixed: fixedJSX } = fixJSXClosingTags(newContent);
    newContent = contentAfterJSX;
    wasFixed = wasFixed || fixedJSX;
    
    // Write changes if fixes were made
    if (wasFixed) {
      await writeFile(filePath, newContent, 'utf8');
      log(`✅ Fixed React issues in ${filePath}`, 'green');
    }
    
    return wasFixed;
  } catch (error) {
    log(`❌ Error processing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Main function to scan all directories
async function scanAndFixReactErrors() {
  log('🔍 Starting EHB React Errors Scanner...', 'cyan');
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
  log(`Total React files scanned: ${totalScanned}`, 'white');
  log(`Files with React fixes applied: ${totalFixed}`, 'green');
  
  return { totalScanned, totalFixed };
}

// Run the scanner if called directly
if (require.main === module) {
  scanAndFixReactErrors()
    .then(({ totalScanned, totalFixed }) => {
      log(`\n✨ EHB React Errors Scanner completed!`, 'cyan');
      log(`Scanned ${totalScanned} files, fixed ${totalFixed} files.`, 'green');
    })
    .catch(error => {
      log(`❌ Error running EHB React Errors Scanner: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = {
  scanAndFixReactErrors,
  fixReactDOMRender,
  fixChakraToastSyntax,
  fixJSXClosingTags
};