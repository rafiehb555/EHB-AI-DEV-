
📘 DEVELOPER PORTAL UI GUIDE
============================

📋 Purpose:
Give visual control panel to developers with:
- API list
- File structure health
- Error logs and fix suggestions
- Service progress status
- Rulebook edit feature

📁 Main Components:
- /pages/dev.js       → Developer portal homepage
- /components/ServiceStatus.js
- /components/LogViewer.js
- /components/APIDetails.js
- /components/RuleEditor.js

✅ Expected Features:
- Click to view missing files
- Click to edit rules
- Cards showing completion status
- Filters: by module, by issue, by type

🔁 Auto-updates from:
- structure-monitor.js
- integration.log
- /system/EHB-System-Development-Rules.txt
