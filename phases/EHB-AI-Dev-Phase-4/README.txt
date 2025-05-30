📁 EHB-AI-Dev-Phase-4.zip

🧩 Phase 4 mein token recharge system aur SQL badge system included hai.

📂 Folder Structure:
- frontend/: User prompt with badge view
- admin/: Token recharge admin page
- backend/: AI + Auth + Admin logic
- models/: Extended User model (tokens, badge, totalPrompts)
- config/: DB connection file

🛡️ Auth: JWT secure API access
🧠 GPT-4 AI: Prompt-response with token check
🎖️ SQL Badge: Badge auto-update based on prompt usage

⚙️ Setup:
1. .env file mein yeh likhein:
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
2. Replit/VSC par unzip karo.
3. Backend: `cd backend && npm install && node index.js`
4. Frontend: `cd frontend && npm install && npm run dev`

✅ Tools: React, Next.js, Tailwind, Express, JWT, MongoDB, GPT, Axios
