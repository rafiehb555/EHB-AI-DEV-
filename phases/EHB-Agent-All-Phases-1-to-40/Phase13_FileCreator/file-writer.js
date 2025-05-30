// FileWriter.js
const fs = require('fs');
function saveTool(fileName, code) {
  fs.writeFileSync(fileName, code);
}
