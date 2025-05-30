📁 EHB-AI-Dev-Phase-10.zip

🏆 Phase 10: Admin User Management + Global Leaderboard

📂 Structure:
- frontend/pages/leaderboard.js → Top 10 token holders
- admin/pages/users.js → Admin panel for user management
- backend/routes/adminRoutes.js → Admin user list + leaderboard
- models/User.js → isAdmin boolean field added

🔐 JWT secure backend (token auth)
📊 Sorted leaderboard by tokens

⚙️ Setup Instructions:
.env file mein likho:
MONGO_URI=
JWT_SECRET=

Terminals:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools Used: React, Next.js, Tailwind, Express, MongoDB, JWT, Axios
