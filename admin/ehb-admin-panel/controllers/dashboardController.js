const Dashboard = require('../models/Dashboard');
const User = require('../models/User');

/**
 * Get user's dashboards
 * @route GET /api/dashboard
 */
exports.getUserDashboards = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all dashboards for the user
    const dashboards = await Dashboard.find({ user: userId })
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: dashboards.length,
      data: {
        dashboards
      }
    });
  } catch (error) {
    console.error('Get user dashboards error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching dashboards'
    });
  }
};

/**
 * Create a new dashboard
 * @route POST /api/dashboard
 */
exports.createDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, layout, isDefault } = req.body;
    
    // Create new dashboard
    const dashboard = await Dashboard.create({
      name,
      description,
      layout: layout || 'grid',
      user: userId,
      isDefault: isDefault || false,
      widgets: []
    });
    
    // If this is set as default, update other dashboards
    if (dashboard.isDefault) {
      await Dashboard.updateMany(
        { user: userId, _id: { $ne: dashboard._id } },
        { isDefault: false }
      );
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        dashboard
      }
    });
  } catch (error) {
    console.error('Create dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating dashboard'
    });
  }
};

/**
 * Get a specific dashboard
 * @route GET /api/dashboard/:id
 */
exports.getDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        dashboard
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching dashboard'
    });
  }
};

/**
 * Update a dashboard
 * @route PUT /api/dashboard/:id
 */
exports.updateDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    const { name, description, layout, isDefault } = req.body;
    
    // Update dashboard
    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: dashboardId, user: userId },
      {
        name,
        description,
        layout,
        isDefault
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // If this is set as default, update other dashboards
    if (dashboard.isDefault) {
      await Dashboard.updateMany(
        { user: userId, _id: { $ne: dashboard._id } },
        { isDefault: false }
      );
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        dashboard
      }
    });
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating dashboard'
    });
  }
};

/**
 * Delete a dashboard
 * @route DELETE /api/dashboard/:id
 */
exports.deleteDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    
    // Delete dashboard
    const dashboard = await Dashboard.findOneAndDelete({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // If the deleted dashboard was the default, set another one as default
    if (dashboard.isDefault) {
      const anotherDashboard = await Dashboard.findOne({ user: userId });
      if (anotherDashboard) {
        anotherDashboard.isDefault = true;
        await anotherDashboard.save();
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Dashboard deleted successfully'
    });
  } catch (error) {
    console.error('Delete dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting dashboard'
    });
  }
};

/**
 * Add a widget to a dashboard
 * @route POST /api/dashboard/:id/widgets
 */
exports.addWidget = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    const { type, title, size, position, config } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // Create widget
    const widget = {
      type,
      title,
      size: size || { w: 2, h: 2 },
      position: position || { x: 0, y: 0 },
      config: config || {}
    };
    
    // Add widget to dashboard
    dashboard.widgets.push(widget);
    await dashboard.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        widget: dashboard.widgets[dashboard.widgets.length - 1]
      }
    });
  } catch (error) {
    console.error('Add widget error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while adding widget'
    });
  }
};

/**
 * Update a widget
 * @route PUT /api/dashboard/:id/widgets/:widgetId
 */
exports.updateWidget = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const widgetId = req.params.widgetId;
    const userId = req.user.id;
    const { title, size, position, config } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // Find widget
    const widget = dashboard.widgets.id(widgetId);
    
    if (!widget) {
      return res.status(404).json({
        status: 'error',
        message: 'Widget not found'
      });
    }
    
    // Update widget
    if (title) widget.title = title;
    if (size) widget.size = size;
    if (position) widget.position = position;
    if (config) widget.config = { ...widget.config, ...config };
    
    // Save dashboard
    await dashboard.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        widget
      }
    });
  } catch (error) {
    console.error('Update widget error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating widget'
    });
  }
};

/**
 * Delete a widget
 * @route DELETE /api/dashboard/:id/widgets/:widgetId
 */
exports.deleteWidget = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const widgetId = req.params.widgetId;
    const userId = req.user.id;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // Remove widget
    dashboard.widgets.pull(widgetId);
    
    // Save dashboard
    await dashboard.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Widget deleted successfully'
    });
  } catch (error) {
    console.error('Delete widget error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting widget'
    });
  }
};

/**
 * Update dashboard layout
 * @route PUT /api/dashboard/:id/layout
 */
exports.updateLayout = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    const { layout, widgets } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // Update layout
    if (layout) dashboard.layout = layout;
    
    // Update widget positions
    if (widgets && Array.isArray(widgets)) {
      widgets.forEach(updatedWidget => {
        const widget = dashboard.widgets.id(updatedWidget.id);
        if (widget) {
          widget.position = updatedWidget.position;
          widget.size = updatedWidget.size;
        }
      });
    }
    
    // Save dashboard
    await dashboard.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        dashboard
      }
    });
  } catch (error) {
    console.error('Update layout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating layout'
    });
  }
};

/**
 * Set a dashboard as default
 * @route POST /api/dashboard/default/:id
 */
exports.setDefaultDashboard = async (req, res) => {
  try {
    const dashboardId = req.params.id;
    const userId = req.user.id;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      user: userId
    });
    
    if (!dashboard) {
      return res.status(404).json({
        status: 'error',
        message: 'Dashboard not found'
      });
    }
    
    // Set as default
    dashboard.isDefault = true;
    await dashboard.save();
    
    // Update other dashboards
    await Dashboard.updateMany(
      { user: userId, _id: { $ne: dashboard._id } },
      { isDefault: false }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Dashboard set as default successfully',
      data: {
        dashboard
      }
    });
  } catch (error) {
    console.error('Set default dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while setting default dashboard'
    });
  }
};