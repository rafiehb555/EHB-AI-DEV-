import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Panel for displaying a list of notifications
 */
const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  // Format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get the appropriate style for the notification type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return { 
          background: '#ecfdf5',
          border: '1px solid #10b981',
          icon: '✓',
          iconColor: '#10b981'
        };
      case 'warning':
        return { 
          background: '#fffbeb',
          border: '1px solid #f59e0b',
          icon: '⚠',
          iconColor: '#f59e0b'
        };
      case 'error':
        return { 
          background: '#fef2f2',
          border: '1px solid #ef4444',
          icon: '✗',
          iconColor: '#ef4444'
        };
      case 'info':
      default:
        return { 
          background: '#eff6ff',
          border: '1px solid #3b82f6',
          icon: 'ℹ',
          iconColor: '#3b82f6'
        };
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = (id) => {
    markAsRead([id]);
  };

  // Handle deleting a notification
  const handleDelete = (id, event) => {
    event.stopPropagation();
    deleteNotification(id);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        width: '350px',
        maxHeight: '500px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 50,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Notifications</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Notification List */}
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          maxHeight: '400px',
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>
            No notifications yet
          </div>
        ) : (
          (notifications || []).map((notification) => {
            const typeStyles = getTypeStyles(notification.type);
            
            return (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  opacity: notification.is_read ? 0.7 : 1,
                  backgroundColor: notification.is_read ? '#f9fafb' : typeStyles.background,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: typeStyles.iconColor,
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {typeStyles.icon}
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                      {notification.title}
                    </h4>
                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#9ca3af',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>{notification.message}</p>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() => mar(notifications || []).map((ons || []).map(n => n.id))}
            style={{
              background: 'none',
              border: 'none',
              color: '#4b5563',
              fontWeight: 'medium',
              cursor: 'pointer',
            }}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;