📁 EHB-AI-Dev-Phase-5.zip

🧩 Phase 5 mein referral system + coin lock logic shamil hai.

📂 Folder Structure:
- frontend/: User prompt + referral stats
- admin/: Admin referral add page
- backend/: Routes for auth, ai, admin
- models/: User schema with lockedCoins & referrals
- config/: DB connection

🔐 JWT + MongoDB used for security and user logic.

🧠 GPT-4 AI: Prompt run only if tokens > 0 & lockedCoins > 0

⚙️ Setup:
1. .env file set karo:
   MONGO_URI=
   JWT_SECRET=
   OPENAI_API_KEY=
2. Backend: `cd backend && npm install && node index.js`
3. Frontend: `cd frontend && npm install && npm run dev`

✅ Tools: Next.js, Tailwind, Express, MongoDB, JWT, GPT-4, Axios
