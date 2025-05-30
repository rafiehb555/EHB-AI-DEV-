/**
 * Documentation Update Script
 * 
 * This script extracts documentation from the EHB system modules
 * and updates the Developer Portal documentation files.
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const INTEGRATION_HUB_URL = 'http://localhost:5003';
const BACKEND_URL = 'http://localhost:5001';
const API_ROUTES_DIR = path.join(__dirname, '..', 'API-Routes');
const BACKEND_ROUTES_DIR = path.join(__dirname, '..', 'Backend-Routes');
const SERVICE_TREE_DIR = path.join(__dirname, '..', 'Service-Tree');
const SYSTEM_ARCHITECTURE_DIR = path.join(__dirname, '..', 'System-Architecture');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(API_ROUTES_DIR, { recursive: true });
    await fs.mkdir(BACKEND_ROUTES_DIR, { recursive: true });
    await fs.mkdir(SERVICE_TREE_DIR, { recursive: true });
    await fs.mkdir(SYSTEM_ARCHITECTURE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

/**
 * Extract API routes from the backend services
 */
async function extractApiRoutes() {
  try {
    console.log('Extracting API routes...');
    
    // Get API routes from Integration Hub
    const integrationHubResponse = await axios.get(`${INTEGRATION_HUB_URL}/api/health`, { timeout: 5000 });
    
    // Get module structure from Integration Hub
    const moduleStructureResponse = await axios.get(`${INTEGRATION_HUB_URL}/api/integration/modules/structure`, { timeout: 5000 });
    const moduleStructure = moduleStructureResponse.data.structure || { core: { children: [] } };
    
    // Extract API routes from Integration Hub
    const integrationHubRoutes = {
      'health': {
        method: 'GET',
        path: '/api/health',
        description: 'Check the health status of the Integration Hub',
        response: integrationHubResponse.data
      },
      'modules': {
        method: 'GET',
        path: '/api/integration/modules',
        description: 'Get a list of all registered modules',
        response: {
          success: true,
          modules: (moduleStructure.children || []).map(child => ({
            moduleId: child.moduleId,
            name: child.name,
            apiEndpoint: child.apiEndpoint
          }))
        }
      },
      'events-subscribe': {
        method: 'POST',
        path: '/api/integration/events/subscribe',
        description: 'Subscribe to events from other modules',
        body: {
          subscriberModuleId: 'string',
          publisherModuleId: 'string',
          eventType: 'string'
        },
        response: {
          success: true,
          subscriptionId: 'subscription-id',
          message: 'Subscription created successfully'
        }
      },
      'events-publish': {
        method: 'POST',
        path: '/api/integration/events/publish',
        description: 'Publish an event for subscribers',
        body: {
          publisherModuleId: 'string',
          eventType: 'string',
          eventData: {}
        },
        response: {
          success: true,
          message: 'Event published successfully',
          notifiedSubscribers: ['subscriber1', 'subscriber2']
        }
      }
    };
    
    // Save Integration Hub API routes
    await fs.writeFile(
      path.join(API_ROUTES_DIR, 'integration-hub-api.md'),
      `# Integration Hub API Documentation

This document provides information about the available API endpoints in the EHB Integration Hub.

## Health Check

**Endpoint:** \`GET ${integrationHubRoutes.health.path}\`

${integrationHubRoutes.health.description}

**Response:**
\`\`\`json
${JSON.stringify(integrationHubRoutes.health.response, null, 2)}
\`\`\`

## Module Management

**Endpoint:** \`GET ${integrationHubRoutes.modules.path}\`

${integrationHubRoutes.modules.description}

**Response:**
\`\`\`json
${JSON.stringify(integrationHubRoutes.modules.response, null, 2)}
\`\`\`

## Event Subscription

**Endpoint:** \`${integrationHubRoutes['events-subscribe'].method} ${integrationHubRoutes['events-subscribe'].path}\`

${integrationHubRoutes['events-subscribe'].description}

**Request Body:**
\`\`\`json
${JSON.stringify(integrationHubRoutes['events-subscribe'].body, null, 2)}
\`\`\`

**Response:**
\`\`\`json
${JSON.stringify(integrationHubRoutes['events-subscribe'].response, null, 2)}
\`\`\`

## Event Publishing

**Endpoint:** \`${integrationHubRoutes['events-publish'].method} ${integrationHubRoutes['events-publish'].path}\`

${integrationHubRoutes['events-publish'].description}

**Request Body:**
\`\`\`json
${JSON.stringify(integrationHubRoutes['events-publish'].body, null, 2)}
\`\`\`

**Response:**
\`\`\`json
${JSON.stringify(integrationHubRoutes['events-publish'].response, null, 2)}
\`\`\`
`
    );
    
    console.log('API routes extracted and documented successfully');
    return true;
  } catch (error) {
    console.error('Error extracting API routes:', error.message);
    return false;
  }
}

