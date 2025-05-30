#!/bin/bash

# Make the script executable
chmod +x auto_file_processor.js

# Start the file processor in the background
node auto_file_processor.js &

# Log start
echo "EHB Automatic File Processor started"
echo "Now monitoring attached_assets, uploads, and temp folders"