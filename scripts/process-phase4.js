const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const SOURCE_DIR = path.join(process.cwd(), 'attached_assets');
const TEMP_DIR = path.join(process.cwd(), 'temp_extract_phase4');

async function processPhase4() {
  try {
    // Find the Phase 4 ZIP file
    const files = fs.readdirSync(SOURCE_DIR);
    const phase4Zip = files.find(f => f.toLowerCase().includes('phase 4') || f.toLowerCase().includes('phase4'));
    
    if (!phase4Zip) {
      console.error('Phase 4 ZIP file not found');
      return;
    }

    const zipPath = path.join(SOURCE_DIR, phase4Zip);
    
    // Create temp directory
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Extract ZIP
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(TEMP_DIR, true);
    console.log('ZIP extracted successfully');

    // Move folders without overwriting
    const foldersToMove = ['frontend-phase4', 'backend-phase4', 'models-phase4'];
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

processPhase4();