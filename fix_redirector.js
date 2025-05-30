/**
 * Fix EHB-HOME-Main-Redirector Script
 * 
 * This script fixes the main redirector which forwards port 3003 to 5005
 * where the EHB-HOME service is running.
 */

const fs = require('fs');
const { exec } = require('child_process');

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function createRedirectorFile() {
  const redirectorFile = 'redirect-to-ehb-home.js';
  const fileContent = `/**
 * EHB-HOME Main Redirector
 * 
 * This script redirects all root traffic to the EHB-HOME module
 * which serves as the central entry point for all EHB services.
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({});

// Handle proxy errors
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: Could not connect to EHB-HOME service.');
});

// Create the server that will handle the redirects
const server = http.createServer(function(req, res) {
  // Log the incoming request
  console.log(\`\${new Date().toISOString()} - Request for \${req.url}\`);
  
  // Redirect to the EHB-HOME service on port 5005
  proxy.web(req, res, { target: 'http://localhost:5005' });
});

// Listen on port 3003
const PORT = 3003;
server.listen(PORT, function() {
  console.log(\`EHB-HOME Main Redirector running on port \${PORT}\`);
  console.log(\`All traffic will be redirected to EHB-HOME service on port 5005\`);
});

// Periodically check if the EHB-HOME service is running
setInterval(function() {
  const http = require('http');
  const req = http.get('http://localhost:5005/health', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(\`EHB-HOME service health check: \${res.statusCode}\`);
    });
  }).on('error', (err) => {
    console.log(\`EHB-HOME service health check failed: \${err.message}\`);
  });
  req.end();
}, 30000); // Check every 30 seconds
`;

  fs.writeFileSync(redirectorFile, fileContent);
  log(`Created redirector file: ${redirectorFile}`);
}

function restartRedirector() {
  // First kill any existing process
  exec('pkill -f "node redirect-to-ehb-home.js"', (error, stdout, stderr) => {
    // Ignore errors - it might not be running
    
    // Wait a moment to make sure the process is fully terminated
    setTimeout(() => {
      // Start the redirector in the background
      exec('node redirect-to-ehb-home.js &', (error, stdout, stderr) => {
        if (error) {
          log(`Error starting redirector: ${error.message}`);
          return;
        }
        
        log('EHB-HOME-Main-Redirector started successfully');
        log('The system is now accessible through the main Replit URL');
      });
    }, 1000);
  });
}

function restartWorkflow() {
  // We don't have direct access to restart workflows from JS
  // But we can create a signal file that indicates a restart is needed
  fs.writeFileSync('EHB-HOME-Main-Redirector.restart', new Date().toISOString());
  log('Created restart signal file for EHB-HOME-Main-Redirector');
}

function fixPortForwardingService() {
  // Check if the port forwarding service needs updating
  const portForwardingFile = 'port-forwarding-service.js';
  
  if (fs.existsSync(portForwardingFile)) {
    const content = fs.readFileSync(portForwardingFile, 'utf8');
    
    // Check if it's using port 5030 which might conflict
    if (content.includes('port = 5030')) {
      const updatedContent = content.replace('port = 5030', 'port = 5040');
      fs.writeFileSync(portForwardingFile, updatedContent);
      log('Updated port-forwarding-service.js to use port 5040 instead of 5030');
    } else {
      log('Port Forwarding Service already configured correctly');
    }
  } else {
    log('Port Forwarding Service file not found');
  }
}

function main() {
  log('=======================================');
  log('Starting EHB-HOME-Main-Redirector fix');
  log('=======================================');
  
  // Create or update the redirector file
  createRedirectorFile();
  
  // Fix port forwarding service if needed
  fixPortForwardingService();
  
  // Restart the redirector
  restartRedirector();
  
  // Create restart signal for the workflow
  restartWorkflow();
  
  log('=======================================');
  log('EHB-HOME-Main-Redirector fix completed');
  log('=======================================');
  
  log('\nThe system should now be accessible through the main Replit URL');
  log('If there are still issues, you may need to manually restart the workflow');
}

// Run the main function
main();