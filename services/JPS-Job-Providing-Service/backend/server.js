const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('./routes/auth');
const referralRoutes = require('./routes/referrals');
const integrationService = require('./services/integrationService');

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // Continue running the server even if database connection fails
    // This allows API endpoints that don't require the database to function
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);

// Integration Hub routes
app.get('/api/integrations/referrals', async (req, res) => {
  try {
    // In a real implementation, this would query the database for referral statistics
    // For now, we return a sample response
    res.json({
      success: true,
      moduleId: 'JPS-Job-Providing-Service',
      capabilities: ['referral-tracking', 'job-listings'],
      data: {
        referralCodes: {
          active: 25,
          total: 50
        },
        referrals: {
          pending: 5,
          active: 10,
          completed: 15
        }
      }
    });
  } catch (error) {
    console.error('Error in referrals endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving referral data',
      error: error.message
    });
  }
});

// Webhook endpoint to receive notifications from Integration Hub
app.post('/api/webhook/:eventType', async (req, res) => {
  try {
    const { eventType } = req.params;
    const eventData = req.body;
    
    console.log(`Received ${eventType} webhook:`, eventData);
    
    // Process different event types
    switch (eventType) {
      case 'new-affiliate':
        // Handle new affiliate registration
        console.log('New affiliate registered:', eventData.affiliateId);
        break;
      case 'referral-status-update':
        // Handle referral status updates
        console.log('Referral status updated:', eventData.referralId, eventData.status);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5004; // Using 5004 to avoid conflict with Developer Portal (5000) and Integration Hub (5003)
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`JPS Affiliate API server running on port ${PORT}`);
  
  // Register with the Integration Hub after a short delay to ensure servers are up
  setTimeout(async () => {
    try {
      await integrationService.registerWithHub();
      console.log('Registered with Integration Hub');
    } catch (error) {
      console.error('Failed to register with Integration Hub:', error);
    }
  }, 3000);
});