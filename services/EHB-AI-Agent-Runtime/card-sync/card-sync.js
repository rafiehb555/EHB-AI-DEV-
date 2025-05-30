// card-sync.js
const fs = require("fs");
const path = require("path");

function syncAdminCard(moduleName) {
  const cardPath = `./admin/EHB-DASHBOARD/components/cards/${moduleName}.json`;
  const moduleJsonPath = `./services/${moduleName}/module.json`;

  if (fs.existsSync(moduleJsonPath)) {
    const config = JSON.parse(fs.readFileSync(moduleJsonPath, "utf-8"));
    fs.writeFileSync(cardPath, JSON.stringify({
      name: config.name,
      title: config.title,
      status: "Active",
      sql: config.sql,
      lastUpdated: new Date().toISOString()
    }, null, 2));
    console.log("✅ Admin dashboard card created for:", moduleName);
  } else {
    console.log("⚠️ Module config not found:", moduleName);
  }
}

module.exports = { syncAdminCard };
