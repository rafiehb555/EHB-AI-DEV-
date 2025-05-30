const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose>} Mongoose connection object
 */
const connectDB = async () => {
  try {
    // Check if we have a MongoDB URI
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI environment variable not set, skipping database connection');
      return null;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process on connection error to allow app to function without database
    throw error;
  }
};

module.exports = connectDB;