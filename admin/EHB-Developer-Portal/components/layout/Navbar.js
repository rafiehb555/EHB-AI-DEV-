import React, { useState } from 'react';
import { FaBars, FaBell, FaSearch, FaMoon, FaSun, FaCog } from 'react-icons/fa';
import { useColorMode } from '../chakra/MockChakraProvider';

const Navbar = ({ onToggleSidebar }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Mock color mode functionality
  const { colorMode, toggleColorMode } = useColorMode();
  
  const containerStyles = {
    padding: '0 16px',
    height: '60px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  
  const leftSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };
  
  const rightSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  
  const iconButtonStyles = {
    background: 'none',
    border: 'none',
    borderRadius: '4px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4a5568',
    transition: 'background-color 0.2s'
  };
  
  const searchContainerStyles = {
    position: 'relative',
    marginLeft: '16px',
    marginRight: '16px',
    width: '300px',
    display: 'flex',
    alignItems: 'center'
  };
  
  const searchInputStyles = {
    width: '100%',
    padding: '8px 8px 8px 36px',
    borderRadius: '4px',
    border: isSearchFocused ? '1px solid #3182ce' : '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    transition: 'border-color 0.2s'
  };
  
  const searchIconStyles = {
    position: 'absolute',
    left: '10px',
    color: '#718096',
    fontSize: '14px'
  };
  
  const avatarStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4a5568'
  };
  
  const userMenuStyles = {
    position: 'absolute',
    top: '55px',
    right: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '180px',
    zIndex: 1000,
    display: isUserMenuOpen ? 'block' : 'none'
  };
  
  const menuItemStyles = {
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: 'none'
  };
  
  const menuDividerStyles = {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '4px 0'
  };
  
  return (
    <div style={containerStyles}>
      <div style={leftSectionStyles}>
        <button 
          style={iconButtonStyles} 
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          EHB Developer Portal
        </div>
        
        <div style={searchContainerStyles}>
          <FaSearch style={searchIconStyles} />
          <input 
            type="text" 
            placeholder="Search folders, services, modules..." 
            style={searchInputStyles}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
      
      <div style={rightSectionStyles}>
        <button 
          style={iconButtonStyles}
          onClick={toggleColorMode}
          aria-label="Toggle Color Mode"
        >
          {colorMode === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        
        <button 
          style={iconButtonStyles}
          aria-label="Notifications"
        >
          <FaBell />
        </button>
        
        <div style={{ position: 'relative' }}>
          <div 
            style={avatarStyles}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            JD
          </div>
          
          <div style={userMenuStyles}>
            <button style={menuItemStyles}>Profile</button>
            <button style={menuItemStyles}>Settings</button>
            <button style={menuItemStyles}>Help</button>
            <button style={menuItemStyles}>Log Management</button>
            <div style={menuDividerStyles}></div>
            <button style={menuItemStyles}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;