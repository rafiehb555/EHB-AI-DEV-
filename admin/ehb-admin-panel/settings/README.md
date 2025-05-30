# Settings

This directory contains components and utilities for system settings in the EHB Admin Panel.

## Components

- `GeneralSettings.js`: Component for managing general system settings
- `SecuritySettings.js`: Component for security and authentication settings
- `IntegrationSettings.js`: Component for managing external service integrations
- `NotificationSettings.js`: Component for customizing notification preferences
- `BackupSettings.js`: Tools for system backup and recovery

## Usage

Import and use settings components in your pages:

```jsx
import { GeneralSettings } from 'settings/GeneralSettings';
import { SecuritySettings } from 'settings/SecuritySettings';

function SettingsPage() {
  return (
    <div className="settings-page">
      <h1>System Settings</h1>
      <Tabs>
        <Tab label="General">
          <GeneralSettings />
        </Tab>
        <Tab label="Security">
          <SecuritySettings />
        </Tab>
      </Tabs>
    </div>
  );
}
```