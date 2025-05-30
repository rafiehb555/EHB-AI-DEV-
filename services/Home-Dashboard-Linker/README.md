# Home-Dashboard-Linker

This service integrates EHB-HOME with the various dashboards and admin panels in the EHB system.

## Purpose

The Home-Dashboard-Linker serves as the connection point between the central EHB-HOME hub and all other dashboard interfaces. It provides:

- Unified navigation between interfaces
- Consistent state management 
- Synchronized theme and preferences
- Single sign-on capabilities
- Centralized notifications

## Integration Points

- EHB-HOME
- EHB-DASHBOARD
- ehb-admin-panel
- EHB-Developer-Portal
- Service-specific dashboards

## Configuration

Configuration options can be found in `config.json`.

## API

The service exposes an API for dashboard integrations:

- `GET /api/dashboards`: Get list of available dashboards
- `POST /api/preferences`: Update user preferences across dashboards
- `GET /api/navigation`: Get unified navigation structure