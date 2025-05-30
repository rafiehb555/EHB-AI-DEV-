📁 AutoCardGen-Phase-7.zip

📌 Phase 7: Auto Dashboard Card Generator for EHB-HOME & EHB-DASHBOARD

📂 7 Component Breakdown:

1️⃣ frontend/pages/dashboard-cards.js → Shows dynamic 3-column card layout
2️⃣ backend/routes/cardRoutes.js → Create + list cards
3️⃣ admin/panels/card-log.txt → Admin record of created cards
4️⃣ models/Card.js → MongoDB schema for service/dept card info
5️⃣ config/db.js → DB connection setup
6️⃣ backend/controllers/cardController.js → Card create/list logic
7️⃣ README.txt → Roman Urdu setup explanation

🛠 Use Cases:
- On new service/module → Card auto-create
- Linked to dashboard or EHB-HOME UI

⚙ Setup:
.env:
MONGO_URI=
JWT_SECRET=

Commands:
npm install  
node index.js  
npm run dev
