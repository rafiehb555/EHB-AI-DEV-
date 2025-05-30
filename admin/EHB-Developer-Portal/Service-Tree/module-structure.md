# EHB System Module Structure

This document provides information about the module structure of the EHB system.

## Core Integration Hub

The Integration Hub is the core component of the EHB system, responsible for module registration and event distribution.

**ID:** EHBIntegrationHub
**Name:** EHB Integration Hub

## Registered Modules


### EHB-AI-Agent-Runtime

**ID:** undefined
**API Endpoint:** undefined
**Version:** 1.0.0
**Status:** N/A
**Registered:** N/A
**Last Updated:** N/A

EHB Module: EHB-AI-Agent-Runtime

#### Capabilities

- frontend-ui\n- backend-services
\n
### EHB-AI-DEV-AgentSystem-Phase-1

**ID:** undefined
**API Endpoint:** undefined
**Version:** 1.0.0
**Status:** N/A
**Registered:** N/A
**Last Updated:** N/A

EHB Module: EHB-AI-DEV-AgentSystem-Phase-1

#### Capabilities

- frontend-ui\n- backend-services
\n
### ehb-ai-dev-fullstack

**ID:** undefined
**API Endpoint:** undefined
**Version:** 1.0.0
**Status:** N/A
**Registered:** N/A
**Last Updated:** N/A

EHB AI Dev Fullstack Integration Hub

#### Capabilities

- frontend-ui\n- backend-services\n- authentication\n- ai-services
\n
### agent-handler

**ID:** undefined
**API Endpoint:** undefined
**Version:** 1.0.0
**Status:** N/A
**Registered:** N/A
**Last Updated:** N/A

EHB Module: agent-handler

#### Capabilities

- frontend-ui\n- backend-services
\n
### attached_assets

**ID:** undefined
**API Endpoint:** undefined
**Version:** 1.0.0
**Status:** N/A
**Registered:** N/A
**Last Updated:** N/A

EHB Module: attached_assets

#### Capabilities

- frontend-ui\n- backend-services


## Module Communication Flow

```
EHB Integration Hub
       |
       |--- Events ---> Subscribed Modules
       |
       |<-- Registration -- New Modules
```

## Adding New Modules

To add a new module to the EHB system:

1. Create a new module directory
2. Implement required functionality
3. Register with the Integration Hub:

```javascript
const axios = require('axios');

axios.post('http://localhost:5003/api/integration/modules/register', {
  moduleId: 'YourModuleId',
  name: 'Your Module Name',
  description: 'Description of your module',
  version: '1.0.0',
  apiEndpoint: 'http://localhost:your-port',
  capabilities: ['capability1', 'capability2']
});
```
