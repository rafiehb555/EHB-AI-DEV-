import React, { useState } from 'react';
import { useColorModeValue } from '../chakra/MockChakraProvider';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { 
  FaHome, 
  FaLayerGroup, 
  FaChartBar, 
  FaRobot, 
  FaCogs, 
  FaDatabase, 
  FaUsers, 
  FaBook,
  FaServer,
  FaNetworkWired,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaInfo,
  FaStar,
  FaEye,
  FaComment,
  FaCalendar,
  FaExternalLinkAlt,
  FaClock,
  FaSearch,
  FaPlus,
  FaCheck,
  FaTimes,
  FaBars,
  FaMoon,
  FaSun
} from 'react-icons/fa';

// Navigation item component
const NavItem = ({ icon: Icon, label, active, onClick, badge, children, collapsed }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const activeColor = '#0064db';
  const activeBg = '#e3f2fd';
  const hoverBg = '#f5f5f5';
  
  const itemStyles = {
    width: '100%'
  };
  
  const flexStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: collapsed ? '14px 8px' : '16px',
    marginLeft: collapsed ? '4px' : '8px',
    marginRight: collapsed ? '4px' : '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: active ? activeBg : isHovered ? hoverBg : 'transparent',
    color: active ? activeColor : 'inherit',
    transition: 'all 0.2s',
    justifyContent: collapsed ? 'center' : 'flex-start'
  };
  
  const iconStyles = {
    marginRight: collapsed ? '0' : '16px',
    fontSize: collapsed ? '18px' : '16px',
    color: active ? activeColor : '#718096'
  };
  
  const textStyles = {
    fontWeight: active ? 'bold' : 'medium',
    display: collapsed ? 'none' : 'block'
  };
  
  const badgeStyles = {
    marginLeft: collapsed ? '0' : 'auto',
    backgroundColor: badge?.color === 'blue' ? '#0064db' : 
                   badge?.color === 'green' ? '#48bb78' : '#0064db',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    position: collapsed ? 'absolute' : 'static',
    top: collapsed ? '5px' : 'auto',
    right: collapsed ? '5px' : 'auto',
    display: collapsed && !active ? 'none' : 'block' // Hide badges in collapsed mode unless active
  };
  
  const childrenContainerStyles = {
    paddingLeft: collapsed ? '0' : '24px',
    display: collapsed ? 'none' : 'block'
  };
  
  return (
    <div style={itemStyles}>
      <div
        style={flexStyles}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={collapsed ? label : ''}
      >
        {Icon && (
          <Icon style={iconStyles} />
        )}
        <span style={textStyles}>{label}</span>
        {badge && !collapsed && (
          <span style={badgeStyles}>
            {badge.text}
          </span>
        )}
        {children && !collapsed && (
          <FaChevronRight style={{ marginLeft: 'auto' }} />
        )}
      </div>
      {children && !collapsed && (
        <div style={childrenContainerStyles}>
          {children}
        </div>
      )}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ 
  activeItem = 'dashboard',
  isMobile = false,
  isVisible = true
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const config = useSiteConfig();
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Use preferences for sidebar state
  const collapsed = preferences.sidebar.collapsed;
  const width = preferences.sidebar.width;
  const collapsedWidth = preferences.sidebar.collapsedWidth;
  
  // Function to toggle collapsed state
  const toggleSidebar = () => {
    updatePreferences('sidebar.collapsed', !collapsed);
  };
  
  // Use nav items from site config with some additional metadata
  const navItems = [
    { 
      section: 'Main', 
      items: config?.navigation?.main?.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.id === 'dashboard' ? FaHome : 
              item.id === 'phases' ? FaLayerGroup : 
              item.id === 'analytics' ? FaChartBar : 
              item.id === 'learning' ? FaBook : FaInfo,
        badge: item.id === 'phases' ? { text: '10', color: 'blue' } : 
               item.id === 'learning' ? { text: 'NEW', color: 'green' } : null
      })) || []
    },
    { 
      section: 'AI Components', 
      items: config?.navigation?.ai?.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.id === 'ai-dashboard' ? FaChartBar : 
              item.id === 'smart-agent' ? FaRobot : 
              item.id === 'auto-card-gen' ? FaEye : FaInfo
      })) || []
    },
    {
      section: 'System',
      items: config?.navigation?.system?.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.id === 'integration' ? FaNetworkWired : 
              item.id === 'services' ? FaServer : 
              item.id === 'database' ? FaDatabase : FaInfo,
        badge: item.id === 'services' ? { text: 'NEW', color: 'green' } : null
      })) || []
    },
    {
      section: 'Management',
      items: config?.navigation?.management?.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.id === 'users' ? FaUsers : 
              item.id === 'settings' ? FaCogs : FaInfo
      })) || []
    }
  ];

  // Handle page navigation
  const handleNavigation = (pageId) => {
    // Save the last visited page in user preferences
    updatePreferences('navigation.lastVisitedPage', pageId);
    
    // Navigate to different pages based on pageId
    if (pageId === 'learning') {
      // This will be handled by Next.js router in a real implementation
      window.location.href = '/learning';
    } else if (pageId === 'learning-challenges') {
      window.location.href = '/learning/challenges';
    } else if (pageId === 'learning-achievements') {
      window.location.href = '/learning/achievements';
    } else if (pageId === 'dashboard') {
      window.location.href = '/dashboard';
    } else if (pageId === 'phases') {
      window.location.href = '/phases';
    } else if (pageId === 'settings') {
      // Open preferences panel - this would typically be handled through a context or state
      updatePreferences('ui.showPreferencesPanel', true);
    }
  };
  
  const currentWidth = collapsed ? collapsedWidth : width;
  
  const sidebarStyles = {
    backgroundColor: 'white',
    height: '100vh',
    width: `${currentWidth}px`,
    position: 'fixed',
    paddingTop: '16px',
    paddingBottom: '16px',
    zIndex: 999,
    transition: 'all 0.3s ease-in-out',
    overflowY: 'auto',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    left: isMobile ? (isVisible ? 0 : `-${currentWidth}px`) : 0
  };
  
  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    marginLeft: collapsed ? '8px' : '32px',
    marginRight: collapsed ? '8px' : '32px',
    marginBottom: '24px'
  };
  
  const logoStyles = {
    fontSize: collapsed ? '1.2rem' : '1.5rem',
    fontWeight: 'bold',
    color: '#0064db'
  };
  
  const versionBadgeStyles = {
    backgroundColor: '#0064db',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    display: collapsed ? 'none' : 'block'
  };
  
  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    marginBottom: '24px',
    marginLeft: collapsed ? '8px' : '24px',
    marginRight: collapsed ? '8px' : '24px'
  };
  
  const avatarStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    marginRight: collapsed ? '0' : '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#718096',
    fontWeight: 'bold',
    fontSize: '14px'
  };
  
  const userTextContainerStyles = {
    display: collapsed ? 'none' : 'flex',
    flexDirection: 'column'
  };
  
  const userNameStyles = {
    fontWeight: 'medium',
    fontSize: '0.875rem'
  };
  
  const userRoleStyles = {
    fontSize: '0.75rem',
    color: '#718096'
  };
  
  const menuButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 'auto',
    display: collapsed ? 'none' : 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px'
  };
  
  const menuStyles = {
    position: 'absolute',
    right: collapsed ? '64px' : '24px',
    top: '80px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
    zIndex: 10,
    display: userMenuOpen ? 'block' : 'none'
  };
  
  const menuItemStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: '0.875rem',
    cursor: 'pointer'
  };
  
  const menuItemIconStyles = {
    marginRight: '8px',
    fontSize: '14px'
  };
  
  const dividerStyles = {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '8px 0',
    width: '100%'
  };
  
  const sectionStyles = {
    marginBottom: '24px'
  };
  
  const sectionHeaderStyles = {
    paddingLeft: collapsed ? '8px' : '32px',
    paddingRight: collapsed ? '8px' : '32px',
    marginBottom: '8px',
    fontSize: '0.75rem',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#718096',
    textAlign: collapsed ? 'center' : 'left',
    display: collapsed ? 'none' : 'block'
  };
  
  const navListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };
  
  const resourcesStyles = {
    paddingLeft: collapsed ? '8px' : '32px',
    paddingRight: collapsed ? '8px' : '32px',
    marginBottom: '16px',
    display: collapsed ? 'none' : 'block'
  };
  
  const resourceItemStyles = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    marginBottom: '4px'
  };
  
  const resourceIconStyles = {
    marginRight: '12px',
    color: '#718096'
  };
  
  const statusIndicatorStyles = {
    paddingLeft: collapsed ? '8px' : '32px',
    paddingRight: collapsed ? '8px' : '32px',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start'
  };
  
  const statusDotStyles = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#48bb78',
    marginRight: collapsed ? '0' : '8px'
  };
  
  const statusTextStyles = {
    fontSize: '0.75rem',
    color: '#718096',
    display: collapsed ? 'none' : 'block'
  };

  return (
    <div style={sidebarStyles}>
      {/* Logo and header */}
      <div style={headerStyles}>
        <div style={logoStyles}>
          EHB
        </div>
        {!collapsed && (
          <div style={versionBadgeStyles}>
            v{config?.version || '1.0.0'}
          </div>
        )}
      </div>

      {/* User info */}
      <div style={userInfoStyles}>
        <div style={avatarStyles}>JD</div>
        {!collapsed && (
          <>
            <div style={userTextContainerStyles}>
              <div style={userNameStyles}>John Doe</div>
              <div style={userRoleStyles}>Administrator</div>
            </div>
            <button 
              style={menuButtonStyles}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <FaChevronDown />
            </button>
          </>
        )}
        
        {/* User menu */}
        <div style={menuStyles}>
          <div style={menuItemStyles}>
            <FaInfo style={menuItemIconStyles} />
            Profile
          </div>
          <div style={menuItemStyles}>
            <FaCog style={menuItemIconStyles} />
            Settings
          </div>
          <div style={dividerStyles}></div>
          <div style={menuItemStyles}>
            <FaTimes style={menuItemIconStyles} />
            Logout
          </div>
        </div>
      </div>

      <div style={dividerStyles}></div>

      {/* Navigation sections */}
      <div>
        {navItems.map((section) => (
          <div key={section.section} style={sectionStyles}>
            <div style={sectionHeaderStyles}>
              {section.section}
            </div>
            <div style={navListStyles}>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeItem === item.id}
                  badge={item.badge}
                  onClick={() => handleNavigation(item.id)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={dividerStyles}></div>

      {/* Resources section (hidden when collapsed) */}
      {!collapsed && (
        <div style={resourcesStyles}>
          <div style={sectionHeaderStyles}>
            Resources
          </div>
          <div>
            <div style={resourceItemStyles}>
              <FaBook style={resourceIconStyles} />
              <span>Documentation</span>
            </div>
            <div style={resourceItemStyles}>
              <FaComment style={resourceIconStyles} />
              <span>Support</span>
            </div>
            <div 
              style={{
                ...resourceItemStyles,
                cursor: 'pointer',
                backgroundColor: '#f8f9fa',
                padding: '6px 8px',
                borderRadius: '4px',
                marginTop: '8px'
              }}
              onClick={() => updatePreferences('ui.showPreferencesPanel', true)}
            >
              <FaCog style={resourceIconStyles} />
              <span>Workspace Preferences</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button - always visible */}
      <div 
        style={{
          position: 'absolute',
          bottom: '80px',
          left: collapsed ? '50%' : '24px',
          transform: collapsed ? 'translateX(-50%)' : 'none',
          backgroundColor: '#f5f8fa',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1000
        }}
        onClick={toggleSidebar}
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <FaBars 
          style={{
            transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.3s ease-in-out',
            fontSize: '14px',
            color: '#0064db'
          }}
        />
      </div>

      {/* System status indicator */}
      <div style={statusIndicatorStyles}>
        <div style={statusDotStyles}></div>
        {!collapsed && (
          <div style={statusTextStyles}>System Online</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;