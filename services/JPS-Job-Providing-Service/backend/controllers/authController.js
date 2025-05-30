const User = require('../models/User');
const Referral = require('../models/Referral');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/token');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, referredBy } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'User with this email already exists' });
    }
    
    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 8);
    
    // Create new user
    const user = await User.create({ 
      name, 
      email, 
      password, // In production, this should be hashed
      referralCode,
      referredBy
    });
    
    // Create referral record if user was referred
    if (referredBy) {
      await Referral.create({ 
        referredUser: user._id, 
        referredBy,
        status: 'active'
      });
      
      // Notify the integration hub about the new referral
      try {
        // This would be implemented to notify the integration hub
        console.log('New referral created', { referredUser: user.email, referredBy });
      } catch (notifyError) {
        console.error('Failed to notify about referral:', notifyError);
      }
    }
    
    // Generate token for automatic login
    const token = generateToken(user._id);
    
    res.status(201).json({ 
      success: true, 
      msg: 'User registered successfully', 
      data: {
        referralCode,
        userId: user._id,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, msg: 'Error registering user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In production, we would compare hashed passwords
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        msg: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.json({ 
      success: true,
      msg: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, msg: 'Error during login', error: error.message });
  }
};
