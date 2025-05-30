const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pool = require('./db/db');
const websocketService = require('./services/websocketService');

// Import routes
const notificationRoutes = require('./routes/notificationRoutes');
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const contextualHelpRoutes = require('./routes/contextualHelpRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const supabaseRoutes = require('./routes/supabaseRoutes');

// Import SQL Badge System routes
const path = require('path');
// Create a basic module for the SQL routes instead of directly requiring
const sqlLevelController = require(path.join(__dirname, '../../../services/SOT-Technologies/EHB-AI-Dev/backend/controllers/sqlLevelController'));
const sqlLevelRoutes = express.Router();

// Public routes
sqlLevelRoutes.get('/badges', sqlLevelController.getAllBadges);
sqlLevelRoutes.get('/badges/:level', sqlLevelController.getBadgeByLevel);

// Routes that would normally need authentication, but we'll make them public for now
sqlLevelRoutes.get('/profile', (req, res) => {
  // Mock user for development
  req.user = { id: 'mock-user-id' };
  sqlLevelController.getUserSQLProfile(req, res);
});
sqlLevelRoutes.post('/query', (req, res) => {
  // Mock user for development
  req.user = { id: 'mock-user-id' };
  sqlLevelController.recordSQLQuery(req, res);
});
sqlLevelRoutes.get('/leaderboard', (req, res) => {
  // Mock user for development
  req.user = { id: 'mock-user-id' };
  sqlLevelController.getLeaderboard(req, res);
});
sqlLevelRoutes.get('/progress', (req, res) => {
  // Mock user for development
  req.user = { id: 'mock-user-id' };
  sqlLevelController.getUserProgress(req, res);
});
sqlLevelRoutes.post('/manual-level-up', (req, res) => {
  // Mock user for development
  req.user = { id: 'mock-user-id', role: 'admin' };
  sqlLevelController.manualLevelUp(req, res);
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept']
}));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached (50MB)'
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.path
  });
});

// Initialize database tables when server starts
initializeDatabase();

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create notifications table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create user_preferences table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        preferences JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create onboarding_status table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_status (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        completed BOOLEAN NOT NULL DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create onboarding_flow table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_flow (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        steps JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create onboarding_interactions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_interactions (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        step_id VARCHAR(255) NOT NULL,
        user_response JSONB NOT NULL,
        ai_response JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create contextual_help_logs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contextual_help_logs (
        id UUID PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        response JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create help_question_logs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS help_question_logs (
        id UUID PRIMARY KEY,
        question TEXT NOT NULL,
        response JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Health check endpoint - explicitly adding this at the root level for workflow detection
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'EHB Dashboard Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/contextual-help', contextualHelpRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/supabase', supabaseRoutes);

// SQL Badge System routes
app.use('/api/sql-levels', sqlLevelRoutes);

// Serve static files for badges
app.use('/badges', express.static(path.join(__dirname, '../../../services/SOT-Technologies/EHB-AI-Dev/public/badges')));

// Create HTTP server
const server = http.createServer(app);

// Store websocketService in the app for use in routes
app.set('websocketService', websocketService);

// Initialize WebSocket service
websocketService.initialize(server);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log('==== EHB BACKEND SERVER STARTED ====');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://0.0.0.0:${PORT}/api`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log('======================================');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});

module.exports = server;