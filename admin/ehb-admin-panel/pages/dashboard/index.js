import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Dummy data for dashboard widgets
const statsData = [
  { label: 'Active Users', value: '245', change: '+12%', up: true },
  { label: 'Total Revenue', value: '$54,375', change: '+8.5%', up: true },
  { label: 'Open Tasks', value: '28', change: '-5%', up: false },
  { label: 'System Uptime', value: '99.98%', change: '+0.1%', up: true }
];

const recentActivityData = [
  { id: 1, user: 'John Doe', action: 'Created a new task', time: '10 minutes ago' },
  { id: 2, user: 'Jane Smith', action: 'Updated service status', time: '25 minutes ago' },
  { id: 3, user: 'Mike Johnson', action: 'Completed task #1234', time: '1 hour ago' },
  { id: 4, user: 'Sarah Wilson', action: 'Added new user', time: '3 hours ago' },
  { id: 5, user: 'Robert Brown', action: 'Updated system settings', time: '5 hours ago' }
];

const tasksData = [
  { id: 1, title: 'Update user documentation', status: 'In Progress', dueDate: '2025-05-15' },
  { id: 2, title: 'Fix login issue on mobile devices', status: 'Pending', dueDate: '2025-05-12' },
  { id: 3, title: 'Deploy new features to production', status: 'Completed', dueDate: '2025-05-10' },
  { id: 4, title: 'Schedule monthly maintenance', status: 'Pending', dueDate: '2025-05-20' }
];

// Analytics chart data
const analyticsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'User Growth',
      data: [150, 180, 210, 230, 245, 270]
    },
    {
      label: 'Revenue ($K)',
      data: [32, 36, 40, 45, 54, 60]
    }
  ]
};

const Dashboard = () => {
  const { workspaceSettings, toggleWidget, reorderWidgets } = useWorkspace();
  const { dashboardWidgets, widgetsOrder, theme } = workspaceSettings;
  
  // State for drag and drop
  const [draggedWidgetId, setDraggedWidgetId] = useState(null);
  
  // Helper to get background color based on theme
  const getCardBackground = () => {
    return theme === 'dark' ? '#374151' : 'white';
  };
  
  // Helper to get text color based on theme
  const getTextColor = () => {
    return theme === 'dark' ? '#f9fafb' : '#111827';
  };
  
  // Helper to get border color based on theme
  const getBorderColor = () => {
    return theme === 'dark' ? '#4b5563' : '#e5e7eb';
  };
  
  // Start dragging a widget
  const handleDragStart = (e, widgetId) => {
    setDraggedWidgetId(widgetId);
    e.dataTransfer.setData('text/plain', widgetId);
    
    // Set the drag image
    const dragImage = document.createElement('div');
    dragImage.textContent = 'Moving Widget';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };
  
  // Handle drop of a widget
  const handleDrop = (e, targetWidgetId) => {
    e.preventDefault();
    
    if (draggedWidgetId && draggedWidgetId !== targetWidgetId) {
      // Get the new position
      const newPosition = widgetsOrder[targetWidgetId];
      
      // Reorder the widgets
      reorderWidgets(draggedWidgetId, newPosition);
    }
    
    setDraggedWidgetId(null);
  };
  
  // Allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Render widgets in order
  const renderWidgetsInOrder = () => {
    // Sort widgets by their order
    const sortedWidgets = dashboardWidgets
      .filter(widgetId => Object.keys(widgetsOrder).includes(widgetId))
      .sort((a, b) => widgetsOrder[a] - widgetsOrder[b]);
    
    return (sortedWidgets || []).map(widgetId => {
      switch (widgetId) {
        case 'quick-stats':
          return (
            <div 
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widgetId)}
              style={{
                backgroundColor: getCardBackground(),
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'move'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  Quick Stats
                </h2>
                <button 
                  onClick={() => toggleWidget(widgetId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: getTextColor(),
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
         (statsData || []).map((ata || []).map((stat, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '1rem',
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                      borderRadius: '0.5rem',
                      border: `1px solid ${getBorderColor()}`
                    }}
                  >
                    <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>
                      {stat.label}
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      margin: '0.5rem 0'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: stat.up ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {stat.up ? '↑' : '↓'} {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'recent-activity':
          return (
            <div 
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widgetId)}
              style={{
                backgroundColor: getCardBackground(),
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'move'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  Recent Activity
                </h2>
                <button 
                  onClick={() => toggleWidget(widgetId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: getTextColor(),
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </div>
              <div>
 (recentActivityData || (ctivityData || []).map((ata || []).map(activity => (
                  <div 
                    key={activity.id}
                    style={{
                      padding: '0.75rem 0',
                      borderBottom: `1px solid ${getBorderColor()}`,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{activity.user}</div>
                      <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>
                        {activity.action}
                      </div>
                    </div>
                    <div style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'analytics-chart':
          return (
            <div 
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widgetId)}
              style={{
                backgroundColor: getCardBackground(),
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'move'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  Analytics Overview
                </h2>
                <button 
                  onClick={() => toggleWidget(widgetId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: getTextColor(),
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ height: '300px', position: 'relative' }}>
                {/* Placeholder for chart - in a real app, you'd use a chart library */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                  borderRadius: '0.5rem',
                  border: `1px solid ${getBorderColor()}`
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Analytics Chart</div>
                  <div style={{ 
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    textAlign: 'center'
                  }}>
                    User Growth and Revenue Trends<br/>
                    Jan 2025 - Jun 2025
                  </div>
                </div>
              </div>
            </div>
          );
          
        case 'tasks':
          return (
            <div 
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widgetId)}
              style={{
                backgroundColor: getCardBackground(),
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'move'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  Tasks
                </h2>
                <button 
                  onClick={() => toggleWidget(widgetId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: getTextColor(),
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </div>
             (tasksData || [](tasksData || [](tasksData || []).map((ata || []).map(task => (
                  <div 
                    key={task.id}
                    style={{
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '0.25rem',
                      border: `1px solid ${getBorderColor()}`,
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ 
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem',
                        backgroundColor: 
                          task.status === 'Completed' 
                            ? '#059669' 
                            : task.status === 'In Progress' 
                              ? '#2563eb' 
                              : '#f59e0b',
                        color: 'white'
                      }}>
                        {task.status}
                      </span>
                      <span style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
        default:
          return null;
      }
    });
  };
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Dashboard
      </h1>
      
      {/* Render widgets */}
      {renderWidgetsInOrder()}
      
      {/* Widgets configuration help */}
      <div style={{
        backgroundColor: getCardBackground(),
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginTop: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0 }}>Customize Your Dashboard</h3>
        <p>
          Drag and drop the widgets to rearrange them. Click the X button to hide a widget.
          Visit the <a href="/dashboard/settings" style={{ color: '#3b82f6' }}>Settings</a> page to fully customize your workspace.
        </p>
      </div>
    </div>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout></DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;