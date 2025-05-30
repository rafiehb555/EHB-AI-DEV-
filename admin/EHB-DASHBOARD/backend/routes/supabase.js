
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/db');

router.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: '✅ Supabase connection successful',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Supabase connection failed',
      error: error.message
    });
  }
});

module.exports = router;
