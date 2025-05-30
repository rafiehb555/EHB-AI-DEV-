import React, { createContext, useContext, useState, useEffect } from 'react';

// Default workspace settings
const defaultWorkspaceSettings = {
  // Layout settings
  sidebarCollapsed: false,
  sidebarWidth: 250,
  layout: 'default', // 'compact', 'default', 'expanded'
  contentWidth: 'fluid', // 'fluid', 'fixed'
  fontSize: 'medium', // 'small', 'medium', 'large'
  
  // Theme settings
  theme: 'light', // 'light', 'dark', 'system'
  primaryColor: 'blue', // 'blue', 'purple', 'green', 'red', 'orange'
  
  // Dashboard widgets
  dashboardWidgets: ['quick-stats', 'recent-activity', 'analytics-chart', 'tasks', 'system-health', 'blockchain-status'],
  widgetsOrder: {
    'quick-stats': 1,
    'recent-activity': 2,
    'analytics-chart': 3,
    'tasks': 4,
    'system-health': 5,
    'blockchain-status': 6
  },
  widgetSizes: {
    'quick-stats': 'medium', // 'small', 'medium', 'large'
    'recent-activity': 'medium',
    'analytics-chart': 'large',
    'tasks': 'medium',
    'system-health': 'small',
    'blockchain-status': 'medium'
  },
  
  // User preferences
  favorites: [],
  recentlyVisited: [],
  
  // Notification settings
  notifications: {
    showBadges: true,
    sound: true,
    desktop: true,
    emailDigest: false,
    priority: 'all' // 'all', 'important', 'none'
  },
  
  // Panel visibility and positions
  panels: {
    notifications: {
      visible: true,
      position: 'right',
      size: 'medium' // 'small', 'medium', 'large'
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
    blockchain: {
      visible: true,
      position: 'right',
      size: 'medium'
    },
    salesData: {
      visible: true,
      position: 'bottom',
      size: 'medium'
    }
  }
};

// Create context
const WorkspaceContext = createContext();

// Helper function to get nested property value using dot notation
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
};

// Helper function to set nested property value using dot notation
const setNestedValue = (obj, path, value) => {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let current = clone;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return clone;
};

