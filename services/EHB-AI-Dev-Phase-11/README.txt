📁 EHB-AI-Dev-Phase-11.zip

💰 Phase 11: Wallet System + Coin Transfer + Reward History

📂 Structure:
- frontend/pages/wallet.js → Wallet UI with transfer + history
- backend/routes/walletRoutes.js → GET/POST routes for wallet
- models/Reward.js → Reward transaction history

🔐 JWT token required for all routes

⚙️ Setup Instructions:
.env file:
MONGO_URI=
JWT_SECRET=

Run Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: Next.js, Tailwind, Express, MongoDB, JWT, Axios
