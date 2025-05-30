
📘 EHB SYSTEM INTRODUCTION FOR REPLIT AGENT
===========================================

🧠 What is EHB?
---------------
EHB (Empowered Human Blockchain) is a smart ecosystem that connects global services such as:
- GoSellr (e-commerce)
- JPS (Job Providing Service)
- EMO (Easy Management Office)
- PSS (Personal Security System)
- OBS (Online Book Store)
- AGTS (Advanced Global Travel)
- WMS (World Medical Service)
- AI Assistant, Developer Panel, Franchise System

Every service is AI-integrated, verified through 3 departments: PSS, EDR, EMO.

------------------------------------------------
📂 Folder Structure & Placement Rules:

1. /admin/
   └── EHB-HOME/          → Global home page UI & user dashboard
   └── EHB-DASHBOARD/     → Admin panel with cards for each service
   └── Static Admins/     → Optional extra admin pages

2. /services/
   └── GoSellr-Phase-1/
       ├── frontend/      → React pages, UI logic
       ├── backend/       → Node.js/Express APIs
       ├── admin/         → Module-level admin panel
       ├── models/        → Mongoose DB schemas
       ├── config/        → Keys and module settings

   └── JPS-Phase-1/
       ├── ... (same structure)

   (All future modules follow this)

3. /ai-services/
   └── EHB-AI-Dev/        → Handles integration of new services
   └── structure-monitor/ → Checks folder health, fixes issues

4. /system/
   └── config/            → Global settings, language, currency
   └── rules/             → EHB-System-Development-Rules.txt
   └── snapshots/         → Auto-backups
   └── ui-config/         → Home/Dashboard drag layout settings

5. /logs/
   └── integration.log    → All uploads and routing actions
   └── structure.log      → Errors or recovery events

------------------------------------------------
🔗 Folder Linking Rules (Service to Dashboard):

- Every /services/<module>/ must be auto-linked to:
  - /admin/EHB-HOME (user cards + homepage routes)
  - /admin/EHB-DASHBOARD (admin view + controls)

- AI-Dev must update routing automatically via:
  /ai-services/EHB-AI-Dev/services/ModuleIntegrationService.js

------------------------------------------------
👥 User Flow Logic:

- Users register via JPS
- Their SQL level is managed by PSS, EDR, EMO
- Based on SQL: access to services like GoSellr, OBS, WMS is enabled
- Each service has:
   - Product/Service Listing
   - Complaint flow
   - Admin escalation path
   - Wallet & Payment logic

------------------------------------------------
⚙️ Backend Integration Expectations:

- /backend/routes/
   - auth.js, products.js, orders.js, complaints.js, etc.
- /models/
   - User.js, Product.js, Franchise.js
- /config/
   - db.js, constants.js

------------------------------------------------
🎨 Frontend Integration Expectations:

- /frontend/pages/
   - index.js, dashboard.js, service-specific views
- /frontend/components/
   - Card.js, ServiceList.js, Header/Footer
- /frontend/utils/
   - axios, toast, state manager (if needed)

------------------------------------------------
✅ How to Use This Package:

1. Place this ZIP in root of your Replit project.
2. Extract using shell:
   unzip EHB-System-Intro-Package.zip -d ./system/
3. AI Agent should read this first before any module execution.

------------------------------------------------
🧠 Final Reminder to AI Agent:

This intro file tells you exactly how EHB is structured.
Follow folder rules, place ZIP uploads properly, auto-link dashboards,
generate cards, and always follow rulebook: /system/rules/EHB-System-Development-Rules.txt

