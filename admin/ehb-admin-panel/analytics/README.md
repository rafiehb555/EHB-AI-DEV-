# Analytics

This directory contains analytics-related components and utilities for the EHB Admin Panel.

## Components

- `Dashboard.js`: Main analytics dashboard component
- `Charts.js`: Reusable chart components (Line, Bar, Pie)
- `Metrics.js`: Components for displaying key metrics and KPIs
- `ReportGenerator.js`: Utility for generating analytics reports

## Usage

Import and use analytics components in your pages:

```jsx
import { LineChart, BarChart } from 'analytics/Charts';
import { KPI } from 'analytics/Metrics';

function AnalyticsPage() {
  return (
    <div className="analytics-page">
      <KPI title="Total Users" value={5432} change={+12.5} />
      <LineChart data={userData} title="User Growth" />
      <BarChart data={revenueData} title="Monthly Revenue" />
    </div>
  );
}
```