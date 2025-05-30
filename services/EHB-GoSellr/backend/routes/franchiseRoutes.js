/**
 * Franchise Routes for GoSellr E-commerce
 * Handles all franchise-related API endpoints
 * Connects with EHB-SUB-FRANCHISE/ehb-gosellr-franchise
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get all franchises
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM franchises ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching franchises:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get franchise by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM franchises WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }
    
    // Get franchise owner
    const ownerResult = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [result.rows[0].owner_id]);
    
    // Get franchise sales
    const salesResult = await pool.query(`
      SELECT SUM(total_amount) as total_sales
      FROM orders
      WHERE franchise_id = $1 AND status = 'delivered'
    `, [id]);
    
    const franchise = {
      ...result.rows[0],
      owner: ownerResult.rows[0] || null,
      total_sales: salesResult.rows[0].total_sales || 0
    };
    
    res.json(franchise);
  } catch (error) {
    console.error('Error fetching franchise:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new franchise
router.post('/', async (req, res) => {
  try {
    const { name, owner_id, location, contact_email, contact_phone, level } = req.body;
    
    const result = await pool.query(
      'INSERT INTO franchises (name, owner_id, location, contact_email, contact_phone, level, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, owner_id, location, contact_email, contact_phone, level, 'pending']
    );
    
    // Register in franchise system
    try {
      // Check if the franchise system folder exists
      const franchiseSystemPath = path.join(process.cwd(), '..', '..', 'system', 'franchise-system', 'EHB-SUB-FRANCHISE', 'ehb-gosellr-franchise');
      const franchiseDataPath = path.join(franchiseSystemPath, 'data');
      
      if (!fs.existsSync(franchiseDataPath)) {
        fs.mkdirSync(franchiseDataPath, { recursive: true });
      }
      
      // Save franchise data
      const franchiseData = {
        ...result.rows[0],
        registration_date: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(franchiseDataPath, `franchise_${result.rows[0].id}.json`),
        JSON.stringify(franchiseData, null, 2)
      );
    } catch (fsError) {
      console.error('Error registering franchise in system:', fsError);
      // Continue anyway, this is just additional integration
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating franchise:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update franchise
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contact_email, contact_phone, level, status } = req.body;
    
    const result = await pool.query(
      'UPDATE franchises SET name = $1, location = $2, contact_email = $3, contact_phone = $4, level = $5, status = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, location, contact_email, contact_phone, level, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }
    
    // Update in franchise system
    try {
      const franchiseSystemPath = path.join(process.cwd(), '..', '..', 'system', 'franchise-system', 'EHB-SUB-FRANCHISE', 'ehb-gosellr-franchise');
      const franchiseDataPath = path.join(franchiseSystemPath, 'data');
      const franchiseFilePath = path.join(franchiseDataPath, `franchise_${id}.json`);
      
      if (fs.existsSync(franchiseFilePath)) {
        const existingData = JSON.parse(fs.readFileSync(franchiseFilePath));
        const updatedData = {
          ...existingData,
          ...result.rows[0],
          updated_at: new Date().toISOString()
        };
        
        fs.writeFileSync(franchiseFilePath, JSON.stringify(updatedData, null, 2));
      }
    } catch (fsError) {
      console.error('Error updating franchise in system:', fsError);
      // Continue anyway, this is just additional integration
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating franchise:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get franchise analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe } = req.query;
    
    // Default to last 30 days if no timeframe is provided
    let timeframeQuery = "AND created_at > NOW() - INTERVAL '30 days'";
    
    if (timeframe === 'week') {
      timeframeQuery = "AND created_at > NOW() - INTERVAL '7 days'";
    } else if (timeframe === 'year') {
      timeframeQuery = "AND created_at > NOW() - INTERVAL '1 year'";
    } else if (timeframe === 'all') {
      timeframeQuery = '';
    }
    
    // Check if franchise exists
    const franchiseCheck = await pool.query('SELECT * FROM franchises WHERE id = $1', [id]);
    
    if (franchiseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Franchise not found' });
    }
    
    // Get sales data
    const salesQuery = `
      SELECT DATE(created_at) as date, SUM(total_amount) as total
      FROM orders
      WHERE franchise_id = $1 ${timeframeQuery}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    
    const salesResult = await pool.query(salesQuery, [id]);
    
    // Get top products
    const topProductsQuery = `
      SELECT p.name, p.id, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.franchise_id = $1 ${timeframeQuery}
      GROUP BY p.id, p.name
      ORDER BY total_sales DESC
      LIMIT 5
    `;
    
    const topProductsResult = await pool.query(topProductsQuery, [id]);
    
    // Get customer counts
    const customerCountQuery = `
      SELECT COUNT(DISTINCT user_id) as customer_count
      FROM orders
      WHERE franchise_id = $1 ${timeframeQuery}
    `;
    
    const customerCountResult = await pool.query(customerCountQuery, [id]);
    
    // Calculate order statistics
    const orderStatsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
      WHERE franchise_id = $1 ${timeframeQuery}
    `;
    
    const orderStatsResult = await pool.query(orderStatsQuery, [id]);
    
    const analytics = {
      sales_data: salesResult.rows,
      top_products: topProductsResult.rows,
      customer_count: customerCountResult.rows[0].customer_count,
      order_stats: orderStatsResult.rows[0],
      timeframe: timeframe || '30days'
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching franchise analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;