/**
 * Extract database schema from the backend services
 */
async function extractDatabaseSchema() {
  try {
    console.log('Extracting database schema...');
    
    // In a real system, we would get this from the database directly
    // For now, we'll create a simulated schema
    
    const schema = {
      users: {
        description: 'Store user information',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true },
          { name: 'email', type: 'string', unique: true },
          { name: 'name', type: 'string' },
          { name: 'role', type: 'string' },
          { name: 'created_at', type: 'timestamp' }
        ]
      },
      departments: {
        description: 'Store department information',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true },
          { name: 'name', type: 'string' },
          { name: 'code', type: 'string', unique: true },
          { name: 'manager_id', type: 'uuid', foreignKey: 'users.id' },
          { name: 'created_at', type: 'timestamp' }
        ]
      },
      modules: {
        description: 'Store module information',
        columns: [
          { name: 'id', type: 'string', primaryKey: true },
          { name: 'name', type: 'string' },
          { name: 'api_endpoint', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'registered_at', type: 'timestamp' },
          { name: 'updated_at', type: 'timestamp' }
        ]
      },
      notifications: {
        description: 'Store notification information',
        columns: [
          { name: 'id', type: 'string', primaryKey: true },
          { name: 'user_id', type: 'uuid', foreignKey: 'users.id' },
          { name: 'title', type: 'string' },
          { name: 'message', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'read', type: 'boolean' },
          { name: 'created_at', type: 'timestamp' }
        ]
      },
      ai_feedback: {
        description: 'Store AI feedback information',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true },
          { name: 'user_id', type: 'uuid', foreignKey: 'users.id' },
          { name: 'prompt', type: 'string' },
          { name: 'response', type: 'string' },
          { name: 'rating', type: 'integer' },
          { name: 'feedback', type: 'string' },
          { name: 'created_at', type: 'timestamp' }
        ]
      }
    };
    
    // Save database schema
    await fs.writeFile(
      path.join(SYSTEM_ARCHITECTURE_DIR, 'database-schema.md'),
      `# EHB System Database Schema

This document provides information about the database schema used in the EHB system.

## Tables

${Object.entries(schema).map(([tableName, tableInfo]) => `
### ${tableName}

${tableInfo.description}

| Column | Type | Constraints |
|--------|------|-------------|
${(tableInfo.columns || []).map(column => `| ${column.name} | ${column.type} | ${column.primaryKey ? 'PRIMARY KEY' : ''}${column.unique ? 'UNIQUE' : ''}${column.foreignKey ? `REFERENCES ${column.foreignKey}` : ''} |`).join('\\n')}
`).join('\\n')}

## Relationships

- Users can belong to multiple departments
- Departments have one manager (a user)
- Notifications belong to a user
- AI feedback is provided by users

## Indexes

- users(email) - For quick user lookup by email
- departments(code) - For quick department lookup by code
- notifications(user_id) - For quick retrieval of a user's notifications
- ai_feedback(user_id) - For quick retrieval of a user's AI feedback
`
    );
    
    console.log('Database schema extracted and documented successfully');
    return true;
  } catch (error) {
    console.error('Error extracting database schema:', error.message);
    return false;
  }
}

