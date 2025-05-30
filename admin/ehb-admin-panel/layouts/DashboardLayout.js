import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWorkspace } from '../context/WorkspaceContext';
import WorkspaceSettingsPanel from '../components/layout/WorkspaceSettingsPanel';

/**
 * DashboardLayout Component
 * 
 * The main layout component for the EHB Admin Panel dashboard.
 * It includes a sidebar, header, and main content area.
 * The component applies user workspace preferences from the WorkspaceContext.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render in the main content area
 * @param {string} props.title - Page title
 */
const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const router = useRouter();
  const { 
    workspaceSettings,
    toggleSidebar,
    toggleTheme,
    setTheme,
    addToRecentlyVisited
  } = useWorkspace();
  
  const [isMobile, setIsMobile] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  
  // Destructure settings from workspaceSettings
  const { 
    sidebarCollapsed, 
    sidebarWidth, 
    theme, 
    layout, 
    fontSize, 
    primaryColor,
    contentWidth,
    favorites = []
  } = workspaceSettings;
  
  // Register current page in recently visited when route changes
  useEffect(() => {
    if (router.pathname) {
      addToRecentlyVisited({
        path: router.pathname,
        title: title,
        timestamp: new Date().toISOString()
      });
    }
  }, [router.pathname, title, addToRecentlyVisited]);
  
  // Check if viewport is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Apply sidebar width
  useEffect(() => {
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement && !sidebarCollapsed && sidebarWidth) {
      sidebarElement.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarCollapsed, sidebarWidth]);
  
  // Toggle settings panel
  const toggleSettingsPanel = () => {
    setSettingsPanelOpen(prev => !prev);
  };
  
  // Navigation items with categories
  const navItems = [
    // EHB Admin
    { label: 'Dashboard', href: '/dashboard', icon: '📊', category: 'EHB Admin' },
    { label: 'Users', href: '/dashboard/users', icon: '👥', category: 'EHB Admin' },
    { label: 'Franchises', href: '/dashboard/franchises', icon: '🏢', category: 'EHB Admin' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: '📈', category: 'EHB Admin' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️', category: 'EHB Admin' },
    
    // EHB System
    { label: 'Blockchain', href: '/system/blockchain', icon: '🔗', category: 'EHB System' },
    { label: 'SQL Departments', href: '/system/sql-departments', icon: '💾', category: 'EHB System' },
    { label: 'Franchise System', href: '/system/franchise', icon: '🏬', category: 'EHB System' },
    
    // Enterprise Hybrid Blockchain
    { label: 'Wallet', href: '/enterprise/wallet', icon: '💰', category: 'Enterprise Hybrid Blockchain' },
    { label: 'Transactions', href: '/enterprise/transactions', icon: '💸', category: 'Enterprise Hybrid Blockchain' },
    { label: 'Smart Contracts', href: '/enterprise/contracts', icon: '📝', category: 'Enterprise Hybrid Blockchain' },
    
    // AI Integration Hub
    { label: 'AI Services', href: '/ai-hub/services', icon: '🤖', category: 'AI Integration Hub' },
    { label: 'LangChain', href: '/ai-hub/langchain', icon: '🔄', category: 'AI Integration Hub' },
    { label: 'AI Agents', href: '/ai-hub/agents', icon: '🧠', category: 'AI Integration Hub' },
    { label: 'AI Integration', href: 'http://localhost:5150', icon: '🔌', category: 'AI Integration Hub', external: true },
    
    // EHB Development Portal
    { label: 'Developer Portal', href: '/dev-portal', icon: '💻', category: 'EHB Development Portal' },
    { label: 'API Documentation', href: '/dev-portal/api-docs', icon: '📚', category: 'EHB Development Portal' },
    { label: 'Dev Resources', href: '/dev-portal/resources', icon: '🧰', category: 'EHB Development Portal' },
    { label: 'Portal Access', href: 'http://localhost:5010', icon: '🔗', category: 'EHB Development Portal', external: true },
  ];
  
  // Get favorite items to show at the top
  const favoriteItems = navItems.filter(item => favorites.includes(item.href));
  const otherItems = navItems.filter(item => !favorites.includes(item.href));
  
  const renderNavItem = (item) => (
    <li key={item.href}>
      {item.external ? (
        <a 
          href={item.href}
          className={router.pathname === item.href ? 'active' : ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">{item.icon}</span>
          {!sidebarCollapsed && <span className="label">{item.label}</span>}
        </a>
      ) : (
        <Link 
          href={item.href}
          className={router.pathname === item.href ? 'active' : ''}
        >
          <span className="icon">{item.icon}</span>
          {!sidebarCollapsed && <span className="label">{item.label}</span>}
        </Link>
      )}
    </li>
  );
  
  // Generate layout class based on settings
  const layoutClasses = [
    `dashboard-layout`,
    `theme-${theme}`,
    `layout-${layout}`,
    `font-${fontSize}`,
    `content-${contentWidth}`,
    `color-${primaryColor}`,
    sidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={layoutClasses}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">EHB Admin</h2>
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="nav-menu">
          {favoriteItems.length > 0 && (
            <>
              <div className="nav-section-title">Favorites</div>
              <ul className="favorites">
                {favoriteItems.map(renderNavItem)}
              </ul>
              <div className="divider"></div>
            </>
          )}
          
          {/* Group items by category */}
          {Array.from(new Set(otherItems.map(item => item.category))).map(category => (
            <div key={category}>
              <div className="nav-section-title">{category}</div>
              <ul className="nav-group">
                {otherItems.filter(item => item.category === category).map(renderNavItem)}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>{title}</h1>
          </div>
          <div className="header-right">
            <button 
              onClick={toggleSettingsPanel}
              className="settings-btn"
              aria-label="Workspace Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <div className="user-menu">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <button className="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className={`content content-${contentWidth}`}>
          {children}
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <p>EHB Admin Panel © 2025 - All rights reserved</p>
        </footer>
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
      
      {/* Workspace Settings Panel */}
      {settingsPanelOpen && (
        <WorkspaceSettingsPanel onClose={() => setSettingsPanelOpen(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;