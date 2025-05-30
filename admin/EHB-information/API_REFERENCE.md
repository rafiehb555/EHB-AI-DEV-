# EHB API Reference

## Overview

This document provides a reference for the various APIs available in the EHB platform. Each service exposes its own set of APIs that follow RESTful principles.

## Authentication

All API requests require authentication using JWT tokens. To obtain a token:

```
POST /api/auth/login
{
  "username": "your_username",
  "password": "your_password"
}
```

The response will include a token that should be included in the Authorization header of subsequent requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Core APIs

### User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | List all users |
| `/api/users/:id` | GET | Get user details |
| `/api/users` | POST | Create a new user |
| `/api/users/:id` | PUT | Update user details |
| `/api/users/:id` | DELETE | Delete a user |

### Module Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/modules` | GET | List all modules |
| `/api/modules/:id` | GET | Get module details |
| `/api/modules` | POST | Register a new module |
| `/api/modules/:id` | PUT | Update module details |
| `/api/modules/:id` | DELETE | Unregister a module |

### Service APIs

Each service in the EHB platform exposes its own API. Here are the base endpoints:

- GoSellr: `/api/gosellr`
- Blockchain: `/api/blockchain`
- SQL Departments: `/api/sql/:department`

## WebSocket APIs

Real-time notifications and updates are available through WebSocket connections:

```
ws://your-ehb-instance/ws
```

## Error Handling

All APIs return standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a JSON body with more details:

```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per user. Exceeding this limit will result in a 429 Too Many Requests response.