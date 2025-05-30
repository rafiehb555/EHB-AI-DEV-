📁 EHB-AI-Dev-Phase-6.zip

🧪 Phase 6: Test System + Badge Promotion Logic

📂 Folder Breakdown:
- frontend/: test.js page for quiz
- backend/: Express routes and controllers
- models/: User with testScore + sqlBadge
- config/: DB setup file

🧠 Logic:
- Correct answer = testScore: Pass + badge = VIP
- Wrong answer = testScore: Fail
- Result stored in DB

⚙️ Setup:
.env file mein yeh variables likho:
MONGO_URI=
JWT_SECRET=

Terminal 1: `cd backend && npm install && node index.js`  
Terminal 2: `cd frontend && npm install && npm run dev`

✅ Tools: Next.js, TailwindCSS, Express, JWT, MongoDB
