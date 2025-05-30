import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import DraggablePanel from './DraggablePanel';

const WorkspaceSettingsPanel = ({ onClose }) => {
  const { 
    workspaceSettings, 
    updateSetting, 
    resetSettings,
  } = useWorkspace();
  
  const handleThemeChange = (e) => {
    updateSetting('theme', e.target.value);
  };
  
  const handleLayoutChange = (e) => {
    updateSetting('layout', e.target.value);
  };
  
  const handleFontSizeChange = (e) => {
    updateSetting('fontSize', e.target.value);
  };
  
  const handleSidebarWidthChange = (e) => {
    updateSetting('sidebarWidth', parseInt(e.target.value, 10));
  };
  
  const handlePanelVisibilityChange = (panelId, checked) => {
    updateSetting(`panels.${panelId}.visible`, checked);
  };
  
  const handlePanelPositionChange = (panelId, position) => {
    updateSetting(`panels.${panelId}.position`, position);
  };
  
  const handlePanelSizeChange = (panelId, size) => {
    updateSetting(`panels.${panelId}.size`, size);
  };
  
  return (
    <DraggablePanel
      id="workspaceSettings"
      title="Workspace Settings"
      defaultPosition={{ x: 50, y: 50 }}
      defaultSize={{ width: 400, height: 550 }}
      onClose={onClose}
    ></DraggablePanel>
      <div>
        <h4 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>General Settings</h4>
        
        {/* Theme Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Theme
          </label>
          <select
            value={workspaceSettings.theme}
            onChange={handleThemeChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
        
        {/* Layout Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Layout
          </label>
          <select
            value={workspaceSettings.layout}
            onChange={handleLayoutChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          >
            <option value="default">Default</option>
            <option value="compact">Compact</option>
            <option value="expanded">Expanded</option>
          </select>
        </div>
        
        {/* Font Size Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Font Size
          </label>
          <select
            value={workspaceSettings.fontSize}
            onChange={handleFontSizeChange}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        {/* Sidebar Width Slider */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Sidebar Width: {workspaceSettings.sidebarWidth}px
          </label>
          <input
            type="range"
            min="150"
            max="350"
            step="10"
            value={workspaceSettings.sidebarWidth}
            onChange={handleSidebarWidthChange}
            style={{ width: '100%' }}
          />
        </div>
        
        <h4 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '16px' }}>Panel Settings</h4>
        
        {/* Notification Panel */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 'bold' }}>
              Notifications Panel
            </label>
            <div>
              <input
                type="checkbox"
                id="notifications-visible"
                checked={workspaceSettings.panels.notifications?.visible}
                onChange={(e) => handlePanelVisibilityChange('notifications', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="notifications-visible">Visible</label>
            </div>
          </div>
          
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Position
            </label>
            <select
              value={workspaceSettings.panels.notifications?.position || 'right'}
              onChange={(e) => handlePanelPositionChange('notifications', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '6px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da' 
              }}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 'bold' }}>
              Quick Actions Panel
            </label>
            <div>
              <input
                type="checkbox"
                id="quickActions-visible"
                checked={workspaceSettings.panels.quickActions?.visible}
                onChange={(e) => handlePanelVisibilityChange('quickActions', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="quickActions-visible">Visible</label>
            </div>
          </div>
          
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Position
            </label>
            <select
              value={workspaceSettings.panels.quickActions?.position || 'top'}
              onChange={(e) => handlePanelPositionChange('quickActions', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '6px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da' 
              }}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
        
        {/* Recent Activity Panel */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 'bold' }}>
              Recent Activity Panel
            </label>
            <div>
              <input
                type="checkbox"
                id="recentActivity-visible"
                checked={workspaceSettings.panels.recentActivity?.visible}
                onChange={(e) => handlePanelVisibilityChange('recentActivity', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="recentActivity-visible">Visible</label>
            </div>
          </div>
          
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Position
            </label>
            <select
              value={workspaceSettings.panels.recentActivity?.position || 'bottom'}
              onChange={(e) => handlePanelPositionChange('recentActivity', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '6px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da' 
              }}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
        
        {/* Reset Button */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={resetSettings}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default WorkspaceSettingsPanel;