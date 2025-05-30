import React, { createContext, useState, useContext, useEffect } from 'react';

// Define default preference values
const defaultPreferences = {
  sidebar: {
    collapsed: false,
    width: 250,
    collapsedWidth: 64,
  },
  layout: {
    contentWidth: 'full', // 'full' or 'contained'
    showHelpSidebar: true,
  },
  theme: {
    mode: 'light',
    color: 'blue',
  },
  dashboard: {
    tiles: {
      layout: 'grid', // 'grid' or 'list'
      visibility: {
        analytics: true,
        phases: true,
        services: true,
        aiComponents: true,
      },
    },
  },
};

// Create context
const UserPreferencesContext = createContext(null);

// Custom hook to use the context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

// Helper to get a nested value from an object using a dot-notated path
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : undefined;
  }, obj);
};

// Helper to set a nested value in an object using a dot-notated path
const setNestedValue = (obj, path, value) => {
  const result = { ...obj };
  const parts = path.split('.');
  const lastKey = parts.pop();
  let current = result;

  for (const part of parts) {
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }

  current[lastKey] = value;
  return result;
};

// Provider component
export const UserPreferencesProvider = ({ children }) => {
  // Initialize state with default preferences
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPrefs = localStorage.getItem('ehb-user-preferences');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
        // In any case, mark as loaded after attempt
        setLoaded(true);
      } catch (error) {
        console.error('Error loading preferences from localStorage:', error);
        setLoaded(true);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('ehb-user-preferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences to localStorage:', error);
      }
    }
  }, [preferences, loaded]);

  // Update a specific preference by path (e.g. 'sidebar.collapsed')
  const updatePreferences = (path, value) => {
    setPreferences(prev => setNestedValue({ ...prev }, path, value));
  };

  // Reset all preferences to default
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Get a specific preference by path
  const getPreference = (path) => {
    return getNestedValue(preferences, path);
  };

  // Value object to be provided by the context
  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
    getPreference,
    isLoaded: loaded,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};