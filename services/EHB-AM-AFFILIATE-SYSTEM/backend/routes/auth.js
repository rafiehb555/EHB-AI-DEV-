const express = require('express');
const router = express.Router();
const integrationService = require('../services/integrationService');

// Sample user database (would be MongoDB in production)
const users = [];
const affiliates = [];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new affiliate
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, companyName, website } = req.body;
    
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
      createdAt: new Date().toISOString()
    };
    
    // Save user to database
    users.push(newUser);
    
    // Generate unique affiliate code
    const affiliateCode = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(Math.random() * 10000)}`;
    
    // Create affiliate record
    const newAffiliate = {
      userId: newUser.id,
      affiliateCode,
      companyName: companyName || null,
      website: website || null,
      status: 'active',
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingCommission: 0,
      paidCommission: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save affiliate to database
    affiliates.push(newAffiliate);
    
    // Notify Integration Hub about new affiliate
    try {
      await integrationService.notifyAffiliateUpdate({
        affiliateId: newUser.id,
        affiliateCode,
        status: 'active',
        event: 'new-affiliate'
      });
      console.log('Notified Integration Hub about new affiliate');
    } catch (error) {
      console.error('Failed to notify about new affiliate:', error);
      // Continue registration process despite notification failure
    }
    
    res.status(201).json({
      success: true,
      message: 'Affiliate registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      affiliate: {
        affiliateCode,
        status: newAffiliate.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating affiliate account',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate affiliate & get token
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
    
    // Find affiliate record
    const affiliate = affiliates.find(aff => aff.userId === user.id);
    
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
      },
      affiliate: affiliate ? {
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        totalReferrals: affiliate.totalReferrals,
        successfulReferrals: affiliate.successfulReferrals,
        pendingCommission: affiliate.pendingCommission,
        paidCommission: affiliate.paidCommission
      } : null
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
 * @desc    Get current authenticated affiliate
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
    
    // Find affiliate record
    const affiliate = affiliates.find(aff => aff.userId === user.id);
    
    // Get job referral data from JPS service
    let jobReferrals = null;
    try {
      // In real implementation, would actually call the API
      // For demo purposes, we'll simulate successful API call
      jobReferrals = {
        source: 'JPS-Job-Providing-Service',
        total: 5,
        active: 3
      };
    } catch (error) {
      console.error('Failed to fetch job referrals:', error);
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      affiliate: affiliate ? {
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        totalReferrals: affiliate.totalReferrals,
        successfulReferrals: affiliate.successfulReferrals,
        pendingCommission: affiliate.pendingCommission,
        paidCommission: affiliate.paidCommission
      } : null,
      externalReferrals: {
        jobReferrals
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