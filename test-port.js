const express = require('express');
const app = express();
const port = 5050;

app.get('/', (req, res) => {
  res.send('Port 5050 is working!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server listening on port ${port}`);
});