import React, { createContext, useContext, useState, useEffect } from 'react';

// Create contexts to replace Chakra UI contexts
export const ChakraContext = createContext({
  colorMode: 'light',
  toggleColorMode: () => {},
  theme: {
    colors: {
      gray: {
        50: '#f8f9fa',
        100: '#f1f3f5',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#868e96',
        700: '#495057',
        800: '#343a40',
        900: '#212529',
      },
      blue: {
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
      },
    },
  },
});

// Additional Chakra contexts to prevent errors
export const ChakraThemeContext = createContext(null);
export const ColorModeContext = createContext(null);

// Create a mock useColorMode hook
export const useColorMode = () => {
  const context = useContext(ChakraContext);
  if (!context) {
    // Fallback if context not available
    return {
      colorMode: 'light',
      toggleColorMode: () => {},
    };
  }
  return {
    colorMode: context.colorMode,
    toggleColorMode: context.toggleColorMode, 
  };
};

// Create a mock useColorModeValue hook
export const useColorModeValue = (lightValue, darkValue) => {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? lightValue : darkValue;
};

// Create a mock useTheme hook
export const useTheme = () => {
  const context = useContext(ChakraThemeContext);
  if (!context) {
    // Fallback theme
    return {
      colors: {
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        blue: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
      }
    };
  }
  return context;
};

// Mock ChakraProvider component
const MockChakraProvider = ({ children }) => {
  // Get color mode preference from localStorage if available
  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    // Try to get color mode from localStorage
    if (typeof window !== 'undefined') {
      const storedColorMode = localStorage.getItem('chakra-ui-color-mode');
      if (storedColorMode) {
        setColorMode(storedColorMode);
      }
    }
  }, []);

  const toggleColorMode = () => {
    const newColorMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newColorMode);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('chakra-ui-color-mode', newColorMode);
    }
  };

  // Theme object
  const theme = {
    colors: {
      gray: {
        50: '#f8f9fa',
        100: '#f1f3f5',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#adb5bd',
        600: '#868e96',
        700: '#495057',
        800: '#343a40',
        900: '#212529',
      },
      blue: {
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
      },
    },
    spacing: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
    }
  };

  // Update body class based on color mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${colorMode}-mode`);
    }
  }, [colorMode]);

  return (
    <ChakraContext.Provider 
      value={{
        colorMode,
        toggleColorMode,
        theme
      }}
    >
      <ChakraThemeContext.Provider value={theme}>
        <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
          {children}
        </ColorModeContext.Provider>
      </ChakraThemeContext.Provider>
    </ChakraContext.Provider>
  );
};

export default MockChakraProvider;