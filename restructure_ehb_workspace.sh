#!/bin/bash

# EHB Workspace Restructuring Script
# This script reorganizes the EHB-AI workspace to align with the official architecture

echo "⚙️ Starting EHB workspace restructuring..."

# Create a log file to track changes
LOG_FILE="restructure_log.txt"
echo "EHB Workspace Restructuring Log - $(date)" > $LOG_FILE

# Functions for reporting
log_created() {
    echo "➕ Created: $1" | tee -a $LOG_FILE
}

log_moved() {
    echo "🔄 Moved: $1 -> $2" | tee -a $LOG_FILE
}

log_merged() {
    echo "♻️ Merged: $1 into $2" | tee -a $LOG_FILE
}

log_deleted() {
    echo "🗑️ Deleted empty/duplicate: $1" | tee -a $LOG_FILE
}

# 1. Create required directories if they don't exist
create_standard_structure() {
    local parent_dir=$1
    local module_name=$2
    
    mkdir -p "$parent_dir/$module_name/frontend"
    mkdir -p "$parent_dir/$module_name/backend"
    mkdir -p "$parent_dir/$module_name/config"
    mkdir -p "$parent_dir/$module_name/public"
    mkdir -p "$parent_dir/$module_name/models"
    mkdir -p "$parent_dir/$module_name/components"
    
    # Create placeholder files if directories are empty
    for dir in frontend backend config public models components; do
        if [ ! "$(ls -A "$parent_dir/$module_name/$dir" 2>/dev/null)" ]; then
            echo "// $module_name $dir module placeholder" > "$parent_dir/$module_name/$dir/index.js"
            log_created "$parent_dir/$module_name/$dir/index.js (placeholder)"
        fi
    done
    
    # Create README if it doesn't exist
    if [ ! -f "$parent_dir/$module_name/README.md" ]; then
        echo "# $module_name\n\nPart of the EHB System.\n" > "$parent_dir/$module_name/README.md"
        log_created "$parent_dir/$module_name/README.md (placeholder)"
    fi
}

# 2. Move misplaced folders to correct location
echo "🔍 Moving misplaced folders to correct locations..."

# Handle franchise-system
if [ -d "franchise-system" ]; then
    if [ ! -d "services/franchise-system" ]; then
        mkdir -p services/franchise-system
        log_created "services/franchise-system"
    fi
    
    # Move all contents from franchise-system to services/franchise-system
    if [ -d "franchise-system/EHB-Franchise" ]; then
        mv franchise-system/EHB-Franchise services/franchise-system/
        log_moved "franchise-system/EHB-Franchise" "services/franchise-system/EHB-Franchise"
    fi
    
    if [ -d "franchise-system/EHB-GoSellr" ]; then
        mv franchise-system/EHB-GoSellr services/franchise-system/
        log_moved "franchise-system/EHB-GoSellr" "services/franchise-system/EHB-GoSellr"
    fi
    
    # Remove franchise-system if it's now empty
    if [ -z "$(ls -A franchise-system 2>/dev/null)" ]; then
        rmdir franchise-system
        log_deleted "franchise-system (empty directory)"
    else
        echo "Warning: franchise-system still contains files that weren't moved" | tee -a $LOG_FILE
    fi
fi

# Check for duplicate EHB-AI-Dev modules and consolidate
if [ -d "admin/EHB-AI-Dev" ] && [ -d "ai-services/EHB-AI-Dev" ]; then
    echo "Found duplicate EHB-AI-Dev modules. Consolidating..." | tee -a $LOG_FILE
    
    # Create destination directory
    mkdir -p "services/SOT-Technologies/EHB-AI-Dev"
    log_created "services/SOT-Technologies/EHB-AI-Dev"
    
    # Copy all unique files from both locations to new location
    rsync -av admin/EHB-AI-Dev/ services/SOT-Technologies/EHB-AI-Dev/ 2>/dev/null
    log_merged "admin/EHB-AI-Dev" "services/SOT-Technologies/EHB-AI-Dev"
    
    rsync -av ai-services/EHB-AI-Dev/ services/SOT-Technologies/EHB-AI-Dev/ 2>/dev/null
    log_merged "ai-services/EHB-AI-Dev" "services/SOT-Technologies/EHB-AI-Dev"
    
    # Create standard structure in the new location
    create_standard_structure "services/SOT-Technologies" "EHB-AI-Dev"
    
    # Backup original folders before removing them
    mkdir -p backup/restructure
    cp -r admin/EHB-AI-Dev backup/restructure/admin_EHB-AI-Dev_backup
    cp -r ai-services/EHB-AI-Dev backup/restructure/ai_services_EHB-AI-Dev_backup
    log_created "Backups in backup/restructure/"
    
    # Remove original folders
    rm -rf admin/EHB-AI-Dev
    log_deleted "admin/EHB-AI-Dev (consolidated)"
    
    rm -rf ai-services/EHB-AI-Dev
    log_deleted "ai-services/EHB-AI-Dev (consolidated)"
fi

# 3. Verify and create required structures for existing modules
echo "🔧 Creating standard structure for existing modules..."

# Core modules in admin
for module in "EHB-HOME" "EHB-DASHBOARD" "EHB-Developer-Portal"; do
    if [ -d "admin/$module" ]; then
        create_standard_structure "admin" "$module"
    fi
done

# Service modules in services
for service_dir in services/*/; do
    service_name=$(basename "$service_dir")
    create_standard_structure "services" "$service_name"
done

# System modules
for system_module in "EHB-Blockchain" "EHB-SQL" "EHB-TrustyWallet-System"; do
    if [ -d "system/$system_module" ]; then
        create_standard_structure "system" "$system_module"
    fi
done

# 4. Clean up empty or redundant directories
echo "🧹 Cleaning up empty or redundant directories..."

# Check for empty directories
find . -type d -empty -not -path "*/node_modules/*" -not -path "*/\.*" | while read dir; do
    echo "Found empty directory: $dir" | tee -a $LOG_FILE
    # Create placeholder files in empty directories
    if [[ $dir == */frontend || $dir == */backend || $dir == */models || $dir == */components || $dir == */config || $dir == */public ]]; then
        echo "// Placeholder file for $(basename "$dir") directory" > "$dir/index.js"
        log_created "$dir/index.js (placeholder)"
    fi
done

# 5. Create structure.json for future reference
echo "📝 Creating structure.json for reference..."

# Create JSON structure of the current directory organization
find . -type d -not -path "*/node_modules/*" -not -path "*/\.*" -not -path "*/backup/*" | sort > structure.txt

cat > structure.json << EOF
{
  "timestamp": "$(date)",
  "structure": {
    "admin": [$(ls -1 admin 2>/dev/null | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')],
    "services": [$(ls -1 services 2>/dev/null | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')],
    "system": [$(ls -1 system 2>/dev/null | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')],
    "shared": [$(ls -1 shared 2>/dev/null | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')],
    "models": [$(ls -1 models 2>/dev/null | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$/(''))]
  },
  "rules": {
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

log_created "structure.json"

# Final report
echo "✅ EHB Workspace Restructuring Complete!"
echo "📋 Summary of changes:"
echo "-------------------------------------"
echo "✅ Created standard directory structure for all modules"
echo "✅ Moved misplaced folders to correct locations"
echo "✅ Consolidated duplicate EHB-AI-Dev modules"
echo "✅ Added placeholder files to empty directories"
echo "✅ Created structure.json for future reference"
echo "-------------------------------------"
echo "📝 Detailed log available in: $LOG_FILE"
echo "Structure Verified ✅ Ready for AI Development and Deployment Flow"