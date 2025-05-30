-- GoSellr E-commerce Platform Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Franchises Table
CREATE TABLE IF NOT EXISTS franchises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  location VARCHAR(255),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(50),
  level VARCHAR(50) DEFAULT 'basic',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  franchise_id INTEGER REFERENCES franchises(id),
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table (for JPS Integration)
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  job_id INTEGER NOT NULL,
  resume TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data

-- Admin User
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@gosellr.com', '$2a$10$yvXLYX0nTGVtXDGUPfY9.uj3XBKxdZYie.MBqOAcxiEL6QxoQIl5u', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, category, image_url, stock) 
VALUES 
  ('Smartphone X', 'Latest flagship smartphone with amazing features', 799.99, 'Electronics', 'https://example.com/smartphone.jpg', 100),
  ('Wireless Headphones', 'Noise-cancelling wireless headphones', 159.99, 'Electronics', 'https://example.com/headphones.jpg', 50),
  ('Designer T-Shirt', 'Premium cotton t-shirt', 39.99, 'Clothing', 'https://example.com/tshirt.jpg', 200),
  ('Coffee Maker', 'Programmable coffee maker with thermal carafe', 89.99, 'Home & Kitchen', 'https://example.com/coffeemaker.jpg', 30),
  ('Fitness Tracker', 'Track your steps, heart rate, and sleep', 129.99, 'Fitness', 'https://example.com/tracker.jpg', 75)
ON CONFLICT DO NOTHING;