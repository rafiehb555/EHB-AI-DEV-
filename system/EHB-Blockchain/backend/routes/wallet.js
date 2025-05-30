// 💡 Replit Auto-Placement:
// 📁 Path: /backend/routes/wallet.js

const express = require("express");
const router = express.Router();
const Wallet = require("../../models/Wallet");
const auth = require("../middleware/authMiddleware");

// 💰 Get user wallet
router.get("/", auth, async (req, res) => {
  const wallet =
    (await Wallet.findOne({ userId: req.user.id })) ||
    new Wallet({ userId: req.user.id });
  res.json(wallet);
});

// ➕ Add transaction (top-up or deduction)
router.post("/add", auth, async (req, res) => {
  const { amount, type } = req.body;
  let wallet = await Wallet.findOne({ userId: req.user.id });

  if (!wallet)
    wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
  wallet.balance += amount;
  wallet.transactions.push({ type, amount });
  await wallet.save();

  res.json({ message: "✅ Transaction Added", wallet });
});

module.exports = router;
