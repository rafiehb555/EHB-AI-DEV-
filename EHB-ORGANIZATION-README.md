# EHB System Organization

This document provides information about the EHB system organization structure and how to use the reorganization tools.

## Organization Structure

The EHB system is organized into the following categories:

1. **Franchise System**
   - EHB-Franchise

2. **Dev Services**
   - SOT-Technologies

3. **AI Services**
   - EHB-AI-Dev-Fullstack
   - EHB-AI-Dev-Phase-1
   - EHB-AI-Marketplace

4. **Admin**
   - EHB-Developer-Portal
   - EHB-HOME
   - EHB-DASHBOARD

5. **System**
   - EHB-Blockchain
   - EHB-TrustyWallet-System
   - EHB-SQL
   - EHB-Services-Departments-Flow (if for system management)

6. **Services**
   - GoSellr-Ecommerce
   - WMS-World-Medical-Service
   - HPS-Education-Service
   - OLS-Online-Law-Service
   - JPS-Job-Providing-Service
   - EHB-Tube
   - HMS-Machinery
   - EHB-Services-Departments-Flow (if service providing)

## Reorganization Tools

This repository includes tools to reorganize the EHB system according to the standardized structure. The reorganization process includes:

1. Creating categorized folder structure
2. Setting up API connections between services
3. Synchronizing services with main UIs

### Scripts

- `scripts/ehb-folder-organizer.js`: Manages folder organization
- `scripts/ehb-service-connector.js`: Sets up API connections
- `scripts/ehb-service-sync.js`: Synchronizes services with main UIs
- `scripts/ehb-organize-structure.js`: Main orchestration script
- `reorganize-ehb-system.sh`: User-friendly shell script to run the reorganization

### Running the Reorganization

To run the reorganization process:

```bash
./reorganize-ehb-system.sh
```

This will:
1. Prepare and clean existing folders
2. Create main category directories
3. Move folders to categorized structure
4. Save folder mapping
5. Setup internal API connections and linking
6. Sync services with Home/Dashboard/Marketplace
7. Generate a comprehensive report

### Reports and Outputs

After running the reorganization, the following files will be generated:

- `ehb-folder-mapping.json`: Mapping of folders to categories
- `ehb-connections-manifest.json`: List of all API connections
- `ehb-reorganization-report.json`: Detailed technical report
- `ehb-reorganization-summary.txt`: Human-readable summary

## Connections Between Services

The reorganization establishes the following connections:

1. **Services to Admin Dashboards**
   - All services are connected to the admin dashboards for monitoring

2. **SQL System to All Folders**
   - The EHB-SQL module is connected to all other modules for database access

3. **AI Services Full Access**
   - The EHB-AI-Dev-Fullstack module has full access to all other modules

## Folder Synchronization

The reorganization ensures that all active services are synchronized with:
- EHB-HOME
- EHB-DASHBOARD
- EHB-AI-Marketplace

This means that every module shows a card or tile in these main UIs.

## Maintaining the Structure

This organization structure should be maintained for all future development. New modules should be placed in the appropriate category, and the synchronization process should be run periodically to ensure that all UIs are up-to-date.

## Support

If you have any questions or encounter issues with the reorganization process, please contact the EHB development team.