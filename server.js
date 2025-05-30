/**
 * EHB Root Server
 * 
 * This simple server redirects users to the EHB-HOME dashboard.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// All other routes redirect to EHB-HOME
app.get('*', (req, res) => {
  res.redirect('http://localhost:5005');
});

// Start the server
app.listen(PORT, () => {
  console.log(`EHB Root Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to be redirected to EHB-HOME`);
});