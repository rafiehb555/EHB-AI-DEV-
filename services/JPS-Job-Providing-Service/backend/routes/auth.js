const express = require('express');
const router = express.Router();
const integrationService = require('../services/integrationService');

// Sample user database (would be MongoDB in production)
const users = [];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with optional referral code
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password'
      });
    }
    
    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create a new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In real app, would hash password first
      referralCode: referralCode || null,
      createdAt: new Date().toISOString()
    };
    
    // Save user to database
    users.push(newUser);
    
    // If user registered with a referral code, notify Integration Hub
    if (referralCode) {
      try {
        await integrationService.notifyNewReferral({
          referralCode,
          referredUserId: newUser.id,
          referredUsername: newUser.username,
          status: 'registered'
        });
        console.log('Notified Integration Hub about new referral');
      } catch (error) {
        console.error('Failed to notify about referral:', error);
        // Continue registration process despite notification failure
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check for user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password (in real app, would compare hashed password)
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token (would use JWT in real app)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', (req, res) => {
  // In a real app, would verify JWT token and find user by ID
  // For now, we'll assume authentication middleware would populate req.user
  const userId = req.headers.authorization?.split(' ')[1];
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }
  
  try {
    // Decode token (in real app, would verify JWT)
    const decodedId = Buffer.from(userId, 'base64').toString().split(':')[0];
    
    // Find user
    const user = users.find(user => user.id === decodedId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;