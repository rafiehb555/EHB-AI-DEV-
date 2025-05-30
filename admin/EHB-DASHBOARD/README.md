# EHB-DASHBOARD

This module contains the central dashboard system for the EHB platform.

## Features

- Interactive data visualizations
- Real-time metrics and KPIs
- Role-based dashboards
- Wallet management interface
- System notifications
- Task management
- User profile management
- Settings and preferences
- Administrative controls
- Cross-module data integration

## Dashboard Types

- Admin Dashboard
- Seller Dashboard
- Buyer Dashboard
- Franchise Dashboard
- Department Dashboards
- Analytics Dashboard
- Financial Dashboard

## Directory Structure

- `/frontend`: React/Next.js components for dashboards
- `/backend`: Express APIs for dashboard data
- `/models`: Data schemas for dashboard configuration
- `/config`: Configuration files for dashboard system
- `/wallet`: Wallet components and functionality

## Integration Points

All EHB modules connect to the dashboard for data visualization:

- EHB-SQL for database metrics
- EHB-AI-Marketplace for AI insights
- EHB-Blockchain for transaction data
- GoSellr-Ecommerce for sales metrics
- EHB-Franchise for franchise performance
- JPS-Job-Providing-Service for employment metrics
- All other service modules for their specific metrics

## Widget System

The dashboard uses a flexible widget system that allows:
- Drag-and-drop customization
- Widget resizing
- Data filtering
- Export capabilities
- Responsive layouts

## Roman Urdu Instructions

- Dashboard system EHB k tamam modules k liye metrics dikhata hai
- Har role k liye alag dashboard hai
- Wallet management dashboard k through hota hai
- Real-time data updates provide karta hai
- User apne dashboards customize kar sakte hain