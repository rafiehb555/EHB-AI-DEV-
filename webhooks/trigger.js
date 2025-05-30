/**
 * External Webhook Trigger Handler
 * 
 * This module provides webhook endpoints to trigger actions in the AI agent
 * from external systems like n8n, Zapier, IFTTT, GitHub, etc.
 * It supports automated workflows for code generation, deployment, and integration.
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// AI-Coder utility import
const aiCoder = require('../agent/utils/ai-coder');
// Web3 deployer import
const web3Deployer = require('../agent/tools/web3-deployer');

// SECRET: This should be a secure string set in environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default-webhook-secret-change-me';

/**
 * Verify webhook signature for security
 * @param {Object} req - Express request object
 * @returns {boolean} - Whether the signature is valid
 */
function verifySignature(req) {
  // For GitHub webhooks
  if (req.headers['x-hub-signature-256']) {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
  }
  
  // For custom integrations
  if (req.headers['x-webhook-signature']) {
    const signature = req.headers['x-webhook-signature'];
    return signature === WEBHOOK_SECRET;
  }
  
  // Fallback to query param for simple integrations
  if (req.query.secret) {
    return req.query.secret === WEBHOOK_SECRET;
  }
  
  return false;
}

/**
 * Log webhook activity to file
 * @param {Object} data - Data to log
 */
function logWebhook(data) {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const logFile = path.join(logsDir, 'webhooks.log');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;
  
  fs.appendFileSync(logFile, logEntry);
}

// GitHub webhook handler
router.post('/github', async (req, res) => {
  // Verify GitHub signature
  if (!verifySignature(req)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  logWebhook({ source: 'github', event, payload });
  
  // Handle different GitHub events
  switch (event) {
    case 'push':
      // Handle code push events
      console.log(`Received push event for ${payload.repository.name}`);
      // You can add custom handling here like auto-deployment
      // triggerAutoDeploy(payload);
      break;
      
    case 'issues':
      // Handle issue events
      if (payload.action === 'opened' || payload.action === 'edited') {
        console.log(`Issue ${payload.action}: ${payload.issue.title}`);
        
        // Check for AI component generation tags
        if (payload.issue.title.includes('[generate-component]')) {
          const description = payload.issue.body;
          const match = description.match(/Component name: ([A-Za-z0-9]+)/);
          if (match && match[1]) {
            const componentName = match[1];
            try {
              await aiCoder.generateComponent(description, componentName);
              // Comment on the GitHub issue with a success message
              // await commentOnIssue(payload.issue.number, `Component ${componentName} generated successfully!`);
            } catch (error) {
              console.error('Error generating component:', error);
            }
          }
        }
      }
      break;
      
    case 'pull_request':
      // Handle PR events
      console.log(`PR ${payload.action}: ${payload.pull_request.title}`);
      break;
      
    default:
      console.log(`Received unhandled GitHub event: ${event}`);
  }
  
  res.status(200).json({ status: 'success' });
});

// n8n webhook handler
router.post('/n8n', async (req, res) => {
  // Verify n8n signature
  if (!verifySignature(req)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  const action = req.body.action || 'unknown';
  const payload = req.body.data || {};
  
  logWebhook({ source: 'n8n', action, payload });
  
  try {
    switch (action) {
      case 'generate-component':
        // Generate a new React component
        if (payload.description && payload.name) {
          const outputPath = await aiCoder.generateComponent(
            payload.description,
            payload.name,
            payload.outputDir || 'components',
            payload.options || { styling: 'tailwind' }
          );
          
          return res.status(200).json({
            status: 'success',
            message: `Component generated successfully at ${outputPath}`
          });
        } else {
          return res.status(400).json({ 
            error: 'Missing required parameters: description and name' 
          });
        }
        
      case 'generate-page':
        // Generate a full page with components
        if (payload.name && payload.description) {
          const result = await aiCoder.generatePage(
            payload.name,
            payload.description,
            payload.components || []
          );
          
          return res.status(200).json({
            status: 'success',
            message: `Page generated successfully at ${result.pagePath}`,
            components: result.childComponents
          });
        } else {
          return res.status(400).json({ 
            error: 'Missing required parameters: name and description' 
          });
        }
        
      case 'deploy-contract':
        // Deploy a smart contract
        if (payload.contractPath && payload.network) {
          const deploymentInfo = await web3Deployer.deployContract(
            payload.contractPath,
            payload.network,
            payload.constructorArgs || [],
            payload.privateKey
          );
          
          return res.status(200).json({
            status: 'success',
            message: `Contract deployed successfully at ${deploymentInfo.address}`,
            deploymentInfo
          });
        } else {
          return res.status(400).json({ 
            error: 'Missing required parameters: contractPath and network' 
          });
        }
        
      case 'create-contract':
        // Create a new smart contract from template
        if (payload.name && payload.type) {
          const contractPath = await web3Deployer.createContract(
            payload.name,
            payload.type || 'custom',
            payload.options || {}
          );
          
          return res.status(200).json({
            status: 'success',
            message: `Contract created successfully at ${contractPath}`,
            contractPath
          });
        } else {
          return res.status(400).json({ 
            error: 'Missing required parameters: name and type' 
          });
        }
        
      case 'run-command':
        // Run a shell command
        if (payload.command) {
          const cmd = payload.command;
          const args = payload.args || [];
          const cwd = payload.cwd || process.cwd();
          
          const childProcess = spawn(cmd, args, { cwd });
          
          let stdout = '';
          let stderr = '';
          
          childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
          });
          
          childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
          });
          
          childProcess.on('close', (code) => {
            logWebhook({ 
              source: 'n8n', 
              action: 'run-command', 
              command: cmd, 
              exitCode: code,
              stdout,
              stderr
            });
          });
          
          return res.status(200).json({
            status: 'success',
            message: `Command ${cmd} started successfully`,
            pid: childProcess.pid
          });
        } else {
          return res.status(400).json({ 
            error: 'Missing required parameter: command' 
          });
        }
        
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error(`Error handling n8n webhook (${action}):`, error);
    return res.status(500).json({ 
      error: `Error handling action ${action}: ${error.message}` 
    });
  }
});

// Generic webhook handler for custom integrations
router.post('/custom', async (req, res) => {
  // Verify signature
  if (!verifySignature(req)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  const action = req.body.action || req.query.action || 'unknown';
  const payload = req.body;
  
  logWebhook({ source: 'custom', action, payload });
  
  try {
    // Process the webhook based on action
    // Add your custom logic here
    
    return res.status(200).json({ 
      status: 'success',
      message: `Webhook received: ${action}` 
    });
  } catch (error) {
    console.error(`Error handling custom webhook (${action}):`, error);
    return res.status(500).json({ 
      error: `Error handling action ${action}: ${error.message}` 
    });
  }
});

// Status endpoint to check webhook health
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;