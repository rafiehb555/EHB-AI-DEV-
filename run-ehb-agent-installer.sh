#!/bin/bash

# Run EHB Agent Installer
# This script runs the EHB Agent Installer to process uploaded ZIP files

echo "======================================"
echo "===== Running EHB Agent Installer ===="
echo "======================================"

# Create required directories
mkdir -p ./uploads ./temp

# Run the installer
node ehbAgentInstaller.js

echo "======================================"
echo "===== Installation Complete =========="
echo "======================================"
echo "Visit the Developer Portal to see the setup page"