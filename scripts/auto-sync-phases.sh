#!/bin/bash

# Auto-Sync-Phases
# This script automates the process of syncing phase modules into the EHB dashboard
# It combines the process-phase-zips and dashboard-auto-sync tools

# Display banner
echo "=============================================="
echo "==== EHB-AI-DEV PHASE SYNC AUTOMATION ======="
echo "=============================================="
echo

# Step 1: Process any uploaded ZIP files
echo "Step 1: Processing phase ZIP files..."
node scripts/process-phase-zips.js

# Step 2: Sync dashboard (regardless of ZIP processing)
echo
echo "Step 2: Syncing dashboard with all phases..."
node scripts/dashboard-auto-sync.js

# Step 3: Restart necessary workflows
echo
echo "Step 3: Restarting necessary workflows..."
for workflow in "Frontend Server" "EHB-HOME" "EHB-Admin-Dashboard" "EHB-Central-Redirector"; do
  echo "Restarting workflow: $workflow"
  node -e "require('./restart_workflow.js')('$workflow');"
done

echo
echo "=============================================="
echo "==== PHASE SYNC PROCESS COMPLETE ============"
echo "=============================================="
echo "You can now access the dashboard to see all phases"
echo "Dashboard URL: https://[your-replit-name].[your-username].repl.co"
echo "=============================================="