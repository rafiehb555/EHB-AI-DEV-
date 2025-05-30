// 💡 Replit Auto-Placement:
// 📁 Path: /backend/routes/sql.js

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../middleware/authMiddleware");

// 🔼 Upgrade SQL level
router.put("/upgrade", auth, async (req, res) => {
  const { newLevel } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { sqlLevel: newLevel },
    { new: true },
  );
  res.json({ message: "✅ SQL Level Updated", user });
});

module.exports = router;
