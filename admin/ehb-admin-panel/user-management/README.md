# User Management

This directory contains components and utilities for managing users in the EHB Admin Panel.

## Components

- `UserList.js`: Component for displaying and managing users
- `UserDetails.js`: Component for viewing and editing user information
- `UserCreation.js`: Form for creating a new user
- `RoleManager.js`: Component for managing user roles and permissions
- `TeamManagement.js`: Tools for organizing users into teams

## Usage

Import and use user management components in your pages:

```jsx
import { UserList } from 'user-management/UserList';
import { RoleManager } from 'user-management/RoleManager';

function UsersPage() {
  return (
    <div className="users-page">
      <h1>User Management</h1>
      <UserList showFilters={true} />
      <RoleManager />
    </div>
  );
}
```