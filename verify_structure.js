/**
 * EHB Structure Verification Script
 * 
 * This script verifies that all files and folders comply with the approved
 * folder structure for the EHB system. If any violations are found, 
 * errors will be thrown and execution will be halted.
 */

const fs = require('fs');
const path = require('path');

// Approved folder structure
const VERIFIED_STRUCTURE = {
  MAIN_PROJECT: "/services/SOT-Technologies/EHB-AI-Dev",
  EHB_AI_AGENT: "/services/SOT-Technologies/EHB-AI-Dev/ai-agent",
  ADMIN_MODULES: [
    "/admin/EHB-HOME",
    "/admin/ehb-admin-panel",
    "/admin/EHB-DASHBOARD",
    "/admin/EHB-Developer-Portal",
    "/admin/User-flow"
  ],
  SERVICES: [
    "/services/EHB-GoSellr",
    "/services/JPS-Job-Providing-Service",
    "/services/WMS-World-Medical-Service",
    "/services/HPS-Education-Service",
    "/services/OLS-Online-Law-Service"
  ],
  SYSTEM: {
    CORE: "/system",
    SQL: [
      "/system/EHB-SQL",
      "/system/EHB-SQL/EHB-SQL-PSS",
      "/system/EHB-SQL/EHB-SQL-EDR",
      "/system/EHB-SQL/EHB-SQL-EMO"
    ],
    CONFIG: "/system/config",
    RULES: "/system/rules",
    STRUCTURE: "/system/structure.json"
  }
};

// Flatten the structure for easy path checking
function flattenStructure(obj, prefix = '') {
  let paths = [];
  
  if (typeof obj === 'string') {
    return [obj];
  } else if (Array.isArray(obj)) {
    obj.forEach(item => {
      paths = paths.concat(flattenStructure(item, prefix));
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      paths = paths.concat(flattenStructure(obj[key], prefix));
    });
  }
  
  return paths;
}

// Get all approved paths
const approvedPaths = flattenStructure(VERIFIED_STRUCTURE);

// Rules for verification
const RULES = [
  "No files or folders should be created outside the approved structure.",
  "New phases or modules should only be created within verified paths.",
  "Import or require() statements should not reference incorrect folders.",
  "This verification should run automatically on startup."
];

// Verify that a path adheres to the approved structure
function verifyPath(testPath) {
  // Normalize the path to ensure consistent format
  const normalizedPath = path.normalize(testPath).replace(/\\/g, '/');
  
  // Check if this path or any of its parent directories are in the approved list
  let isApproved = false;
  let currentPath = normalizedPath;
  
  while (currentPath && currentPath !== '.') {
    if (approvedPaths.some(approved => currentPath.startsWith(approved) || approved.startsWith(currentPath))) {
      isApproved = true;
      break;
    }
    currentPath = path.dirname(currentPath);
  }
  
  return isApproved;
}

// Verify import/require statements in a file
function verifyImports(filePath) {
  if (!fs.existsSync(filePath)) {
    return true;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /(?:import\s+.*\s+from\s+['"](.+?)['"]|require\s*\(\s*['"](.+?)['"]\s*\))/g;
  let match;
  const issues = [];
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    if (importPath.startsWith('.')) {
      // Relative import - resolve to absolute
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      if (!verifyPath(resolvedPath)) {
        issues.push(`Invalid import path: ${importPath} in file ${filePath}`);
      }
    }
  }
  
  return issues.length === 0 ? true : issues;
}

// Recursively scan directories to verify structure
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory does not exist: ${dirPath}`);
    return [];
  }
  
  const issues = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    
    // Skip node_modules, .git, and other common system directories
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.vscode') {
      continue;
    }
    
    // Verify the path is in the approved structure
    if (!verifyPath(entryPath)) {
      issues.push(`Path not in approved structure: ${entryPath}`);
    }
    
    // If it's a file, verify its imports
    if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const importIssues = verifyImports(entryPath);
      if (importIssues !== true) {
        issues.push(...importIssues);
      }
    }
    
    // If it's a directory, recursively scan it
    if (entry.isDirectory()) {
      const subIssues = scanDirectory(entryPath);
      issues.push(...subIssues);
    }
  }
  
  return issues;
}

// Main verification function
function verifyStructure() {
  console.log('Verifying EHB folder structure...');
  
  // Get the project root directory (current working directory)
  const rootDir = process.cwd();
  
  // Scan the entire project
  const issues = scanDirectory(rootDir);
  
  if (issues.length === 0) {
    console.log('✅ Structure verification passed. All paths adhere to the approved structure.');
    return true;
  } else {
    console.error('❌ Structure verification failed. The following issues were found:');
    issues.forEach(issue => console.error(`- ${issue}`));
    return false;
  }
}

// Execute verification when the script is run directly
if (require.main === module) {
  const result = verifyStructure();
  if (!result) {
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = {
  verifyStructure,
  verifyPath,
  VERIFIED_STRUCTURE,
  RULES
};