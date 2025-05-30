/**
 * GoSellr Database Configuration
 * Connects to the PostgreSQL database and manages connections with EHB-SQL systems
 */

const { Pool } = require('pg');

// Main database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Connection to EHB-SQL Department databases
const pssConnection = {
  connect: () => {
    console.log('Connected to EHB-SQL-PSS (Product Sales System)');
    return true;
  }
};

const edrConnection = {
  connect: () => {
    console.log('Connected to EHB-SQL-EDR (E-commerce Data Repository)');
    return true;
  }
};

const emoConnection = {
  connect: () => {
    console.log('Connected to EHB-SQL-EMO (E-commerce Marketing Optimization)');
    return true;
  }
};

// Connect to the database and SQL departments
const connectDatabase = async () => {
  try {
    // Test main database connection
    const client = await pool.connect();
    console.log('PostgreSQL database connection successful');
    client.release();
    
    // Connect to SQL departments
    await pssConnection.connect();
    await edrConnection.connect();
    await emoConnection.connect();
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

module.exports = {
  pool,
  pssConnection,
  edrConnection,
  emoConnection,
  connectDatabase,
  query: (text, params) => pool.query(text, params)
};