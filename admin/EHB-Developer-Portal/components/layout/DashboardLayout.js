import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import UserPreferencesPanel from '../preferences/UserPreferencesPanel.jsx';
import { useUserPreferences } from '../../context/UserPreferencesContext.jsx';
import { FaBars, FaChevronLeft, FaChevronRight, FaCog } from 'react-icons/fa';

const DashboardLayout = ({ children, activeItem = 'dashboard' }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);

  // Extract sidebar preferences
  const sidebarCollapsed = preferences?.sidebar?.collapsed || false;
  const sidebarWidth = preferences?.sidebar?.width || 250;
  const collapsedWidth = preferences?.sidebar?.collapsedWidth || 64;

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile if not explicitly set by user
      if (mobile && !preferences?.sidebar?.hasUserSetMobilePreference) {
        updatePreferences('sidebar.collapsed', true);
      }
    };
    
    // Initial check
    if (typeof window !== 'undefined') {
      checkScreenSize();
      
      // Add resize listener
      window.addEventListener('resize', checkScreenSize);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, [preferences?.sidebar?.hasUserSetMobilePreference, updatePreferences]);

  // Handle showing/hiding the preferences panel
  useEffect(() => {
    if (preferences?.ui?.showPreferencesPanel) {
      setShowPreferencesPanel(true);
      // Reset the flag
      updatePreferences('ui.showPreferencesPanel', false);
    }
  }, [preferences?.ui?.showPreferencesPanel, updatePreferences]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;
    updatePreferences('sidebar.collapsed', newCollapsedState);
    
    // Remember that user has explicitly set this preference
    updatePreferences('sidebar.hasUserSetMobilePreference', true);
    
    setIsMenuOpen(!newCollapsedState);
  };

  // Calculate main content styles based on sidebar state
  const getMainContentStyles = () => {
    const currentSidebarWidth = sidebarCollapsed ? collapsedWidth : sidebarWidth;
    const contentWidth = preferences?.layout?.contentWidth || 'full';
    
    return {
      marginLeft: isMobile ? 0 : `${currentSidebarWidth}px`,
      width: isMobile ? '100%' : `calc(100% - ${currentSidebarWidth}px)`,
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f9f9fb',
      transition: 'all 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      alignItems: contentWidth === 'contained' ? 'center' : 'stretch'
    };
  };

  const toggleButtonStyles = {
    position: 'fixed',
    top: '20px',
    left: sidebarCollapsed ? `${collapsedWidth + 10}px` : `${sidebarWidth + 10}px`,
    zIndex: 100,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'left 0.3s ease-in-out'
  };

  const preferencesButtonStyles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 100,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const mobileMenuButtonStyles = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 100,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: isMobile ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  // Create a container for main content if layout is contained
  const contentContainerStyles = {
    width: preferences?.layout?.contentWidth === 'contained' ? 'min(1200px, 100%)' : '100%',
    margin: '0 auto'
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        backgroundColor: '#f9f9fb', 
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Only show toggle button if not mobile */}
      {!isMobile && (
        <div 
          style={toggleButtonStyles}
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </div>
      )}
      
      {/* Mobile menu button */}
      {isMobile && (
        <div 
          style={mobileMenuButtonStyles}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars size={18} />
        </div>
      )}
      
      {/* Preferences button */}
      <div 
        style={preferencesButtonStyles}
        onClick={() => setShowPreferencesPanel(true)}
        title="Workspace Preferences"
      >
        <FaCog size={14} />
      </div>
      
      {/* Sidebar with collapsible state */}
      <Sidebar 
        activeItem={activeItem} 
        isMobile={isMobile}
        isVisible={!isMobile || isMenuOpen}
      />
      
      {/* Main content area */}
      <main style={getMainContentStyles()}>
        {/* Add padding to top on mobile to account for menu button */}
        {isMobile && <div style={{ height: '60px' }} />}
        
        {/* Content container for width control */}
        <div style={contentContainerStyles}>
          {children}
        </div>
      </main>
      
      {/* Modal overlay for mobile menu */}
      {isMobile && isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* User preferences panel */}
      <UserPreferencesPanel 
        isOpen={showPreferencesPanel} 
        onClose={() => setShowPreferencesPanel(false)} 
      />
    </div>
  );
};

export default DashboardLayout;