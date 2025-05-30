import React from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiGrid, 
  FiBox, 
  FiDatabase, 
  FiServer, 
  FiSettings,
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiLayers,
  FiCode,
  FiTerminal
} from 'react-icons/fi';

const SidebarItem = ({ icon: Icon, children, active, href = "#" }) => {
  const activeBg = '#e3f2fd';
  const activeColor = '#0064db';
  const hoverBg = '#f5f5f5';
  
  return (
    <Link 
      href={href}
      style={{
        display: 'block',
        padding: '10px 16px',
        borderRadius: '8px',
        backgroundColor: active ? activeBg : 'transparent',
        color: active ? activeColor : '#333',
        transition: 'all 0.2s',
        cursor: 'pointer',
        width: '100%',
        textDecoration: 'none'
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = hoverBg;
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon style={{ fontSize: '18px' }} />
        <span style={{ fontWeight: active ? 600 : 500 }}>{children}</span>
      </div>
    </Link>
  );
};

const SidebarCategory = ({ children }) => {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#888',
        marginLeft: '16px',
        marginRight: '16px',
        marginTop: '16px',
        marginBottom: '8px',
      }}
    >
      {children}
    </div>
  );
};

const Sidebar = ({ activeItem = 'dashboard' }) => {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        width: '250px',
        top: 0,
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #eee',
        paddingTop: '24px',
        paddingBottom: '32px',
        overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo and title */}
        <div style={{ 
          display: 'flex', 
          paddingLeft: '16px', 
          paddingRight: '16px', 
          marginBottom: '32px', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            borderRadius: '8px', 
            backgroundColor: '#0064db', 
            padding: '8px', 
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiLayers style={{ color: 'white', fontSize: '20px' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>EHB Dev Portal</span>
        </div>
        
        {/* Main navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
          <SidebarItem icon={FiHome} active={activeItem === 'dashboard'} href="/">
            Dashboard
          </SidebarItem>
          <SidebarItem icon={FiGrid} active={activeItem === 'phases'} href="/phases">
            Development Phases
          </SidebarItem>
          <SidebarItem icon={FiGrid} active={activeItem === 'learning'} href="/learning">
            Learning Path
          </SidebarItem>
          
          <SidebarItem icon={FiCode} active={activeItem === 'code-explain'} href="/code-explain">
            AI Code Explanation
          </SidebarItem>
          
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
          
          <SidebarCategory>Services</SidebarCategory>
          <SidebarItem icon={FiBox} active={activeItem === 'gosellr'} href="/services/gosellr">
            GoSellr
          </SidebarItem>
          <SidebarItem icon={FiActivity} active={activeItem === 'ai-playground'} href="/services/playground">
            AI Playground
          </SidebarItem>
          <SidebarItem icon={FiServer} active={activeItem === 'jps'} href="/services/jps">
            JPS Service
          </SidebarItem>
          
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
          
          <SidebarCategory>Systems</SidebarCategory>
          <SidebarItem icon={FiDatabase} active={activeItem === 'blockchain'} href="/systems/blockchain">
            Blockchain System
          </SidebarItem>
          <SidebarItem icon={FiDatabase} active={activeItem === 'sql-department'} href="/systems/sql-department">
            SQL Department
          </SidebarItem>
          <SidebarItem icon={FiBarChart2} active={activeItem === 'franchise'} href="/systems/franchise">
            Franchise System
          </SidebarItem>
          
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />
          
          <SidebarCategory>Admin</SidebarCategory>
          <SidebarItem icon={FiSettings} active={activeItem === 'admin-panel'} href="/admin/panel">
            Admin Panel
          </SidebarItem>
          <SidebarItem icon={FiActivity} active={activeItem === 'dashboard-admin'} href="/admin/dashboard">
            Dashboard
          </SidebarItem>
          <SidebarItem icon={FiUsers} active={activeItem === 'user-management'} href="/admin/users">
            User Management
          </SidebarItem>
          <SidebarItem icon={FiBarChart2} active={activeItem === 'analytics'} href="/analytics">
            Analytics Dashboard
          </SidebarItem>
        </div>
        
        {/* Footer with profile */}
        <div style={{ marginTop: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
          <hr style={{ marginBottom: '16px', border: 'none', borderTop: '1px solid #eee' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#eee',
                marginRight: '12px',
                overflow: 'hidden'
              }}
            >
              <img 
                src="https://via.placeholder.com/36" 
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>Admin User</div>
              <div style={{ fontSize: '12px', color: '#888' }}>admin@ehb-system.com</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;