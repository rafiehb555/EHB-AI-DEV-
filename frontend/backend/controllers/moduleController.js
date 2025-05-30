const fs = require('fs');
const path = require('path');

exports.buildModule = async (req, res) => {
  const { prompt } = req.body;
  const cleanName = prompt.toLowerCase().split(' ')[0] || "module";
  const dirPath = path.join(__dirname, '../../public/uploads/', cleanName);

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'README.txt'), `Generated from prompt: ${prompt}`);

  return res.json({ message: `✅ Module generated and saved at: ${cleanName}` });
};
