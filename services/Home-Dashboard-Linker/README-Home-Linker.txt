
🔗 HOME & DASHBOARD SMART LINKER
================================

🎯 Purpose:
Automatically detect new services and:
- Add cards to EHB-HOME for users
- Add admin controls to EHB-DASHBOARD
- Set routes and buttons based on config

📁 Structure Required:
- /services/<module>/module.json
  {
    "name": "JPS",
    "sql": "Basic",
    "homepage": true,
    "adminview": true
  }

🧠 Behavior:
- Read module.json after ZIP registration
- Update homepage UI with card
- Add admin toggle/button in dashboard
- Link routes via /ai-services/EHB-AI-Dev/services/

📌 Note:
- Each card linked to correct route
- Icon, description, SQL level shown automatically
