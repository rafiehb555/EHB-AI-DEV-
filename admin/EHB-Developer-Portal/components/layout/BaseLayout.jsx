import React from 'react';
import Link from 'next/link';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useColorMode, useColorModeValue } from '../chakra/MockChakraProvider';
import { getSiteConfig } from '../../utils/config';

const BaseLayout = ({ children, title, description }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const siteConfig = getSiteConfig();
  
  const layoutStyles = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const headerStyles = {
    padding: '16px 24px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  };
  
  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  };
  
  const flexStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  const logoLinkStyles = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  };
  
  const logoTextStyles = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0064db'
  };
  
  const versionStyles = {
    marginLeft: '8px',
    fontSize: '0.75rem',
    color: '#718096',
    marginTop: '4px'
  };
  
  const navStyles = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  };
  
  const buttonStyles = {
    padding: '8px 12px',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'background-color 0.2s',
    textDecoration: 'none'
  };
  
  const buttonHoverStyles = {
    backgroundColor: '#f1f5f9'
  };
  
  const iconButtonStyles = {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4a5568'
  };
  
  const pageTitleStyles = {
    backgroundColor: '#ebf5ff',
    padding: '24px 0'
  };
  
  const titleStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a202c'
  };
  
  const descriptionStyles = {
    marginTop: '8px',
    color: '#718096'
  };
  
  const mainStyles = {
    padding: '24px 0',
    flex: '1'
  };
  
  const footerStyles = {
    padding: '16px 0',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: 'white'
  };
  
  const footerTextStyles = {
    fontSize: '0.875rem',
    color: '#718096'
  };
  
  const footerLinkStyles = {
    fontSize: '0.875rem',
    color: '#718096',
    marginLeft: '16px',
    textDecoration: 'none'
  };
  
  return (
    <div style={layoutStyles}>
      {/* Header */}
      <header style={headerStyles}>
        <div style={containerStyles}>
          <div style={flexStyles}>
            <Link href="/dashboard" style={logoLinkStyles}>
              <div style={logoTextStyles}>
                {siteConfig.title}
              </div>
              <div style={versionStyles}>
                v{siteConfig.version}
              </div>
            </Link>
            
            <div style={navStyles}>
              <Link href="/dashboard" style={buttonStyles}>
                Dashboard
              </Link>
              <Link href="/phases" style={buttonStyles}>
                Phases
              </Link>
              <Link href="/learning" style={buttonStyles}>
                Learning
              </Link>
              <button
                style={iconButtonStyles}
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
              >
                {colorMode === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page title */}
      {(title || description) && (
        <div style={pageTitleStyles}>
          <div style={containerStyles}>
            {title && <h1 style={titleStyles}>{title}</h1>}
            {description && <p style={descriptionStyles}>{description}</p>}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main style={mainStyles}>
        <div style={containerStyles}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer style={footerStyles}>
        <div style={containerStyles}>
          <div style={flexStyles}>
            <div style={footerTextStyles}>
              © {new Date().getFullYear()} EHB Developer Portal
            </div>
            <div>
              <a style={footerLinkStyles} href="#">Documentation</a>
              <a style={footerLinkStyles} href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;