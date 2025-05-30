const fs = require('fs');
const path = require('path');

exports.generateModule = async (req, res) => {
  const { prompt } = req.body;

  const moduleName = prompt.split(' ')[1] || "Module";
  const folder = path.join(__dirname, '../../ehb-flow/' + moduleName);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'README.txt'), `Prompt: ${prompt}\nGenerated for: ${moduleName}`);

  return res.json({ message: `${moduleName} module generated.` });
};
