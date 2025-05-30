/**
 * Order Routes for GoSellr E-commerce
 * Handles all order-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { pool, edrConnection } = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items
    const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    
    const order = {
      ...result.rows[0],
      items: items.rows
    };
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, items, shipping_address, payment_method, total_amount } = req.body;
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, shipping_address, payment_method, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, shipping_address, payment_method, total_amount, 'pending']
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Create order items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await client.query('COMMIT');
    
    // Record in EDR database
    edrConnection.connect();
    
    res.status(201).json({
      id: orderId,
      message: 'Order created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel order
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Check if order exists
    const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order can be cancelled
    if (orderCheck.rows[0].status !== 'pending' && orderCheck.rows[0].status !== 'processing') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order cannot be cancelled in its current state' });
    }
    
    // Get order items
    const items = await client.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    
    // Restore product stock
    for (const item of items.rows) {
      await client.query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    // Update order status
    await client.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', id]
    );
    
    await client.query('COMMIT');
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;