📁 EHB-AI-Dev-Phase-8.zip

🧑‍💼 Phase 8: Profile Avatar Upload + SQL Badge Display

📂 Structure:
- frontend/pages/profile.js → User avatar upload + badge display
- backend/routes/profileRoutes.js → Avatar POST route (multer)
- models/User.js → Avatar + badge fields

📸 Multer se image upload hoti hai aur `/public/avatars` me save hoti hai
🎖️ SQL badge profile par dikhai jaati hai

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

📦 Terminals:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: React, Next.js, Tailwind, Express, MongoDB, Multer, JWT, Axios
