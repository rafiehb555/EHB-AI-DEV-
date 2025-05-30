// frontend-preview.js
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function launchFrontend(moduleName) {
  const frontendPath = path.join("./services", moduleName, "frontend");
  if (fs.existsSync(path.join(frontendPath, "package.json"))) {
    console.log(`🌐 Launching frontend for ${moduleName}`);
    exec("npm install && npm run dev", { cwd: frontendPath });
  } else {
    console.log("⚠️ No frontend found for:", moduleName);
  }
}

module.exports = { launchFrontend };
