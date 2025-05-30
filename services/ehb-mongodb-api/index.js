/**
 * EHB MongoDB API
 * 
 * This service provides a RESTful API for MongoDB data operations.
 * Includes Supabase fallback support for when MongoDB is unavailable.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { rateLimit } = require('express-rate-limit');
const mongoose = require('mongoose');
const { supabase, testConnection: testSupabaseConnection } = require('../../shared/supabase-client');

// Load environment variables
dotenv.config();

// MongoDB connection URI - use environment variable for security
const MONGO_URI = process.env.MONGO_URI;

// If MONGO_URI is not provided, use a fallback but log a warning
if (!MONGO_URI) {
  console.warn('⚠️ MONGO_URI environment variable not found. Using fallback connection string.');
  console.warn('⚠️ To fix this, please set MONGO_URI in your environment variables.');
}

// MongoDB connection options - simplified options for MongoDB Atlas
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

// Define user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define product schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);

// Database connection state
let connectionState = {
  mongo: {
    connected: false,
    status: 'disconnected',
    error: null,
    lastAttempt: null
  },
  supabase: {
    connected: false,
    status: 'disconnected',
    error: null,
    lastAttempt: null
  },
  activeFallback: false,
  retryCount: 0,
  maxRetries: 5
};

// Connect to MongoDB with retry
function connectWithRetry(uri, options, retryAttempt = 0) {
  console.log(`MongoDB connection attempt ${retryAttempt + 1}/${connectionState.maxRetries}...`);
  
  connectionState.mongo.lastAttempt = new Date().toISOString();
  connectionState.retryCount = retryAttempt;
  
  return mongoose.connect(uri, options)
    .then(() => {
      console.log('==================================================');
      console.log('✅ Connected to MongoDB successfully');
      console.log('==================================================');
      
      connectionState.mongo.connected = true;
      connectionState.mongo.status = 'connected';
      connectionState.mongo.error = null;
      
      // Check if we need to disable fallback mode
      if (connectionState.activeFallback) {
        console.log('MongoDB connection restored. Disabling Supabase fallback.');
        connectionState.activeFallback = false;
      }
      
      return true;
    })
    .catch(err => {
      console.error(`MongoDB connection error: ${err}`);
      console.error(err);
      
      // Update connection state
      connectionState.mongo.connected = false;
      connectionState.mongo.status = 'error';
      connectionState.mongo.error = err.message;
      
      // Enhance error messaging for common issues
      if (err.name === 'MongoServerError' && err.code === 8000 && err.codeName === 'AtlasError') {
        console.error('==================================================');
        console.error('❌ AUTHENTICATION ERROR: Invalid username or password');
        console.error('To fix this issue:');
        console.error('1. Check that the username and password in your MONGO_URI are correct');
        console.error('2. Ensure special characters in the username or password are URL encoded');
        console.error('3. Verify that the user has appropriate permissions in MongoDB Atlas');
        console.error('4. Try regenerating your MongoDB connection string from the Atlas dashboard');
        console.error('==================================================');
      } else if (err.name === 'MongoTimeoutError') {
        console.error('==================================================');
        console.error('❌ CONNECTION TIMEOUT: Unable to reach MongoDB server');
        console.error('To fix this issue:');
        console.error('1. Check that your MongoDB Atlas cluster is running');
        console.error('2. Verify that network access is enabled for IP: 34.16.8.22 (Replit IP)');
        console.error('3. Try a ping test to ensure your MongoDB server is reachable');
        console.error('==================================================');
      }
      
      // If we've reached the maximum number of retries, activate fallback
      if (retryAttempt >= connectionState.maxRetries - 1) {
        console.warn(`Maximum MongoDB connection retries (${connectionState.maxRetries}) reached.`);
        
        // Check if Supabase fallback is available
        return testSupabaseConnection()
          .then(supabaseConnected => {
            if (supabaseConnected) {
              console.log('==================================================');
              console.log('ℹ️ Activating Supabase fallback for database operations');
              console.log('==================================================');
              
              connectionState.supabase.connected = true;
              connectionState.supabase.status = 'connected';
              connectionState.supabase.error = null;
              connectionState.activeFallback = true;
              connectionState.supabase.lastAttempt = new Date().toISOString();
            } else {
              console.error('==================================================');
              console.error('❌ Failed to connect to both MongoDB and Supabase fallback');
              console.error('==================================================');
              
              connectionState.supabase.connected = false;
              connectionState.supabase.status = 'error';
              connectionState.supabase.error = 'Failed to connect to Supabase';
              connectionState.activeFallback = false;
            }
          })
          .catch(supabaseErr => {
            console.error('Supabase fallback connection error:', supabaseErr);
            connectionState.supabase.connected = false;
            connectionState.supabase.status = 'error';
            connectionState.supabase.error = supabaseErr.message;
            connectionState.activeFallback = false;
          });
      }
      
      // Wait before trying to reconnect
      const retryDelay = Math.min(Math.pow(2, retryAttempt) * 1000, 60000);
      console.log(`Will retry connection in ${retryDelay / 1000} seconds (at ${new Date(Date.now() + retryDelay).toISOString()})...`);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(connectWithRetry(uri, options, retryAttempt + 1));
        }, retryDelay);
      });
    });
}

// Initial connection attempt
if (MONGO_URI) {
  connectWithRetry(MONGO_URI, options, 0);
} else {
  // If no MongoDB URI, try activating Supabase fallback immediately
  testSupabaseConnection()
    .then(supabaseConnected => {
      if (supabaseConnected) {
        console.log('==================================================');
        console.log('ℹ️ No MongoDB URI provided. Using Supabase as primary database');
        console.log('==================================================');
        
        connectionState.supabase.connected = true;
        connectionState.supabase.status = 'connected';
        connectionState.supabase.error = null;
        connectionState.activeFallback = true;
        connectionState.supabase.lastAttempt = new Date().toISOString();
      } else {
        console.error('==================================================');
        console.error('❌ No database connection available. Both MongoDB URI missing and Supabase connection failed');
        console.error('==================================================');
        
        connectionState.supabase.connected = false;
        connectionState.supabase.status = 'error';
        connectionState.supabase.error = 'Failed to connect to Supabase';
      }
    });
}

// Initialize Express app
const app = express();
const PORT = process.env.MONGODB_API_PORT || 5300;

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Database connection check middleware
// Exclude paths that don't need database access
const excludedPaths = ['/health', '/api/admin/reconnect'];

app.use((req, res, next) => {
  // Skip database check for excluded paths
  if (excludedPaths.some(path => req.path.includes(path))) {
    return next();
  }
  
  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    // Use Supabase fallback if available
    if (connectionState.activeFallback && connectionState.supabase.connected) {
      console.log(`Using Supabase fallback for database operations on ${req.originalUrl}`);
      req.useFallback = true; // Flag to use fallback in route handlers
      return next();
    } else {
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection unavailable. Both MongoDB and Supabase fallback are unavailable.',
        dbStatus: 'disconnected',
        fallbackStatus: connectionState.supabase.status
      });
    }
  }
  
  // MongoDB is connected, proceed with the request
  return next();
});

// Health check route
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[mongoStatus] || 'unknown';
  
  const connectionInfo = {
    supabase: {
      connected: connectionState.supabase.connected,
      status: connectionState.supabase.status,
      lastAttempt: connectionState.supabase.lastAttempt,
      error: connectionState.supabase.error
    },
    mongodb: {
      connected: connectionState.mongo.connected,
      status: connectionState.mongo.status,
      lastAttempt: connectionState.mongo.lastAttempt,
      error: connectionState.mongo.error,
      readyState: mongoStatus,
      readyStateText: mongoStatusText
    },
    usingFallback: connectionState.activeFallback
  };
  
  res.json({
    service: 'EHB-MongoDB-API',
    status: 'running',
    timestamp: new Date().toISOString(),
    connections: connectionInfo,
    troubleshooting: {
      whitelistNeeded: connectionState.mongo.error ? true : false,
      replitIP: '34.16.8.22', // Replit IP that needs to be whitelisted
      whitelistInstructions: 'To whitelist your IP in MongoDB Atlas: 1) Log into cloud.mongodb.com, 2) Go to Network Access, 3) Click "Add IP Address", 4) Add Replit IP: 34.16.8.22 or select "Allow Access from Anywhere"',
      uri: MONGO_URI ? MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'Not provided', // Mask credentials in the connection URI
    }
  });
});

// User routes
const userRouter = express.Router();

// Get all users
userRouter.get('/', async (req, res) => {
  try {
    // Use the appropriate data source based on connection status
    let users = [];
    
    if (req.useFallback) {
      // Use Supabase fallback
      users = await fallbackOps.find('users', {});
      console.log(`Retrieved ${users.length} users from Supabase fallback`);
    } else {
      // Use MongoDB normally
      users = await User.find({}, '-password');
    }
    
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(`Error retrieving users: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// Product routes
const productRouter = express.Router();

// Get all products
productRouter.get('/', async (req, res) => {
  try {
    // Use the appropriate data source based on connection status
    let products = [];
    
    if (req.useFallback) {
      // Use Supabase fallback
      products = await fallbackOps.find('products', {});
      console.log(`Retrieved ${products.length} products from Supabase fallback`);
    } else {
      // Use MongoDB normally
      products = await Product.find({});
    }
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Error retrieving products: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving products',
      error: error.message
    });
  }
});

// Admin routes
const adminRouter = express.Router();

// Manually reconnect to database (with optional custom URI for testing)
adminRouter.post('/reconnect', async (req, res) => {
  try {
    const customUri = req.body.uri;
    
    // Start a new connection attempt regardless of retry count
    console.log('Manual reconnection triggered via API');
    connectionState.retryCount = 0;
    
    // If using a custom URI from request, don't persist it but use for test
    if (customUri) {
      console.log('Testing connection with provided URI (credentials masked)');
      // Test connection only, don't replace the environment variable
      mongoose.disconnect()
        .then(() => {
          mongoose.connect(customUri, options)
            .then(() => {
              console.log('✅ Test connection successful with provided URI');
              // Disconnect and connect with the real URI
              mongoose.disconnect().then(() => {
                connectWithRetry(MONGO_URI, options, 0);
              });
            })
            .catch(err => {
              console.error('❌ Test connection failed with provided URI:', err.message);
              // Connect back with the original URI
              connectWithRetry(MONGO_URI, options, 0);
            });
        });
    } else {
      // Standard reconnection with environment URI
      connectWithRetry(MONGO_URI, options, 0);
    }
    
    res.status(200).json({
      success: true,
      message: 'Manual reconnection attempt triggered',
      usingCustomUri: !!customUri,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        replitIp: '34.16.8.22',
        ipWhitelistInstructions: 'To whitelist Replit IP in MongoDB Atlas: Go to Security > Network Access and add 34.16.8.22',
        authInstructions: 'To fix auth errors: Check username/password in connection string and ensure special characters are URL encoded'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate reconnection attempt',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get detailed connection status
adminRouter.get('/connection-status', (req, res) => {
  const mongoDbHost = MONGO_URI ? MONGO_URI.match(/@([^\/]+)\//)?.[1] || 'unknown' : 'not provided';
  
  res.status(200).json({
    success: true,
    dbStatus: {
      readyState: mongoose.connection.readyState,
      readyStateText: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[mongoose.connection.readyState] || 'unknown'
    },
    connectionState,
    server: {
      host: mongoDbHost,
      maskedUri: MONGO_URI ? MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'not provided'
    },
    troubleshooting: {
      ipWhitelisting: {
        replitIP: '34.16.8.22', // Replit IP that needs to be whitelisted
        instructions: 'To whitelist your IP in MongoDB Atlas: 1) Log into cloud.mongodb.com, 2) Go to Network Access, 3) Click "Add IP Address", 4) Add Replit IP: 34.16.8.22 or select "Allow Access from Anywhere"',
        url: 'https://cloud.mongodb.com/v2#/security/network/accessList'
      }
    }
  });
});

// Fallback database operations using Supabase
const fallbackOps = {
  /**
   * Find documents in Supabase as a fallback to MongoDB
   * @param {string} collectionName - The collection/table name
   * @param {Object} query - Query filter (simplified for Supabase)
   * @param {Object} options - Options for sorting, limiting, etc.
   * @returns {Promise<Array>} - The found documents
   */
  async find(collectionName, query = {}, options = {}) {
    if (!connectionState.activeFallback) {
      throw new Error('Fallback is not active');
    }
    
    try {
      // Simplify MongoDB-style query for Supabase
      // For example, convert { name: { $eq: 'John' } } to supabase.eq('name', 'John')
      let supabaseQuery = supabase.from(collectionName).select('*');
      
      // Apply filters
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle MongoDB operators
          if (value.$eq !== undefined) {
            supabaseQuery = supabaseQuery.eq(key, value.$eq);
          } else if (value.$in !== undefined && Array.isArray(value.$in)) {
            supabaseQuery = supabaseQuery.in(key, value.$in);
          }
        } else {
          // Simple equality
          supabaseQuery = supabaseQuery.eq(key, value);
        }
      });
      
      // Handle options
      if (options.limit) {
        supabaseQuery = supabaseQuery.limit(options.limit);
      }
      
      if (options.sort) {
        Object.entries(options.sort).forEach(([key, direction]) => {
          // MongoDB uses 1 for ascending, -1 for descending
          const ascending = direction === 1;
          supabaseQuery = supabaseQuery.order(key, { ascending });
        });
      }
      
      const { data, error } = await supabaseQuery;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Supabase fallback find operation failed for ${collectionName}:`, error);
      throw error;
    }
  },
  
  /**
   * Insert documents in Supabase as a fallback to MongoDB
   * @param {string} collectionName - The collection/table name
   * @param {Object|Array} docs - Document(s) to insert
   * @returns {Promise<Object>} - Result of the insert operation
   */
  async insert(collectionName, docs) {
    if (!connectionState.activeFallback) {
      throw new Error('Fallback is not active');
    }
    
    try {
      // Convert to array if it's a single document
      const docsArray = Array.isArray(docs) ? docs : [docs];
      
      // Insert into Supabase
      const { data, error } = await supabase.from(collectionName).insert(docsArray);
      
      if (error) {
        throw error;
      }
      
      return {
        acknowledged: true,
        insertedCount: docsArray.length,
        insertedIds: data ? data.map(doc => doc.id) : []
      };
    } catch (error) {
      console.error(`Supabase fallback insert operation failed for ${collectionName}:`, error);
      throw error;
    }
  },
  
  /**
   * Update documents in Supabase as a fallback to MongoDB
   * @param {string} collectionName - The collection/table name
   * @param {Object} filter - Filter for documents to update
   * @param {Object} update - Update operations to perform
   * @returns {Promise<Object>} - Result of the update operation
   */
  async update(collectionName, filter, update) {
    if (!connectionState.activeFallback) {
      throw new Error('Fallback is not active');
    }
    
    try {
      // Start with the base query
      let supabaseQuery = supabase.from(collectionName);
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle MongoDB operators
          if (value.$eq !== undefined) {
            supabaseQuery = supabaseQuery.eq(key, value.$eq);
          } else if (value.$in !== undefined && Array.isArray(value.$in)) {
            supabaseQuery = supabaseQuery.in(key, value.$in);
          }
        } else {
          // Simple equality
          supabaseQuery = supabaseQuery.eq(key, value);
        }
      });
      
      // Get the update values from MongoDB style to Supabase style
      let updateValues = {};
      
      if (update.$set) {
        // MongoDB { $set: { name: 'New name' } } => Supabase { name: 'New name' }
        updateValues = { ...update.$set };
      } else {
        // If no $set operator, use the update object directly
        updateValues = { ...update };
      }
      
      // Execute update
      const { data, error } = await supabaseQuery.update(updateValues);
      
      if (error) {
        throw error;
      }
      
      return {
        acknowledged: true,
        modifiedCount: data ? data.length : 0,
        matchedCount: data ? data.length : 0
      };
    } catch (error) {
      console.error(`Supabase fallback update operation failed for ${collectionName}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete documents in Supabase as a fallback to MongoDB
   * @param {string} collectionName - The collection/table name
   * @param {Object} filter - Filter for documents to delete
   * @returns {Promise<Object>} - Result of the delete operation
   */
  async delete(collectionName, filter) {
    if (!connectionState.activeFallback) {
      throw new Error('Fallback is not active');
    }
    
    try {
      // Start with the base query
      let supabaseQuery = supabase.from(collectionName);
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle MongoDB operators
          if (value.$eq !== undefined) {
            supabaseQuery = supabaseQuery.eq(key, value.$eq);
          } else if (value.$in !== undefined && Array.isArray(value.$in)) {
            supabaseQuery = supabaseQuery.in(key, value.$in);
          }
        } else {
          // Simple equality
          supabaseQuery = supabaseQuery.eq(key, value);
        }
      });
      
      // Execute delete
      const { data, error } = await supabaseQuery.delete();
      
      if (error) {
        throw error;
      }
      
      return {
        acknowledged: true,
        deletedCount: data ? data.length : 0
      };
    } catch (error) {
      console.error(`Supabase fallback delete operation failed for ${collectionName}:`, error);
      throw error;
    }
  }
};

// Register routers
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`EHB MongoDB API Server running on port ${PORT}`);
  console.log(`==================================================`);
  console.log(`API URL: http://0.0.0.0:${PORT}/api`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`==================================================`);
});

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.log('Error occurred, but server will continue running with limited functionality');
  // Don't exit the process, just log the error
});

module.exports = app;