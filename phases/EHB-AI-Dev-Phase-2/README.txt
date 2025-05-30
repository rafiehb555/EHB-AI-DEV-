📁 EHB-AI-Dev-Phase-2.zip

🧩 Yeh Phase 2 ZIP file JWT-based login system aur real AI interaction ka example contain karti hai.

📂 Folder Structure:
- frontend/: React UI with login + AI ask feature
- backend/: Express.js routes with auth & AI logic
- models/: MongoDB User schema
- config/: DB connection setup
- admin/: Reserved for admin panel
- public/: Static files placeholder

🧠 AI Agent: Abhi dummy response de raha hai. Real GPT-4 API next phase mein connect hoga.

🔐 JWT Auth: Login karke token milta hai, jise headers mein daal kar AI API call hoti hai.

⚙️ Setup Instructions:
1. .env file mein `MONGO_URI` aur `JWT_SECRET` set karo.
2. Replit ya VS Code mein ZIP upload karo aur unzip karo.
3. Terminal 1: `cd backend && npm install && node index.js`
4. Terminal 2: `cd frontend && npm install && npm run dev`

✅ Tools: Next.js, Tailwind CSS, MongoDB, Mongoose, Express.js, JWT, Axios
