const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('./routes/auth');
const affiliateRoutes = require('./routes/affiliates');
const integrationService = require('./services/integrationService');

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // Continue running the server even if database connection fails
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/affiliates', affiliateRoutes);

// Add Integration Hub connectivity - Used to notify other EHB modules
app.get('/api/integrations/referrals', async (req, res) => {
  try {
    // In a real implementation, this would query the database for affiliate statistics
    // For now, we return a sample response
    res.json({
      success: true,
      moduleId: 'EHB-AM-AFFILIATE-SYSTEM',
      capabilities: ['affiliate-management', 'referral-tracking', 'rewards-management'],
      data: {
        affiliates: {
          active: 35,
          total: 75
        },
        earnings: {
          pending: 2500,
          paid: 12500,
          total: 15000
        },
        referrals: {
          successful: 100,
          pending: 25
        }
      }
    });
  } catch (error) {
    console.error('Error in referrals endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving affiliate data',
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
      case 'new-referral':
        // Handle new referral from JPS service
        console.log('New referral received:', eventData.referralId);
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

// Cross-system data retrieval endpoint
app.get('/api/job-referrals', async (req, res) => {
  try {
    const referralData = await integrationService.getJobReferralData();
    res.json({
      success: true,
      source: 'JPS-Job-Providing-Service',
      data: referralData
    });
  } catch (error) {
    console.error('Error fetching job referral data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job referral data',
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
const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`EHB Affiliate Management System running on port ${PORT}`);
  
  // Register with the Integration Hub after a short delay to ensure servers are up
  setTimeout(async () => {
    try {
      await integrationService.registerWithHub();
      console.log('Registered with Integration Hub');
      
      // Subscribe to relevant events
      await integrationService.subscribeToEvent('new-referral');
      await integrationService.subscribeToEvent('referral-status-update');
      console.log('Subscribed to relevant events from Integration Hub');
    } catch (error) {
      console.error('Failed to register with Integration Hub:', error);
    }
  }, 5000);
});