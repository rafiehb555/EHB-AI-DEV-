// sandbox-controller.js
const { exec } = require('child_process');

function runInSandbox(code, callback) {
  const secureCode = code.replace(/[^a-zA-Z0-9\s{}();.=+-/*]/g, ''); // basic filter
  exec(`node -e "${secureCode}"`, { timeout: 3000 }, (err, stdout, stderr) => {
    if (err) return callback({ error: stderr });
    callback({ output: stdout });
  });
}

module.exports = { runInSandbox };
