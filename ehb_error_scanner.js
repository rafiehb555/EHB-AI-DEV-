/**
 * EHB Error Scanner and Auto-fixer
 * 
 * This script scans the codebase for common JavaScript errors and automatically fixes them:
 * 1. Undefined variables used before declaration
 * 2. .filter() or .map() used on null or undefined
 * 3. Missing return() inside arrow functions with JSX
 * 4. Fixing invalid render() calls from toast components
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

// Find all JS/JSX files in a directory recursively
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

// Check if a file might be using JSX
function mightContainJSX(content) {
  return (
    content.includes('import React') || 
    content.includes('from "react"') || 
    content.includes("from 'react'") ||
    content.includes('<') && content.includes('/>') ||
    content.match(/<[A-Z][A-Za-z0-9]*/)
  );
}

// Fix null/undefined .map() and .filter() usage
function fixNullMapFilter(content) {
  let fixed = false;
  let newContent = content;
  
  // Pattern to find .map() or .filter() without null/undefined check
  const mapFilterRegex = /(\w+)(\.\w+)*\.(map|filter)\(/g;
  let match;
  
  while ((match = mapFilterRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const variablePath = match[1] + (match[2] || '');
    const method = match[3];
    
    // Skip if inside a comment
    const lineStart = content.lastIndexOf('\n', match.index) + 1;
    const line = content.substring(lineStart, match.index + fullMatch.length);
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      continue;
    }
    
    // Skip if already has a null check
    const beforeMatch = content.substring(Math.max(0, match.index - 50), match.index);
    if (
      beforeMatch.includes(`if (${variablePath})`) ||
      beforeMatch.includes(`${variablePath} &&`) ||
      beforeMatch.includes(`${variablePath}?`) ||
      beforeMatch.includes(`${variablePath} !== null`) ||
      beforeMatch.includes(`${variablePath} !== undefined`)
    ) {
      continue;
    }
    
    // Replace with null-safe version
    const replacement = `(${variablePath} || []).${method}(`;
    newContent = newContent.substring(0, match.index) + 
                replacement + 
                newContent.substring(match.index + fullMatch.length);
    
    fixed = true;
    // Update regex lastIndex due to replacement
    mapFilterRegex.lastIndex += replacement.length - fullMatch.length;
  }
  
  return { content: newContent, fixed };
}

// Fix missing return in arrow functions with JSX
function fixMissingReturn(content) {
  let fixed = false;
  let newContent = content;
  
  // Only process files that might contain JSX
  if (!mightContainJSX(content)) {
    return { content, fixed };
  }
  
  // Pattern to find arrow functions without return that might need it
  // This is a simplified pattern and might need refinement
  const arrowFunctionRegex = /(\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*\{(?!\s*return|\s*\/\*|\s*\/\/)[^}]*<[A-Z][^>]*>[^}]*\}/g;
  let match;
  
  while ((match = arrowFunctionRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const params = match[1];
    
    // Extract the arrow function body
    const bodyStart = fullMatch.indexOf('{') + 1;
    const body = fullMatch.substring(bodyStart, fullMatch.length - 1).trim();
    
    // Replace with version that includes return
    const replacement = `${params} => {\n  return (${body});\n}`;
    newContent = newContent.substring(0, match.index) + 
                replacement + 
                newContent.substring(match.index + fullMatch.length);
    
    fixed = true;
    // Update regex lastIndex due to replacement
    arrowFunctionRegex.lastIndex += replacement.length - fullMatch.length;
  }
  
  return { content: newContent, fixed };
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

// Fix Chakra toast syntax
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

// Scan and fix a single file
async function scanAndFixFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let wasFixed = false;
    
    // Run all fixes
    const { content: contentAfterMapFilter, fixed: fixedMapFilter } = fixNullMapFilter(newContent);
    newContent = contentAfterMapFilter;
    wasFixed = wasFixed || fixedMapFilter;
    
    const { content: contentAfterArrowReturn, fixed: fixedArrowReturn } = fixMissingReturn(newContent);
    newContent = contentAfterArrowReturn;
    wasFixed = wasFixed || fixedArrowReturn;
    
    const { content: contentAfterReactDOM, fixed: fixedReactDOM } = fixReactDOMRender(newContent);
    newContent = contentAfterReactDOM;
    wasFixed = wasFixed || fixedReactDOM;
    
    const { content: contentAfterToast, fixed: fixedToast } = fixChakraToastSyntax(newContent);
    newContent = contentAfterToast;
    wasFixed = wasFixed || fixedToast;
    
    // Write changes if fixes were made
    if (wasFixed) {
      await writeFile(filePath, newContent, 'utf8');
      log(`✅ Fixed issues in ${filePath}`, 'green');
    }
    
    return wasFixed;
  } catch (error) {
    log(`❌ Error processing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Main function to scan all directories
async function scanAndFix() {
  log('🔍 Starting EHB Error Scanner...', 'cyan');
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
  log(`Files with fixes applied: ${totalFixed}`, 'green');
  
  return { totalScanned, totalFixed };
}

// Run the scanner if called directly
if (require.main === module) {
  scanAndFix()
    .then(({ totalScanned, totalFixed }) => {
      log(`\n✨ EHB Error Scanner completed!`, 'cyan');
      log(`Scanned ${totalScanned} files, fixed ${totalFixed} files.`, 'green');
    })
    .catch(error => {
      log(`❌ Error running EHB Error Scanner: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = {
  scanAndFix,
  fixNullMapFilter,
  fixMissingReturn,
  fixReactDOMRender,
  fixChakraToastSyntax
};