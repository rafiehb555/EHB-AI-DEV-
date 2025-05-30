# Hooks

This directory contains custom React hooks for the EHB Admin Panel.

## Available Hooks

- `useAuth.js`: Authentication-related hooks (login, logout, user state)
- `useWorkspace.js`: Hooks for managing workspace state and preferences
- `useNotifications.js`: Hooks for handling notifications
- `useAPI.js`: Hooks for API requests and data fetching

## Usage

Import and use hooks in your components:

```jsx
import { useAuth } from 'hooks/useAuth';

function ProfileComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```