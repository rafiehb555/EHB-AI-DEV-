// gui-trigger.js
const { handleZipUpload } = require("./agent-handler/agent-handler");
const { launchFrontend } = require("./frontend-preview/frontend-preview");
const { syncAdminCard } = require("./card-sync/card-sync");
const { chat } = require("./chatbot/ai-deploy-chatbot");

async function processModule(moduleName) {
  console.log("🚀 Triggering full setup for:", moduleName);
  await handleZipUpload(`./uploads/${moduleName}.zip`);
  syncAdminCard(moduleName);
  launchFrontend(moduleName);
  console.log(chat("status"));
}

module.exports = { processModule };
