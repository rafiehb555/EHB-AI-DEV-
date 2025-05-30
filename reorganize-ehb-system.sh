#!/bin/bash

# EHB System Reorganization Script
# This script executes the EHB system reorganization by running the main JavaScript script

echo "========================================================"
echo "EHB SYSTEM REORGANIZATION"
echo "========================================================"
echo "This script will reorganize the EHB project structure according to"
echo "the standardized categorization plan."
echo ""
echo "The process includes:"
echo "1. Creating categorized folder structure"
echo "2. Setting up API connections between services"
echo "3. Synchronizing services with main UIs"
echo ""
echo "Warning: Make sure all your work is saved before proceeding."
echo "========================================================"
echo ""

read -p "Do you want to proceed with the reorganization? (y/n): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Reorganization cancelled."
  exit 0
fi

echo ""
echo "Starting reorganization process..."
echo ""

# Execute the main reorganization script
node scripts/ehb-organize-structure.js

# Check if the reorganization was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "========================================================"
  echo "EHB SYSTEM REORGANIZATION COMPLETED SUCCESSFULLY"
  echo "========================================================"
  echo ""
  echo "The reorganization process has been completed successfully."
  echo "Please check the following files for detailed information:"
  echo "- ehb-reorganization-report.json (detailed technical report)"
  echo "- ehb-reorganization-summary.txt (human-readable summary)"
  echo ""
  echo "You can now start using the reorganized EHB system structure."
  echo "========================================================"
else
  echo ""
  echo "========================================================"
  echo "EHB SYSTEM REORGANIZATION FAILED"
  echo "========================================================"
  echo ""
  echo "There was an error during the reorganization process."
  echo "Please check the console output for error details."
  echo ""
  echo "If you need assistance, please consult the documentation"
  echo "or contact the EHB development team."
  echo "========================================================"
fi