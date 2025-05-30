// 💡 Replit Auto-Placement:
// 📁 Path: /backend/routes/auth.js

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = require("../../config/jwtSecret");

// 🔐 Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash, role });
  await user.save();
  res.json({ message: "✅ Registered successfully" });
});

// 🔑 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "❌ User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "❌ Incorrect password" });

  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "7d",
  });
  res.json({ message: "✅ Login success", token, user });
});

module.exports = router;
