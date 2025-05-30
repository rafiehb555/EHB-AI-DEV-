/**
 * Port Internal Redirector
 *
 * Yeh utility internal services ko 127.0.0.1 se 0.0.0.0 pe forward karta hai
 * jisse Replit aur external clients ke liye visible ban jaayein.
 */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");

// ✅ Define all active port mappings
const PORT_MAPPINGS = [
  { internalPort: 5121, externalPort: 5121, name: "AI Agent Core (Old)" },
  { internalPort: 5122, externalPort: 5122, name: "AI Agent Core Alt" },
  { internalPort: 5123, externalPort: 5123, name: "AI Agent Core Primary" },
  {
    internalPort: 5124,
    externalPort: 5124,
    name: "AI Agent Core Fixed (Stale)",
  },
  {
    internalPort: 5125,
    externalPort: 5125,
    name: "AI Agent Core (Port 5125)",
  },
  {
    internalPort: 5126,
    externalPort: 5126,
    name: "✅ AI Agent Core NEW (Port 5126)",
  },
  {
    internalPort: 5127,
    externalPort: 5127,
    name: "Whisper Command (Port 5127)",
  },
];

// ✅ Function to create proxy forwarder
function createRedirector(mapping) {
  const app = express();

  // Proxy all traffic
  app.use(
    "/",
    createProxyMiddleware({
      target: `http://127.0.0.1:${mapping.internalPort}`,
      changeOrigin: true,
      logLevel: "silent",
    }),
  );

  // Local health endpoint
  app.get("/health-redirector", (req, res) => {
    res.json({
      status: "ok",
      forwardedTo: `127.0.0.1:${mapping.internalPort}`,
      externalVisibleAt: `0.0.0.0:${mapping.externalPort}`,
      service: mapping.name,
      timestamp: new Date().toISOString(),
    });
  });

  const server = http.createServer(app);

  server.listen(mapping.externalPort, "0.0.0.0", () => {
    console.log(
      `🔄 [${mapping.name}] → 127.0.0.1:${mapping.internalPort} => 0.0.0.0:${mapping.externalPort}`,
    );
    console.log(`🌐 PORT ${mapping.externalPort} is now externally visible ✅`);
  });
}

// 🚀 Start
console.log("=================================================");
console.log("         🚀 EHB PORT INTERNAL REDIRECTOR         ");
console.log("=================================================");

PORT_MAPPINGS.forEach(createRedirector);
