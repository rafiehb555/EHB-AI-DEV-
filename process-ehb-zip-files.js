/**
 * EHB ZIP Files Processor
 * 
 * This script automatically processes ZIP files containing EHB AI components,
 * extracts them to the correct structure, and integrates them with the existing EHB-AI-Dev system.
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { execSync } = require('child_process');

// Define directories
const processedDir = path.join(__dirname, 'attached_assets', 'processed');
const uploadsDir = path.join(__dirname, 'uploads');
const tempExtractDir = path.join(__dirname, 'temp_extract');
const ehbAiDevDir = path.join(__dirname, 'services', 'SOT-Technologies', 'EHB-AI-Dev');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log with colors
function log(message, color = colors.white) {
  const timestamp = new Date().toISOString();
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, colors.green);
  }
}

// Clean directory (remove all files and subdirectories)
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const currentPath = path.join(dirPath, file);
      
      if (fs.lstatSync(currentPath).isDirectory()) {
        cleanDirectory(currentPath);
        fs.rmdirSync(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    }
    
    log(`Cleaned directory: ${dirPath}`, colors.yellow);
  }
}

// Get all ZIP files from a directory
function getZipFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  const files = fs.readdirSync(dirPath);
  return files.filter(file => file.toLowerCase().endsWith('.zip'));
}

// Extract ZIP file to the temporary extraction directory
function extractZipFile(zipFilePath, targetDir = tempExtractDir) {
  try {
    log(`Extracting ${path.basename(zipFilePath)}...`, colors.yellow);
    
    // Clean the target directory before extraction
    cleanDirectory(targetDir);
    ensureDirectoryExists(targetDir);
    
    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(targetDir, true);
    
    log(`Extracted ${path.basename(zipFilePath)} to ${targetDir}`, colors.green);
    return true;
  } catch (error) {
    log(`Error extracting ${path.basename(zipFilePath)}: ${error.message}`, colors.red);
    return false;
  }
}

// Copy files recursively from source to destination
function copyFiles(sourceDir, targetDir) {
  ensureDirectoryExists(targetDir);
  
  const items = fs.readdirSync(sourceDir);
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      ensureDirectoryExists(targetPath);
      copyFiles(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Integrate extracted files into the EHB-AI-Dev structure
function integrateExtractedFiles(extractDir, zipFileName) {
  log(`Integrating files from ${zipFileName}...`, colors.cyan);
  
  // Identify the type of content based on the ZIP file name
  const isAgentPhase = zipFileName.includes('Agent') && zipFileName.includes('Phase');
  const isAIDevPhase = zipFileName.includes('EHB-AI-Dev-Phase');
  const isSpecialSystem = zipFileName.includes('System') || zipFileName.includes('Package');
  
  // For AI Agent Phases
  if (isAgentPhase) {
    integrateAgentPhase(extractDir, zipFileName);
  } 
  // For EHB-AI-Dev Phases
  else if (isAIDevPhase) {
    integrateAIDevPhase(extractDir, zipFileName);
  }
  // For special system packages
  else if (isSpecialSystem) {
    integrateSpecialSystem(extractDir, zipFileName);
  }
  // For any other type of content
  else {
    integrateGenericContent(extractDir, zipFileName);
  }
  
  log(`Integration of ${zipFileName} completed`, colors.green);
}

// Integrate AI Agent Phase content
function integrateAgentPhase(extractDir, zipFileName) {
  log(`Integrating AI Agent Phase content from ${zipFileName}...`, colors.blue);
  
  // Extract phase number if present
  const phaseMatch = zipFileName.match(/Phase-?(\d+)/i);
  const phaseNumber = phaseMatch ? phaseMatch[1].padStart(2, '0') : null;
  
  // Define the target directory in the phases structure
  let targetDir;
  
  if (phaseNumber) {
    targetDir = path.join(ehbAiDevDir, 'phases', phaseNumber);
    ensureDirectoryExists(targetDir);
    
    // Copy all content from the extract directory to the target directory
    copyFiles(extractDir, targetDir);
    
    log(`Integrated Phase ${phaseNumber} to ${targetDir}`, colors.green);
  } else {
    // If no phase number is found, integrate into the ai-agent directory
    targetDir = path.join(ehbAiDevDir, 'ai-agent');
    
    // Check content structure to determine how to integrate
    const extractContents = fs.readdirSync(extractDir);
    const hasAgentDir = extractContents.some(item => item === 'agent' || item === 'ai-agent');
    
    if (hasAgentDir) {
      // Copy from the agent directory only
      const agentDir = extractContents.find(item => item === 'agent' || item === 'ai-agent');
      copyFiles(path.join(extractDir, agentDir), targetDir);
    } else {
      // Copy all content directly
      copyFiles(extractDir, targetDir);
    }
    
    log(`Integrated agent content to ${targetDir}`, colors.green);
  }
}

// Integrate EHB-AI-Dev Phase content
function integrateAIDevPhase(extractDir, zipFileName) {
  log(`Integrating EHB-AI-Dev Phase content from ${zipFileName}...`, colors.blue);
  
  // Extract phase number
  const phaseMatch = zipFileName.match(/Phase-?(\d+)/i);
  const phaseNumber = phaseMatch ? phaseMatch[1].padStart(2, '0') : null;
  
  if (!phaseNumber) {
    log(`Could not determine phase number from ${zipFileName}`, colors.red);
    return;
  }
  
  // Define the target directory in the phases structure
  const targetPhaseDir = path.join(ehbAiDevDir, 'phases', phaseNumber);
  ensureDirectoryExists(targetPhaseDir);
  
  // Copy all content from the extract directory to the target phase directory
  copyFiles(extractDir, targetPhaseDir);
  
  log(`Integrated Phase ${phaseNumber} to ${targetPhaseDir}`, colors.green);
  
  // Now integrate relevant components into the main structure
  const extractContents = fs.readdirSync(extractDir);
  
  // Map of component directories to their destination in the main structure
  const componentMapping = {
    'admin': path.join(ehbAiDevDir, 'admin'),
    'admin-dashboard': path.join(ehbAiDevDir, 'admin-dashboard'),
    'backend': path.join(ehbAiDevDir, 'backend'),
    'frontend': path.join(ehbAiDevDir, 'frontend'),
    'models': path.join(ehbAiDevDir, 'models'),
    'controllers': path.join(ehbAiDevDir, 'backend', 'controllers'),
    'routes': path.join(ehbAiDevDir, 'backend', 'routes'),
    'components': path.join(ehbAiDevDir, 'components'),
    'utils': path.join(ehbAiDevDir, 'utils'),
    'shared': path.join(ehbAiDevDir, 'shared'),
    'config': path.join(ehbAiDevDir, 'config'),
    'ai-agent': path.join(ehbAiDevDir, 'ai-agent'),
    'ai-agent-core': path.join(ehbAiDevDir, 'ai-agent-core'),
    'ai-integration-hub': path.join(ehbAiDevDir, 'ai-integration-hub'),
    'playground': path.join(ehbAiDevDir, 'playground')
  };
  
  // Integrate each component into its corresponding directory in the main structure
  for (const [component, targetDir] of Object.entries(componentMapping)) {
    if (extractContents.includes(component)) {
      ensureDirectoryExists(targetDir);
      
      const sourceDir = path.join(extractDir, component);
      copyFiles(sourceDir, targetDir);
      
      log(`Integrated ${component} from Phase ${phaseNumber} to ${targetDir}`, colors.green);
    }
  }
}

// Integrate special system packages
function integrateSpecialSystem(extractDir, zipFileName) {
  log(`Integrating special system package from ${zipFileName}...`, colors.blue);
  
  // Identify the type of system package
  const isAutoDashboard = zipFileName.includes('AutoDashboard');
  const isFreeAgent = zipFileName.includes('Free-Agent-Package');
  const isAgentCore = zipFileName.includes('Agent-Core');
  
  if (isAutoDashboard) {
    // AutoDashboard System integration
    const targetDir = path.join(ehbAiDevDir, 'admin-dashboard');
    ensureDirectoryExists(targetDir);
    
    // Check if the extracted directory has a specific structure
    const extractContents = fs.readdirSync(extractDir);
    const hasDashboardDir = extractContents.some(item => 
      item === 'dashboard' || item === 'admin-dashboard' || item === 'admin'
    );
    
    if (hasDashboardDir) {
      // Copy from the dashboard directory only
      const dashboardDir = extractContents.find(item => 
        item === 'dashboard' || item === 'admin-dashboard' || item === 'admin'
      );
      copyFiles(path.join(extractDir, dashboardDir), targetDir);
    } else {
      // Copy all content directly
      copyFiles(extractDir, targetDir);
    }
    
    log(`Integrated AutoDashboard System to ${targetDir}`, colors.green);
  } else if (isFreeAgent) {
    // Free Agent Package integration
    const targetDir = path.join(ehbAiDevDir, 'ai-agent');
    ensureDirectoryExists(targetDir);
    
    // Check if the extracted directory has a specific structure
    const extractContents = fs.readdirSync(extractDir);
    const hasAgentDir = extractContents.some(item => 
      item === 'agent' || item === 'ai-agent' || item === 'free-agent'
    );
    
    if (hasAgentDir) {
      // Copy from the agent directory only
      const agentDir = extractContents.find(item => 
        item === 'agent' || item === 'ai-agent' || item === 'free-agent'
      );
      copyFiles(path.join(extractDir, agentDir), targetDir);
    } else {
      // Copy all content directly
      copyFiles(extractDir, targetDir);
    }
    
    log(`Integrated Free Agent Package to ${targetDir}`, colors.green);
  } else if (isAgentCore) {
    // Agent Core integration
    const targetDir = path.join(ehbAiDevDir, 'ai-agent-core');
    ensureDirectoryExists(targetDir);
    
    // Check if the extracted directory has a specific structure
    const extractContents = fs.readdirSync(extractDir);
    const hasCoreDir = extractContents.some(item => 
      item === 'core' || item === 'agent-core' || item === 'ai-agent-core'
    );
    
    if (hasCoreDir) {
      // Copy from the core directory only
      const coreDir = extractContents.find(item => 
        item === 'core' || item === 'agent-core' || item === 'ai-agent-core'
      );
      copyFiles(path.join(extractDir, coreDir), targetDir);
    } else {
      // Copy all content directly
      copyFiles(extractDir, targetDir);
    }
    
    log(`Integrated Agent Core to ${targetDir}`, colors.green);
  } else {
    // Generic system package integration
    integrateGenericContent(extractDir, zipFileName);
  }
}

// Integrate generic content that doesn't match specific patterns
function integrateGenericContent(extractDir, zipFileName) {
  log(`Integrating generic content from ${zipFileName}...`, colors.blue);
  
  // Analyze the content to determine where it should go
  const extractContents = fs.readdirSync(extractDir);
  
  // Check for common directories that indicate the content type
  const hasBackend = extractContents.includes('backend') || extractContents.includes('server');
  const hasFrontend = extractContents.includes('frontend') || extractContents.includes('client');
  const hasAdmin = extractContents.includes('admin') || extractContents.includes('dashboard');
  const hasAgent = extractContents.includes('agent') || extractContents.includes('ai-agent');
  
  // Integrate based on content type
  if (hasBackend) {
    const backendDir = extractContents.find(item => item === 'backend' || item === 'server');
    const targetDir = path.join(ehbAiDevDir, 'backend');
    ensureDirectoryExists(targetDir);
    copyFiles(path.join(extractDir, backendDir), targetDir);
    log(`Integrated backend content to ${targetDir}`, colors.green);
  }
  
  if (hasFrontend) {
    const frontendDir = extractContents.find(item => item === 'frontend' || item === 'client');
    const targetDir = path.join(ehbAiDevDir, 'frontend');
    ensureDirectoryExists(targetDir);
    copyFiles(path.join(extractDir, frontendDir), targetDir);
    log(`Integrated frontend content to ${targetDir}`, colors.green);
  }
  
  if (hasAdmin) {
    const adminDir = extractContents.find(item => item === 'admin' || item === 'dashboard');
    const targetDir = path.join(ehbAiDevDir, 'admin-dashboard');
    ensureDirectoryExists(targetDir);
    copyFiles(path.join(extractDir, adminDir), targetDir);
    log(`Integrated admin dashboard content to ${targetDir}`, colors.green);
  }
  
  if (hasAgent) {
    const agentDir = extractContents.find(item => item === 'agent' || item === 'ai-agent');
    const targetDir = path.join(ehbAiDevDir, 'ai-agent');
    ensureDirectoryExists(targetDir);
    copyFiles(path.join(extractDir, agentDir), targetDir);
    log(`Integrated agent content to ${targetDir}`, colors.green);
  }
  
  // If no specific directories were found, copy all content to a special directory
  if (!hasBackend && !hasFrontend && !hasAdmin && !hasAgent) {
    const targetDir = path.join(ehbAiDevDir, 'imported', path.basename(zipFileName, '.zip'));
    ensureDirectoryExists(targetDir);
    copyFiles(extractDir, targetDir);
    log(`Integrated unclassified content to ${targetDir}`, colors.yellow);
  }
}

// Process a single ZIP file
async function processZipFile(zipFilePath) {
  const zipFileName = path.basename(zipFilePath);
  
  log(`Processing ${zipFileName}...`, colors.cyan);
  
  // Extract the ZIP file to the temporary directory
  const extractSuccess = extractZipFile(zipFilePath);
  
  if (!extractSuccess) {
    log(`Failed to extract ${zipFileName}. Skipping integration.`, colors.red);
    return false;
  }
  
  // Integrate the extracted files into the EHB-AI-Dev structure
  integrateExtractedFiles(tempExtractDir, zipFileName);
  
  // Move the processed ZIP file to a 'processed' subdirectory
  const processedSubdir = path.join(path.dirname(zipFilePath), 'processed');
  ensureDirectoryExists(processedSubdir);
  
  const destPath = path.join(processedSubdir, zipFileName);
  
  if (fs.existsSync(destPath)) {
    // If file already exists in the processed directory, delete it
    fs.unlinkSync(destPath);
  }
  
  fs.renameSync(zipFilePath, destPath);
  log(`Moved ${zipFileName} to ${processedSubdir}`, colors.green);
  
  return true;
}

// Fix Node.js package dependencies
function fixDependencies() {
  log('Checking and fixing package dependencies...', colors.cyan);
  
  const packageJsonPaths = [
    path.join(ehbAiDevDir, 'package.json'),
    path.join(ehbAiDevDir, 'ai-agent', 'package.json'),
    path.join(ehbAiDevDir, 'ai-agent-core', 'package.json'),
    path.join(ehbAiDevDir, 'ai-integration-hub', 'package.json'),
    path.join(ehbAiDevDir, 'backend', 'package.json'),
    path.join(ehbAiDevDir, 'playground', 'package.json')
  ];
  
  for (const packageJsonPath of packageJsonPaths) {
    if (fs.existsSync(packageJsonPath)) {
      try {
        log(`Fixing dependencies in ${packageJsonPath}`, colors.yellow);
        
        // Read the package.json file
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Make sure all required dependencies are added
        if (!packageJson.dependencies) {
          packageJson.dependencies = {};
        }
        
        // Add essential dependencies if not already present
        const essentialDeps = {
          'express': '^4.18.2',
          'mongoose': '^7.5.0',
          'cors': '^2.8.5',
          'dotenv': '^16.3.1',
          'adm-zip': '^0.5.10',
          'fs-extra': '^11.1.1',
          'axios': '^1.5.0',
          'body-parser': '^1.20.2',
          'jsonwebtoken': '^9.0.2'
        };
        
        for (const [dep, version] of Object.entries(essentialDeps)) {
          if (!packageJson.dependencies[dep]) {
            packageJson.dependencies[dep] = version;
          }
        }
        
        // Write the updated package.json file
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        log(`Fixed dependencies in ${packageJsonPath}`, colors.green);
      } catch (error) {
        log(`Error fixing dependencies in ${packageJsonPath}: ${error.message}`, colors.red);
      }
    }
  }
}

// Fix file permissions
function fixPermissions() {
  try {
    log('Fixing file permissions...', colors.cyan);
    
    // Make all JS files executable
    execSync(`find ${ehbAiDevDir} -name "*.js" -exec chmod +x {} \\;`);
    
    log('Fixed file permissions', colors.green);
  } catch (error) {
    log(`Error fixing permissions: ${error.message}`, colors.red);
  }
}

// Run post-integration setup steps
function postIntegrationSetup() {
  log('Running post-integration setup...', colors.cyan);
  
  // Fix dependencies
  fixDependencies();
  
  // Fix file permissions
  fixPermissions();
  
  // Clean temporary directories
  cleanDirectory(tempExtractDir);
  
  log('Post-integration setup completed', colors.green);
}

// Process all ZIP files in a directory
async function processAllZipFiles(dirPath) {
  const zipFiles = getZipFiles(dirPath);
  
  log(`Found ${zipFiles.length} ZIP files in ${dirPath}`, colors.cyan);
  
  if (zipFiles.length === 0) {
    return [];
  }
  
  // Sort files by priority (Agent files first, then EHB-AI-Dev files)
  const prioritizedFiles = zipFiles.sort((a, b) => {
    if (a.includes('Agent') && !b.includes('Agent')) return -1;
    if (!a.includes('Agent') && b.includes('Agent')) return 1;
    if (a.includes('EHB-AI-Dev') && !b.includes('EHB-AI-Dev')) return 1;
    if (!a.includes('EHB-AI-Dev') && b.includes('EHB-AI-Dev')) return -1;
    return 0;
  });
  
  // Process each ZIP file in order
  const processedFiles = [];
  
  for (const file of prioritizedFiles) {
    const filePath = path.join(dirPath, file);
    const success = await processZipFile(filePath);
    
    if (success) {
      processedFiles.push(file);
    }
  }
  
  return processedFiles;
}

// Main function
async function main() {
  log('Starting EHB ZIP files integration...', colors.cyan);
  
  // Ensure all required directories exist
  ensureDirectoryExists(uploadsDir);
  ensureDirectoryExists(tempExtractDir);
  ensureDirectoryExists(ehbAiDevDir);
  
  // Process all ZIP files in the uploads directory
  const processedUploads = await processAllZipFiles(uploadsDir);
  log(`Processed ${processedUploads.length} ZIP files from uploads directory`, colors.green);
  
  // Process all ZIP files directly from the processed directory
  const processedDirect = await processAllZipFiles(processedDir);
  log(`Processed ${processedDirect.length} ZIP files from processed directory`, colors.green);
  
  // Run post-integration setup
  postIntegrationSetup();
  
  log('EHB ZIP files integration completed successfully', colors.green);
  
  return {
    processedUploads,
    processedDirect,
    totalProcessed: processedUploads.length + processedDirect.length
  };
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    log(`Error in main process: ${error.message}`, colors.red);
    console.error(error);
  });
} else {
  module.exports = { main };
}