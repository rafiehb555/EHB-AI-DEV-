
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const SOURCE_DIR = path.join(process.cwd(), 'attached_assets');
const TEMP_DIR = path.join(process.cwd(), 'temp_extract_phase3');

async function processPhase3() {
  try {
    // Find the Phase 3 ZIP file
    const files = fs.readdirSync(SOURCE_DIR);
    const phase3Zip = files.find(f => f.toLowerCase().includes('phase 3') || f.toLowerCase().includes('phase3'));
    
    if (!phase3Zip) {
      console.error('Phase 3 ZIP file not found');
      return;
    }

    const zipPath = path.join(SOURCE_DIR, phase3Zip);
    
    // Create temp directory
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Extract ZIP
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(TEMP_DIR, true);
    console.log('ZIP extracted successfully');

    // Move folders without overwriting
    const foldersToMove = ['frontend-phase3', 'backend-phase3', 'models-phase3'];
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

processPhase3();
