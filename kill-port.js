const net = require("net");
const { exec } = require("child_process");

// Get port from command line argument or use default
const port = process.argv[2] ? parseInt(process.argv[2]) : 5005;

function findProcessOnPort() {
  return new Promise((resolve, reject) => {
    exec(`lsof -i :${port}`, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 1) {
          // No process found on this port
          resolve(null);
        } else {
          reject(error);
        }
        return;
      }
      
      const lines = stdout.trim().split('\n');
      if (lines.length > 1) {
        const processInfo = lines[1].split(/\s+/);
        const pid = processInfo[1];
        resolve(pid);
      } else {
        resolve(null);
      }
    });
  });
}

function killProcess(pid) {
  return new Promise((resolve, reject) => {
    exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function checkPort() {
  try {
    const server = net.createServer();
    
    return new Promise((resolve, reject) => {
      server.listen(port);
      
      server.on("listening", () => {
        console.log(`✅ Port ${port} is free. Proceeding to start server.`);
        server.close();
        resolve(true);
      });
      
      server.on("error", async (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`🔴 Port ${port} is already in use. Trying to close...`);
          
          try {
            const pid = await findProcessOnPort();
            if (pid) {
              console.log(`Found process with PID ${pid} on port ${port}. Killing...`);
              await killProcess(pid);
              console.log(`Process ${pid} killed successfully.`);
              resolve(true);
            } else {
              console.log(`⚠ No process found on port ${port}, but port is still in use.`);
              console.log(`⚠ Unable to auto-close in Replit. Please restart shell or click 'Stop' above.`);
              resolve(false);
            }
          } catch (error) {
            console.error("Error finding or killing process:", error);
            resolve(false);
          }
        } else {
          console.error("Unexpected error:", err);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("Error checking port:", error);
    return false;
  }
}

// Main function
async function main() {
  const result = await checkPort();
  process.exit(result ? 0 : 1);
}

main();
