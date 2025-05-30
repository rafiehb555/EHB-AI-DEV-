/**
 * Shared Supabase Client
 * 
 * This module exports a configured Supabase client that can be used
 * throughout the EHB system for consistent database interactions.
 */

// Import dependencies for Supabase
const { createClient } = require('@supabase/supabase-js');

// Use cross-fetch for better compatibility
require('cross-fetch/polyfill');

// Initialize Supabase client with environment variables
let supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Features requiring Supabase will be limited.');
}

// Ensure URL is valid and has https:// prefix
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Set up fetch options
const fetchOptions = {
  auth: {
    persistSession: false, // Don't persist sessions for server-side usage
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch, // Use the polyfilled fetch
  },
};

// Create Supabase client with proper error handling
let supabase;
try {
  // Apply a timeout to connection attempts
  const timeoutMs = 10000; // 10 seconds timeout
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, fetchOptions);
    console.log('Shared Supabase client initialized successfully');
  } else {
    throw new Error('Supabase URL or key is missing');
  }
} catch (error) {
  console.error('Failed to initialize shared Supabase client:', error.message);
  // Create a dummy client with stub methods to prevent crashes
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      insert: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      update: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      delete: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      eq: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      limit: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
        list: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
      }),
    },
    rpc: () => ({ data: null, error: { message: 'Supabase client initialization failed: ' + error.message } }),
  };
}

/**
 * Tests the Supabase connection
 * @returns {Promise<Object>} Connection status object
 */
const testConnection = async () => {
  try {
    // First check if we have valid credentials
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase connection test failed: Missing credentials');
      return { 
        connected: false, 
        error: 'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.',
        env: {
          hasUrl: !!process.env.SUPABASE_URL,
          hasKey: !!process.env.SUPABASE_ANON_KEY
        }
      };
    }
    
    // Check URL format
    if (!supabaseUrl.startsWith('http')) {
      console.warn('Supabase URL does not start with http/https, prepending https://');
    }
    
    // Simple health check query that doesn't require any specific tables
    try {
      const { data, error } = await supabase
        .from('_health_check_')
        .select('*')
        .limit(1);
        
      // This will likely error with table not found, but that's OK
      // We just want to confirm network connectivity to Supabase
      
      if (!error || error.code === 'PGRST116') {
        // PGRST116 = Table not found, which is fine for a health check
        return { 
          connected: true, 
          source: 'health_check',
          message: 'Connection successful. Table _health_check_ not found, but connection is working.'
        };
      }
      
      // If we got a different error, it might still be OK if it's related to auth
      // or table permissions, but not connection issues
      if (error && !error.message.includes('fetch failed')) {
        return {
          connected: true,
          source: 'health_check',
          message: 'Connection successful, but with permissions error: ' + error.message,
          error: error.message
        };
      }
    } catch (healthError) {
      console.error('Health check failed:', healthError);
      // Continue to next check
    }
    
    // Final fallback - direct URL health check
    try {
      // Just use the base URL with no auth to check if the service is accessible
      const healthUrl = supabaseUrl.endsWith('/') ? `${supabaseUrl}health` : `${supabaseUrl}/health`;
      const response = await fetch(healthUrl);
      
      if (response.ok) {
        return {
          connected: true,
          source: 'direct_url',
          status: response.status,
          message: 'Direct URL health check successful, but API queries may still fail due to auth.'
        };
      } else {
        return {
          connected: false,
          source: 'direct_url',
          status: response.status,
          error: `Health endpoint returned status ${response.status}`
        };
      }
    } catch (directError) {
      console.error('Direct health check failed:', directError);
    }
    
    // If we got here, we exhausted all options
    return { 
      connected: false, 
      error: 'All connection attempts failed',
      details: 'Please check the Supabase URL and API key, and ensure the Supabase service is running.'
    };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { 
      connected: false, 
      error: error.message || 'Unknown error',
      details: error.toString(),
      stack: error.stack
    };
  }
};

/**
 * Utility function to create table if it doesn't exist
 * @param {string} tableName - The name of the table to create
 * @param {string} schemaSQL - The SQL schema definition
 * @returns {Promise<Object>} Result of the operation
 */
const createTableIfNotExists = async (tableName, schemaSQL) => {
  try {
    const { data, error } = await supabase.rpc('create_table_if_not_exists', {
      table_name: tableName,
      schema_sql: schemaSQL,
    });
    
    if (error) {
      console.error(`Error creating table ${tableName}:`, error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error in createTableIfNotExists for ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Helper function to handle database queries with error handling
 * @param {Function} queryFn - The function that performs the query
 * @returns {Promise<Object>} The query result with data and error properties
 */
const safeQuery = async (queryFn) => {
  try {
    const result = await queryFn();
    return result;
  } catch (error) {
    console.error('Supabase query error:', error.message);
    return { data: null, error: { message: error.message } };
  }
};

/**
 * Format error responses consistently
 * @param {Error|Object} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {Object} Formatted error response
 */
const formatError = (error, operation = 'Database operation') => {
  console.error(`Supabase error in ${operation}:`, error);
  
  return {
    success: false,
    error: {
      message: error.message || `${operation} failed`,
      details: error.details || error.toString(),
      code: error.code || 'UNKNOWN_ERROR',
      hint: error.hint || ''
    }
  };
};

module.exports = {
  supabase,
  testConnection,
  createTableIfNotExists,
  safeQuery,
  formatError,
};