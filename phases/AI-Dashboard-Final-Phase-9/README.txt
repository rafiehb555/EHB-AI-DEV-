📁 AI-Dashboard-Final-Phase-9.zip

📊 Phase 9: AI-Based EHB Final Dashboard

📂 7 Components:

1️⃣ frontend/pages/ehb-dashboard.js → Final EHB dashboard page
2️⃣ backend/routes/moduleRoutes.js → API to list/create modules
3️⃣ admin/panels/ai-dashboard.txt → Admin view & logs
4️⃣ models/Module.js → MongoDB model of modules
5️⃣ config/db.js → DB connector
6️⃣ backend/controllers/moduleController.js → Logic to manage module data
7️⃣ README.txt → Setup guide (Roman Urdu)

🛠 Tools:
Next.js + Tailwind + Express + JWT + MongoDB

📌 Feature:
Shows all 8 modules dynamically + future modules from API

⚙ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Terminal:
npm install  
npm run dev  
node index.js
