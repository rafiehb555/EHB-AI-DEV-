# Dashboard Cards

This directory contains reusable dashboard card components for the EHB Admin Panel.

## Components

- `MetricCard.js`: Card for displaying key metrics
- `ChartCard.js`: Card with embedded charts
- `StatusCard.js`: Card for showing system status
- `ActionCard.js`: Card with actionable buttons
- `NotificationCard.js`: Card for displaying notifications

## Usage

Import and use dashboard cards in your pages:

```jsx
import { MetricCard, ChartCard } from 'dashboard-cards';

function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <MetricCard 
        title="Total Users" 
        value={5432} 
        icon="users" 
        change={+12.5} 
      />
      <ChartCard 
        title="Revenue" 
        chartType="line" 
        data={revenueData} 
      />
    </div>
  );
}
```