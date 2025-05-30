// integration-test.js
const { handleZipUpload } = require("./agent-handler/agent-handler.js");

(async () => {
  await handleZipUpload("./uploads/GoSellr-Phase-1.zip");
})();
