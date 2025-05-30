// ai-deploy-chatbot.js
function chat(input) {
  if (input.includes("deploy")) {
    return "🚀 Starting deployment... Upload your ZIP to /uploads/!";
  } else if (input.includes("error")) {
    return "🛠️ Please check /logs/integration.log or try rollback.";
  } else if (input.includes("status")) {
    return "📊 Services are running. All dashboards are synced.";
  } else {
    return "🤖 I am here to assist with EHB deployments.";
  }
}

module.exports = { chat };
