📁 EHB-AI-Dev-Phase-22.zip

📘 Phase 22: Learning System + Test-Based Skill Badges

📂 Files Included:
- frontend/pages/learning.js → Lesson list, question, badge result
- backend/routes/lessonRoutes.js → Get lessons & submit answer
- models/Lesson.js → Lesson schema with question + badge
- models/UserBadge.js → Stores earned badges per user

🧠 Logic:
- User lesson read karta hai → answer submit karta hai
- Sahi jawab par badge milta hai, database mein save hota hai

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Terminal:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: React, TailwindCSS, MongoDB, Express, JWT, Axios
