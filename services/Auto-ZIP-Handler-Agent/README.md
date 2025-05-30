# Auto-ZIP-Handler-Agent

This service automatically processes ZIP files in upload directories, extracts them, identifies their module type, and installs them to the appropriate location in the EHB system structure.

## Features

- **Automated ZIP processing**: Monitors directories for new ZIP files
- **Module type detection**: Automatically identifies the type of module (service, UI, blockchain, etc.)
- **Flexible installation**: Installs modules to the correct location based on type
- **Developer Portal integration**: Registers modules with the Developer Portal
- **Configurable behavior**: Extensive configuration options in config.json

## Configuration

The service is configured via the `config.json` file. Key configuration options include:

- **watchDirectories**: Directories to monitor for ZIP files
- **targetPaths**: Where to install different types of modules
- **autoInstall**: Whether to automatically install modules
- **deleteAfterInstall**: Whether to delete ZIP files after installation

## Module Structure

For optimal module detection, ZIP files should include:

- **config.json**: Specifies module type, version, and dependencies
- **package.json**: For UI and service modules (optional)
- **README.md**: Contains module description (optional)

## Integration with Developer Portal

The service integrates with the EHB Developer Portal by:

1. Registering modules with the portal's module registry
2. Triggering the setup wizard when new modules are installed

## Security Considerations

- ZIP files are validated before extraction
- Module types are verified against allowed types
- Optional signature validation for verified modules

## Usage

This service runs automatically and requires no manual intervention. Simply upload ZIP files to the watched directories (usually `./uploads`), and they will be processed automatically.

## Logs

Logs are written to `./logs/zip-handler.log` by default. Log level and other logging options can be configured in `config.json`.