/**
 * EHB API Development Agent
 * 
 * This script provides an API for the Auto Development Agent,
 * allowing other services to create and manage service configurations.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const autoDevAgent = require('./auto-dev-agent');

// Configuration
const PORT = process.env.DEV_AGENT_PORT || 5010;
const SERVICE_CONFIG_DIR = path.join(__dirname, '../temp/service-configs');

// Ensure service config directory exists
if (!fs.existsSync(SERVICE_CONFIG_DIR)) {
  fs.mkdirSync(SERVICE_CONFIG_DIR, { recursive: true });
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/**
 * API Routes
 */

// Get all service configurations
app.get('/api/services', (req, res) => {
  try {
    const files = fs.readdirSync(SERVICE_CONFIG_DIR).filter(file => file.endsWith('.json'));
    
    const services = files.map(file => {
      const configData = JSON.parse(fs.readFileSync(path.join(SERVICE_CONFIG_DIR, file), 'utf8'));
      return configData;
    });
    
    res.json({ success: true, services });
  } catch (error) {
    console.error('Error retrieving services:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a specific service configuration
app.get('/api/services/:name', (req, res) => {
  try {
    const { name } = req.params;
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    
    if (!fs.existsSync(configFile)) {
      return res.status(404).json({ success: false, error: 'Service configuration not found' });
    }
    
    const configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    res.json({ success: true, service: configData });
  } catch (error) {
    console.error(`Error retrieving service ${req.params.name}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new service configuration
app.post('/api/services', (req, res) => {
  try {
    const { name, type, requirements } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ success: false, error: 'Name and type are required' });
    }
    
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    
    if (fs.existsSync(configFile)) {
      return res.status(409).json({ success: false, error: 'Service configuration already exists' });
    }
    
    const serviceConfig = {
      name,
      type,
      requirements: requirements || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(configFile, JSON.stringify(serviceConfig, null, 2));
    
    // Add to the auto dev agent
    autoDevAgent.addService(serviceConfig);
    
    res.status(201).json({ success: true, service: serviceConfig });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a service configuration
app.put('/api/services/:name', (req, res) => {
  try {
    const { name } = req.params;
    const { type, requirements } = req.body;
    
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    
    if (!fs.existsSync(configFile)) {
      return res.status(404).json({ success: false, error: 'Service configuration not found' });
    }
    
    const configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    
    if (type) configData.type = type;
    if (requirements) configData.requirements = requirements;
    
    configData.updatedAt = new Date().toISOString();
    
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
    
    res.json({ success: true, service: configData });
  } catch (error) {
    console.error(`Error updating service ${req.params.name}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a service configuration
app.delete('/api/services/:name', (req, res) => {
  try {
    const { name } = req.params;
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    
    if (!fs.existsSync(configFile)) {
      return res.status(404).json({ success: false, error: 'Service configuration not found' });
    }
    
    fs.unlinkSync(configFile);
    
    res.json({ success: true, message: `Service ${name} configuration deleted` });
  } catch (error) {
    console.error(`Error deleting service ${req.params.name}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a feature to a service
app.post('/api/services/:name/features', (req, res) => {
  try {
    const { name } = req.params;
    const { featureName, description, priority } = req.body;
    
    if (!featureName) {
      return res.status(400).json({ success: false, error: 'Feature name is required' });
    }
    
    const configFile = path.join(SERVICE_CONFIG_DIR, `${name}.json`);
    
    if (!fs.existsSync(configFile)) {
      return res.status(404).json({ success: false, error: 'Service configuration not found' });
    }
    
    const configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    
    // Initialize features array if it doesn't exist
    if (!configData.features) {
      configData.features = [];
    }
    
    // Add the feature
    const feature = {
      name: featureName,
      description: description || '',
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    configData.features.push(feature);
    configData.updatedAt = new Date().toISOString();
    
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
    
    res.status(201).json({ success: true, service: configData, feature });
  } catch (error) {
    console.error(`Error adding feature to service ${req.params.name}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all tasks in the queue
app.get('/api/tasks', (req, res) => {
  try {
    const tasksFile = path.join(__dirname, '../temp/auto-dev-tasks.json');
    
    if (!fs.existsSync(tasksFile)) {
      return res.json({ success: true, tasks: [] });
    }
    
    const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a task to the queue
app.post('/api/tasks', (req, res) => {
  try {
    const { type, serviceName, serviceType, requirements } = req.body;
    
    if (!type || !serviceName) {
      return res.status(400).json({ success: false, error: 'Task type and service name are required' });
    }
    
    // Add the task to the auto dev agent
    autoDevAgent.taskQueue.addTask({
      type,
      serviceName,
      serviceType,
      requirements
    });
    
    res.status(201).json({ success: true, message: 'Task added to queue' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent status
app.get('/api/status', (req, res) => {
  try {
    const tasksFile = path.join(__dirname, '../temp/auto-dev-tasks.json');
    let tasks = [];
    
    if (fs.existsSync(tasksFile)) {
      tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
    }
    
    const status = {
      running: true,
      queueSize: tasks.length,
      activeTask: tasks.length > 0 ? tasks[0] : null,
      uptime: process.uptime()
    };
    
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error retrieving status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`EHB API Development Agent running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Register as a service workflow
try {
  const workflowsSetRunConfig = require('../node_modules/.bin/replit-workflows');
  
  workflowsSetRunConfig({
    name: 'DevAgentAPI',
    command: 'node scripts/api-dev-agent.js'
  });
  
  console.log('Registered as a service workflow');
} catch (error) {
  console.warn('Could not register as a workflow:', error.message);
}

module.exports = app;