// EHB Developer Portal Theme - Simple Version
// Using a simple theme object instead of extendTheme to avoid compatibility issues

const theme = {
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
    secondary: {
      50: "#f0e7ff",
      100: "#d0b9ff",
      200: "#b08bff",
      300: "#915cff",
      400: "#712eff",
      500: "#5a00ff", // Secondary brand color
      600: "#4800cc",
      700: "#360099",
      800: "#240066",
      900: "#120033",
    },
  },
  fonts: {
    heading: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    body: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
};

export default theme;