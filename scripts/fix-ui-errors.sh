#!/bin/bash

# Fix UI Errors Script
# This script automatically fixes common UI errors in the Developer Portal

# Print colored messages
print_green() {
  echo -e "\e[32m$1\e[0m"
}

print_blue() {
  echo -e "\e[34m$1\e[0m"
}

print_red() {
  echo -e "\e[31m$1\e[0m"
}

print_yellow() {
  echo -e "\e[33m$1\e[0m"
}

print_blue "===== EHB Developer Portal UI Error Fixer ====="
print_blue "This script will automatically fix common UI errors in the Developer Portal."
print_blue "Starting the process..."

# Check if the Developer Portal directory exists
if [ ! -d "admin/EHB-Developer-Portal" ]; then
  print_red "Error: Developer Portal directory not found!"
  print_yellow "Creating Developer Portal directory..."
  mkdir -p admin/EHB-Developer-Portal
fi

# Run the check-missing-components script
if [ -f "admin/EHB-Developer-Portal/scripts/check-missing-components.js" ]; then
  print_yellow "Step 1: Checking for missing components..."
  node admin/EHB-Developer-Portal/scripts/check-missing-components.js
else
  print_red "Error: Missing components checker script not found!"
  print_yellow "Creating basic directory structure..."
  mkdir -p admin/EHB-Developer-Portal/components
  mkdir -p admin/EHB-Developer-Portal/pages
  mkdir -p admin/EHB-Developer-Portal/scripts
  mkdir -p admin/EHB-Developer-Portal/public
  mkdir -p admin/EHB-Developer-Portal/styles
fi

# Run the auto-fix-ui-errors script
if [ -f "admin/EHB-Developer-Portal/scripts/auto-fix-ui-errors.js" ]; then
  print_yellow "Step 2: Fixing UI errors..."
  node admin/EHB-Developer-Portal/scripts/auto-fix-ui-errors.js
else
  print_red "Error: Auto fix script not found!"
fi

# Restart the Developer Portal workflow
print_yellow "Step 3: Restarting the Developer Portal workflow..."
echo "Workflow restart command would be executed here"

print_green "===== UI Error Fixing Process Completed ====="
print_green "If errors persist, please check the log files in the Developer Portal directory."
print_green "To run this script again, use: bash scripts/fix-ui-errors.sh"