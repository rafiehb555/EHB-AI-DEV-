/**
 * Notification Controller
 * 
 * This controller handles notification operations using the WebSocket service
 */

const websocketService = require('../services/websocketService');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create a new notification and broadcast it to specified users or all users
exports.createNotification = async (req, res) => {
  const { title, message, type, userIds, data, broadcast } = req.body;
  
  try {
    // Generate a unique ID for the notification
    const notificationId = uuidv4();
    
    // Create notification object
    const notification = {
      id: notificationId,
      type: 'notification',
      notificationType: type || 'info', // info, success, warning, error
      title,
      message,
      data: data || {},
      timestamp: new Date().toISOString()
    };
    
    // Store notification in database
    const client = await pool.connect();
    
    try {
      await client.query(`
        INSERT INTO notifications (
          id, type, title, message, data, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        notification.id,
        notification.notificationType,
        notification.title,
        notification.message,
        JSON.stringify(notification.data),
        new Date()
      ]);
      
      // If specific users are provided, send to them
      let sentCount = 0;
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          // Store user notification in database
          await client.query(`
            INSERT INTO user_notifications (
              notification_id, user_id, is_read, created_at
            ) VALUES ($1, $2, $3, $4)
          `, [
            notification.id,
            userId,
            false,
            new Date()
          ]);
          
          // Send via WebSocket
          sentCount += websocketService.sendToUser(userId, notification);
        }
      } 
      // If broadcast flag is true, send to all connected clients
      else if (broadcast) {
        sentCount = websocketService.broadcast(notification);
      }
      
      res.status(201).json({
        success: true,
        notification,
        sentCount
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const client = await pool.connect();
    
    try {
      // First, ensure that the notifications table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id VARCHAR(36) PRIMARY KEY,
          type VARCHAR(20) NOT NULL,
          title VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          data JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Then, ensure that the user_notifications table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_notifications (
          id SERIAL PRIMARY KEY,
          notification_id VARCHAR(36) REFERENCES notifications(id),
          user_id INTEGER NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Get user notifications
      const result = await client.query(`
        SELECT 
          n.id, n.type, n.title, n.message, n.data, n.created_at,
          un.is_read
        FROM notifications n
        JOIN user_notifications un ON n.id = un.notification_id
        WHERE un.user_id = $1
        ORDER BY n.created_at DESC
        LIMIT 50
      `, [userId]);
      
      res.json({
        success: true,
        notifications: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  const { notificationIds } = req.body;
  const userId = req.params.userId;
  
  if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No notification IDs provided'
    });
  }
  
  try {
    const client = await pool.connect();
    
    try {
      // Mark notifications as read
      await client.query(`
        UPDATE user_notifications
        SET is_read = TRUE
        WHERE notification_id = ANY($1)
        AND user_id = $2
      `, [notificationIds, userId]);
      
      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a notification for a user
exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.notificationId;
  const userId = req.params.userId;
  
  try {
    const client = await pool.connect();
    
    try {
      // Delete user notification
      await client.query(`
        DELETE FROM user_notifications
        WHERE notification_id = $1
        AND user_id = $2
      `, [notificationId, userId]);
      
      // Check if this notification is still referenced by other users
      const { rowCount } = await client.query(`
        SELECT 1 FROM user_notifications
        WHERE notification_id = $1
        LIMIT 1
      `, [notificationId]);
      
      // If no other users reference this notification, delete it
      if (rowCount === 0) {
        await client.query(`
          DELETE FROM notifications
          WHERE id = $1
        `, [notificationId]);
      }
      
      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};