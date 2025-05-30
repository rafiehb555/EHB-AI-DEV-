# Integration Hub API Documentation

This document provides information about the available API endpoints in the EHB Integration Hub.

## Health Check

**Endpoint:** `GET /api/health`

Check the health status of the Integration Hub

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-05-10T19:31:07.980Z",
  "services": {
    "integration": true,
    "notification": true,
    "dataSynchronization": true,
    "companyInfo": true
  }
}
```

## Module Management

**Endpoint:** `GET /api/integration/modules`

Get a list of all registered modules

**Response:**
```json
{
  "success": true,
  "modules": [
    {
      "moduleId": "DeveloperPortal",
      "name": "EHB Developer Portal",
      "apiEndpoint": "http://localhost:5000"
    }
  ]
}
```

## Event Subscription

**Endpoint:** `POST /api/integration/events/subscribe`

Subscribe to events from other modules

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
  "subscriptionId": "subscription-id",
  "message": "Subscription created successfully"
}
```

## Event Publishing

**Endpoint:** `POST /api/integration/events/publish`

Publish an event for subscribers

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
  "message": "Event published successfully",
  "notifiedSubscribers": [
    "subscriber1",
    "subscriber2"
  ]
}
```
