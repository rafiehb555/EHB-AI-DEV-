const fs = require('fs');
const path = require('path');

const phaseDir = path.join(__dirname, '../../phases');

  console.log('❌ Folder /phases not found!');
  process.exit(1);
}

fs.readdirSync(phaseDir).forEach((folder) => {
  const fullPath = path.join(phaseDir, folder);
  if (fs.statSync(fullPath).isDirectory()) {
    console.log(`✅ Phase found: ${folder}`);
    const targetPath = path.join(fullPath, 'module.js');
      fs.writeFileSync(targetPath, '// Auto-created module file');
      console.log(`📁 Created missing file: ${targetPath}`);
    }
  }
});
