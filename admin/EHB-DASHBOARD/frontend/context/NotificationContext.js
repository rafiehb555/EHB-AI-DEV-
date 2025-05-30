import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the notification context
const NotificationContext = createContext();

/**
 * NotificationProvider Component
 * Provides notification functionality throughout the app
 */
export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Create a unique user ID if none exists
    if (!userId) {
      const storedUserId = localStorage.getItem('ehb:user:id');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = `user-${uuidv4().substring(0, 8)}`;
        localStorage.setItem('ehb:user:id', newUserId);
        setUserId(newUserId);
      }
    }

    // Initialize WebSocket connection
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        console.log('Connecting to WebSocket at', wsUrl);
        
        const newSocket = new WebSocket(wsUrl);
        
        newSocket.onopen = () => {
          console.log('WebSocket connected');
          setSocketConnected(true);
          newSocket.send(JSON.stringify({ type: 'register', userId }));
        };
        
        newSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.type === 'connected') {
            console.log('WebSocket connection confirmed by server');
          } else if (data.type === 'registered') {
            console.log(`Successfully registered as user ${data.userId}`);
          } else if (data.type === 'notification') {
            // Add new notification to the state
            addNotificationToState(data.notification);
          } else if (data.type === 'pong') {
            console.log('Received pong from server');
          }
        };
        
        newSocket.onclose = (event) => {
          console.log(`WebSocket disconnected, code: ${event.code}`);
          setSocketConnected(false);
          
          // Attempt to reconnect after a delay
          setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }, 3000);
        };
        
        newSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        
        setSocket(newSocket);
        
        // Clean up on unmount
        return () => {
          newSocket.close();
        };
      } catch (error) {
        console.error('Error establishing WebSocket connection:', error);
      }
    };
    
    // Connect WebSocket if we have a userId
    if (userId) {
      connectWebSocket();
    }
    
    // Clean up on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId]);
  
  // Keep connection alive with ping-pong
  useEffect(() => {
    if (!socket || !socketConnected) return;
    
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
    
    return () => clearInterval(pingInterval);
  }, [socket, socketConnected]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('ehb:notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
  }, []);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('ehb:notifications', JSON.stringify(notifications));
    }
  }, [notifications]);
  
  // Fetch initial notifications from the API
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId]);
  
  // Helper function to fetch notifications from API
  const fetchNotifications = useCallback(async (uid) => {
    try {
      const response = await fetch(`/api/notifications?userId=${uid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.notifications) {
        // Merge with existing notifications, avoiding duplicates
        setNotifications(prev => {
          const existing = new Set((prev || []).map(n => n.id));
          const newNotifications = (data.notifications || []).filter(n => !existing.has(n.id));
          return [...prev, ...newNotifications];
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);
  
  // Add a notification to state
  const addNotificationToState = (notification) => {
    setNotifications(prev => {
      // Avoid duplicates
      if (prev.some(n => n.id === notification.id)) {
        return prev;
      }
      // Add new notification at the beginning
      return [notification, ...prev];
    });
  };

  // Send notification via WebSocket
  const sendNotification = (title, message, type = 'info') => {
    const notification = {
      id: uuidv4(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Add to local state
    addNotificationToState(notification);
    
    // Send to server if socket is connected
    if (socket && socketConnected) {
      socket.send(JSON.stringify({
        type: 'notification',
        notification,
        userId,
        broadcast: false // Set to true if you want to broadcast to all users
      }));
    }
    
    return notification;
  };
  
  // Test function to generate random notifications
  const sendTestNotification = () => {
    const types = ['info', 'success', 'warning', 'error'];
    const titles = [
      'New Update Available',
      'Transaction Completed',
      'Security Alert',
      'Connection Issue',
      'Account Notice',
    ];
    const messages = [
      'A new version of the application is ready to install.',
      'Your transaction has been successfully processed.',
      'Unusual login detected from new device.',
      'Network connection is unstable.',
      'Your account requires verification.',
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return sendNotification(randomTitle, randomMessage, randomType);
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      (prev || []).map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      (prev || []).map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      (prev || []).filter(notification => notification.id !== notificationId)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('ehb:notifications');
  };
  
  // Get count of unread notifications
  const getUnreadCount = () => {
    return (notifications || []).filter(notification => !notification.read).length;
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sendNotification,
        sendTestNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getUnreadCount,
        socketConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};