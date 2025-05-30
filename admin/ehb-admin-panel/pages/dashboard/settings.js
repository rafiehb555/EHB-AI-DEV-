import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useWorkspace } from '../../context/WorkspaceContext';

const Settings = () => {
  const { 
    workspaceSettings, 
    toggleTheme, 
    setTheme, 
    toggleWidget, 
    updateNotificationSettings,
    resetWorkspaceSettings
  } = useWorkspace();
  
  const [activeTab, setActiveTab] = useState('appearance');
  
  // Function to handle appearance form submission
  const handleAppearanceSubmit = (e) => {
    e.preventDefault();
    // The changes are applied immediately via the context functions
    alert('Appearance settings saved');
  };
  
  // Function to handle widgets form submission
  const handleWidgetsSubmit = (e) => {
    e.preventDefault();
    // The changes are applied immediately via the context functions
    alert('Widget settings saved');
  };
  
  // Function to handle notification settings form submission
  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    // The changes are applied immediately via the context functions
    alert('Notification settings saved');
  };
  
  // Function to handle form reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      resetWorkspaceSettings();
      alert('All settings have been reset to default');
    }
  };
  
  // Helper to get text color based on theme
  const getTextColor = () => {
    return workspaceSettings.theme === 'dark' ? '#f9fafb' : '#111827';
  };
  
  // Helper to get background color based on theme
  const getCardBackground = () => {
    return workspaceSettings.theme === 'dark' ? '#1f2937' : 'white';
  };
  
  // Helper to get border color based on theme
  const getBorderColor = () => {
    return workspaceSettings.theme === 'dark' ? '#374151' : '#e5e7eb';
  };
  
  // Tab styles
  const getTabStyle = (tabName) => {
    return {
      padding: '0.75rem 1.25rem',
      fontWeight: activeTab === tabName ? 'bold' : 'normal',
      borderBottom: activeTab === tabName 
        ? `2px solid ${workspaceSettings.theme === 'dark' ? '#3b82f6' : '#2563eb'}`
        : '2px solid transparent',
      color: activeTab === tabName
        ? (workspaceSettings.theme === 'dark' ? '#3b82f6' : '#2563eb')
        : getTextColor(),
      cursor: 'pointer'
    };
  };
  
  // Button styles
  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: workspaceSettings.theme === 'dark' ? '#3b82f6' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 'medium',
    cursor: 'pointer'
  };
  
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor()
  };
  
  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: workspaceSettings.theme === 'dark' ? '#dc2626' : '#ef4444'
  };
  
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Settings
      </h1>
      
      <div style={{
        backgroundColor: getCardBackground(),
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${getBorderColor()}`
        }}>
          <div
            style={getTabStyle('appearance')}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </div>
          <div
            style={getTabStyle('widgets')}
            onClick={() => setActiveTab('widgets')}
          >
            Dashboard Widgets
          </div>
          <div
            style={getTabStyle('notifications')}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </div>
        </div>
        
        {/* Tab Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleAppearanceSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Theme
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    backgroundColor: workspaceSettings.theme === 'light' 
                      ? (workspaceSettings.theme === 'dark' ? '#3b82f6' : '#dbeafe')
                      : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={workspaceSettings.theme === 'light'}
                      onChange={() => setTheme('light')}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <div style={{
                      width: '120px',
                      height: '80px',
                      backgroundColor: 'white',
                      borderRadius: '0.25rem',
                      border: '1px solid #e5e7eb',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        height: '20px', 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                      }}></div>
                    </div>
                    <span>Light</span>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    backgroundColor: workspaceSettings.theme === 'dark' 
                      ? (workspaceSettings.theme === 'dark' ? '#3b82f6' : '#dbeafe')
                      : 'transparent'
                  }}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={workspaceSettings.theme === 'dark'}
                      onChange={() => setTheme('dark')}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <div style={{
                      width: '120px',
                      height: '80px',
                      backgroundColor: '#111827',
                      borderRadius: '0.25rem',
                      border: '1px solid #374151',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        height: '20px', 
                        backgroundColor: '#1f2937',
                        borderBottom: '1px solid #374151'
                      }}></div>
                    </div>
                    <span>Dark</span>
                  </label>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Sidebar
                </h2>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}>
                  <input
                    type="checkbox"
                    checked={workspaceSettings.sidebarCollapsed}
                    onChange={() => toggleSidebar()}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>Start with collapsed sidebar</span>
                </label>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '2rem',
                borderTop: `1px solid ${getBorderColor()}`,
                paddingTop: '1.5rem'
              }}>
                <button type="button" onClick={handleReset} style={dangerButtonStyle}>
                  Reset to Default
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" style={secondaryButtonStyle}>
                    Cancel
                  </button>
                  <button type="submit" style={buttonStyle}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Widgets Tab */}
          {activeTab === 'widgets' && (
            <form onSubmit={handleWidgetsSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Dashboard Widgets
                </h2>
                <p style={{ marginBottom: '1rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  Select which widgets to display on your dashboard. You can also rearrange their order on the dashboard page.
                </p>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.dashboardWidgets.includes('quick-stats')}
                      onChange={() => toggleWidget('quick-stats')}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Quick Stats</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Shows key metrics and statistics
                      </div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.dashboardWidgets.includes('recent-activity')}
                      onChange={() => toggleWidget('recent-activity')}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Recent Activity</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Shows recent user and system activity
                      </div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.dashboardWidgets.includes('analytics-chart')}
                      onChange={() => toggleWidget('analytics-chart')}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Analytics Chart</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Shows graphical data visualization
                      </div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: `1px solid ${getBorderColor()}`,
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.dashboardWidgets.includes('tasks')}
                      onChange={() => toggleWidget('tasks')}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Tasks</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Shows active and pending tasks
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '2rem',
                borderTop: `1px solid ${getBorderColor()}`,
                paddingTop: '1.5rem'
              }}>
                <button type="button" onClick={handleReset} style={dangerButtonStyle}>
                  Reset to Default
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" style={secondaryButtonStyle}>
                    Cancel
                  </button>
                  <button type="submit" style={buttonStyle}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Notification Settings
                </h2>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.notifications.showBadges}
                      onChange={() => updateNotificationSettings({ 
                        showBadges: !workspaceSettings.notifications.showBadges 
                      })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Show notification badges</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Display badges for unread notifications
                      </div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.notifications.sound}
                      onChange={() => updateNotificationSettings({ 
                        sound: !workspaceSettings.notifications.sound 
                      })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Play sound for new notifications</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Play a sound when new notifications arrive
                      </div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={workspaceSettings.notifications.desktop}
                      onChange={() => updateNotificationSettings({ 
                        desktop: !workspaceSettings.notifications.desktop 
                      })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'medium' }}>Enable desktop notifications</div>
                      <div style={{ fontSize: '0.875rem', color: workspaceSettings.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Show browser notifications when new alerts arrive
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '2rem',
                borderTop: `1px solid ${getBorderColor()}`,
                paddingTop: '1.5rem'
              }}>
                <button type="button" onClick={handleReset} style={dangerButtonStyle}>
                  Reset to Default
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" style={secondaryButtonStyle}>
                    Cancel
                  </button>
                  <button type="submit" style={buttonStyle}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

Settings.getLayout = (page) => <DashboardLayout></DashboardLayout>{page}</DashboardLayout>;

export default Settings;