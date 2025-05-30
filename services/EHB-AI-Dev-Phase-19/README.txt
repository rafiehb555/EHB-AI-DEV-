📁 EHB-AI-Dev-Phase-19.zip

🧾 Phase 19: Invoice System + Auto Billing Logic

📂 Shamil Files:
- frontend/pages/invoices.js → Invoice form + list view
- backend/routes/invoiceRoutes.js → Invoice APIs
- models/Invoice.js → Invoice schema with status

📌 Logic:
- Har user apne liye invoice create kar sakta hai
- Status update hota hai: Pending, Paid, Overdue

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Terminal Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: React, Tailwind, MongoDB, Express, JWT, Axios
