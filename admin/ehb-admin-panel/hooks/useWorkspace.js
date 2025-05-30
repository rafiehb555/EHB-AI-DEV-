import { useContext } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext';

/**
 * useWorkspace Hook
 * 
 * Custom hook for accessing and updating workspace preferences
 * such as theme, sidebar state, and layout settings.
 * 
 * @returns {Object} Workspace context methods and values
 */
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  
  return context;
};

/**
 * useDashboardLayout Hook
 * 
 * Custom hook for layout-specific functions
 * 
 * @returns {Object} Layout-specific methods and values
 */
export const useDashboardLayout = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    dashboardWidgets,
    updateWidgetOrder,
    visibleWidgets,
    toggleWidgetVisibility
  } = useWorkspace();
  
  return {
    sidebarCollapsed,
    toggleSidebar,
    dashboardWidgets,
    updateWidgetOrder,
    visibleWidgets,
    toggleWidgetVisibility
  };
};

/**
 * useTheme Hook
 * 
 * Custom hook for theme-related functionality
 * 
 * @returns {Object} Theme methods and values
 */
export const useTheme = () => {
  const { theme, setTheme } = useWorkspace();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isLightTheme: theme === 'light',
    isDarkTheme: theme === 'dark'
  };
};

export default useWorkspace;