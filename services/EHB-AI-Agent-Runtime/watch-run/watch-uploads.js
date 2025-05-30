// watch-uploads.js
const fs = require("fs");
const path = require("path");
const { handleZipUpload } = require("./agent-handler/agent-handler.js");

const uploadsDir = "./uploads";

console.log("👁️ Watching uploads directory...");

fs.watch(uploadsDir, async (eventType, filename) => {
  if (filename && filename.endsWith(".zip") && eventType === "rename") {
    const zipPath = path.join(uploadsDir, filename);
    if (fs.existsSync(zipPath)) {
      console.log("📥 New ZIP detected:", filename);
      await handleZipUpload(zipPath);

      // Optional: run npm install and start backend
      const serviceName = filename.replace(".zip", "");
      const backendPath = path.join("./services", serviceName, "backend");
      if (fs.existsSync(path.join(backendPath, "package.json"))) {
        console.log("📦 Installing dependencies for", serviceName);
        require("child_process").execSync("npm install", { cwd: backendPath, stdio: "inherit" });

        console.log("🚀 Starting backend for", serviceName);
        require("child_process").exec("npm start", { cwd: backendPath });
      }
    }
  }
});
