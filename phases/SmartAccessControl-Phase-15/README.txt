📁 SmartAccessControl-Phase-15.zip

🔐 Phase 15: Smart Access Control (Module-wise + Role-wise)

📦 Features:
- Role-based auth: admin, buyer, seller, staff
- JWT token with `role` field
- Middleware to block unauthorized users
- MongoDB-based user access record

📂 Modules:
- middleware/roleAccess.js
- models/UserAccess.js
- backend/routes/protectedRoutes.js
- frontend/pages/secure-page.js

🛠 Setup:
.env:
JWT_SECRET=
MONGO_URI=

Commands:
- `npm install`
- `npm run dev`
- `node index.js`
