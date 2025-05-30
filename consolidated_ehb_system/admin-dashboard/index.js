// 📘 Admin Route Auto-Importer

const fs = require('fs');
const path = require('path');

const adminRoot = path.join(__dirname, '../phases');
const routes = [];

fs.readdirSync(adminRoot).forEach(phase => {
  const adminPath = path.join(adminRoot, phase, 'admin');
  if (fs.existsSync(adminPath)) {
    fs.readdirSync(adminPath).forEach(file => {
      const routePath = `/${phase}/${file.replace('.js', '')}`;
      routes.push(`app.use('${routePath}', require('${adminPath}/${file}'))`);
    });
  }
});

module.exports = routes;
