const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes in this file require authentication
router.use(authMiddleware.protect);

// GET /api/users - Get all users (admin only)
router.get('/', authMiddleware.restrictTo('admin'), userController.getAllUsers);

// GET /api/users/:id - Get a single user
router.get('/:id', userController.getUser);

// PUT /api/users/:id - Update a user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/:id', authMiddleware.restrictTo('admin'), userController.deleteUser);

// GET /api/users/:id/preferences - Get user preferences
router.get('/:id/preferences', userController.getUserPreferences);

// PUT /api/users/:id/preferences - Update user preferences
router.put('/:id/preferences', userController.updateUserPreferences);

// GET /api/users/:id/activity - Get user activity
router.get('/:id/activity', userController.getUserActivity);

module.exports = router;