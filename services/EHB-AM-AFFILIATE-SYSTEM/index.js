/**
 * EHB-Affiliate-System
 * Main entry point
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'EHB-Affiliate-System',
    status: 'active',
    version: '1.0.0'
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`EHB-Affiliate-System running on port ${port}`);
  });
}

module.exports = app;