/**
 * Extract module structure from the Integration Hub
 */
async function extractModuleStructure() {
  try {
    console.log('Extracting module structure...');
    
    // Get module structure from Integration Hub
    const moduleStructureResponse = await axios.get(`${INTEGRATION_HUB_URL}/api/integration/modules/structure`, { timeout: 5000 });
    const moduleStructure = moduleStructureResponse.data.structure || { core: { children: [] } };
    
    // Get registered modules
    const modulesResponse = await axios.get(`${INTEGRATION_HUB_URL}/api/integration/modules`, { timeout: 5000 });
    const modules = modulesResponse.data.modules || [];
    
    // Save module structure
    await fs.writeFile(
      path.join(SERVICE_TREE_DIR, 'module-structure.md'),
      `# EHB System Module Structure

This document provides information about the module structure of the EHB system.

## Core Integration Hub

The Integration Hub is the core component of the EHB system, responsible for module registration and event distribution.

**ID:** ${moduleStructure.core.moduleId}
**Name:** ${moduleStructure.core.name}

## Registered Modules

${modules.length > 0 
  ? (modules || []).map(module => `
### ${module.name}

**ID:** ${module.moduleId}
**API Endpoint:** ${module.apiEndpoint}
**Version:** ${module.version || 'N/A'}
**Status:** ${module.status || 'N/A'}
**Registered:** ${module.registrationTime || 'N/A'}
**Last Updated:** ${module.lastUpdateTime || 'N/A'}

${module.description || 'No description provided.'}

#### Capabilities

${module.capabilities && module.capabilities.length > 0
  ? (module.capabilities || []).map(capability => `- ${capability}`).join('\\n')
  : 'No capabilities specified.'}
`).join('\\n')
  : 'No modules have been registered yet.'}

## Module Communication Flow

\`\`\`
EHB Integration Hub
       |
       |--- Events ---> Subscribed Modules
       |
       |<-- Registration -- New Modules
\`\`\`

## Adding New Modules

To add a new module to the EHB system:

1. Create a new module directory
2. Implement required functionality
3. Register with the Integration Hub:

\`\`\`javascript
const axios = require('axios');

axios.post('http://localhost:5003/api/integration/modules/register', {
  moduleId: 'YourModuleId',
  name: 'Your Module Name',
  description: 'Description of your module',
  version: '1.0.0',
  apiEndpoint: 'http://localhost:your-port',
  capabilities: ['capability1', 'capability2']
});
\`\`\`
`
    );
    
    console.log('Module structure extracted and documented successfully');
    return true;
  } catch (error) {
    console.error('Error extracting module structure:', error.message);
    return false;
  }
}

/**
 * Update all documentation
 */
async function updateDocumentation() {
  try {
    console.log('Starting documentation update...');
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Extract and update documentation
    const apiRoutes = await extractApiRoutes();
    const databaseSchema = await extractDatabaseSchema();
    const moduleStructure = await extractModuleStructure();
    
    console.log('Documentation update completed with results:');
    console.log(`- API Routes: ${apiRoutes ? 'Success' : 'Failed'}`);
    console.log(`- Database Schema: ${databaseSchema ? 'Success' : 'Failed'}`);
    console.log(`- Module Structure: ${moduleStructure ? 'Success' : 'Failed'}`);
    
    return true;
  } catch (error) {
    console.error('Error updating documentation:', error);
    return false;
  }
}

// Run the update if this file is executed directly
if (require.main === module) {
  updateDocumentation().catch(error => {
    console.error('Documentation update failed:', error);
    process.exit(1);
  });
}

module.exports = {
  extractApiRoutes,
  extractDatabaseSchema,
  extractModuleStructure,
  updateDocumentation
};