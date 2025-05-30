const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login a user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user's profile (protected route)
router.get('/me', authMiddleware.protect, authController.getCurrentUser);

// POST /api/auth/logout - Logout a user
router.post('/logout', authController.logout);

// POST /api/auth/refresh-token - Refresh the access token
router.post('/refresh-token', authController.refreshToken);

// PUT /api/auth/update-password - Update user's password (protected route)
router.put('/update-password', authMiddleware.protect, authController.updatePassword);

// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token - Reset password with token
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;