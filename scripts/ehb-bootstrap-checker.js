const fs = require("fs");
const { exec } = require("child_process");

function log(msg) {
  console.log("🛠️ " + msg);
}

// Step 1: Create /pages folder if missing
function createPagesFolder() {
  const path = "./pages";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    log("✅ Created missing /pages folder");
  } else {
    log("📁 /pages folder already exists");
  }
}

// Step 2: Create /pages/index.js if missing
function createIndexFile() {
  const filePath = "./pages/index.js";
  const content = `
export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>EHB AI System ✅ Running</h1>
      <p>This is an auto-generated homepage.</p>
    </div>
  );
}`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    log("✅ Created pages/index.js homepage");
  } else {
    log("📄 pages/index.js already exists");
  }
}

// Step 3: Run the dev server
function runDev() {
  log("🚀 Starting npm run dev...");
  const devProcess = exec("npm run dev");

  devProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  devProcess.stderr.on("data", (data) => {
    console.error("❌ Error:", data.toString());
  });

  devProcess.on("exit", (code) => {
    console.log(`📦 App exited with code ${code}`);
  });
}

// Run all steps
createPagesFolder();
createIndexFile();
runDev();
