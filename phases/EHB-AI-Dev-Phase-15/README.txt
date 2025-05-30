📁 EHB-AI-Dev-Phase-15.zip

🔐 Phase 15: Staking System + Coin Lock/Unlock + Passive Income

📂 Important Files:
- frontend/pages/staking.js → User staking panel
- backend/routes/stakeRoutes.js → API for staking logic
- models/Staking.js → MongoDB model for user stake

🧠 Logic:
- Lock coins → Earn monthly 5%
- Unlock anytime → Full coins + reward return

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Run:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tech Used: Next.js, Tailwind, MongoDB, Express, JWT, Axios
