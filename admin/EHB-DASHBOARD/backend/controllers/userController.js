const User = require('../models/User');
const Analytics = require('../models/Analytics');

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Add filtering
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    
    // Execute query with pagination
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching users'
    });
  }
};

/**
 * Get a single user
 * @route GET /api/users/:id
 */
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to only access their own profile, admin can access any profile
    if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this profile'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user'
    });
  }
};

/**
 * Update a user
 * @route PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to only update their own profile, admin can update any profile
    if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this profile'
      });
    }
    
    // Don't allow password updates through this route
    if (req.body.password) {
      return res.status(400).json({
        status: 'error',
        message: 'This route is not for password updates. Please use /api/auth/update-password'
      });
    }
    
    // Don't allow role changes unless admin
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to change role'
      });
    }
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role, // This will only apply if admin (controlled above)
        avatar: req.body.avatar,
        isActive: req.body.isActive
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user'
    });
  }
};

/**
 * Delete a user (admin only)
 * @route DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting user'
    });
  }
};

/**
 * Get user preferences
 * @route GET /api/users/:id/preferences
 */
exports.getUserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to only access their own preferences, admin can access any user's preferences
    if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access these preferences'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get user preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching preferences'
    });
  }
};

/**
 * Update user preferences
 * @route PUT /api/users/:id/preferences
 */
exports.updateUserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to only update their own preferences, admin can update any user's preferences
    if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update these preferences'
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        'preferences.theme': req.body.theme,
        'preferences.notifications.email': req.body.notifications?.email,
        'preferences.notifications.push': req.body.notifications?.push,
        'preferences.language': req.body.language
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        preferences: updatedUser.preferences
      }
    });
  } catch (error) {
    console.error('Update user preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating preferences'
    });
  }
};

/**
 * Get user activity
 * @route GET /api/users/:id/activity
 */
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Allow users to only access their own activity, admin can access any user's activity
    if (userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this activity'
      });
    }
    
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get user's activity from analytics
    const activity = await Analytics.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 });
    
    // Get total count for pagination
    const total = await Analytics.countDocuments({ user: userId });
    
    res.status(200).json({
      status: 'success',
      results: activity.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: {
        activity
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching activity'
    });
  }
};