// Create provider component
export const WorkspaceProvider = ({ children }) => {
  const [workspaceSettings, setWorkspaceSettings] = useState(defaultWorkspaceSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveMethod, setSaveMethod] = useState('local'); // 'local' or 'server'

  // Load workspace settings from localStorage or server on component mount
  useEffect(() => {
    const loadWorkspaceSettings = async () => {
      try {
        // Try to get user ID first
        const storedUser = localStorage.getItem('ehbUser');
        const userObj = storedUser ? JSON.parse(storedUser) : null;
        const currentUserId = userObj?.id || 'guest';
        setUserId(currentUserId);
        
        let loadedSettings = null;
        
        // Try to load from server first (if user is logged in)
        if (currentUserId !== 'guest') {
          try {
            const response = await fetch(`/api/user-preferences/${currentUserId}`);
            if (response.ok) {
              loadedSettings = await response.json();
              setSaveMethod('server');
              console.log('Loaded workspace settings from server');
            }
          } catch (serverError) {
            console.log('Could not load from server, falling back to localStorage');
          }
        }
        
        // Fall back to localStorage if server load failed or user is guest
        if (!loadedSettings) {
          const key = `workspaceSettings_${currentUserId}`;
          const storedSettings = localStorage.getItem(key);
          if (storedSettings) {
            loadedSettings = JSON.parse(storedSettings);
            console.log('Loaded workspace settings from localStorage');
          }
          setSaveMethod('local');
        }
        
        // Merge loaded settings with defaults to ensure all properties exist
        if (loadedSettings) {
          setWorkspaceSettings(prev => ({
            ...prev,
            ...loadedSettings
          }));
        }
      } catch (error) {
        console.error('Error loading workspace settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadWorkspaceSettings();
  }, []);

  // Save settings whenever they change, using a debounced approach
  useEffect(() => {
    // Don't save if not loaded yet
    if (!isLoaded) return;
    
    // Use a timeout to debounce frequent updates
    const timeoutId = setTimeout(async () => {
      try {
        const settingsKey = `workspaceSettings_${userId || 'guest'}`;
        
        // Save to server if user is logged in
        if (saveMethod === 'server' && userId && userId !== 'guest') {
          try {
            const response = await fetch(`/api/user-preferences/${userId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(workspaceSettings)
            });
            
            if (!response.ok) {
              throw new Error('Failed to save to server');
            }
            setSaveError(null);
          } catch (serverError) {
            console.error('Error saving to server, falling back to localStorage:', serverError);
            localStorage.setItem(settingsKey, JSON.stringify(workspaceSettings));
            setSaveMethod('local');
            setSaveError('Could not save to server, using local storage instead');
          }
        } else {
          // Always save to localStorage as backup or for guest users
          localStorage.setItem(settingsKey, JSON.stringify(workspaceSettings));
          setSaveError(null);
        }
        
        // Apply theme class to body
        if (typeof document !== 'undefined') {
          // Remove all theme classes first
          document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
          document.body.classList.remove('layout-default', 'layout-compact', 'layout-expanded');
          document.body.classList.remove('font-small', 'font-medium', 'font-large');
          
          // Apply theme class
          document.body.classList.add(`theme-${workspaceSettings.theme}`);
          
          // Apply layout class
          document.body.classList.add(`layout-${workspaceSettings.layout}`);
          
          // Apply font size class
          document.body.classList.add(`font-${workspaceSettings.fontSize}`);
          
          // Apply primary color class
          document.body.classList.add(`color-${workspaceSettings.primaryColor}`);
          
          // Apply width class
          document.body.classList.add(`content-${workspaceSettings.contentWidth}`);
          
          // Apply sidebar state
          if (workspaceSettings.sidebarCollapsed) {
            document.body.classList.add('sidebar-collapsed');
          } else {
            document.body.classList.remove('sidebar-collapsed');
          }
        }
      } catch (error) {
        console.error('Error saving workspace settings:', error);
        setSaveError('Failed to save settings');
      }
    }, 300); // Wait 300ms before saving
    
    // Clear the timeout if workspaceSettings changes again before it fires
    return () => clearTimeout(timeoutId);
  }, [workspaceSettings, isLoaded, userId, saveMethod]);

  // Generic method to update any setting with dot notation path support
  const updateSetting = (path, value) => {
    setWorkspaceSettings(prev => setNestedValue(prev, path, value));
  };

  // Get a specific setting by path
  const getSetting = (path, defaultValue) => {
    const value = getNestedValue(workspaceSettings, path);
    return value !== undefined ? value : defaultValue;
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setWorkspaceSettings(prevSettings => ({
      ...prevSettings,
      sidebarCollapsed: !prevSettings.sidebarCollapsed
    }));
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setWorkspaceSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  // Set specific theme
  const setTheme = (theme) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      theme
    }));
  };

  // Set content width (fluid or fixed)
  const setContentWidth = (width) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      contentWidth: width
    }));
  };

  // Set primary color
  const setPrimaryColor = (color) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      primaryColor: color
    }));
  };

  // Set layout type (compact, default, expanded)
  const setLayout = (layout) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      layout
    }));
  };

  // Set font size (small, medium, large)
  const setFontSize = (size) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  // Toggle visibility of a specific panel
  const togglePanel = (panelId) => {
    setWorkspaceSettings(prev => {
      // Ensure the panel exists in the settings
      if (!prev.panels[panelId]) {
        return prev;
      }
      
      return {
        ...prev,
        panels: {
          ...prev.panels,
          [panelId]: {
            ...prev.panels[panelId],
            visible: !prev.panels[panelId].visible
          }
        }
      };
    });
  };

  // Set panel position
  const setPanelPosition = (panelId, position) => {
    setWorkspaceSettings(prev => {
      // Ensure the panel exists in the settings
      if (!prev.panels[panelId]) {
        return prev;
      }
      
      return {
        ...prev,
        panels: {
          ...prev.panels,
          [panelId]: {
            ...prev.panels[panelId],
            position
          }
        }
      };
    });
  };

  // Set panel size
  const setPanelSize = (panelId, size) => {
    setWorkspaceSettings(prev => {
      // Ensure the panel exists in the settings
      if (!prev.panels[panelId]) {
        return prev;
      }
      
      return {
        ...prev,
        panels: {
          ...prev.panels,
          [panelId]: {
            ...prev.panels[panelId],
            size
          }
        }
      };
    });
  };

  // Toggle visibility of a dashboard widget
  const toggleWidget = (widgetId) => {
    setWorkspaceSettings(prev => {
      const widgets = [...prev.dashboardWidgets];
      const index = widgets.indexOf(widgetId);
      
      if (index > -1) {
        widgets.splice(index, 1);
      } else {
        widgets.push(widgetId);
        
        // Clone the widget order object to avoid mutating the previous state
        const updatedWidgetsOrder = { ...prev.widgetsOrder };
        
        // Also add to widget order if it's not there
        if (!updatedWidgetsOrder[widgetId]) {
          // Find the highest order and add 1
          const values = Object.values(updatedWidgetsOrder);
          const highestOrder = values.length > 0 ? Math.max(...values) : 0;
          updatedWidgetsOrder[widgetId] = highestOrder + 1;
        }
        
        return {
          ...prev,
          dashboardWidgets: widgets,
          widgetsOrder: updatedWidgetsOrder
        };
      }
      
      // If we're just removing a widget, only update the dashboardWidgets array
      return {
        ...prev,
        dashboardWidgets: widgets
      };
    });
  };

  // Set widget size
  const setWidgetSize = (widgetId, size) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      widgetSizes: {
        ...prev.widgetSizes,
        [widgetId]: size
      }
    }));
  };

  // Change the order of widgets
  const reorderWidgets = (widgetId, newPosition) => {
    setWorkspaceSettings(prev => {
      const currentOrder = { ...prev.widgetsOrder };
      const oldPosition = currentOrder[widgetId];
      
      // Adjust all widgets between old and new position
      Object.keys(currentOrder).forEach(key => {
        if (oldPosition < newPosition) {
          // Moving down
          if (currentOrder[key] > oldPosition && currentOrder[key] <= newPosition) {
            currentOrder[key]--;
          }
        } else {
          // Moving up
          if (currentOrder[key] < oldPosition && currentOrder[key] >= newPosition) {
            currentOrder[key]++;
          }
        }
      });
      
      // Set the new position for the widget
      currentOrder[widgetId] = newPosition;
      
      return {
        ...prev,
        widgetsOrder: currentOrder
      };
    });
  };

  // Add a service to favorites
  const addToFavorites = (serviceId) => {
    setWorkspaceSettings(prev => {
      if (prev.favorites.includes(serviceId)) {
        return prev;
      }
      
      return {
        ...prev,
        favorites: [...prev.favorites, serviceId]
      };
    });
  };

  // Remove a service from favorites
  const removeFromFavorites = (serviceId) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      favorites: (prev.favorites || []).filter(id => id !== serviceId)
    }));
  };

  // Add a page to recently visited
  const addToRecentlyVisited = (pageInfo) => {
    setWorkspaceSettings(prev => {
      // Remove if already exists (to avoid duplicates)
      const filtered = (prev.recentlyVisited || []).filter(
        item => item.path !== pageInfo.path
      );
      
      // Add to the beginning of the array (most recent first)
      const updated = [pageInfo, ...filtered];
      
      // Keep only the 10 most recent
      const limited = updated.slice(0, 10);
      
      return {
        ...prev,
        recentlyVisited: limited
      };
    });
  };

  // Update notification settings
  const updateNotificationSettings = (settings) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...settings
      }
    }));
  };

  // Set notification priority
  const setNotificationPriority = (priority) => {
    updateNotificationSettings({ priority });
  };

  // Toggle email digest for notifications
  const toggleEmailDigest = () => {
    updateNotificationSettings({ 
      emailDigest: !workspaceSettings.notifications.emailDigest 
    });
  };

  // Toggle sound for notifications
  const toggleNotificationSound = () => {
    updateNotificationSettings({ 
      sound: !workspaceSettings.notifications.sound 
    });
  };

  // Reset all workspace settings to default
  const resetWorkspaceSettings = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all workspace settings to default?')) {
      setWorkspaceSettings(defaultWorkspaceSettings);
    }
  };

  // Export settings to a JSON file
  const exportSettings = () => {
    if (typeof window !== 'undefined') {
      const dataStr = JSON.stringify(workspaceSettings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ehb-workspace-settings-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  // Import settings from a JSON file
  const importSettings = (jsonString) => {
    try {
      const settings = JSON.parse(jsonString);
      setWorkspaceSettings(prev => ({
        ...prev,
        ...settings
      }));
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  };

  // Context value
  const contextValue = {
    workspaceSettings,
    isLoaded,
    saveError,
    updateSetting,
    getSetting,
    toggleSidebar,
    toggleTheme,
    setTheme,
    setContentWidth,
    setPrimaryColor,
    setLayout,
    setFontSize,
    togglePanel,
    setPanelPosition,
    setPanelSize,
    toggleWidget,
    setWidgetSize,
    reorderWidgets,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyVisited,
    updateNotificationSettings,
    setNotificationPriority,
    toggleEmailDigest,
    toggleNotificationSound,
    resetWorkspaceSettings,
    exportSettings,
    importSettings
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook to use the workspace context
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export default WorkspaceContext;