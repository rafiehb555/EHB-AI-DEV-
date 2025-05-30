/**
 * API Routes Entry Point
 * 
 * This file serves as the main entry point for API routes in the Fullstack AI Agent.
 * It handles routing to specific API controllers and middleware setup.
 */

const express = require('express');
const router = express.Router();

// Import API controllers
const agentController = require('./controllers/agent');
const componentsController = require('./controllers/components');
const contractsController = require('./controllers/contracts');

// Middleware for API routes
router.use(express.json());

// Apply rate limiting to prevent abuse
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
router.use(apiLimiter);

// Apply CORS for API routes
const cors = require('cors');
router.use(cors());

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes registration
router.use('/agent', agentController);
router.use('/components', componentsController);
router.use('/contracts', contractsController);

// Webhook routes
const webhookRoutes = require('../../webhooks/trigger');
router.use('/webhooks', webhookRoutes);

// 404 handler for API routes
router.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Error handler for API routes
router.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = router;