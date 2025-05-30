
🤖 AI AGENT EXECUTION SCRIPT
============================

🎯 Purpose:
Main script that reads ZIP files, validates, registers, logs, and links modules.

📜 agent-handler.js (core logic):
- Detects uploaded ZIPs in /uploads/
- Extracts to /services/<module-name>/
- Validates folder structure (frontend, backend, admin, models, config)
- Reads module.json
- Generates cards
- Registers routes into dashboards
- Logs actions into /logs/integration.log

🧠 Integrated with:
- Home & dashboard linker
- Structure monitor
- Developer portal updates

📁 Place agent-handler.js in /ai-services/EHB-AI-Dev/
