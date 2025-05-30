📁 ReferralTree-Phase-6.zip

🌲 Phase 6: Referral Tree System (Basic Upline/Downline)

📂 Is module mein shamil hai:

1️⃣ frontend/pages/referral-tree.js → User referral code input & registration
2️⃣ backend/routes/referralRoutes.js → Register + fetch referral data
3️⃣ admin/panels/referral-logs.txt → Admin record of all referral chains
4️⃣ models/Referral.js → MongoDB schema for referral tracking
5️⃣ config/db.js → MongoDB database connection
6️⃣ backend/controllers/referralController.js → Register + fetch referrals logic
7️⃣ README.txt → Roman Urdu setup instructions

🧪 Example:
- A invites B (refCode = A ID)
- B becomes downline of A

🔐 JWT Auth required

⚙ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Terminal Commands:
- `npm install`
- `npm run dev` (frontend)
- `node index.js` (backend)
