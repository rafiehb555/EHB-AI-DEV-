#!/bin/bash

# Create main category directories
echo "📌 STEP 1: Creating main category directories..."
mkdir -p franchise-system
mkdir -p dev-services
mkdir -p ai-services
mkdir -p admin
mkdir -p system
mkdir -p services

# Create a mapping file to record folder structure
echo "Creating mapping file..."
cat > restructure_mapping.txt << 'EOL'
# EHB System - Folder Structure Mapping

## Main Categories

1. franchise-system/
   - EHB-Franchise

2. dev-services/
   - SOT-Technologies

3. ai-services/
   - EHB-AI-Dev
   - EHB-AI-Dev-Fullstack

4. admin/
   - EHB-Developer-Portal
   - EHB-HOME
   - EHB-DASHBOARD

5. system/
   - EHB-Blockchain
   - EHB-TrustyWallet-System
   - EHB-SQL
   - EHB-Services-Departments-Flow

6. services/
   - GoSellr-Ecommerce
   - WMS-World-Medical-Service
   - HPS-Education-Service
   - OLS-Online-Law-Service
   - JPS-Job-Providing-Service
   - EHB-Tube
   - EHB-AI-Marketplace
   - HMS-Machinery
   - AG-Travelling
   - Delivery-Service
   - EHB-AM-AFFILIATE-SYSTEM
EOL

# Move folders to their respective categories
echo "📌 STEP 2: Moving folders to their categories..."

# Move Franchise System folders
if [ -d "EHB-Franchise" ]; then
    echo "Moving EHB-Franchise to franchise-system/"
    mv EHB-Franchise franchise-system/
fi

# Move Dev Services folders
if [ -d "SOT-Technologies" ]; then
    echo "Moving SOT-Technologies to dev-services/"
    mv SOT-Technologies dev-services/
fi

# Move AI Services folders
if [ -d "EHB-AI-Dev" ]; then
    echo "Moving EHB-AI-Dev to ai-services/"
    mv EHB-AI-Dev ai-services/
fi

# Move Admin folders
if [ -d "EHB-Developer-Portal" ]; then
    echo "Moving EHB-Developer-Portal to admin/"
    mv EHB-Developer-Portal admin/
fi

if [ -d "EHB-HOME" ]; then
    echo "Moving EHB-HOME to admin/"
    mv EHB-HOME admin/
fi

if [ -d "EHB-DASHBOARD" ]; then
    echo "Moving EHB-DASHBOARD to admin/"
    mv EHB-DASHBOARD admin/
fi

# Move System folders
if [ -d "EHB-Blockchain" ]; then
    echo "Moving EHB-Blockchain to system/"
    mv EHB-Blockchain system/
fi

if [ -d "EHB-TrustyWallet-System" ]; then
    echo "Moving EHB-TrustyWallet-System to system/"
    mv EHB-TrustyWallet-System system/
fi

if [ -d "EHB-SQL" ]; then
    echo "Moving EHB-SQL to system/"
    mv EHB-SQL system/
fi

if [ -d "EHB-Services-Departments-Flow" ]; then
    echo "Moving EHB-Services-Departments-Flow to system/"
    mv EHB-Services-Departments-Flow system/
fi

# Move Services folders
if [ -d "GoSellr-Ecommerce" ]; then
    echo "Moving GoSellr-Ecommerce to services/"
    mv GoSellr-Ecommerce services/
fi

if [ -d "WMS-World-Medical-Service" ]; then
    echo "Moving WMS-World-Medical-Service to services/"
    mv WMS-World-Medical-Service services/
fi

if [ -d "HPS-Education-Service" ]; then
    echo "Moving HPS-Education-Service to services/"
    mv HPS-Education-Service services/
fi

if [ -d "OLS-Online-Law-Service" ]; then
    echo "Moving OLS-Online-Law-Service to services/"
    mv OLS-Online-Law-Service services/
fi

if [ -d "JPS-Job-Providing-Service" ]; then
    echo "Moving JPS-Job-Providing-Service to services/"
    mv JPS-Job-Providing-Service services/
fi

if [ -d "EHB-Tube" ]; then
    echo "Moving EHB-Tube to services/"
    mv EHB-Tube services/
fi

if [ -d "EHB-AI-Marketplace" ]; then
    echo "Moving EHB-AI-Marketplace to services/"
    mv EHB-AI-Marketplace services/
fi

if [ -d "HMS-Machinery" ]; then
    echo "Moving HMS-Machinery to services/"
    mv HMS-Machinery services/
fi

if [ -d "AG-Travelling" ]; then
    echo "Moving AG-Travelling to services/"
    mv AG-Travelling services/
fi

if [ -d "Delivery-Service" ]; then
    echo "Moving Delivery-Service to services/"
    mv Delivery-Service services/
fi

if [ -d "EHB-AM-AFFILIATE-SYSTEM" ]; then
    echo "Moving EHB-AM-AFFILIATE-SYSTEM to services/"
    mv EHB-AM-AFFILIATE-SYSTEM services/
fi

# Create the AI Agent structure according to the provided template
echo "📌 STEP 3: Setting up AI Agent structure..."

