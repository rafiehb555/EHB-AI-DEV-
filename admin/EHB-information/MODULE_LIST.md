# EHB Module List

This document provides a comprehensive list of all modules in the Enterprise Hybrid Blockchain (EHB) platform.

## Administrative Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| EHB-HOME | UI | Central hub for EHB system | admin/EHB-HOME |
| EHB-DASHBOARD | UI | Administrative dashboard | admin/EHB-DASHBOARD |
| ehb-admin-panel | UI | Advanced administration panel | admin/ehb-admin-panel |
| EHB-Developer-Portal | UI | Developer interface and tools | admin/EHB-Developer-Portal |
| User-flow | Core | User journey and workflow management | admin/User-flow |
| EHB-information | Documentation | System documentation | admin/EHB-information |

## Service Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| EHB-GoSellr | Service | E-commerce and marketplace service | services/EHB-GoSellr |
| JPS-Job-Providing-Service | Service | Job management and assignment | services/JPS-Job-Providing-Service |
| Home-Dashboard-Linker | Service | Service integration and navigation | services/Home-Dashboard-Linker |
| Auto-ZIP-Handler-Agent | Service | Module installation and management | services/Auto-ZIP-Handler-Agent |
| EHB-Test-Service | Service | Test service for EHB platform | services/EHB-Test-Service |

## System Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| EHB-Blockchain | Blockchain | Blockchain integration layer | system/EHB-Blockchain |
| EHB-Services-Departments-Flow | System | Service department management | system/EHB-Services-Departments-Flow |
| EHB-SQL | Database | SQL database services | system/EHB-SQL |
| ui-config | Configuration | UI configuration and theming | system/ui-config |
| franchise-system | Business | Franchise system management | system/franchise-system |

## SQL Department Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| PSS | SQL | Product Storage Service | system/EHB-SQL/PSS |
| EDR | SQL | Entity Data Repository | system/EHB-SQL/EDR |
| EMO | SQL | Entity Management Operations | system/EHB-SQL/EMO |

## Blockchain Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| ehb-wallet | Blockchain | Digital wallet system | admin/ehb-wallet |
| trusty-wallet | Blockchain | Secure trusty wallet implementation | system/EHB-Blockchain/trusty-wallet |
| crypto-wallet | Blockchain | Cryptocurrency wallet integration | system/EHB-Blockchain/crypto-wallet |

## AI Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| EHB-AI-Agent | AI | AI-powered automation and assistance | ai-services/EHB-AI-Agent |
| EHB-AI-Bot | AI | AI chatbot and user assistance | ai-services/EHB-AI-Bot |

## Utility Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| moduleInstaller.js | Utility | Module installation utility | utils/moduleInstaller.js |
| ehb_error_scanner.js | Utility | Error scanning and fixing | ehb_error_scanner.js |
| ehb_auto_error_prevention.js | Utility | Automated error prevention | ehb_auto_error_prevention.js |
| ehb_backup_cleaner.js | Utility | Backup cleanup utility | ehb_backup_cleaner.js |

## Redirector Modules

| Module Name | Type | Description | Location |
|-------------|------|-------------|----------|
| EHB-Central-Redirector | Redirector | Central EHB redirector | redirect-central-ehb.js |
| GoSellr-Redirector | Redirector | GoSellr service redirector | redirect-gosellr.js |
| Developer-Portal-Redirector | Redirector | Developer Portal redirector | redirect-dev-portal.js |
| Dashboard-Redirector | Redirector | Dashboard redirector | redirect-dashboard.js |
| Home-Redirector | Redirector | Home redirector | redirect-home.js |

## Module Dependencies

Key module dependencies are as follows:

- **EHB-HOME**: Depends on all other modules for central integration
- **EHB-GoSellr**: Depends on PSS, EDR, EMO, and JPS
- **EHB-Wallet**: Depends on EHB-Blockchain
- **User-flow**: Depends on EHB-HOME, EHB-DASHBOARD, EHB-Developer-Portal
- **Auto-ZIP-Handler-Agent**: Depends on EHB-Developer-Portal

## Module Status

| Status | Count | Description |
|--------|-------|-------------|
| Active | 25 | Fully operational modules |
| In Development | 5 | Modules under active development |
| Planned | 3 | Planned for future implementation |
| Deprecated | 0 | Modules scheduled for removal |

## Integration Guide

For information on how to integrate these modules, refer to the [Developer Guide](./DEVELOPER_GUIDE.md) and the module-specific documentation in each module's directory.