// Basic configuration for Chakra UI in the EHB Developer Portal
const chakraConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    brand: {
      50: "#e6f1ff",
      100: "#b3d4fd",
      200: "#80b7fa",
      300: "#4d9af7",
      400: "#1a7df4",
      500: "#0064db", // Primary brand color
      600: "#0050af",
      700: "#003c83",
      800: "#002857",
      900: "#00142b",
    },
  },
  fonts: {
    heading: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    body: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
};

export default chakraConfig;