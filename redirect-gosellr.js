/**
 * Redirect script for GoSellr
 * This script redirects to the correct location of GoSellr service
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// Specific routes for GoSellr redirections
app.get('/system/franchise-system/EHB-SUB-FRANCHISE/EHB-GoSellr', (req, res) => {
  console.log(`Redirecting franchise GoSellr request to GoSellr service`);
  res.redirect('http://localhost:5002');
});

// General redirect
app.use((req, res) => {
  console.log(`Redirecting general request from ${req.path} to GoSellr`);
  res.redirect('http://localhost:5002');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================`);
  console.log(`===== GOSELLR REDIRECTOR ============`);
  console.log(`Redirecting all traffic to GoSellr`);
  console.log(`Running on port ${PORT}`);
  console.log(`======================================`);
});