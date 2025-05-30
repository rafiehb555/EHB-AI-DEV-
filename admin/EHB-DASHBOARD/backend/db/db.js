/**
 * Database Connection
 * 
 * PostgreSQL database connection pool
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('PostgreSQL database connection established successfully');
  }
});

module.exports = pool;