# Create agent directory structure if it doesn't exist
if [ ! -d "ai-services/EHB-AI-Dev/agent" ]; then
    echo "Creating agent directory structure..."
    mkdir -p ai-services/EHB-AI-Dev/agent
    mkdir -p ai-services/EHB-AI-Dev/blockchain
    mkdir -p ai-services/EHB-AI-Dev/websocket
    mkdir -p ai-services/EHB-AI-Dev/ui
    mkdir -p ai-services/EHB-AI-Dev/public/voice-models
    mkdir -p ai-services/EHB-AI-Dev/routes/api
    
    # Create basic files with template content
    echo "// AI Agent Brain - Langchain + OpenAI logic" > ai-services/EHB-AI-Dev/agent/brain.js
    echo "// Scheduler for automatic tasks" > ai-services/EHB-AI-Dev/agent/scheduler.js
    echo "// Vector Memory for long-term storage" > ai-services/EHB-AI-Dev/agent/vectorMemory.js
    echo "// File processor for handling various file types" > ai-services/EHB-AI-Dev/agent/fileProcessor.js
    echo "// Speech control for voice input/output" > ai-services/EHB-AI-Dev/agent/speechControl.js
    echo "// Configuration file for API keys and constants" > ai-services/EHB-AI-Dev/agent/config.js
    
    echo "// Main blockchain handler" > ai-services/EHB-AI-Dev/blockchain/index.js
    echo "// Polkadot integration" > ai-services/EHB-AI-Dev/blockchain/polkadot.js
    echo "// Solana integration" > ai-services/EHB-AI-Dev/blockchain/solana.js
    echo "// IPFS uploader" > ai-services/EHB-AI-Dev/blockchain/ipfsUploader.js
    echo "// Wallet handler" > ai-services/EHB-AI-Dev/blockchain/wallet.js
    mkdir -p ai-services/EHB-AI-Dev/blockchain/contracts
    
    echo "// WebSocket client" > ai-services/EHB-AI-Dev/websocket/client.js
    echo "// WebSocket server" > ai-services/EHB-AI-Dev/websocket/server.js
    
    echo "// Agent Console UI component" > ai-services/EHB-AI-Dev/ui/AgentConsole.jsx
    echo "// Agent Control Panel UI component" > ai-services/EHB-AI-Dev/ui/AgentControlPanel.jsx
    echo "// Agent Popup Logs UI component" > ai-services/EHB-AI-Dev/ui/AgentPopupLogs.jsx
    
    echo "// API endpoint for EHB agent" > ai-services/EHB-AI-Dev/routes/api/ehb-agent.js
fi

echo "📌 STEP 4: Updating configuration..."

# Create NPM package recommendations file
cat > ai-services/EHB-AI-Dev/package-recommendations.txt << 'EOL'
# Recommended NPM packages for EHB-AI-Dev

## AI Agent packages
openai langchain pinecone-client chromadb 

## Document processing
pdf-lib pdf-parse tesseract.js

## Automation
node-cron

## Real-time communication
socket.io uuid

## Blockchain integration
ethers web3 @polkadot/api ipfs-http-client moralis @solana/web3.js @walletconnect/client @metamask/detect-provider

## Web tools
puppeteer react-speech-recognition

## Installation command:
npm install openai langchain pinecone-client chromadb pdf-lib pdf-parse tesseract.js node-cron socket.io uuid ethers web3 @polkadot/api ipfs-http-client moralis @solana/web3.js @walletconnect/client @metamask/detect-provider puppeteer react-speech-recognition
EOL

# Create agent instructions file
cat > ai-services/EHB-AI-Dev/agent-instructions.md << 'EOL'
# EHB Agent Instructions

## Core Guidelines
1. All AI services related to EHB-AI-Dev must be routed through `agent/` folder logic.
2. All blockchain interactions must go through `blockchain/` folder only.
3. All future tools should be installed using the listed `npm install` command.
4. websocket/client.js must be connected to EHB-DASHBOARD and EHB-HOME for real-time status.
5. EHB Agent should have read/write/delete/create permissions for all folders under EHB project.
6. No duplicate folders should be allowed. Use existing folders, delete duplicates.
7. Always link all services/modules to EHB-HOME and EHB-DASHBOARD frontend.
8. Save this flow permanently and always sync new modules with this structure.

## After Integration
- Setup auto indexer
- Setup agent init logs
- Setup websocket listener
EOL

echo "📌 STEP 5: Setting up API connections..."

# Create a basic integration script
cat > admin/integration-script.js << 'EOL'
/**
 * EHB Integration Script
 * 
 * This script handles the connections between different modules:
 * - services ↔ admin (Dashboard fetches service states)
 * - system/EHB-SQL ↔ all folders (for SQL-based level verification)
 * - ai-services/EHB-AI-Dev ↔ all folders (AI agent/robot full read/write access)
 */

// Connect admin dashboards to all services
const connectAdminToDashboard = () => {
  // Implementation will go here
};

// Connect SQL database to all services
const connectSqlToAllServices = () => {
  // Implementation will go here
};

// Connect AI agent to all services
const connectAiAgentToAllServices = () => {
  // Implementation will go here
};

// Sync all active services with home, dashboard, and marketplace
const syncWithUIs = () => {
  // Implementation will go here
};

module.exports = {
  connectAdminToDashboard,
  connectSqlToAllServices,
  connectAiAgentToAllServices,
  syncWithUIs
};
EOL

echo "📌 STEP 6: Final cleanup..."

# Check for empty directories and print a warning
for dir in franchise-system dev-services ai-services admin system services; do
    if [ -z "$(ls -A $dir)" ]; then
        echo "WARNING: $dir is empty"
    fi
done

echo "✅ COMPLETE: EHB folder structure has been organized according to the prescribed plan."
echo "Check the restructure_mapping.txt file for the complete folder structure overview."