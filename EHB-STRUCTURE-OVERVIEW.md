# EHB System Structure Overview

## Introduction

This document outlines the approved folder structure for the EHB (Enterprise Hybrid Blockchain) system. All development must strictly follow this structure to ensure consistency, maintainability, and proper integration across all components.

## Folder Structure

```
├── admin/
│   ├── EHB-HOME/              # Main integration hub for all EHB components
│   ├── ehb-admin-panel/       # Admin control panel UI
│   ├── EHB-DASHBOARD/         # Operations dashboard
│   ├── EHB-Developer-Portal/  # Developer documentation and tools
│   └── User-flow/             # User journey management
│
├── services/
│   ├── EHB-GoSellr/           # E-commerce service
│   ├── JPS-Job-Providing-Service/  # Job marketplace
│   ├── WMS-World-Medical-Service/  # Healthcare service
│   ├── HPS-Education-Service/     # Education service
│   ├── OLS-Online-Law-Service/    # Legal services
│   └── SOT-Technologies/
│       └── EHB-AI-Dev/       # AI development tools & services
│           └── ai-agent/     # Autonomous AI agent system
│
├── system/
│   ├── EHB-SQL/              # Database management
│   │   ├── EHB-SQL-PSS/      # PSS database module
│   │   ├── EHB-SQL-EDR/      # EDR database module
│   │   └── EHB-SQL-EMO/      # EMO database module
│   ├── config/               # System configuration
│   ├── rules/                # Business rules and validation
│   └── structure.json        # This structure definition file
│
└── scripts/                  # System utilities and maintenance scripts
```

## Structure Verification

We have implemented automatic structure verification to ensure all code follows the approved directory structure. The verification runs:

1. At system startup via the `scripts/verify-structure-startup.js` script
2. Whenever the `verify` npm script is run
3. Within the continuous integration process

### How Verification Works

The verification process:

1. Reads the approved structure from `/system/structure.json`
2. Scans all directories and files in the project
3. Checks if each path adheres to the approved structure
4. Validates import/require statements to ensure they reference valid paths
5. Terminates execution if any violations are found

### Rules

1. No files or folders should be created outside the approved structure
2. All new phases or modules must be placed within the verified paths
3. Import/require statements must reference correct folders
4. The structure verification runs automatically on startup

## For Developers

When creating new components or modifying existing ones:

1. Always check the structure.json file to ensure you're placing files in the correct locations
2. Run `node verify_structure.js` before committing changes to validate your work
3. Keep all imports and requires aligned with the approved structure
4. Never bypass or disable the structure verification process

## Code Organization

* **Admin Modules**: All administrative interfaces and dashboards
* **Services**: Individual service applications that provide specific functionalities
* **System**: Core infrastructure, database, and configuration components
* **Scripts**: Utilities and maintenance tools

## Contact

For questions or clarification about the structure requirements, please contact the EHB system architect or refer to the Developer Portal documentation.