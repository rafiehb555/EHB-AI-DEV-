# EHB System Developer Setup Guide

This guide provides instructions for setting up a development environment for the EHB system.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase account
- OpenAI API key (optional, for AI features)
- Anthropic API key (optional, for AI features)

## System Architecture Overview

The EHB system consists of several components:

1. **Frontend**: Next.js application
2. **Backend**: Node.js/Express API server
3. **Integration Hub**: Central service for module integration
4. **Developer Portal**: Documentation and development resources
5. **Database**: Supabase (PostgreSQL)

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ehb-system.git
cd ehb-system
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Integration Hub dependencies
cd ../EHB-AI-Dev-Fullstack
npm install

# Install Developer Portal dependencies
cd ../EHB-Developer-Portal
npm install
```

### 3. Configure Environment Variables

Create `.env` files in each component directory based on the provided `.env.example` files:

#### Frontend (.env.local)

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_API_BASE_URL=http://localhost:5002/api
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend (.env)

```
PORT=5001
JWT_SECRET=your-jwt-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### Integration Hub (.env)

```
PORT=5003
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

#### Developer Portal (.env)

```
PORT=5000
INTEGRATION_HUB_URL=http://localhost:5003
```

### 4. Start Development Servers

Use the provided start script to run all components:

```bash
# From the root directory
npm run start
```

Or start individual components:

```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend server
cd frontend
npm run dev

# Start the integration hub
cd EHB-AI-Dev-Fullstack
node index.js

# Start the developer portal
cd EHB-Developer-Portal
node index.js
```

### 5. Access the Applications

- Frontend: http://localhost:5002
- Backend API: http://localhost:5001
- Integration Hub: http://localhost:5003
- Developer Portal: http://localhost:5000

## Database Setup

The application uses Supabase for database storage. To set up the database:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and API keys
3. Update the `.env` files with your Supabase credentials
4. Run the database setup script:

```bash
cd backend
npm run db:setup
```

## Adding New Modules

To add a new module to the EHB system:

1. Create a new directory for your module
2. Implement the required API endpoints
3. Register your module with the Integration Hub:

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

4. Subscribe to relevant events:

```javascript
axios.post('http://localhost:5003/api/integration/events/subscribe', {
  subscriberModuleId: 'YourModuleId',
  publisherModuleId: 'PublisherModuleId', // Or '*' for all modules
  eventType: 'event-type'
});
```

## Troubleshooting

### CORS Issues

If you experience CORS issues between the frontend and backend:

1. Ensure the backend has proper CORS headers:

```javascript
app.use(cors({
  origin: ['http://localhost:5002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

2. Use the frontend's proxy API endpoints to relay requests:

```javascript
// In Next.js API route
export default async function handler(req, res) {
  const response = await fetch(`${process.env.BACKEND_URL}/your/endpoint`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });
  
  const data = await response.json();
  res.status(response.status).json(data);
}
```

### WebSocket Connection Issues

If WebSocket connections are failing:

1. Check that the WebSocket server is running on the correct path:

```javascript
// In Integration Hub
const wsServer = new WebSocketServer({ 
  server: httpServer, 
  path: '/ws' 
});
```

2. Ensure the WebSocket client connects to the correct URL:

```javascript
// In frontend client
const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/proxy/ws`;
const socket = new WebSocket(wsUrl);
```

## Need Help?

If you encounter any issues not covered in this guide, please contact the development team or file an issue on the GitHub repository.