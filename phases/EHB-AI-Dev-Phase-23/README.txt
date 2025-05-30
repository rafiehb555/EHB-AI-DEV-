📁 EHB-AI-Dev-Phase-23.zip

📜 Phase 23: Compliance & Verification Layer (KYC + Document Audit)

📂 Is ZIP mein shamil hai:
- frontend/pages/kyc.js → Document upload interface (user side)
- backend/routes/kycRoutes.js → Upload + Admin approve/reject routes
- models/KYC.js → User ID, file path, status

🛡️ Logic:
- User document upload karta hai
- Status: Pending → Approved/Rejected (Admin)
- File uploads to /public/uploads folder

⚙️ Setup:
.env file:
MONGO_URI=
JWT_SECRET=

Terminal Commands:
cd backend && npm install && node index.js  
cd frontend && npm install && npm run dev

✅ Stack: Next.js, TailwindCSS, MongoDB, Express, JWT, Multer, Axios
