# Franchise Control

This directory contains components and utilities for managing franchises in the EHB Admin Panel.

## Components

- `FranchiseList.js`: Component for displaying and managing franchises
- `FranchiseDetails.js`: Component for viewing detailed franchise information
- `FranchiseCreation.js`: Form for creating a new franchise
- `FranchiseAnalytics.js`: Analytics dashboard for franchise performance

## Usage

Import and use franchise control components in your pages:

```jsx
import { FranchiseList } from 'franchise-control/FranchiseList';

function FranchisesPage() {
  return (
    <div className="franchises-page">
      <h1>Manage Franchises</h1>
      <FranchiseList showFilters={true} />
    </div>
  );
}
```