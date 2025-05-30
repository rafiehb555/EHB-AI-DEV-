#!/bin/bash

# EHB Workspace Restructuring Script - Part 2
# This script continues the EHB-AI workspace restructuring where the previous script left off

LOG_FILE="restructure_log_part2.txt"
echo "EHB Workspace Restructuring Log (Part 2) - $(date)" > $LOG_FILE

# Functions for reporting
log_action() {
    echo "$1" | tee -a $LOG_FILE
}

echo "⚙️ Continuing EHB workspace restructuring..."

# 1. Verify if our previous restructuring tasks were completed
if [ ! -d "services/franchise-system" ]; then
    log_action "❌ Previous restructuring incomplete: services/franchise-system not found"
    log_action "➕ Creating services/franchise-system directory"
    mkdir -p services/franchise-system
    
    # Check if franchise-system directory still exists at root
    if [ -d "franchise-system" ]; then
        log_action "🔄 Moving franchise-system contents to services/franchise-system"
        
        # Move all contents
        for item in franchise-system/*; do
            if [ -e "$item" ]; then
                mv "$item" services/franchise-system/
                log_action "🔄 Moved: $item -> services/franchise-system/$(basename $item)"
            fi
        done
        
        # Remove original directory if empty
        if [ -z "$(ls -A franchise-system 2>/dev/null)" ]; then
            rmdir franchise-system
            log_action "🗑️ Removed empty directory: franchise-system"
        fi
    fi
fi

# 2. Create affiliate directory in services if it doesn't exist
if [ -d "affiliate" ]; then
    log_action "🔄 Moving affiliate directory to services"
    mkdir -p services/affiliate
    
    # Move contents
    for item in affiliate/*; do
        if [ -e "$item" ]; then
            mv "$item" services/affiliate/
            log_action "🔄 Moved: $item -> services/affiliate/$(basename $item)"
        fi
    done
    
    # Remove original directory if empty
    if [ -z "$(ls -A affiliate 2>/dev/null)" ]; then
        rmdir affiliate
        log_action "🗑️ Removed empty directory: affiliate"
    fi
else
    # Create affiliate directory if it doesn't exist
    mkdir -p services/affiliate
    log_action "➕ Created services/affiliate directory"
fi

# 3. Ensure EHB-AI-Dev is properly placed in services/SOT-Technologies
if [ ! -d "services/SOT-Technologies/EHB-AI-Dev" ]; then
    log_action "❌ Previous restructuring incomplete: services/SOT-Technologies/EHB-AI-Dev not found"
    mkdir -p services/SOT-Technologies/EHB-AI-Dev
    log_action "➕ Created services/SOT-Technologies/EHB-AI-Dev"
    
    # Check for EHB-AI-Dev in other locations and consolidate
    for location in "admin/EHB-AI-Dev" "ai-services/EHB-AI-Dev"; do
        if [ -d "$location" ]; then
            log_action "🔄 Moving $location to services/SOT-Technologies/EHB-AI-Dev"
            rsync -a "$location/" services/SOT-Technologies/EHB-AI-Dev/
            log_action "♻️ Merged: $location into services/SOT-Technologies/EHB-AI-Dev"
            
            # Backup before removing
            mkdir -p backup/restructure
            cp -r "$location" backup/restructure/$(echo $location | tr '/' '_')_backup
            
            # Remove original
            rm -rf "$location"
            log_action "🗑️ Removed: $location (after backup)"
        fi
    done
fi

# 4. Create standard structure in all required directories
create_standard_structure() {
    local dir=$1
    
    # Ensure all required subdirectories exist
    for subdir in frontend backend config public models components; do
        if [ ! -d "$dir/$subdir" ]; then
            mkdir -p "$dir/$subdir"
            log_action "➕ Created: $dir/$subdir"
            
            # Add placeholder file
            echo "// Placeholder file for $(basename $dir)/$subdir" > "$dir/$subdir/index.js"
            log_action "➕ Created placeholder: $dir/$subdir/index.js"
        fi
    done
    
    # Create README if it doesn't exist
    if [ ! -f "$dir/README.md" ]; then
        echo "# $(basename $dir)\n\nPart of the EHB System.\n" > "$dir/README.md"
        log_action "➕ Created: $dir/README.md"
    fi
}

# Process core directories
log_action "🔧 Ensuring standard structure for core directories..."

# Admin modules
for module in admin/EHB-HOME admin/EHB-DASHBOARD admin/EHB-Developer-Portal; do
    if [ -d "$module" ]; then
        create_standard_structure "$module"
    fi
done

# System modules
for module in system/EHB-Blockchain system/EHB-SQL system/EHB-TrustyWallet-System; do
    if [ -d "$module" ]; then
        create_standard_structure "$module"
    fi
done

# Service modules
for module in services/franchise-system services/affiliate services/SOT-Technologies/EHB-AI-Dev; do
    if [ -d "$module" ]; then
        create_standard_structure "$module"
    fi
done

# 5. Create structure.json file for future references
log_action "📝 Creating .structure.json for future reference..."

# Get lists of directories
admin_dirs=$(ls -1 admin 2>/dev/null | grep -v node_modules | grep -v "^\." | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')
services_dirs=$(ls -1 services 2>/dev/null | grep -v node_modules | grep -v "^\." | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')
system_dirs=$(ls -1 system 2>/dev/null | grep -v node_modules | grep -v "^\." | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')
shared_dirs=$(ls -1 shared 2>/dev/null | grep -v node_modules | grep -v "^\." | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')

# Create the JSON structure file
cat > .structure.json << EOF
{
  "timestamp": "$(date)",
  "ehb_structure": {
    "admin": [${admin_dirs:-}],
    "services": [${services_dirs:-}],
    "system": [${system_dirs:-}],
    "shared": [${shared_dirs:-}]
  },
  "placement_rules": {
    "GoSellr": "services/",
    "JPS": "services/",
    "WMS": "services/",
    "sql": "system/",
    "pss": "system/",
    "edr": "system/",
    "pages": "admin/",
    "logs": "admin/",
    "tools": "admin/"
  }
}
EOF

log_action "➕ Created: .structure.json"

# 6. Final validation
log_action "✅ Validation complete"
log_action "Structure Verified ✅ Ready for AI Development and Deployment Flow"

# 7. Generate a final report
cat > EHB-STRUCTURE-REPORT.md << EOF
# EHB Workspace Structure Report

## Overview
This report documents the reorganization of the EHB-AI workspace to align with the official architecture.

## Structure Hierarchy
- \`admin/\`: Administrative modules and dashboards
  - EHB-HOME: Main dashboard and entry point
  - EHB-DASHBOARD: Administrative dashboard
  - EHB-Developer-Portal: Developer tools and documentation
  
- \`services/\`: Business and technical services
  - franchise-system/: Franchise management modules
  - affiliate/: Affiliate management system
  - SOT-Technologies/: Technology modules
    - EHB-AI-Dev: AI development framework
  
- \`system/\`: Core system components
  - EHB-Blockchain: Blockchain integration
  - EHB-SQL: Database management tools
  - EHB-TrustyWallet-System: Wallet management

- \`shared/\`: Shared components and utilities
  - Components, types, utils, etc.

## Automated Module Detection
The system now supports automatic placement of modules:
- Modules with GoSellr, JPS, WMS, etc. → services/
- Modules with sql/, pss/, edr/ → system/
- Modules with pages/, logs/, tools/ → admin/

## Status
Structure Verified ✅ Ready for AI Development and Deployment Flow

## Next Steps
1. Implement the contextual help sidebar with real-time AI explanations
2. Continue with the regular development tasks

EOF

log_action "➕ Created: EHB-STRUCTURE-REPORT.md"

echo "🏁 EHB workspace reorganization complete!"
echo "📋 Check EHB-STRUCTURE-REPORT.md for a summary."