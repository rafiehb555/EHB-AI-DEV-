#!/bin/bash

# Script to run the EHB Free Agent Installer

echo "======================================"
echo "= STARTING EHB FREE AGENT INSTALLER ="
echo "======================================"

# Create necessary directories if they don't exist
mkdir -p logs
mkdir -p generated
mkdir -p uploads
mkdir -p temp_extract

# Install required dependencies if not already installed
if ! npm list | grep -q "adm-zip"; then
  echo "Installing dependencies..."
  npm install adm-zip
fi

# Run the installer
node ehb-free-agent-installer.js

echo "======================================"
echo "= EHB FREE AGENT INSTALLER COMPLETE ="
echo "======================================"

# Make this script executable
chmod +x run-free-agent-installer.sh