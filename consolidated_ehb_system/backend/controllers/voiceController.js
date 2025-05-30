const fs = require('fs');
const path = require('path');

exports.processVoice = async (req, res) => {
  const filePath = req.file.path;
  const folderName = 'voice-module-' + Date.now();
  const outputPath = path.join(__dirname, '../../public/audio', folderName);

  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(path.join(outputPath, 'README.txt'), `This module was triggered by voice input. Original file: ${filePath}`);

  res.json({ message: '✅ Voice received and module structure generated.' });
};
