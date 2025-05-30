# EHB Integration Guide

This document provides guidance on how to integrate different modules within the EHB system.

## Core Architecture

The EHB system follows a modular microservices architecture where each module can operate independently while also integrating seamlessly with other modules. This is achieved through:

1. **Shared Authentication**: All modules use the same JWT-based authentication system
2. **Centralized Database**: EHB-SQL provides database services to all modules
3. **AI Services Layer**: EHB-AI-Marketplace provides intelligent features to all modules
4. **Unified Frontend**: EHB-HOME-PAGE provides navigation to all modules
5. **Analytics Dashboard**: EHB-DASHBOARD displays metrics from all modules
6. **Secure Transactions**: EHB-Blockchain provides transaction infrastructure

## Integration Patterns

### API-First Design

All modules expose REST APIs that other modules can consume. These APIs follow standard patterns:

```
GET /api/{module-name}/{resource}
POST /api/{module-name}/{resource}
PUT /api/{module-name}/{resource}/{id}
DELETE /api/{module-name}/{resource}/{id}
```

### Event-Based Communication

For real-time updates, modules use WebSocket connections to broadcast and receive events:

```javascript
// Broadcasting from any module
socket.emit('order-created', orderData);

// Listening in any module
socket.on('order-created', (orderData) => {
  // Handle the event
});
```

### Shared Components

UI components are shared across modules through a component library, ensuring consistent experiences:

```jsx
import { Button, Card, Table } from '@ehb/components';
```

## Integration Examples

### Integrating with EHB-SQL

```javascript
// Example of connecting to EHB-SQL from another module
import { supabase } from '@ehb/shared/db';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data;
}
```

### Integrating with EHB-AI-Marketplace

```javascript
// Example of using AI services from another module
import { generateRecommendations } from '@ehb/ai-marketplace/services';

async function getProductRecommendations(userId, productHistory) {
  const recommendations = await generateRecommendations({
    userId,
    productHistory,
    model: 'product-recommender',
    count: 5
  });
  
  return recommendations;
}
```

### Integrating with EHB-Blockchain

```javascript
// Example of processing a secure transaction
import { createTransaction } from '@ehb/blockchain/services';

async function processPayment(orderId, amount, customerId) {
  const transaction = await createTransaction({
    type: 'payment',
    metadata: { orderId },
    amount,
    from: customerId,
    to: 'system-account'
  });
  
  return transaction;
}
```

## Department Card Integration

The EHB-SQL module provides department cards (PSS, EMO, EDR) that can be integrated into any module:

```jsx
import { DepartmentCard } from '@ehb/sql/components';

function DepartmentSection() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <DepartmentCard department="pss" />
      <DepartmentCard department="emo" />
      <DepartmentCard department="edr" />
    </div>
  );
}
```

## Cross-Module Navigation

The EHB-HOME-PAGE provides navigation utilities that can be used in any module:

```jsx
import { ModuleLink } from '@ehb/home-page/components';

function NavigationMenu() {
  return (
    <nav>
      <ModuleLink to="dashboard">Dashboard</ModuleLink>
      <ModuleLink to="gosellr">GoSellr Store</ModuleLink>
      <ModuleLink to="jps">Jobs</ModuleLink>
      <ModuleLink to="franchise">Franchise</ModuleLink>
    </nav>
  );
}
```

## Authentication and User Management

Authentication is shared across all modules:

```javascript
import { useAuth } from '@ehb/shared/auth';

function ProfileComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Real-Time Notifications

Notifications can be sent and received across all modules:

```javascript
import { useNotifications, sendNotification } from '@ehb/shared/notifications';

// Sending notifications from any module
function OrderCompleted() {
  sendNotification({
    recipientId: order.customerId,
    title: 'Order Completed',
    message: `Your order #${order.id} has been completed`,
    type: 'success',
    module: 'gosellr'
  });
}

// Receiving notifications in any module
function NotificationPanel() {
  const { notifications, markAsRead } = useNotifications();
  
  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices for Integration

1. **Follow the Module Directory Structure**: Maintain the standard structure to ease integration
2. **Use Shared Utilities**: Leverage the shared utilities in `@ehb/shared/*`
3. **Respect Authentication**: Always verify user permissions before allowing access
4. **Handle Errors Gracefully**: Implement proper error handling for cross-module calls
5. **Document Integration Points**: Maintain documentation for your module's API
6. **Versioning**: Include version information in your APIs to prevent breaking changes
7. **Testing**: Test cross-module integrations thoroughly

## Roman Urdu Instructions

- Modules ko integrate karne k liye shared APIs istemal karein
- Authentication har module mein same system se handle hogi
- Real-time updates WebSockets se send karein
- Har module ka separate directory structure maintain karein
- Components aur utilities ko reuse karein modules k darmiyaan
- EHB-SQL se database access karein
- EHB-AI-Marketplace se AI features access karein