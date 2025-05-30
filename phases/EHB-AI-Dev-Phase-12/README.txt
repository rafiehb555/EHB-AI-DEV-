📁 EHB-AI-Dev-Phase-12.zip

📊 Phase 12: Income Dashboard + Monthly Report + Admin Coin Control

📂 Files:
- frontend/pages/income.js → Income stats UI (earned/sent)
- admin/pages/coin-control.js → Admin coin update form
- models/Reward.js → Existing model used for transactions

🔐 JWT protection for `/income/summary`
📅 Mongo aggregation used for monthly breakdown

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: React, Express, MongoDB, JWT, TailwindCSS, Axios
