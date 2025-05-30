📁 EHB-AI-Dev-Phase-7.zip

📘 Phase 7: Test History + Admin Analytics + PDF Certificate Generator

📂 Structure:
- frontend/pages/test-history.js → User ki test history list
- admin/pages/analytics.js → Total users, VIPs, test pass stats
- models/TestRecord.js → Har test ka record DB mein
- /api/test/certificate → VIP users ke liye PDF certificate

🔐 JWT secure routes
🧠 Badge logic + Test score already from Phase 6

⚙️ Setup:
.env file mein:
MONGO_URI=
JWT_SECRET=

📦 Terminal:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Tools: Next.js, Tailwind, Express, MongoDB, JWT, PDFKit, Axios
