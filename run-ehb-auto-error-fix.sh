#!/bin/bash

# EHB Auto Error Fix Runner
# This script manually runs the EHB error prevention system and backup cleaner

# Display header
echo -e "\033[34m======================================\033[0m"
echo -e "\033[34m==== EHB AUTO ERROR FIX & CLEANUP ====\033[0m"
echo -e "\033[34m======================================\033[0m"

# Check if the auto prevention system exists
if [ ! -f ./ehb_auto_error_prevention.js ]; then
  echo -e "\033[31mError: ehb_auto_error_prevention.js not found\033[0m"
  exit 1
fi

# Run the automated error prevention system with immediate execution
echo -e "\033[32mRunning automated error detection and fixing...\033[0m"
node ehb_auto_error_prevention.js 0

echo ""
echo -e "\033[32mDone! Check ehb_auto_fix.log and ehb_cleanup.log for details\033[0m"
echo ""

# Make this script executable
chmod +x run-ehb-auto-error-fix.sh