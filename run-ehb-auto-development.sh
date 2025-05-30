#!/bin/bash

# EHB Auto Development Runner
# This script runs the entire EHB auto development process

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=============================================================${NC}"
echo -e "${BLUE}🚀 EHB AUTO DEVELOPMENT RUNNER${NC}"
echo -e "${BLUE}=============================================================${NC}"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed or not in PATH${NC}"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Check if the required scripts exist
if [ ! -f "ehb_auto_development.py" ]; then
    echo -e "${RED}❌ Required script not found: ehb_auto_development.py${NC}"
    exit 1
fi

if [ ! -f "ehb_ai_integrator.py" ]; then
    echo -e "${RED}❌ Required script not found: ehb_ai_integrator.py${NC}"
    exit 1
fi

if [ ! -f "ehb_chatgpt_scraper.py" ]; then
    echo -e "${RED}❌ Required script not found: ehb_chatgpt_scraper.py${NC}"
    exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p ehb_company_info

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}⚠️ OPENAI_API_KEY environment variable not set${NC}"
    echo -e "Do you want to provide an OpenAI API key? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY])$ ]]; then
        echo "Please enter your OpenAI API key:"
        read -r api_key
        export OPENAI_API_KEY="$api_key"
        echo -e "${GREEN}✅ API key set for this session${NC}"
    else
        echo -e "${YELLOW}⚠️ Continuing without OpenAI API integration${NC}"
    fi
fi

echo ""
echo -e "${CYAN}📋 Starting auto development process...${NC}"
echo ""

# Run the main auto development script
python3 ehb_auto_development.py

# Check if the script was successful
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Auto development process failed${NC}"
    echo "Check the log file for details: ehb_auto_development.log"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${CYAN}💡 You can now start working with the generated files in the ehb_company_info directory${NC}"
echo -e "${CYAN}💡 Check the development plan in ehb_company_info/development_plan.md${NC}"
echo ""

# Restart the workflows
echo -e "${CYAN}🔄 Restarting workflows to apply changes...${NC}"
echo ""

# This is just a simulation - in a real setup, you would use the Replit
# API or GUI to restart the workflows
echo -e "${YELLOW}⚠️ Workflow restart is simulated in this script${NC}"
echo -e "${YELLOW}⚠️ Please restart your workflows manually if needed${NC}"

echo ""
echo -e "${GREEN}🎉 All done! Your EHB system is ready for development.${NC}"
echo ""