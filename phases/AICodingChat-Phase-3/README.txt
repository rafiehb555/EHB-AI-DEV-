📁 AICodingChat-Phase-3.zip

💬 Phase 3: AI Chat Interface for Coding Help

📂 Module Details:

1️⃣ frontend/pages/ai-chat.js → Chat interface to ask AI coding questions
2️⃣ backend/routes/chatRoutes.js → /api/chat/ask route
3️⃣ admin/panels/chat-history.txt → Admin zone to review conversation logs
4️⃣ models/ChatLog.js → MongoDB model to store question-answer pairs
5️⃣ config/db.js → MongoDB setup
6️⃣ backend/controllers/chatController.js → Simulated AI response logic
7️⃣ README.txt → Roman Urdu setup guide

⚙ Setup:
- `.env` mein MONGO_URI aur JWT_SECRET
- `npm install`
- `node index.js` (backend)
- `npm run dev` (frontend)

🔐 JWT token required to access route

📦 Future: AI reply can be connected to OpenAI API
