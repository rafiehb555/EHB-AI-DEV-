# EHB User Flow Management Module

The User Flow Management module provides a comprehensive solution for designing, implementing, and analyzing user journeys across the EHB platform.

## Features

- **Flow Design**: Visual editor for designing user journeys and workflows
- **Journey Mapping**: Create and manage user journey maps
- **Funnel Analysis**: Track and analyze user progression through funnels
- **Conversion Optimization**: Tools to optimize conversion rates
- **A/B Testing**: Test different user flow variations
- **Analytics**: Detailed analytics on user flow performance
- **Integration**: Seamless integration with other EHB modules

## API

The module provides REST API endpoints for:

- Retrieving flow definitions
- Creating and updating flows
- Analyzing flow performance
- Managing flow versions
- Exporting/importing flow templates

Base API path: `/api/user-flow`

## Flow Types

The following flow types are supported:

- **Onboarding**: User onboarding and initial setup flows
- **Registration**: Account creation and registration processes
- **Checkout**: Purchase and payment flows
- **Conversion**: Lead generation and conversion funnels
- **Support**: Customer support and ticketing workflows
- **Admin**: Administrative and management workflows

## Configuration

Configuration is managed via `config/config.json` and includes settings for:

- API configuration
- Flow type definitions
- Analytics settings
- UI customization options
- Integration points with other EHB modules

## Integration with Developer Portal

The module integrates with the EHB Developer Portal, allowing:

- Registration of custom flow components
- Flow template publishing
- Flow analytics dashboards
- Configuration via the Developer Portal UI

## Usage

Start the module with:

```
node index.js
```

The service runs on port 5015 by default.

Access the API at `http://localhost:5015/api/user-flow`

## Dependencies

- Express.js for API endpoints
- React for UI components
- Chakra UI for component styling
- EHB core services for authentication and data storage