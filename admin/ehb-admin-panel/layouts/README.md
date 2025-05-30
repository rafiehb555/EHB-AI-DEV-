# Layouts

This directory contains reusable layout components for the EHB Admin Panel.

## Folder Structure

- `DashboardLayout.js`: Main dashboard layout with sidebar, header, and content area
- `AuthLayout.js`: Layout for authentication pages (login, register, etc.)
- `SettingsLayout.js`: Layout for settings pages with navigation tabs

## Usage

Import and use layouts in your pages:

```jsx
import DashboardLayout from 'layouts/DashboardLayout';

export default function MyPage() {
  return (
    <DashboardLayout>
      <h1>My Page Content</h1>
    </DashboardLayout>
  );
}
```