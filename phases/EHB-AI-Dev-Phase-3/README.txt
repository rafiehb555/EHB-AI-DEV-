📁 EHB-AI-Dev-Phase-3.zip

🧩 Phase 3 mein JWT-authenticated GPT-4 integration aur token lock logic shamil hai.

📂 Folder Structure:
- frontend/: User prompt input + response output (protected)
- backend/: Express routes for AI + auth with GPT logic
- models/: User model with tokens count
- config/: MongoDB connect file
- admin/: Reserved for future admin logic
- public/: Static content folder

🔐 JWT: Token login system active hai.
🔄 Tokens: Har GPT query 1 token consume karti hai.
🧠 GPT-4: Real-time response OpenAI API se aata hai.

⚙️ Setup Guide:
1. .env file mein set karo:
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
2. Replit pe unzip karo.
3. Terminal 1: `cd backend && npm install && node index.js`
4. Terminal 2: `cd frontend && npm install && npm run dev`

✅ Tools: Next.js, Tailwind, Express, MongoDB, JWT, GPT-4, Axios
