# Enterprise Hybrid Blockchain (EHB) System

Welcome to the EHB System, a comprehensive enterprise-level platform with multiple integrated modules and services.

## System Overview

The EHB System is a modular, microservices-based platform that combines blockchain technology, AI capabilities, and traditional web services to provide a complete enterprise solution. The system is designed with scalability, security, and integration in mind.

## Core Modules

### EHB-HOME-PAGE
The main entry point and navigation hub for the entire system.

### EHB-DASHBOARD
The central analytics and management dashboard for all services.

### EHB-AI-Marketplace
AI-powered intelligent services and features for all modules.

### EHB-Blockchain
Secure transaction processing and immutable record-keeping.

### EHB-SQL
Database services with three integrated departments (PSS, EMO, EDR).

### EHB-AM-AFFILIATE-SYSTEM
Affiliate marketing and referral system for all services.

## Business Modules

### GoSellr-Ecommerce
E-commerce platform for product sales and management.

### EHB-Franchise
Franchise management and territorial business expansion.

### JPS-Job-Providing-Service
Job listing and employment services.

## Service Modules

### HPS-Education-Service
Educational content and courses.

### WMS-World-Medical-Service
Medical consultations and health services.

### OLS-Online-Law-Service
Legal services and document management.

### EHB-Tube
Video content platform and streaming services.

### AG-Travelling
Travel booking and tourism services.

### SOT-Technologies
Technology consulting and solutions.

### HMS-Machinery
Industrial equipment marketplace.

### Delivery-Service
Logistics and package delivery management.

## Getting Started

1. Clone the repository
2. Set up environment variables
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development servers:
   ```
   npm run dev
   ```

## Architecture

The EHB System follows a microservices architecture:

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT-based with role-based access
- **Real-time**: WebSockets (Socket.io)
- **AI Integration**: OpenAI, Anthropic Claude

For more detailed information, refer to [EHB-SYSTEM-ARCHITECTURE.md](./EHB-SYSTEM-ARCHITECTURE.md).

## Integration

All modules in the EHB System are designed to work together seamlessly while maintaining their independence. For integration guidelines, refer to [EHB-INTEGRATION-GUIDE.md](./EHB-INTEGRATION-GUIDE.md).

## Module Structure

Each module follows a standard directory structure:

- `/frontend`: User interface components
- `/backend`: Server-side APIs and logic
- `/models`: Data schemas and models
- `/config`: Configuration files

For more information on the system structure, refer to [EHB-STRUCTURE-OVERVIEW.md](./EHB-STRUCTURE-OVERVIEW.md).

## Development

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- PostgreSQL database

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## Roman Urdu Instructions

- EHB System enterprise level ka complete solution hai
- System main multiple modules integrate hain
- Har module independently aur combined work karta hai
- AI features pure system main available hain
- Blockchain secure transactions provide karta hai
- Dashboard se saare modules monitor kiye ja sakte hain