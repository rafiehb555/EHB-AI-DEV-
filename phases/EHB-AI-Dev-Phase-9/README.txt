📁 EHB-AI-Dev-Phase-9.zip

💬 Phase 9: AI Assistant Chat Memory + Token Stats

📂 Structure:
- frontend/pages/chat.js → Chat UI with context memory
- models/Chat.js → Stores chat messages with role & content
- backend/controllers/chatController.js → GPT response using last 5 messages
- backend/routes/chatRoutes.js → Send + History API

🔐 JWT secure routes
🧠 Token deducted per message sent

⚙️ Setup:
.env file mein:
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=

Terminals:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: React, Tailwind, Express, MongoDB, GPT-4, JWT, Axios
