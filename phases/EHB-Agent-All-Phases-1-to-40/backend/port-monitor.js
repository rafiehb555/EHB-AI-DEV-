// port-monitor.js
const net = require('net');

function isPortAvailable(port, callback) {
  const server = net.createServer();
  server.once('error', () => callback(false));
  server.once('listening', () => {
    server.close();
    callback(true);
  });
  server.listen(port);
}

module.exports = { isPortAvailable };
