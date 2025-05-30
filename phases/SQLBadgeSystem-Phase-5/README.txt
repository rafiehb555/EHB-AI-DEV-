📁 SQLBadgeSystem-Phase-5.zip

🎯 Phase 5: SQL Level Badge System (Score-based Verification)

📂 Is module mein yeh shamil hai:

1️⃣ frontend/pages/sql-badge.js → Score input + badge display
2️⃣ backend/routes/sqlRoutes.js → POST `/api/sql/submit-score`
3️⃣ admin/panels/sql-badge-history.txt → Admin badge tracking
4️⃣ models/SQLBadge.js → MongoDB schema for badge & score
5️⃣ config/db.js → MongoDB connection config
6️⃣ backend/controllers/sqlController.js → Logic for assigning badge
7️⃣ README.txt → Roman Urdu instructions + setup guide

📌 Score Logic:
- 90+ → VIP
- 75+ → High
- 50+ → Normal
- 25+ → Basic
- <25 → Free

⚙ Setup:
.env → MONGO_URI, JWT_SECRET  
Terminal:
- `npm install`
- `node index.js` (backend)
- `npm run dev` (frontend)

🔐 JWT token required for submitting score
