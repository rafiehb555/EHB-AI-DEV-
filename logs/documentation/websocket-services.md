# EHB System WebSocket Services

This document provides information about WebSocket-enabled services in the EHB system.
The services listed below are automatically monitored and recovered in case of connectivity issues.

## Monitored Services

### GUI-Launcher

**WebSocket URL:** `ws://localhost:5003/ehb-integration`

**Service URL:** `http://localhost:5003`

**Description:** GUI Launcher for managing EHB services

**Capabilities:** service-management, system-monitoring

**Registered:** 2025-05-10T20:50:39.961Z

**Auto-Reconnect:** Enabled

---

### EHB-AI-Dev

**WebSocket URL:** `ws://localhost:5003/ehb-integration`

**Service URL:** `http://localhost:5003`

**Description:** Core AI and integration service for EHB system

**Capabilities:** ai, integration, management

**Registered:** 2025-05-10T20:50:39.968Z

**Auto-Reconnect:** Enabled

---

### EHB-Developer-Portal

**WebSocket URL:** `ws://localhost:5003/ehb-integration`

**Service URL:** `http://localhost:5003`

**Description:** Developer Portal for EHB system

**Capabilities:** documentation, development

**Registered:** 2025-05-10T20:50:39.976Z

**Auto-Reconnect:** Enabled

---

### EHB-DASHBOARD

**WebSocket URL:** `ws://localhost:5003/ehb-integration`

**Service URL:** `http://localhost:5003`

**Description:** Main Dashboard for EHB system

**Capabilities:** dashboard, ui

**Registered:** 2025-05-10T20:50:39.981Z

**Auto-Reconnect:** Enabled

---

### EHB-HOME

**WebSocket URL:** `ws://localhost:5003/ehb-integration`

**Service URL:** `http://localhost:5003`

**Description:** Home page for EHB system

**Capabilities:** home, ui

**Registered:** 2025-05-10T20:50:39.991Z

**Auto-Reconnect:** Enabled

---

## WebSocket Connection Guide

To connect to any of these WebSocket services, use the following code examples:

### Node.js Example

```javascript
const WebSocket = require('ws');

// Replace with actual service WebSocket URL
const ws = new WebSocket('ws://localhost:PORT/path');

ws.on('open', function open() {
  console.log('Connected to WebSocket');
  ws.send(JSON.stringify({ type: 'register', module: { name: 'MyModule' } }));
});

ws.on('message', function incoming(data) {
  const message = JSON.parse(data);
  console.log('Received message:', message);
});
```

### Browser Example

```javascript
// Determine correct WebSocket protocol (ws:// or wss://) based on HTTP/HTTPS
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${protocol}//${window.location.host}/ws-path`;

const socket = new WebSocket(wsUrl);

socket.onopen = () => {
  console.log('Connected to WebSocket');
  socket.send(JSON.stringify({ type: 'register', clientId: 'browser-client' }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received message:', message);
};
```

## Monitoring and Recovery

All WebSocket connections are automatically monitored by the WebSocket Monitor service. If a connection is lost, the system will attempt to reconnect with a progressive backoff strategy. If reconnection fails after multiple attempts, the system will attempt to restart the service.

## Health Checks

Health check records are stored in the `logs/health-checks` directory for each service, providing a history of connection status and recovery attempts.
