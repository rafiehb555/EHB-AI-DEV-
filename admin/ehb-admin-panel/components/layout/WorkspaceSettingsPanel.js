import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

/**
 * WorkspaceSettingsPanel Component
 * 
 * A sliding panel that displays workspace customization options
 * and allows users to adjust their workspace preferences.
 * Provides UI for all the settings available in the WorkspaceContext.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when closing the panel
 */
const WorkspaceSettingsPanel = ({ onClose }) => {
  const { 
    workspaceSettings,
    updateSetting,
    resetWorkspaceSettings,
    toggleSidebar,
    setTheme,
    setLayout,
    setFontSize,
    setPrimaryColor,
    setContentWidth,
    togglePanel,
    setPanelPosition,
    setPanelSize,
    exportSettings,
    importSettings,
    toggleWidget
  } = useWorkspace();
  
  // Track which section is expanded
  const [expandedSection, setExpandedSection] = useState('layout');
  
  // For file import
  const [importError, setImportError] = useState(null);
  
  // Toggle a section's expanded state
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Handle file upload for importing settings
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target.result;
        const success = importSettings(jsonString);
        if (success) {
          setImportError(null);
          alert('Settings imported successfully!');
        } else {
          setImportError('Invalid settings file format');
        }
      } catch (error) {
        setImportError('Error importing settings: ' + error.message);
      }
    };
    reader.onerror = () => {
      setImportError('Error reading file');
    };
    reader.readAsText(file);
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Workspace Settings</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Layout Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('layout')}
            >
              <span>Layout Preferences</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'layout' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'layout' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-4">
                {/* Layout Density */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Layout Density
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.layout === 'compact' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setLayout('compact')}
                    >
                      Compact
                    </button>
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.layout === 'default' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setLayout('default')}
                    >
                      Default
                    </button>
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.layout === 'expanded' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setLayout('expanded')}
                    >
                      Expanded
                    </button>
                  </div>
                </div>
                
                {/* Content Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Width
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.contentWidth === 'fluid' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setContentWidth('fluid')}
                    >
                      Fluid
                    </button>
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.contentWidth === 'fixed' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setContentWidth('fixed')}
                    >
                      Fixed
                    </button>
                  </div>
                </div>
                
                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.fontSize === 'small' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setFontSize('small')}
                    >
                      Small
                    </button>
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.fontSize === 'medium' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setFontSize('medium')}
                    >
                      Medium
                    </button>
                    <button
                      className={`px-3 py-2 text-sm rounded-md ${
                        workspaceSettings.fontSize === 'large' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setFontSize('large')}
                    >
                      Large
                    </button>
                  </div>
                </div>
                
                {/* Sidebar Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sidebar
                  </label>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sidebarCollapsed"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={workspaceSettings.sidebarCollapsed}
                        onChange={() => toggleSidebar()}
                      />
                      <label htmlFor="sidebarCollapsed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Collapsed Sidebar
                      </label>
                    </div>
                    
                    {!workspaceSettings.sidebarCollapsed && (
                      <div>
                        <label htmlFor="sidebarWidth" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          Sidebar Width: {workspaceSettings.sidebarWidth}px
                        </label>
                        <input
                          type="range"
                          id="sidebarWidth"
                          min="180"
                          max="320"
                          step="20"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          value={workspaceSettings.sidebarWidth}
                          onChange={(e) => updateSetting('sidebarWidth', parseInt(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Theme Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('theme')}
            >
              <span>Theme Settings</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'theme' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'theme' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className={`relative px-3 py-3 rounded-md border ${
                        workspaceSettings.theme === 'light' 
                          ? 'border-blue-500 ring-2 ring-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="h-8 bg-white border border-gray-200 rounded"></div>
                      <span className="block text-xs mt-1 text-center text-gray-700 dark:text-gray-300">Light</span>
                    </button>
                    
                    <button
                      className={`relative px-3 py-3 rounded-md border ${
                        workspaceSettings.theme === 'dark' 
                          ? 'border-blue-500 ring-2 ring-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="h-8 bg-gray-800 border border-gray-700 rounded"></div>
                      <span className="block text-xs mt-1 text-center text-gray-700 dark:text-gray-300">Dark</span>
                    </button>
                    
                    <button
                      className={`relative px-3 py-3 rounded-md border ${
                        workspaceSettings.theme === 'system' 
                          ? 'border-blue-500 ring-2 ring-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="h-8 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded"></div>
                      <span className="block text-xs mt-1 text-center text-gray-700 dark:text-gray-300">System</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['blue', 'purple', 'green', 'red', 'orange'].map(color => (
                      <button
                        key={color}
                        className={`h-10 rounded-md ${
                          workspaceSettings.primaryColor === color
                            ? 'ring-2 ring-offset-2 ring-gray-400'
                            : ''
                        }`}
                        style={{ 
                          backgroundColor: 
                            color === 'blue' ? '#3b82f6' : 
                            color === 'purple' ? '#8b5cf6' : 
                            color === 'green' ? '#10b981' : 
                            color === 'red' ? '#ef4444' : 
                            '#f97316' 
                        }}
                        onClick={() => setPrimaryColor(color)}
                        aria-label={`${color} theme`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Panels Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('panels')}
            >
              <span>Panel Visibility</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'panels' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'panels' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-3">
                {Object.keys(workspaceSettings.panels || {}).map(panelId => (
                  <div key={panelId} className="border-b pb-3 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`${panelId}Visible`} className="text-sm text-gray-700 dark:text-gray-300">
                        {panelId.charAt(0).toUpperCase() + panelId.slice(1)} Panel
                      </label>
                      <input
                        type="checkbox"
                        id={`${panelId}Visible`}
                        className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer appearance-none checked:bg-blue-500"
                        checked={workspaceSettings.panels[panelId]?.visible !== false}
                        onChange={() => togglePanel(panelId)}
                      />
                    </div>
                    
                    {workspaceSettings.panels[panelId]?.visible !== false && (
                      <div className="mt-2 space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Position
                          </label>
                          <div className="flex space-x-2">
                            {['left', 'right', 'top', 'bottom'].map(position => (
                              <button 
                                key={position}
                                className={`px-2 py-1 text-xs rounded ${
                                  workspaceSettings.panels[panelId]?.position === position
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => setPanelPosition(panelId, position)}
                              >
                                {position}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Size
                          </label>
                          <div className="flex space-x-2">
                            {['small', 'medium', 'large'].map(size => (
                              <button 
                                key={size}
                                className={`px-2 py-1 text-xs rounded ${
                                  workspaceSettings.panels[panelId]?.size === size
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => setPanelSize(panelId, size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Dashboard Widgets Section */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('widgets')}
            >
              <span>Dashboard Widgets</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'widgets' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'widgets' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-3">
                {(workspaceSettings.dashboardWidgets || []).map((widgetId) => (
                  <div key={widgetId} className="border-b pb-3 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {widgetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => toggleWidget(widgetId)}
                          aria-label="Remove Widget"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Size
                      </label>
                      <div className="flex space-x-2">
                        {['small', 'medium', 'large'].map(size => (
                          <button 
                            key={size}
                            className={`px-2 py-1 text-xs rounded ${
                              workspaceSettings.widgetSizes?.[widgetId] === size
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                            onClick={() => updateSetting(`widgetSizes.${widgetId}`, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-3">
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      const allPossibleWidgets = [
                        'quick-stats', 'recent-activity', 'analytics-chart', 'tasks',
                        'system-health', 'blockchain-status', 'calendar', 'notifications',
                        'revenue-chart', 'franchise-map'
                      ];
                      const missingWidgets = (allPossibleWidgets || []).filter(
                        w => !workspaceSettings.dashboardWidgets.includes(w)
                      );
                      if (missingWidgets.length > 0) {
                        toggleWidget(missingWidgets[0]);
                      }
                    }}
                  >
                    Add Widget
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Notification Settings */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('notifications')}
            >
              <span>Notification Settings</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'notifications' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'notifications' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="notificationSound" className="text-sm text-gray-700 dark:text-gray-300">
                    Sound Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="notificationSound"
                    className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer appearance-none checked:bg-blue-500"
                    checked={workspaceSettings.notifications?.sound !== false}
                    onChange={(e) => updateSetting('notifications.sound', e.target.checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="notificationDesktop" className="text-sm text-gray-700 dark:text-gray-300">
                    Desktop Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="notificationDesktop"
                    className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer appearance-none checked:bg-blue-500"
                    checked={workspaceSettings.notifications?.desktop !== false}
                    onChange={(e) => updateSetting('notifications.desktop', e.target.checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="notificationBadges" className="text-sm text-gray-700 dark:text-gray-300">
                    Show Badge Counts
                  </label>
                  <input
                    type="checkbox"
                    id="notificationBadges"
                    className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer appearance-none checked:bg-blue-500"
                    checked={workspaceSettings.notifications?.showBadges !== false}
                    onChange={(e) => updateSetting('notifications.showBadges', e.target.checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="notificationEmail" className="text-sm text-gray-700 dark:text-gray-300">
                    Email Digest
                  </label>
                  <input
                    type="checkbox"
                    id="notificationEmail"
                    className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer appearance-none checked:bg-blue-500"
                    checked={workspaceSettings.notifications?.emailDigest === true}
                    onChange={(e) => updateSetting('notifications.emailDigest', e.target.checked)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Priority
                  </label>
                  <div className="flex space-x-4">
                    {['all', 'important', 'none'].map(priority => (
                      <button
                        key={priority}
                        className={`px-3 py-2 text-sm rounded-md ${
                          workspaceSettings.notifications?.priority === priority
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => updateSetting('notifications.priority', priority)}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Import/Export Settings */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-gray-100 mb-2"
              onClick={() => toggleSection('importExport')}
            >
              <span>Import / Export</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === 'importExport' ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedSection === 'importExport' && (
              <div className="mt-4 pl-2 border-l-2 border-blue-500 space-y-4">
                <div>
                  <button
                    className="px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    onClick={exportSettings}
                  >
                    Export Settings
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Save your current workspace settings to a file
                  </p>
                </div>
                
                <div>
                  <label htmlFor="importSettings" className="block mb-2">
                    <span className="px-4 py-2 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md block cursor-pointer text-center">
                      Import Settings
                    </span>
                    <input
                      type="file"
                      id="importSettings"
                      className="hidden"
                      accept=".json"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Load workspace settings from a previously exported file
                  </p>
                  {importError && (
                    <p className="text-xs text-red-500 mt-1">{importError}</p>
                  )}
                </div>
                
                <div>
                  <button
                    className="px-4 py-2 w-full bg-red-600 hover:bg-red-700 text-white rounded-md"
                    onClick={resetWorkspaceSettings}
                  >
                    Reset to Defaults
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Reset all workspace settings to their default values
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSettingsPanel;