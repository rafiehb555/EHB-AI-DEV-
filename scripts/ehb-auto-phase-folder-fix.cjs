const fs = require("fs");
const path = require("path");

// Standard folder structure for each phase
const standardFolders = [
  "frontend", 
  "backend", 
  "models", 
  "config", 
  "admin",
  "services",
  "utils"
];

// Standard files to create in each phase
const standardFiles = {
  "README.txt": "# EHB Phase Folder\nAuto-generated standard structure",
  "module.js": "// Auto-created module file\n\nmodule.exports = {\n  name: 'EHB Phase Module',\n  version: '1.0.0'\n};"
};

const phaseDir = path.join(__dirname, "../phases");

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Create file if it doesn't exist
function ensureFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

if (!fs.existsSync(phaseDir)) {
  console.log("❌ Folder /phases not found!");
  process.exit(1);
}

// Process each phase folder
fs.readdirSync(phaseDir).forEach((folder) => {
  const fullPath = path.join(phaseDir, folder);
  
  if (fs.statSync(fullPath).isDirectory()) {
    console.log("✅ Phase found: " + folder);
    
    // Create standard files
    Object.entries(standardFiles).forEach(([fileName, content]) => {
      const filePath = path.join(fullPath, fileName);
      if (ensureFile(filePath, content)) {
        console.log("📄 Created missing file: " + filePath);
      }
    });
    
    // Create standard folders and README files
    standardFolders.forEach(subFolder => {
      const subFolderPath = path.join(fullPath, subFolder);
      if (ensureDir(subFolderPath)) {
        console.log("📁 Created missing folder: " + subFolderPath);
        
        // Add README to each subfolder
        const readmePath = path.join(subFolderPath, "README.txt");
        const readmeContent = `# ${subFolder.charAt(0).toUpperCase() + subFolder.slice(1)} Folder\nPart of the EHB Phase ${folder} structure`;
        
        if (ensureFile(readmePath, readmeContent)) {
          console.log("📄 Created README: " + readmePath);
        }
      }
    });
  }
});