// agent-handler.js
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

async function handleZipUpload(zipPath, targetFolder = "./services") {
  const zipName = path.basename(zipPath, ".zip");
  const destDir = path.join(targetFolder, zipName);

  console.log("🔁 Extracting:", zipPath);
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: destDir }))
    .promise();

  fs.unlinkSync(zipPath);
  console.log("✅ Unzipped to:", destDir);

  const moduleConfigPath = path.join(destDir, "module.json");
  if (fs.existsSync(moduleConfigPath)) {
    const config = JSON.parse(fs.readFileSync(moduleConfigPath, "utf-8"));
    console.log("📦 Module Loaded:", config.name);
    // simulate dashboard and route linking
    fs.appendFileSync("./logs/integration.log", `Registered: ${config.name} | SQL: ${config.sql}\n`);
  } else {
    console.log("⚠️ module.json not found. Skipping dashboard link.");
  }
}

module.exports = { handleZipUpload };
