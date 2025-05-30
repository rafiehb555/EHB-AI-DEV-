📁 EHB-AI-Dev-Phase-13.zip

💸 Phase 13: Auto Pool Income + Referral Bonus + Leader Income Report

📂 Files Included:
- frontend/pages/pool-income.js → Pool + Referral bonus UI
- admin/pages/leader-income.js → Admin leader report
- backend/routes/poolRoutes.js → Auto pool & referral income
- backend/routes/leaderRoutes.js → Leader bonus summary
- models/User.js → Referrals required for calculation

🧠 Logic:
- Har referral = 2 Coins bonus
- Har 5 referrals = 5 Coins Auto Pool bonus

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: React, Tailwind, Express, MongoDB, JWT, Axios
