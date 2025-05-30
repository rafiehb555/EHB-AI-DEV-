/**
 * EHB Phase 5 Integration Script
 * 
 * This script integrates the components from EHB-AI-Dev-Phase-5 into the 
 * appropriate locations in our project structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PHASE5_DIR = path.join(__dirname, '../EHB-AI-Dev-Phase-5');
const DASHBOARD_BACKEND_DIR = path.join(__dirname, '../EHB-DASHBOARD/backend');
const DASHBOARD_FRONTEND_DIR = path.join(__dirname, '../EHB-DASHBOARD/frontend');
const MODELS_DIR = path.join(__dirname, '../models');

// Log function with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  
  // Also append to an integration log file
  fs.appendFileSync(
    path.join(__dirname, '../ehb_phase5_integration.log'),
    `[${timestamp}] ${message}\n`
  );
}

// Check if a path exists
function pathExists(pathToCheck) {
  return fs.existsSync(pathToCheck);
}

// Create a directory if it doesn't exist
function createDirIfNotExists(dirPath) {
  if (!pathExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

// Safely copy a file without overwriting existing files
function safeCopyFile(sourcePath, destPath) {
  // If destination already exists, don't overwrite it
  if (pathExists(destPath)) {
    log(`Skipping existing file: ${destPath}`);
    return false;
  }
  
  // Create destination directory if it doesn't exist
  createDirIfNotExists(path.dirname(destPath));
  
  // Copy the file
  fs.copyFileSync(sourcePath, destPath);
  log(`Copied: ${sourcePath} -> ${destPath}`);
  return true;
}

// Integrate backend controllers
function integrateBackendControllers() {
  const sourceDir = path.join(PHASE5_DIR, 'backend-phase5/controllers');
  const destDir = path.join(DASHBOARD_BACKEND_DIR, 'controllers');
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    // Rename files to avoid conflicts
    const destPath = path.join(destDir, file.replace('.js', 'Phase5.js'));
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
      
      // Update the require paths in the copied file
      const content = fs.readFileSync(destPath, 'utf8');
      const updatedContent = content.replace(
        "require('../../models/User')",
        "require('../../models/UserPhase5')"
      );
      fs.writeFileSync(destPath, updatedContent);
    }
  });
  
  log(`Integrated ${integratedFiles} backend controllers`);
  return integratedFiles;
}

// Integrate backend routes
function integrateBackendRoutes() {
  const sourceDir = path.join(PHASE5_DIR, 'backend-phase5/routes');
  const destDir = path.join(DASHBOARD_BACKEND_DIR, 'routes');
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    // Rename files to avoid conflicts
    const destPath = path.join(destDir, file.replace('.js', 'Phase5.js'));
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
      
      // Update the require paths in the copied file
      const content = fs.readFileSync(destPath, 'utf8');
      const updatedContent = content
        .replace(
          "require('../controllers/",
          "require('../controllers/"
        )
        .replace(
          "adminController",
          "adminControllerPhase5"
        )
        .replace(
          "authController",
          "authControllerPhase5"
        )
        .replace(
          "aiController",
          "aiControllerPhase5"
        );
      fs.writeFileSync(destPath, updatedContent);
    }
  });
  
  log(`Integrated ${integratedFiles} backend routes`);
  return integratedFiles;
}

// Integrate models
function integrateModels() {
  const sourceDir = path.join(PHASE5_DIR, 'models-phase5');
  const destDir = MODELS_DIR;
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    // Rename files to avoid conflicts
    const destPath = path.join(destDir, file.replace('.js', 'Phase5.js'));
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
      
      // Update the model name in the copied file
      const content = fs.readFileSync(destPath, 'utf8');
      const updatedContent = content.replace(
        "mongoose.model('User'",
        "mongoose.model('UserPhase5'"
      );
      fs.writeFileSync(destPath, updatedContent);
    }
  });
  
  log(`Integrated ${integratedFiles} models`);
  return integratedFiles;
}

// Integrate frontend pages
function integrateFrontendPages() {
  const sourceDir = path.join(PHASE5_DIR, 'frontend-phase5/pages');
  const destDir = path.join(DASHBOARD_FRONTEND_DIR, 'pages/phase5');
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
    }
  });
  
  // Also integrate the admin pages
  const adminSourceDir = path.join(PHASE5_DIR, 'admin-phase5/pages');
  const adminDestDir = path.join(DASHBOARD_FRONTEND_DIR, 'pages/admin/phase5');
  
  createDirIfNotExists(adminDestDir);
  
  if (pathExists(adminSourceDir)) {
    const adminFiles = fs.readdirSync(adminSourceDir);
    
    adminFiles.forEach(file => {
      const sourcePath = path.join(adminSourceDir, file);
      const destPath = path.join(adminDestDir, file);
      
      if (safeCopyFile(sourcePath, destPath)) {
        integratedFiles++;
      }
    });
  }
  
  log(`Integrated ${integratedFiles} frontend pages`);
  return integratedFiles;
}

// Integrate styles
function integrateStyles() {
  const sourceDir = path.join(PHASE5_DIR, 'frontend-phase5/styles');
  const destDir = path.join(DASHBOARD_FRONTEND_DIR, 'styles/phase5');
  
  if (!pathExists(sourceDir)) {
    log('No styles directory found in Phase 5');
    return 0;
  }
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
    }
  });
  
  log(`Integrated ${integratedFiles} style files`);
  return integratedFiles;
}

// Integrate middleware
function integrateMiddleware() {
  const sourceDir = path.join(PHASE5_DIR, 'backend-phase5/middleware');
  const destDir = path.join(DASHBOARD_BACKEND_DIR, 'middleware');
  
  if (!pathExists(sourceDir)) {
    log('No middleware directory found in Phase 5');
    return 0;
  }
  
  createDirIfNotExists(destDir);
  
  const files = fs.readdirSync(sourceDir);
  let integratedFiles = 0;
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    // Rename files to avoid conflicts
    const destPath = path.join(destDir, file.replace('.js', 'Phase5.js'));
    
    if (safeCopyFile(sourcePath, destPath)) {
      integratedFiles++;
    }
  });
  
  log(`Integrated ${integratedFiles} middleware files`);
  return integratedFiles;
}

// Update server.js to include Phase 5 routes
function updateServerConfig() {
  const serverPath = path.join(DASHBOARD_BACKEND_DIR, 'server.js');
  
  if (!pathExists(serverPath)) {
    log('Warning: server.js not found, skipping route integration');
    return false;
  }
  
  // Read the existing server configuration
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Check if Phase 5 routes are already integrated
  if (serverContent.includes('Phase5')) {
    log('Phase 5 routes already integrated in server.js');
    return false;
  }
  
  // Find where routes are defined
  const routesPattern = /\/\/ Define routes[\s\S]*?app\.use\(['"]\/api.*?\);/;
  const routesMatch = serverContent.match(routesPattern);
  
  if (!routesMatch) {
    log('Warning: Could not find routes section in server.js');
    return false;
  }
  
  // Get the matched routes section
  const routesSection = routesMatch[0];
  
  // Create an updated routes section with Phase 5 routes
  const updatedRoutesSection = `${routesSection}

// Phase 5 Routes
const authRoutesPhase5 = require('./routes/authRoutesPhase5');
const aiRoutesPhase5 = require('./routes/aiRoutesPhase5');
const adminRoutesPhase5 = require('./routes/adminRoutesPhase5');
app.use('/api/v5/auth', authRoutesPhase5);
app.use('/api/v5/ai', aiRoutesPhase5);
app.use('/api/v5/admin', adminRoutesPhase5);`;

  // Replace the routes section
  const updatedServerContent = serverContent.replace(routesPattern, updatedRoutesSection);
  
  // Write the updated content
  fs.writeFileSync(serverPath, updatedServerContent);
  
  log('Updated server.js to include Phase 5 routes');
  return true;
}

// Main function to integrate Phase 5 components
async function integratePhase5Components() {
  try {
    log('Starting integration of Phase 5 components');
    
    // Check if Phase 5 directory exists
    if (!pathExists(PHASE5_DIR)) {
      throw new Error(`Phase 5 directory not found: ${PHASE5_DIR}`);
    }
    
    // Integrate each component type
    const results = {
      backendControllers: integrateBackendControllers(),
      backendRoutes: integrateBackendRoutes(),
      models: integrateModels(),
      frontendPages: integrateFrontendPages(),
      styles: integrateStyles(),
      middleware: integrateMiddleware(),
      serverUpdated: updateServerConfig()
    };
    
    log('Phase 5 integration completed successfully');
    log(`Integration results: ${JSON.stringify(results, null, 2)}`);
    
    return {
      success: true,
      results
    };
  } catch (error) {
    log(`Error during Phase 5 integration: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  integratePhase5Components()
    .then(result => {
      if (result.success) {
        log('EHB Phase 5 integration completed successfully!');
      } else {
        log('EHB Phase 5 integration failed.');
      }
    })
    .catch(error => {
      log(`Unhandled error: ${error.message}`);
    });
}

module.exports = {
  integratePhase5Components
};