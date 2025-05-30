📦 JPS-Affiliate-Phase-1 Setup (Roman Urdu)

📁 File Structure:
- frontend/pages/register.js — Register page
- frontend/components/RegisterForm.js — Form logic (referral link capture)
- backend/routes/auth.js — Express API routes
- backend/controllers/authController.js — Register/Login logic
- backend/models/User.js — MongoDB schema
- backend/models/Referral.js — Referral tree base
- config/db.js — MongoDB connection config

🛠️ Replit Setup:
1. Folder create karein jese yahan diye gaye hain.
2. Har file ka content copy karke Replit mein paste karein.
3. Backend:
   - `cd backend && npm install express mongoose cors jsonwebtoken`
   - `node server.js`
4. Frontend:
   - `cd frontend && npm install axios react`
   - `npm run dev`

🧠 Referral logic auto enabled hai.
