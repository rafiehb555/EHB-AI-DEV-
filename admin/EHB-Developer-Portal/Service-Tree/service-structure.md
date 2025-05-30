# EHB System Service Structure

This document provides an overview of the EHB system's service structure and component relationships.

## Core Components

```
EHB System
│
├── Integration Hub (EHB-AI-Dev-Fullstack)
│   ├── Module Registration Service
│   ├── Event Subscription System
│   ├── Data Synchronization Service
│   ├── WebSocket Notification Service
│   └── Company Information Service
│
├── Developer Portal
│   ├── Documentation Management
│   ├── API Registry
│   ├── Status Monitoring
│   └── Developer Resources
│
├── Frontend (Next.js)
│   ├── Multi-tenant Dashboard
│   ├── Department-specific Views
│   ├── AI Assistant Interface
│   ├── Drag-and-Drop Dashboard Builder
│   └── Proxy API Layer
│
└── Backend Services
    ├── Auth Service
    ├── User Management
    ├── AI Integration (OpenAI/Anthropic)
    ├── Document Management
    ├── Analytics Engine
    └── Supabase Database Connector
```

## Department Flow Diagram

```
User Login
   │
   ▼
EHB Dashboard
   │
   ├──────────┬──────────┬──────────┬──────────┐
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
GoSellr   JPS Job    OLS Law     WMS       HPS Ed
 Module    Module     Module    Medical    Module
   │          │          │       Module       │
   └──────────┴──────────┴──────────┴─────────┘
                        │
                        ▼
                Franchise Module
                        │
                        ▼
                TrustyWallet System
```

## Service Communication

The EHB system uses several methods for inter-service communication:

1. **REST APIs**: For standard request-response patterns
2. **WebSockets**: For real-time notifications and updates
3. **Event Subscription**: For asynchronous event-based communication
4. **Data Synchronization**: For keeping data consistent across services

## Integration Hub

The Integration Hub (EHB-AI-Dev-Fullstack) serves as the central nervous system of the EHB architecture. It enables:

- Dynamic module discovery and registration
- Event publishing and subscription
- Cross-module data synchronization
- Centralized company information management

## Supabase Database Structure

The system uses Supabase for persistent storage with these key tables:

- users
- departments
- services
- modules
- notifications
- documents
- company_info
- ai_feedback
- ai_suggestions

## WebSocket Communication

WebSocket connections support these channels:

- user-specific channels: `user-{userId}`
- module-specific channels: `module-{moduleId}`
- system-wide channel: `system`

## Security Model

Services authenticate with the Integration Hub using:

- Module ID verification
- API endpoint validation
- JWT-based authentication for cross-service requests