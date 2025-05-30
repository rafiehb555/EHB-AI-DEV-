# UI Configuration

This directory contains global UI configuration for the EHB platform. These configurations control the appearance, behavior, and layout of all user interfaces across the system.

## Configuration Files

- `theme.json`: Global theme settings (colors, typography, spacing)
- `layout.json`: Layout configurations (sidebar, header, content areas)
- `components.json`: Common component configurations
- `icons.json`: Icon library mapping and configuration

## Usage

UI components throughout the EHB platform should reference these configuration files to maintain consistency. For example:

```javascript
const { theme } = require('system/ui-config/theme.json');

// Use theme colors in a component
const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.button.fontSize};
`;
```

## Extending Configurations

Service-specific UI configurations should extend these base configurations rather than override them completely. This ensures system-wide consistency while allowing for customization.