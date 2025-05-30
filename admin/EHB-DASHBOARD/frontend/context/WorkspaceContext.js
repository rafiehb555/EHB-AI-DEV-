import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getUserPreferences,
  saveUserPreferences,
  updateUserPreferences,
  resetUserPreferences
} from '../services/userPreferencesService';

// Create context
const WorkspaceContext = createContext();

// Default workspace settings
const DEFAULT_WORKSPACE_SETTINGS = {
  layout: 'default',  // default, compact, expanded
  theme: 'light',     // light, dark, system
  fontSize: 'medium', // small, medium, large
  sidebarWidth: 250,  // in pixels
  sidebarCollapsed: false,
  panels: {
    notifications: {
      visible: true,
      position: 'right',
      size: 'medium'  // small, medium, large
    },
    quickActions: {
      visible: true,
      position: 'top',
      size: 'medium'
    },
    recentActivity: {
      visible: true,
      position: 'bottom',
      size: 'medium'
    },
    gosellr: {
      visible: true,
      position: 'right',
      size: 'medium'
    },
    franchiseData: {
      visible: true,
      position: 'bottom',
      size: 'medium'
    },
    sqlStatus: {
      visible: true,
      position: 'left',
      size: 'small'
    }
  },
  modules: {
    order: [], // IDs of modules in preferred order
    favorites: [], // IDs of favorite modules
    hidden: []  // IDs of hidden modules
  }
};

// Provider component
export const WorkspaceProvider = ({ children }) => {
  const [workspaceSettings, setWorkspaceSettings] = useState(DEFAULT_WORKSPACE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [saveMethod, setSaveMethod] = useState('local'); // 'local' or 'server'

  // Detect current user
  useEffect(() => {
    // Try to get the user ID from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData && userData.id) {
          setUserId(userData.id);
          setSaveMethod('server');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Load workspace settings (from server if user is logged in, otherwise localStorage)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (userId && saveMethod === 'server') {
          // Try to load settings from the server
          try {
            const serverSettings = await getUserPreferences(userId);
            if (serverSettings && Object.keys(serverSettings).length > 0) {
              // Merge server settings with defaults to ensure all properties exist
              setWorkspaceSettings({ ...DEFAULT_WORKSPACE_SETTINGS, ...serverSettings });
              console.log('Loaded workspace settings from server');
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error loading settings from server, falling back to localStorage:', error);
          }
        }
        
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('workspaceSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          // Merge saved settings with defaults to ensure all properties exist
          setWorkspaceSettings({ ...DEFAULT_WORKSPACE_SETTINGS, ...parsedSettings });
          console.log('Loaded workspace settings from localStorage');
        }
      } catch (error) {
        console.error('Error loading workspace settings:', error);
        // Fallback to defaults on error
        setWorkspaceSettings(DEFAULT_WORKSPACE_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [userId, saveMethod]);

  // Save settings whenever they change
  useEffect(() => {
    // Don't save during initial loading
    if (!isLoading) {
      try {
        // Always save to localStorage as a fallback
        localStorage.setItem('workspaceSettings', JSON.stringify(workspaceSettings));
        
        // Save to server if user is logged in
        if (userId && saveMethod === 'server') {
          saveUserPreferences(userId, workspaceSettings)
            .catch(error => console.error('Error saving workspace settings to server:', error));
        }
      } catch (error) {
        console.error('Error saving workspace settings:', error);
      }
    }
  }, [workspaceSettings, isLoading, userId, saveMethod]);

  // Update a specific setting
  const updateSetting = (path, value) => {
    setWorkspaceSettings(prevSettings => {
      // Handle nested paths like 'panels.notifications.visible'
      if (path.includes('.')) {
        const pathParts = path.split('.');
        const newSettings = { ...prevSettings };
        let current = newSettings;
        
        // Navigate to the nested object
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }
        
        // Set the value
        current[pathParts[pathParts.length - 1]] = value;
        return newSettings;
      }
      
      // Handle top-level setting
      return { ...prevSettings, [path]: value };
    });
  };

  // Reset all settings to defaults
  const resetSettings = async () => {
    setWorkspaceSettings(DEFAULT_WORKSPACE_SETTINGS);
    
    // If user is logged in, reset server-side preferences
    if (userId && saveMethod === 'server') {
      try {
        await resetUserPreferences(userId);
        console.log('Reset server-side workspace preferences');
      } catch (error) {
        console.error('Error resetting server-side workspace preferences:', error);
      }
    }
  };

  // Add module to favorites
  const addFavoriteModule = (moduleId) => {
    setWorkspaceSettings(prevSettings => {
      const favorites = [...prevSettings.modules.favorites];
      if (!favorites.includes(moduleId)) {
        favorites.push(moduleId);
      }
      return {
        ...prevSettings,
        modules: {
          ...prevSettings.modules,
          favorites
        }
      };
    });
  };

  // Remove module from favorites
  const removeFavoriteModule = (moduleId) => {
    setWorkspaceSettings(prevSettings => {
      const favorites = (prevSettings.favorites || []).filter(id => id !== moduleId);
      return {
        ...prevSettings,
        modules: {
          ...prevSettings.modules,
          favorites
        }
      };
    });
  };

  // Reorder modules
  const reorderModules = (moduleIds) => {
    setWorkspaceSettings(prevSettings => ({
      ...prevSettings,
      modules: {
        ...prevSettings.modules,
        order: moduleIds
      }
    }));
  };

  // Hide a module
  const hideModule = (moduleId) => {
    setWorkspaceSettings(prevSettings => {
      const hidden = [...prevSettings.modules.hidden];
      if (!hidden.includes(moduleId)) {
        hidden.push(moduleId);
      }
      return {
        ...prevSettings,
        modules: {
          ...prevSettings.modules,
          hidden
        }
      };
    });
  };

  // Show a hidden module
  const showModule = (moduleId) => {
    setWorkspaceSettings(prevSettings => {
      const hidden = (prevSettings.hidden || []).filter(id => id !== moduleId);
      return {
        ...prevSettings,
        modules: {
          ...prevSettings.modules,
          hidden
        }
      };
    });
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setWorkspaceSettings(prevSettings => ({
      ...prevSettings,
      sidebarCollapsed: !prevSettings.sidebarCollapsed
    }));
  };

  // Context value
  const value = {
    workspaceSettings,
    isLoading,
    updateSetting,
    resetSettings,
    addFavoriteModule,
    removeFavoriteModule,
    reorderModules,
    hideModule,
    showModule,
    toggleSidebar
  };

  return (
    <WorkspaceContext.Provider value={value}></WorkspaceContext>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook for using the context
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};