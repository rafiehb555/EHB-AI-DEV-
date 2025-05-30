// 💡 Replit Auto-Placement:
// 📁 Path: /backend/routes/admin.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../../models/User");
const Order = require("../../models/Order");
const Complaint = require("../../models/Complaint");

// 🔐 Admin-only middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "❌ Access denied: Admins only" });
  }
  next();
};

// 🛡️ GET /api/admin/stats
router.get("/stats", auth, isAdmin, async (req, res) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const complaints = await Complaint.countDocuments();
  const earnings = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);

  res.json({
    users,
    orders,
    complaints,
    earnings: earnings[0]?.total * 1000 || 0, // Dummy Rs 1000/order
  });
});

module.exports = router;
