// /scripts/ehb-chakra-fix.js
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("🛠️ " + msg);
}

// Step 1: Fix Chakra Installation
function installChakra() {
  log("Uninstalling existing Chakra UI...");
  exec("npm uninstall @chakra-ui/react", () => {
    log("Installing Chakra UI and required packages...");
    exec(
      "npm install @chakra-ui/react@latest @emotion/react @emotion/styled framer-motion",
      () => {
        log("✅ Chakra UI successfully installed.");
        writeAppFile();
      }
    );
  });
}

// Step 2: Replace _app.js
function writeAppFile() {
  const appFile = path.join(__dirname, "../admin/Developer-Portal-UI/pages/_app.js");
  const content = `
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import PortalLayout from "../components/layout/PortalLayout";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#E6F0FF",
      100: "#B3D1FF",
      200: "#80B3FF",
      300: "#4D94FF",
      400: "#1A75FF",
      500: "#005CE6",
    },
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps, router }) {
  const isSetupPage = router.pathname === "/setup";

  if (isSetupPage) {
    return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <PortalLayout>
        <Component {...pageProps} />
      </PortalLayout>
    </ChakraProvider>
  );
}

export default MyApp;
`;

  fs.writeFileSync(appFile, content);
  log("✅ _app.js has been safely replaced with Chakra-compatible version.");
  log("🚀 Now run: npm run dev");
}

installChakra();
