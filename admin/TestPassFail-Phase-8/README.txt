📁 TestPassFail-Phase-8.zip

📘 Phase 8: Test Score → Pass/Fail Result + Status Badge

📂 Module ke 7 hisay:

1️⃣ frontend/pages/test-status.js → Test score submit + result badge
2️⃣ backend/routes/testRoutes.js → Routes for submit + fetch test results
3️⃣ admin/panels/test-results-log.txt → Admin logs of all test submissions
4️⃣ models/TestLog.js → Mongoose schema for tracking result logs
5️⃣ config/db.js → MongoDB database connection config
6️⃣ backend/controllers/testController.js → Pass/fail logic + result storage
7️⃣ README.txt → Roman Urdu setup guide + instructions

📌 Logic:
- Score >= 50 = Pass
- Score < 50 = Fail

⚙ Setup:
.env mein:
MONGO_URI=
JWT_SECRET=

Commands:
- `npm install`
- `node index.js`
- `npm run dev`
