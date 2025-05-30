import React, { useState, useEffect } from 'react';
import { WorkspaceProvider } from '../context/WorkspaceContext';
import WorkspaceDashboard from '../components/workspace/WorkspaceDashboard';

const WorkspacePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData && userData.id) {
          setIsLoggedIn(true);
          setUserType(userData.userType || 'standard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Login as a specific user type
  const handleLogin = (type) => {
    // Create mock user based on type
    const mockUsers = {
      standard: {
        id: 'user_123',
        name: 'John Doe',
        email: 'john@example.com',
        userType: 'standard'
      },
      seller: {
        id: 'seller_456',
        name: 'Jane Smith',
        email: 'jane@gosellr.com',
        userType: 'seller',
        sellerLevel: 2
      },
      franchise: {
        id: 'franchise_789',
        name: 'Robert Johnson',
        email: 'robert@franchise.com',
        userType: 'franchise',
        zone: 'North Zone',
        franchiseType: 'sub-franchise'
      }
    };

    const user = mockUsers[type];
    localStorage.setItem('currentUser', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserType(type);

    // Reload page to apply new user settings
    window.location.reload();
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('workspaceSettings');
    setIsLoggedIn(false);
    setUserType(null);
    
    // Reload page to reset state
    window.location.reload();
  };

  return (
    <WorkspaceProvider></WorkspaceProvider>
      <WorkspaceDashboard></WorkspaceDashboard>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px' 
          }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Welcome to Your Customizable Workspace</h2>
            
            {/* User Login/Logout */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {isLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    backgroundColor: userType === 'standard' ? '#2196F3' 
                                  : userType === 'seller' ? '#4CAF50' 
                                  : '#FF9800',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {userType === 'standard' ? 'Standard User' 
                    : userType === 'seller' ? 'GoSellr Seller' 
                    : 'Franchise Owner'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => handleLogin('standard')}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Login as User
                  </button>
                  <button 
                    onClick={() => handleLogin('seller')}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Login as Seller
                  </button>
                  <button 
                    onClick={() => handleLogin('franchise')}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Login as Franchise
                  </button>
                </>
              )}
            </div>
          </div>
          
          <p style={{ marginBottom: '16px' }}>
            This dashboard remembers your preferences and layout settings. Here's how to use it:
          </p>
          
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Add Modules:</strong> Use the "Add Module" dropdown in the top right to add functionality.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Customize Layout:</strong> Drag panels anywhere on the screen to organize your workspace.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Resize Panels:</strong> Grab the edges or corners of any panel to resize it.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Save Preferences:</strong> Your layout and settings are automatically saved for next time.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Change Settings:</strong> Click the "Workspace Settings" button in the sidebar to access theme and layout options.
            </li>
          </ul>
          
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '4px',
            border: '1px solid #ffeeba',
            marginBottom: '16px'
          }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <strong>Pro Tip:</strong> Login with different user types to see how your workspace preferences are saved independently for each user account. When logged in, preferences will be saved to the server instead of just localStorage.
            </p>
          </div>
          
          <p>
            Everything is drag-and-drop with persistent settings to make your workflow more efficient.
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '16px'
        }}>
          {/* Statistics Cards */}
          {[
            { title: 'Active Projects', value: '12', change: '+2', color: '#4CAF50' },
            { title: 'Team Members', value: '8', change: '+1', color: '#2196F3' },
            { title: 'Tasks Due Today', value: '5', change: '-2', color: '#FF9800' },
            { title: 'Support Tickets', value: '3', change: '0', color: '#9C27B0' }
          ].map((stat, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ 
                fontSize: '16px', 
                color: '#6c757d',
                marginTop: 0,
                marginBottom: '8px'
              }}>
                {stat.title}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'space-between'
              }}>
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold'
                }}>
                  {stat.value}
                </span>
                <span style={{ 
                  color: stat.change.startsWith('+') ? '#4CAF50' : stat.change.startsWith('-') ? '#F44336' : '#6c757d'
                }}>
                  {stat.change}
                </span>
              </div>
              
              <div style={{ 
                height: '4px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '2px',
                marginTop: '16px'
              }}>
                <div style={{ 
                  width: `${Math.random() * 100}%`, 
                  height: '100%', 
                  backgroundColor: stat.color,
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </WorkspaceDashboard>
    </WorkspaceProvider>
  );
};

export default WorkspacePage;