📁 EHB-AI-Dev-Phase-20.zip

🌐 Phase 20: Multilingual Translation + Auto Language Detection

📂 Files Included:
- frontend/pages/multilingual.js → Text input + translation result UI
- backend/routes/translateRoutes.js → API route for detect + translate
- translateController.js → Calls LibreTranslate to detect & translate

🧠 Logic:
- Input language auto detect hota hai
- Text English mein translate hota hai
- Future mein target language dynamic ban sakti hai

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Run:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: Next.js, Tailwind, Express, JWT, Axios, LibreTranslate API
