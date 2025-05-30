📁 EHB-AI-Dev-Phase-17.zip

🧩 Phase 17: AI Tool Builder - Prompt to Output Template Generator

📂 Shamil files:
- frontend/pages/ai-tools.js → Tools create + run interface
- backend/routes/toolRoutes.js → API to create, fetch, and run tools
- models/Tool.js → MongoDB schema for tool templates

🧠 Logic:
- Prompt template mein '{{input}}' dynamic field use hota hai
- GPT-4 use hota hai prompt execute karne ke liye
- Tool run karte waqt response user ko milta hai

⚙️ Setup:
.env file mein:
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=

Terminal:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: Next.js, Tailwind, MongoDB, OpenAI, Express, JWT, Axios
