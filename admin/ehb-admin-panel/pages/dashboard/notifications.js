import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationButton } from '../../components/notifications';

const NotificationTestPage = () => {
  const { 
    addNotification, 
    sendTestNotification, 
    socketConnected,
    getUnreadCount
  } = useNotifications();
  
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test notification');
  const [type, setType] = useState('info');
  
  const handleAddNotification = (e) => {
    e.preventDefault();
    addNotification(title, message, type);
  };
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>EHB Dashboard Notifications</h1>
        <NotificationButton /></NotificationButton>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Notifications Demo</h2>
        <p style={{ marginBottom: '20px' }}>
          This page allows you to test the notification system by creating custom notifications.
        </p>
      </div>
      
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold' }}>Create a Notification</h2>
        
        <form onSubmit={handleAddNotification}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Message
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="type" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#3b82f6', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Local Notification
            </button>
            
            <button
              type="button"
              onClick={sendTestNotification}
              disabled={!socketConnected}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: socketConnected ? '#10b981' : '#9ca3af', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: socketConnected ? 'pointer' : 'not-allowed'
              }}
            >
              {socketConnected ? 'Send WebSocket Notification' : 'WebSocket Disconnected'}
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold' }}>Notification System Status</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '12px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>WebSocket Connection</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: socketConnected ? '#10b981' : '#ef4444',
                marginRight: '8px'
              }}></span>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {socketConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '12px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Unread Notifications</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{getUnreadCount()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;