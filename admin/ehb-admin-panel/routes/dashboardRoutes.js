const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes in this file require authentication
router.use(authMiddleware.protect);

// GET /api/dashboard - Get user's dashboards
router.get('/', dashboardController.getUserDashboards);

// POST /api/dashboard - Create a new dashboard
router.post('/', dashboardController.createDashboard);

// GET /api/dashboard/:id - Get a specific dashboard
router.get('/:id', dashboardController.getDashboard);

// PUT /api/dashboard/:id - Update a dashboard
router.put('/:id', dashboardController.updateDashboard);

// DELETE /api/dashboard/:id - Delete a dashboard
router.delete('/:id', dashboardController.deleteDashboard);

// POST /api/dashboard/:id/widgets - Add a widget to a dashboard
router.post('/:id/widgets', dashboardController.addWidget);

// PUT /api/dashboard/:id/widgets/:widgetId - Update a widget
router.put('/:id/widgets/:widgetId', dashboardController.updateWidget);

// DELETE /api/dashboard/:id/widgets/:widgetId - Delete a widget
router.delete('/:id/widgets/:widgetId', dashboardController.deleteWidget);

// PUT /api/dashboard/:id/layout - Update dashboard layout
router.put('/:id/layout', dashboardController.updateLayout);

// POST /api/dashboard/default - Set a dashboard as default
router.post('/default/:id', dashboardController.setDefaultDashboard);

module.exports = router;