const express = require("express");
const router = express.Router();
const { supabaseAdmin } = require("../config/db");

// POST /api/ai-products
router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([{ name, description, price }]);

    if (error) throw error;
    res.status(201).json({ message: "✅ Product saved", data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Failed to save product", error: err.message });
  }
});

module.exports = router;
