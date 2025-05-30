// gui-trigger.js
const { handleZipUpload } = require("../EHB-AI-Agent-Runtime/agent-handler/agent-handler.js");
const { launchFrontend } = require("../EHB-AI-Agent-Runtime/frontend-preview/frontend-preview.js");
const { syncAdminCard } = require("../EHB-AI-Agent-Runtime/card-sync/card-sync.js");
const { chat } = require("../EHB-AI-Agent-Runtime/chatbot/ai-deploy-chatbot.js");

async function run(zipName = "GoSellr-Phase-1.zip") {
  const moduleName = zipName.replace(".zip", "");
  await handleZipUpload(`./uploads/${zipName}`);
  syncAdminCard(moduleName);
  launchFrontend(moduleName);
  console.log(chat("status"));
}

run();
