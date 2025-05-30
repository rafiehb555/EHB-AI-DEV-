import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from './NotificationBadge';
import NotificationPanel from './NotificationPanel';

/**
 * Button component for displaying and managing notifications
 */
const NotificationButton = () => {
  const { getUnreadCount, sendTestNotification, socketConnected, userId } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const buttonRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  // Toggle the notification panel
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Send a test notification
  const handleTestNotification = async () => {
    setIsSending(true);
    try {
      await sendTestNotification();
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        isPanelOpen
      ) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  return (
    <div ref={buttonRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* WebSocket Status */}
        <div 
          style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: socketConnected ? '#10b981' : '#ef4444',
            marginRight: '8px'
          }} 
          title={socketConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
        />
        
        {/* User ID Display */}
        <span 
          style={{ 
            fontSize: '12px', 
            marginRight: '8px',
            color: '#6b7280'
          }}
        >
          {userId?.current ? userId.current.substring(0, 8) : 'Anonymous'}
        </span>
        
        {/* Test Notification Button */}
        <button
          onClick={handleTestNotification}
          disabled={isSending || !socketConnected}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: isSending || !socketConnected ? 'not-allowed' : 'pointer',
            marginRight: '8px',
            opacity: isSending || !socketConnected ? 0.7 : 1,
          }}
        >
          {isSending ? 'Sending...' : 'Test'}
        </button>
        
        {/* Notification Button */}
        <button
          onClick={togglePanel}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {/* Bell icon */}
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: '#4b5563' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>

          {/* Notification badge */}
          <NotificationBadge count={getUnreadCount()} /></NotificationBadge>
        </button>
      </div>

      {/* Notificat<NotificationPanel
        isOpen={isPanelOpen}
        onClose={() =></NotificationPanel>      onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default NotificationButton;