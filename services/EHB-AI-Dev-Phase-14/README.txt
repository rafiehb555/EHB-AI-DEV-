📁 EHB-AI-Dev-Phase-14.zip

🔁 Phase 14: Auto Income Cycle + ROI Tracker + Weekly Earnings

📂 Files Included:
- frontend/pages/roi-tracker.js → User ROI + Weekly Report View
- backend/routes/roiRoutes.js → ROI summary route
- models/Investment.js → Track user investment amounts
- models/WeeklyEarning.js → Log per week income

📊 Weekly income calculated, stored, and displayed on frontend

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Run:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: Next.js, Tailwind, MongoDB, Express, JWT, Axios
