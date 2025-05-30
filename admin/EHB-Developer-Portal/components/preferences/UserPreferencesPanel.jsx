import React from 'react';
import { useUserPreferences } from '../../context/UserPreferencesContext.jsx';

const UserPreferencesPanel = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Simple panel styles
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: isOpen ? 'block' : 'none',
      zIndex: 1000,
    },
    panel: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '320px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1001,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
    },
    section: {
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#555',
    },
    option: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
    },
    checkbox: {
      marginRight: '8px',
    },
  };

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose} />
      
      {/* Panel */}
      <div style={styles.panel}>
        <div style={styles.header}>
          <h2 style={styles.title}>Workspace Preferences</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {/* UI Theme Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>UI THEME</h3>
          <div style={styles.option}>
            <label style={styles.label}>Color Mode</label>
            <select 
              style={styles.select}
              value={preferences?.ui?.colorMode || 'light'}
              onChange={(e) => updatePreferences('ui.colorMode', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        
        {/* Layout Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>LAYOUT</h3>
          <div style={styles.option}>
            <label style={styles.label}>
              <input 
                type="checkbox" 
                style={styles.checkbox}
                checked={preferences?.sidebar?.collapsed || false}
                onChange={(e) => updatePreferences('sidebar.collapsed', e.target.checked)}
              />
              Collapse Sidebar
            </label>
          </div>
          <div style={styles.option}>
            <label style={styles.label}>Content Width</label>
            <select 
              style={styles.select}
              value={preferences?.layout?.contentWidth || 'full'}
              onChange={(e) => updatePreferences('layout.contentWidth', e.target.value)}
            >
              <option value="full">Full Width</option>
              <option value="contained">Contained</option>
            </select>
          </div>
        </div>
        
        {/* Features Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>FEATURES</h3>
          <div style={styles.option}>
            <label style={styles.label}>
              <input 
                type="checkbox" 
                style={styles.checkbox}
                checked={preferences?.features?.aiAssistant || true}
                onChange={(e) => updatePreferences('features.aiAssistant', e.target.checked)}
              />
              AI Assistant
            </label>
          </div>
          <div style={styles.option}>
            <label style={styles.label}>
              <input 
                type="checkbox" 
                style={styles.checkbox}
                checked={preferences?.features?.analytics || true}
                onChange={(e) => updatePreferences('features.analytics', e.target.checked)}
              />
              Analytics
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPreferencesPanel;