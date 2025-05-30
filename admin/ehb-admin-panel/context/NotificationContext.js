import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for notifications
const NotificationContext = createContext();

/**
 * NotificationProvider Component
 * 
 * Provides notification state and actions for the entire application.
 * Handles displaying, adding, and removing notifications.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Add a notification
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      read: false,
      timestamp: new Date().toISOString(),
      ...notification,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-dismiss info notifications after specified time (if autoClose is true)
    if (notification.autoClose !== false && notification.type !== 'error') {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      (prev || []).map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>(prev || []).map((rev || []).map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Dismiss (remove) a notification
  const dismissNotification = (id) => {
    setNotifications(prev || []).fil(prev || []).filter(.filter(notification => notification.id !== id)
    );
  };
  
  // Dismiss all notifications
  const dismissAll = () => {
    setNotifications([]);
  };
  
  // Load notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // This would be a real API call in production
        const response = await fetch('/api/notifications');
        
        // For demonstration, we'll simulate some notifications
        // In a real app, this data would come from the API
        const simulatedNotifications = [
          {
            id: 1,
            type: 'info',
            title: 'Welcome to EHB Admin Panel',
            message: 'Explore the new features and functionality.',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            read: false,
          },
          {
            id: 2,
            type: 'success',
            title: 'Wallet Connected',
            message: 'Your MetaMask wallet has been successfully connected.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
          },
        ];
        
        setNotifications(simulatedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up WebSocket for real-time notifications (would be implemented in production)
    // This is a simplified version of how that might work
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          console.log('WebSocket connected');
          
          // Register for notifications
          socket.send(JSON.stringify({
            type: 'register',
            userId: 'user-e6376cad', // In a real app, this would be the actual user ID
          }));
        };
        
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          // Handle new notification messages
          if (data.type === 'notification') {
            addNotification({
              type: data.notificationType || 'info',
              title: data.title,
              message: data.message,
              autoClose: data.autoClose !== false,
              duration: data.duration || 5000,
            });
          }
        };
        
        socket.onclose = () => {
          console.log('WebSocket disconnected, attempting to reconnect...');
          // Reconnect after a delay
          setTimeout(connectWebSocket, 3000);
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        
        // Clean up on unmount
        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };
    
    // Connect to WebSocket
    const cleanup = connectWebSocket();
    return cleanup;
  }, []);
  
  // Create the context value object with state and functions
  const contextValue = {
    notifica(notifications |(notifications || []).filter((ications || []).filter(n => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    dismissAll,
  };
  
  return (
    <NotificationContext.Provider value={contextValue}></NotificationContext>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;