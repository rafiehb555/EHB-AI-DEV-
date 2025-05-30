import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWorkspace } from '../../context/WorkspaceContext';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { workspaceSettings, toggleSidebar, toggleTheme, addToRecentlyVisited } = useWorkspace();
  const { sidebarCollapsed, theme } = workspaceSettings;
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // State for user menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Add current page to recently visited on mount and route change
  useEffect(() => {
    // Only track main routes, not dynamic routes
    if (router.pathname) {
      const pathSegments = router.pathname.split('/').filter(Boolean);
      let title = '';
      
      // Generate a title based on the path
      if (pathSegments.length === 0) {
        title = 'Home';
      } else {
        title = pathSegments[pathSegments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
      addToRecentlyVisited({
        path: router.pathname,
        title,
        timestamp: new Date().toISOString()
      });
    }
  }, [router.pathname, addToRecentlyVisited]);
  
  // Sample notification data (in a real app, this would come from an API or WebSocket)
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 'n1',
        title: 'System Update',
        message: 'A new system update is available. Please restart to apply.',
        time: '5 minutes ago',
        read: false
      },
      {
        id: 'n2',
        title: 'New User Registered',
        message: 'A new user has registered on the platform.',
        time: '1 hour ago',
        read: false
      },
      {
        id: 'n3',
        title: 'Server Maintenance',
        message: 'Scheduled maintenance will occur on May 15 at 2 AM.',
        time: '3 hours ago',
        read: true
      }
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount((sampleNotifications || []).filter(n => !n.read).length);
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => (prev || []).map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };
  
  // Handle notification click
  const handleNotificationClick = (id) => {
    setNotifications((prev) => (prev || []).map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Handle notification panel toggle
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  // Handle user menu toggle
  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Navigation items
  const navItems = [
    { label: 'Home', icon: '🏠', path: '/home' },
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Analytics', icon: '📈', path: '/dashboard/analytics' },
    { label: 'Services', icon: '🧩', path: '/services' },
    { label: 'Settings', icon: '⚙️', path: '/dashboard/settings' }
  ];
  
  // Background color based on theme
  const bgColor = theme === 'dark' ? '#1f2937' : 'white';
  const textColor = theme === 'dark' ? '#f9fafb' : '#111827';
  const borderColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const sidebarBgColor = theme === 'dark' ? '#111827' : '#f9fafb';
  
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f1f5f9',
      color: textColor
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: sidebarCollapsed ? '64px' : '240px',
        backgroundColor: sidebarBgColor,
        borderRight: `1px solid ${borderColor}`,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ 
          padding: '1rem',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🔗</span>
            {!sidebarCollapsed && (
              <span style={{ 
                marginLeft: '0.5rem', 
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}>
                EHB Admin
              </span>
            )}
          </div>
          {!sidebarCollapsed && (
            <button 
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: textColor
              }}
            >
              ◀
            </button>
          )}
        </div>
        
        {/* Collapsed sidebar toggle */}
        {sidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            style={{
              width: '100%',
              padding: '0.5rem 0',
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${borderColor}`,
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: textColor,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            ▶
          </button>
        )}
        
        {/* Navigation */}
        <nav style={{ padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {(navItems || []).map((item, index) => {
              const isActive = router.pathname === item.path;
              
              return (
                <li key={index}>
                  <Link 
                    href={item.path}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: sidebarCollapsed ? '0.75rem 0' : '0.75rem 1.5rem',
                      color: isActive 
                        ? (theme === 'dark' ? '#3b82f6' : '#1d4ed8') 
                        : textColor,
                      backgroundColor: isActive 
                        ? (theme === 'dark' ? '#1e293b' : '#e2e8f0')
                        : 'transparent',
                      textDecoration: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                      borderLeft: isActive 
                        ? `4px solid ${theme === 'dark' ? '#3b82f6' : '#1d4ed8'}`
                        : '4px solid transparent',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    {!sidebarCollapsed && (
                      <span style={{ marginLeft: '0.75rem' }}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Main content area */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarCollapsed ? '64px' : '240px',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top navbar */}
        <header style={{ 
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          {/* Left side */}
          <div>
            <h1 style={{ 
              fontSize: '1.25rem', 
              margin: 0,
              fontWeight: 'bold'
            }}>
              {/* Get page title from route */}
              {router.pathname === '/home' 
                ? 'Home'
                : router.pathname.split('/').pop()?.split('-').map(
                    word => word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ') || 'Dashboard'}
            </h1>
          </div>
          
          {/* Right side - Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={toggleNotifications}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '320px',
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 20,
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: theme === 'dark' ? '#3b82f6' : '#2563eb'
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications && notifications.length > 0 ? (
                      (notifications || []).map(notification => (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: `1px solid ${borderColor}`,
                            backgroundColor: notification.read 
                              ? 'transparent' 
                              : (theme === 'dark' ? '#1e293b' : '#f0f9ff'),
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem'
                          }}>
                            <span style={{ fontWeight: 'bold' }}>{notification.title}</span>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                            }}>
                              {notification.time}
                            </span>
                          </div>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '0.875rem',
                            color: theme === 'dark' ? '#d1d5db' : '#374151'
                          }}>
                            {notification.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div style={{ 
                        padding: '1.5rem', 
                        textAlign: 'center',
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                      }}>
                        No notifications
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    padding: '0.75rem 1rem', 
                    textAlign: 'center',
                    borderTop: `1px solid ${borderColor}`
                  }}>
             <Link 
                      href="/dashboard/notifications"
                      style={{
                        fontSize: '0.875rem',
                        color: theme === 'dark' ? '#3b82f6' : '#2563eb',
                        textDecoration: 'none'
                      }}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={toggleUserMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: textColor
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  A
                </div>
                <span>Admin</span>
              </button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '200px',
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 20,
                  marginTop: '0.5rem'
                }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: `1px solid ${borderColor}`
                  }}>
                    <div style={{ fontWeight: 'bold' }}>Admin User</div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                    }}>
                      admin@ehb-system.com
                    </div>
                  </div>
                  
                  <nav>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0 
                    }}>
                      <li>
          <Link 
                          href="/dashboard/profile"
                          style={{ 
                            display: 'block', 
                            padding: '0.75rem 1rem',
                            color: textColor,
                            textDecoration: 'none'
                          }}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
   <Link 
                          href="/dashboard/settings"
                          style={{ 
                            display: 'block', 
                            padding: '0.75rem 1rem',
                            color: textColor,
                            textDecoration: 'none'
                          }}
                        >
                          Settings
                        </Link>
                      </li>
                      <li style={{ borderTop: `1px solid ${borderColor}` }}>
                        <Link 
                          href="/logout"
                          style={{ 
                            display: 'block', 
                            padding: '0.75rem 1rem',
                            color: '#ef4444',
                            textDecoration: 'none'
                          }}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;