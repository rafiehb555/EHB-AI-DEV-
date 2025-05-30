📁 ModuleBuilder-Phase-1.zip

📘 Module: AI Prompt-Based Module Generator

🧩 7 Data Components:
1️⃣ frontend/pages/module-builder.js → User input prompt form
2️⃣ backend/routes/moduleRoutes.js → API endpoint to call backend
3️⃣ admin/panels/module-history.txt → Admin area to view history
4️⃣ models/Prompt.js → MongoDB schema to log prompts
5️⃣ config/db.js → MongoDB connection logic
6️⃣ backend/controllers/moduleController.js → Auto module folder creator
7️⃣ README.txt → Yeh file step-by-step setup aur file description deta hai

🔐 JWT Auth:
- Har route token se protected hai

⚙️ Setup (Replit ya VS Code):
1. `npm install`
2. Create `.env` file with MONGO_URI and JWT_SECRET
3. Run `node index.js` from backend
4. Visit `/module-builder` on frontend

📦 Module created ZIP mein nahi aata, balkay `public/uploads/` mein store hota hai.
