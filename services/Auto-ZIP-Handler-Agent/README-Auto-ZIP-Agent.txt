
📦 AUTO-ZIP HANDLER AGENT GUIDE
===============================

👨‍💻 Purpose:
Automatically detect uploaded ZIP files and:
- Extract data
- Check folder names
- Place in /services/<name>/
- Register service in dashboards
- Delete ZIP after extraction
- Run 'npm install' and start services if needed

📁 Expected Folder Format Inside ZIP:
- frontend/
- backend/
- admin/
- config/
- models/

✅ How Replit Should Use:
1. User uploads ZIP (e.g., JPS-Phase-1.zip)
2. Agent extracts to /services/JPS-Phase-1/
3. Checks required folders, auto-creates missing
4. Updates dashboard cards + routing
5. Logs action in /logs/integration.log

🚫 Notes:
- Do NOT allow overwrite of /admin/, /system/, /ai-services/
- Structure monitor must validate each module
