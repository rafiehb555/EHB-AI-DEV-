📁 EHB-AI-Dev-Phase-21.zip

🌱 Phase 21: Advanced Affiliate Tree + Level ROI Split

📂 Files Included:
- frontend/pages/affiliate-tree.js → Affiliate referral tree & ROI summary
- backend/routes/affiliateRoutes.js → Tree API
- models/User.js → Includes 'referrer' and 'roi' fields

🧠 Logic:
- 5 level tree banaya gaya hai
- Har level ka ROI collect hota hai
- Level-wise ROI %: Level 1 (100%), Level 2 (90%), ..., Level 5 (60%)

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Run:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: React, Tailwind, MongoDB, Express, JWT, Axios
