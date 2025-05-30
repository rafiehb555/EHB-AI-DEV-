# EHB Backend API Documentation

This document provides an overview of the available backend APIs in the EHB system.

## Integration Hub APIs

### Module Registration

**Endpoint:** `POST /api/integration/modules/register`

Register a new module with the Integration Hub.

**Request Body:**
```json
{
  "moduleId": "string",
  "name": "string",
  "description": "string",
  "version": "string",
  "apiEndpoint": "string",
  "capabilities": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "moduleId": "string",
  "message": "Module registered successfully",
  "registered": true
}
```

### Event Subscription

**Endpoint:** `POST /api/integration/events/subscribe`

Subscribe to events from other modules.

**Request Body:**
```json
{
  "subscriberModuleId": "string",
  "publisherModuleId": "string",
  "eventType": "string"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "string",
  "message": "Subscription created successfully"
}
```

### Event Publishing

**Endpoint:** `POST /api/integration/events/publish`

Publish an event for subscribers.

**Request Body:**
```json
{
  "publisherModuleId": "string",
  "eventType": "string",
  "eventData": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event published",
  "notifiedSubscribers": ["string"]
}
```

### Get Module Structure

**Endpoint:** `GET /api/integration/modules/structure`

Get the structure of all modules in the system.

**Response:**
```json
{
  "success": true,
  "structure": {
    "core": {
      "moduleId": "EHBIntegrationHub",
      "name": "EHB Integration Hub",
      "children": []
    }
  }
}
```

## Company Information APIs

**Endpoint:** `GET /api/company/info`

Get company information.

**Response:**
```json
{
  "success": true,
  "companyInfo": {
    "name": "string",
    "address": "string",
    "contactEmail": "string",
    "phone": "string",
    "website": "string",
    "description": "string",
    "departments": []
  }
}
```

## Notification APIs

**Endpoint:** `POST /api/notifications/create`

Create a new notification.

**Request Body:**
```json
{
  "title": "string",
  "message": "string",
  "type": "string",
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "notificationId": "string",
  "message": "Notification created successfully"
}
```

**Endpoint:** `GET /api/notifications/all`

Get all notifications.

**Response:**
```json
{
  "success": true,
  "notifications": []
}
```

## WebSocket Notification Service

The EHB system provides real-time notifications via WebSocket connections.

**WebSocket URL:** `ws://localhost:5003/ws`

**Event Types:**
- `notification` - New notifications
- `status-update` - System status changes
- `data-update` - Data synchronization events

**Example Event:**
```json
{
  "type": "notification",
  "data": {
    "id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "timestamp": "string"
  }
}
```