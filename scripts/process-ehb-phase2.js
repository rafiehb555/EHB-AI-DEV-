
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP_FILE = 'EHB PAHSE 2 RE.zip';
const SOURCE_DIR = path.join(process.cwd(), 'attached_assets');
const TEMP_DIR = path.join(process.cwd(), 'temp_extract_phase2');

function processPhase2Zip() {
  try {
    const zipPath = path.join(SOURCE_DIR, ZIP_FILE);
    
    // Create temp directory
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Extract ZIP
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(TEMP_DIR, true);
    console.log('ZIP extracted successfully');

    // Move folders without overwriting
    const foldersToMove = ['frontend-phase2', 'backend-phase2', 'models-phase2'];
    const targetBaseDir = process.cwd();

    foldersToMove.forEach(folder => {
      const sourcePath = path.join(TEMP_DIR, folder);
      const targetPath = path.join(targetBaseDir, folder);
      
      if (fs.existsSync(sourcePath)) {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        
        // Copy files without overwriting
        fs.readdirSync(sourcePath).forEach(file => {
          const sourceFile = path.join(sourcePath, file);
          const targetFile = path.join(targetPath, file);
          
          if (!fs.existsSync(targetFile)) {
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`Copied ${file} to ${targetPath}`);
          } else {
            console.log(`Skipped ${file} - already exists`);
          }
        });
      }
    });

    // Cleanup
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    fs.unlinkSync(zipPath);
    console.log('Cleanup completed');

  } catch (error) {
    console.error('Error processing ZIP:', error);
  }
}

processPhase2Zip();
