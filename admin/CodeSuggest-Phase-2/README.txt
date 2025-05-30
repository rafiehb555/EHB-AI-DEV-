📁 CodeSuggest-Phase-2.zip

🎯 Phase 2: AI Code Suggestion System (Typing Assistant)

📂 Modules:

1️⃣ frontend/pages/code-suggest.js → Input textarea + output panel
2️⃣ backend/routes/codeRoutes.js → `/api/code/suggest` POST API
3️⃣ admin/panels/code-suggestions.txt → AI activity history zone
4️⃣ models/CodePrompt.js → MongoDB model for storing suggestions
5️⃣ config/db.js → Database connection
6️⃣ backend/controllers/codeController.js → Logic for suggestion response
7️⃣ README.txt → Complete Roman Urdu instructions

🧪 Sample:
User types: `show console.log syntax` → AI replies with code line

🔐 JWT Auth:
Use token in header to access suggestion route

⚙ Setup:
- `npm install`
- `.env` with MONGO_URI, JWT_SECRET
- `node index.js` to start backend
- `npm run dev` for frontend

📦 Response saved in `CodePrompt` schema.
