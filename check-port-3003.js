const net = require('net');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is IN USE`);
        resolve(false);
      } else {
        console.log(`Port ${port} check error: ${err.code}`);
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`Port ${port} is AVAILABLE`);
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function main() {
  const port = 3003;
  console.log(`Checking if port ${port} is available...`);
  await checkPort(port);
}

main();