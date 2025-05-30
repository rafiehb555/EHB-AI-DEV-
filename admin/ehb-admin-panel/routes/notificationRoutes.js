const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store for notifications since we're not using a database for this example
const notificationsStore = {};

/**
 * @route GET /api/notifications
 * @desc Get notifications for a user
 */
router.get('/', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Initialize notifications array for the user if it doesn't exist
  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
  }
  
  res.json({ notifications: notificationsStore[userId] });
});

/**
 * @route POST /api/notifications
 * @desc Create a new notification
 */
router.post('/', (req, res) => {
  const { userId, title, message, type = 'info' } = req.body;
  
  if (!userId || !title || !message) {
    return res.status(400).json({ error: 'User ID, title, and message are required' });
  }
  
  // Initialize notifications array for the user if it doesn't exist
  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
  }
  
  // Create a new notification
  const notification = {
    id: uuidv4(),
    title,
    message,
    type,
    is_read: false,
    created_at: new Date().toISOString()
  };
  
  // Add the notification to the user's notifications
  notificationsStore[userId].unshift(notification);
  
  // Send the notification to connected WebSocket clients
  req.app.get('websocketService').sendNotification(userId, notification);
  
  res.status(201).json({ notification });
});

/**
 * @route POST /api/notifications/mark-read
 * @desc Mark notifications as read
 */
router.post('/mark-read', (req, res) => {
  const { userId, notificationIds } = req.body;
  
  if (!userId || !notificationIds || !Array.isArray(notificationIds)) {
    return res.status(400).json({ error: 'User ID and notification IDs array are required' });
  }
  
  // Initialize notifications array for the user if it doesn't exist
  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
    return res.json({ success: true });
  }
  
  // Mark notifications as read
  notificationsStore[userId] = notificationsStore[userId].map(notification => {
    if (notificationIds.includes(notification.id)) {
      return { ...notification, is_read: true };
    }
    return notification;
  });
  
  res.json({ success: true });
});

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a notification
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Initialize notifications array for the user if it doesn't exist
  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
    return res.json({ success: true });
  }
  
  // Remove the notification
  notificationsStore[userId] = notificationsStore[userId].filter(
    notification => notification.id !== id
  );
  
  res.json({ success: true });
});

/**
 * @route POST /api/notifications/test
 * @desc Send a test notification to a user
 */
router.post('/test', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const types = ['info', 'success', 'warning', 'error'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  // Create a test notification
  const notification = {
    id: uuidv4(),
    title: 'Test Notification',
    message: `This is a real-time ${randomType} notification sent at ${new Date().toLocaleTimeString()}`,
    type: randomType,
    is_read: false,
    created_at: new Date().toISOString()
  };
  
  // Add the notification to the user's notifications
  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
  }
  
  notificationsStore[userId].unshift(notification);
  
  // Send the notification to connected WebSocket clients
  req.app.get('websocketService').sendNotification(userId, notification);
  
  res.status(201).json({ notification });
});

/**
 * @route POST /api/notifications/broadcast
 * @desc Broadcast a notification to all users
 */
router.post('/broadcast', (req, res) => {
  const { title, message, type = 'info' } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }
  
  // Create a notification
  const notification = {
    id: uuidv4(),
    title,
    message,
    type,
    is_read: false,
    created_at: new Date().toISOString()
  };
  
  // Broadcast to all users via WebSocket
  req.app.get('websocketService').broadcast({
    type: 'notification',
    notification
  });
  
  res.status(201).json({ success: true, notification });
});

module.exports = router;