📁 EHB-AI-Dev-Phase-16.zip

🧠 Phase 16: AI Prompt Bank + Smart Templates + Usage Tracking

📂 Is phase mein shamil hain:
- frontend/pages/prompt-bank.js → Prompt form + saved prompt listing
- backend/routes/promptRoutes.js → Prompt CRUD + usage counter
- models/Prompt.js → Prompt schema with usage tracking

🧩 Logic:
- Har user apni prompts save kar sakta hai
- Prompts ko AI agents ya tools mein reuse kiya ja sakta hai
- Use count auto increment hota hai (future analytics ke liye)

⚙️ Setup Instructions:
.env file mein:
MONGO_URI=
JWT_SECRET=

Terminal Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: React, Next.js, Tailwind, Express, MongoDB, JWT, Axios
