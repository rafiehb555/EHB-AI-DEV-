const jwt = require('jsonwebtoken');

// JWT Secret Key - In production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'jps-affiliate-secret-key';

/**
 * Generate a JWT token for a user
 * @param {string} userId - The user ID to encode in the token
 * @param {object} additionalData - Any additional data to include in the token
 * @returns {string} - The generated JWT token
 */
exports.generateToken = (userId, additionalData = {}) => {
  return jwt.sign(
    { 
      id: userId,
      ...additionalData
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {object|null} - The decoded token payload or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Authentication middleware for Express
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      msg: 'Authentication required' 
    });
  }
  
  const decoded = this.verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ 
      success: false, 
      msg: 'Invalid or expired token' 
    });
  }
  
  req.user = decoded;
  next();
};
