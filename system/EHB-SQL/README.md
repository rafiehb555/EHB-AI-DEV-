# EHB-SQL

This module contains the database infrastructure and department services for the EHB platform.

## Features

- Centralized database management
- Three integrated departments:
  - PSS (Personal Service System)
  - EMO (Employment Management Office)
  - EDR (Education Department Registry)
- SQL query execution and optimization
- Database administration tools
- Backup and recovery systems
- Access control and permissions
- Data validation and integrity
- Analytics and reporting
- Schema management
- Migration tools

## Department Cards

The EHB-SQL module provides interactive cards for each department:

- **PSS Card**: Access to Personal Service System functionality
- **EMO Card**: Access to Employment Management Office
- **EDR Card**: Access to Education Department Registry

Clicking on a department card navigates to that department's specific interface.

## Directory Structure

- `/frontend`: React/Next.js components for SQL interfaces
- `/backend`: Express APIs for database operations
- `/models`: Data schemas for SQL tables
- `/config`: Configuration files for database
- `/departments`: Department-specific functionality
  - `/pss`: Personal Service System
  - `/emo`: Employment Management Office
  - `/edr`: Education Department Registry

## Integration Points

EHB-SQL provides data storage and retrieval for all EHB modules:

- EHB-DASHBOARD for metrics display
- EHB-AI-Marketplace for data analysis
- EHB-Blockchain for transaction validation
- GoSellr-Ecommerce for product and order data
- JPS-Job-Providing-Service for job and candidate data
- EHB-Franchise for franchise management data
- All other service modules for their specific data needs

## Roman Urdu Instructions

- SQL module tamam database operations handle karta hai
- Teen departments is module mein integrate hain: PSS, EMO, aur EDR
- Department cards click kar k department interface access kar sakte hain
- Database backup aur security yahan se manage hoti hai
- Data validation automatically hota hai