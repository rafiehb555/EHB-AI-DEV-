import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import DraggablePanel from './DraggablePanel';
import WorkspaceSettingsPanel from './WorkspaceSettingsPanel';
import { NotificationButton } from '../notifications';

const WorkspaceDashboard = ({ children }) => {
  const { 
    workspaceSettings, 
    toggleSidebar,
    updateSetting
  } = useWorkspace();
  
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'quickActions', title: 'Quick Actions', icon: '⚡' },
    { id: 'recentActivity', title: 'Recent Activity', icon: '📋' },
    { id: 'calendar', title: 'Calendar', icon: '📅' },
    { id: 'tasks', title: 'Tasks', icon: '✓' },
    { id: 'analytics', title: 'Analytics', icon: '📊' },
    { id: 'gosellr', title: 'GoSellr Dashboard', icon: '🛒' },
    { id: 'franchiseData', title: 'Franchise Data', icon: '🏪' },
    { id: 'sqlStatus', title: 'SQL Status', icon: '📊' }
  ]);
  
  // Apply theme from settings
  useEffect(() => {
    const applyTheme = () => {
      const theme = workspaceSettings.theme;
      document.body.classList.remove('theme-light', 'theme-dark');
      
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      } else {
        document.body.classList.add(`theme-${theme}`);
      }
    };
    
    applyTheme();
    
    // Listen for system theme changes if using system preference
    if (workspaceSettings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, [workspaceSettings.theme]);
  
  // Apply font size from settings
  useEffect(() => {
    const fontSize = workspaceSettings.fontSize;
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
  }, [workspaceSettings.fontSize]);
  
  // Initialize active modules based on settings and user type
  useEffect(() => {
    const initActiveModules = () => {
      try {
        // Check for user type to show context-specific modules
        let userType = 'standard';
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userType = userData.userType || 'standard';
        }
        
        // Filter available modules based on user type
        let filteredModules = [...availableModules];
        
        // If user is a standard user, remove GoSellr and franchise modules
        if (userType === 'standard') {
          filteredModules = (filteredModules || []).filter(
            module => !['gosellr', 'franchiseData'].includes(module.id)
          );
        }
        
        // If user is a seller, show GoSellr but not franchise
        if (userType === 'seller') {
          filteredModules = (filteredModules || []).filter(
            module => module.id !== 'franchiseData'
          );
        }
        
        // Start with panels that are set to visible in settings
        const visiblePanels = Object.keys(workspaceSettings.panels)
          .filter(id => workspaceSettings.panels[id]?.visible)
          .map(id => filteredModules.find(module => module.id === id))
          .filter(Boolean);
        
        setActiveModules(visiblePanels);
        
        // Update available modules to match user type
        setAvailableModules(filteredModules);
      } catch (error) {
        console.error('Error initializing modules based on user type:', error);
        // Fallback to default behavior
        const visiblePanels = Object.keys(workspaceSettings.panels)
          .filter(id => workspaceSettings.panels[id]?.visible)
          .map(id => availableModules.find(module => module.id === id))
          .filter(Boolean);
        
        setActiveModules(visiblePanels);
      }
    };
    
    initActiveModules();
  }, [workspaceSettings.panels, availableModules]);
  
  // Toggle settings panel
  const handleToggleSettings = () => {
    setShowSettingsPanel(prev => !prev);
  };
  
  // Add a module to the workspace
  const handleAddModule = (moduleId) => {
    const module = availableModules.find(m => m.id === moduleId);
    if (module && !activeModules.find(m => m.id === moduleId)) {
      setActiveModules(prev => [...prev, module]);
      updateSetting(`panels.${moduleId}.visible`, true);
    }
  };
  
  // Remove a module from the workspace
  const handleRemoveModule = (moduleId) => {
    setActiveModules((prev) => (prev || []).filter(m => m.id !== moduleId));
    updateSetting(`panels.${moduleId}.visible`, false);
  };
  
  // Get panel content based on module ID
  const getPanelContent = (moduleId) => {
    switch (moduleId) {
      case 'notifications':
        return (
          <div>
            <h4>Recent Notifications</h4>
            <p>You have no new notifications.</p>
          </div>
        );
      case 'quickActions':
        return (
          <div>
            <h4>Quick Actions</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['New Document', 'Add Contact', 'Schedule Meeting', 'Create Task'].map(action => (
                <button
                  key={action}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#e9ecef',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        );
      case 'recentActivity':
        return (
          <div>
            <h4>Recent Activity</h4>
            <ul style={{ paddingLeft: '20px' }}>
              {[
                'Document updated: Project Proposal',
                'Meeting scheduled: Team Sync',
                'Task completed: Update Dashboard',
                'Comment added: Marketing Plan'
              ].map(activity => (
                <li key={activity} style={{ marginBottom: '8px' }}>{activity}</li>
              ))}
            </ul>
          </div>
        );
      case 'calendar':
        return (
          <div>
            <h4>Calendar</h4>
            <p>Calendar view will be implemented soon.</p>
          </div>
        );
      case 'tasks':
        return (
          <div>
            <h4>Tasks</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { title: 'Complete dashboard design', done: true },
                { title: 'Review pull requests', done: false },
                { title: 'Update documentation', done: false },
                { title: 'Prepare demo for meeting', done: false }
              ].map((task, index) => (
                <li 
                  key={index} 
                  style={{ 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={task.done} 
                    readOnly 
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h4>Analytics</h4>
            <p>Analytics dashboard will be implemented soon.</p>
          </div>
        );
      case 'gosellr':
        return (
          <div>
            <h4>GoSellr Dashboard</h4>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Orders Today</span>
                <strong>24</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Revenue</span>
                <strong>$1,245.80</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span>Active Products</span>
                <strong>127</strong>
              </div>
            </div>
            <a href="/gosellr" style={{ 
              display: 'block',
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Go to GoSellr Dashboard
            </a>
          </div>
        );
      case 'franchiseData':
        return (
          <div>
            <h4>Franchise Data</h4>
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>Orders by Area</h5>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px' 
              }}>
                {[
                  { name: 'North Zone', count: 120, color: '#4CAF50' },
                  { name: 'South Zone', count: 87, color: '#2196F3' },
                  { name: 'East Zone', count: 45, color: '#FFC107' },
                  { name: 'West Zone', count: 68, color: '#9C27B0' }
                ].map((zone, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: zone.color,
                      marginRight: '8px',
                      borderRadius: '2px'
                    }}></div>
                    <div style={{ flex: 1 }}>{zone.name}</div>
                    <div><strong>{zone.count}</strong></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>Sub-Franchise Performance</h5>
              <div style={{ 
                height: '100px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                padding: '8px'
              }}>
                {[65, 40, 85, 30, 70, 55, 45].map((height, index) => (
                  <div key={index} style={{ 
                    height: `${height}%`, 
                    flex: 1, 
                    backgroundColor: `hsl(${index * 40}, 70%, 60%)`,
                    borderTopLeftRadius: '2px',
                    borderTopRightRadius: '2px'
                  }}></div>
                ))}
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '10px',
                color: '#6c757d',
                marginTop: '4px'
              }}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        );
      case 'sqlStatus':
        return (
          <div>
            <h4>SQL Status</h4>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span>Current Level</span>
                <span style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>NORMAL</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                  Progress to HIGH
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '65%', 
                    height: '100%', 
                    backgroundColor: '#4CAF50' 
                  }}></div>
                </div>
              </div>
              <div style={{ 
                fontSize: '12px', 
                backgroundColor: '#f8f9fa',
                padding: '8px',
                borderRadius: '4px'
              }}>
                <div style={{ marginBottom: '4px' }}><strong>Affiliate Bonuses</strong></div>
                <div>Level 1-3 earnings unlocked</div>
                <div>Earnings: $345.78 this month</div>
              </div>
            </div>
            <a href="/sql-upgrade" style={{ 
              display: 'block',
              textAlign: 'center',
              padding: '6px',
              backgroundColor: '#2196F3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              Upgrade SQL Level
            </a>
          </div>
        );
      default:
        return <p>Module content not available</p>;
    }
  };
  
  // Layout class based on settings
  const layoutClass = `layout-${workspaceSettings.layout}`;
  
  // Main container style based on sidebar width and collapsed state
  const mainContainerStyle = {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden'
  };
  
  // Sidebar style
  const sidebarStyle = {
    width: workspaceSettings.sidebarCollapsed ? '60px' : `${workspaceSettings.sidebarWidth}px`,
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease'
  };
  
  // Content area style
  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    position: 'relative'
  };
  
  return (
    <div className={`workspace-dashboard ${layoutClass}`} style={mainContainerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '18px', 
            display: workspaceSettings.sidebarCollapsed ? 'none' : 'block' 
          }}>
            EHB Dashboard
          </h2>
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {workspaceSettings.sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '12px' }}>
              Main Navigation
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'dashboard', icon: '🏠', label: 'Dashboard' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  backgroundColor: item.id === 'dashboard' ? '#e9ecef' : 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
          
          {/* EHB Admin Section */}
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '24px', marginBottom: '12px' }}>
              EHB Admin
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'admin-panel', icon: '⚙️', label: 'Admin Panel', url: 'http://localhost:5000/' },
              { id: 'admin-dashboard', icon: '📊', label: 'Admin Dashboard', url: 'http://localhost:5020/' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
          
          {/* EHB System Section */}
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '24px', marginBottom: '12px' }}>
              EHB System
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'ehb-home', icon: '🏠', label: 'EHB Home', url: 'http://localhost:5005/' },
              { id: 'backend-server', icon: '🖥️', label: 'Backend Server', url: 'http://localhost:5001/' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
          
          {/* Enterprise Hybrid Blockchain Section */}
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '24px', marginBottom: '12px' }}>
              Enterprise Hybrid Blockchain
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'blockchain', icon: '🔗', label: 'Blockchain Services', url: '/system/EHB-Blockchain' },
              { id: 'gosellr', icon: '🛒', label: 'GoSellr E-commerce', url: 'http://localhost:5002/' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
          
          {/* AI Integration Hub Section */}
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '24px', marginBottom: '12px' }}>
              AI Integration Hub
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'ai-integration-hub', icon: '🤖', label: 'AI Integration Hub', url: 'http://localhost:5150/' },
              { id: 'ai-agent', icon: '🔄', label: 'EHB AI Agent', url: 'http://localhost:4120/' },
              { id: 'agent-dashboard', icon: '📈', label: 'Agent Dashboard', url: 'http://localhost:5200/' },
              { id: 'playground', icon: '🧪', label: 'EHB Playground', url: 'http://localhost:5050/' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
          
          {/* EHB Development Portal Section */}
          {!workspaceSettings.sidebarCollapsed && (
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '24px', marginBottom: '12px' }}>
              EHB Development Portal
            </p>
          )}
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'developer-portal', icon: '👩‍💻', label: 'Developer Portal', url: 'http://localhost:5010/' },
              { id: 'documents', icon: '📄', label: 'Documentation', url: '/documents' }
            ].map(item => (
              <li 
                key={item.id} 
                style={{ 
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {!workspaceSettings.sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {!workspaceSettings.sidebarCollapsed && (
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={handleToggleSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px 12px',
                backgroundColor: showSettingsPanel ? '#e9ecef' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ marginRight: '12px' }}>⚙️</span>
              <span>Workspace Settings</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Main Content Area */}
      <div style={contentStyle}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          padding: '0 16px'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Smart Workspace</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="module-selector">
              <select
                onChange={(e) => handleAddModule(e.target.value)}
                value=""
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da'
                }}
              >
                <option value="" disabled>Add Module</option>
                {availableModules
                  .filter(module => !activeModules.find(m => m.id === module.id))
                  .map(module => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
              </select>
            </div>
            
            <NotificationButton />
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              US
            </div>
          </div>
        </div>
        
        {/* Main dashboard content */}
        <div className="dashboard-content">
          {children}
        </div>
        
        {/* Active modules as draggable panels */}
        {(activeModules || []).map(module => (
          <DraggablePanel
            key={module.id}
            id={module.id}
            title={module.title}
            defaultPosition={{ x: 100, y: 100 }}
            defaultSize={{ width: 300, height: 300 }}
            onClose={() => handleRemoveModule(module.id)}
          >
            {getPanelContent(module.id)}
          </DraggablePanel>
        ))}
        
        {/* Settings Panel */}
        {showSettingsPanel && (
          <WorkspaceSettingsPanel
            onClose={() => setShowSettingsPanel(false)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspaceDashboard;