/**
 * MongoDB Client Configuration
 * 
 * This file sets up the MongoDB connection client used throughout the application.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ehb-system';

// Configure mongoose settings
mongoose.set('strictQuery', false);

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s
  family: 4 // Use IPv4, skip trying IPv6
};

// Create the MongoDB connection
const connect = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, options);
    console.log('MongoDB connection established successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

// Create connection function that retries on failure
const connectWithRetry = async (maxRetries = 5, delay = 5000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await connect();
    } catch (error) {
      retries += 1;
      console.log(`MongoDB connection attempt ${retries} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
};

// Close the connection
const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
    throw error;
  }
};

// Export the Mongoose instance and connection functions
export default {
  mongoose,
  connect: connectWithRetry,
  disconnect,
  connection: mongoose.connection
};