/**
 * EHB Shared Supabase Client
 * 
 * This module provides a centralized Supabase client that can be used
 * across different services in the EHB ecosystem. It handles initialization,
 * connection testing, and common database operations.
 * 
 * @version 1.0.0
 * @date 2025-05-13
 */

const { createClient } = require('@supabase/supabase-js');
const crossFetch = require('cross-fetch');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const DEBUG = process.env.NODE_ENV !== 'production';

// Singleton instance
let supabaseInstance = null;

/**
 * Get or initialize the Supabase client
 * @returns {Object} The Supabase client instance
 */
function getClient() {
  if (!supabaseInstance) {
    // Normalize Supabase URL first
    let supabaseUrl = SUPABASE_URL;
    
    // Check if the URL is just a project ID or malformed
    if (supabaseUrl && !supabaseUrl.startsWith('http')) {
      if (supabaseUrl.includes('.supabase.co')) {
        // Missing protocol
        supabaseUrl = 'https://' + supabaseUrl;
      } else if (!supabaseUrl.includes('.')) {
        // It's likely just the project ID
        supabaseUrl = `https://${supabaseUrl}.supabase.co`;
      }
    }
    
    // Remove trailing slash if present
    if (supabaseUrl && supabaseUrl.endsWith('/')) {
      supabaseUrl = supabaseUrl.slice(0, -1);
    }
    
    if (!supabaseUrl || !SUPABASE_ANON_KEY) {
      console.warn('Missing Supabase credentials. Create client with dummy values to prevent crashes.');
      // Create a non-functional client to prevent crashes
      supabaseInstance = {
        from: () => ({
          select: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          insert: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          update: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          delete: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        }),
        auth: {
          onAuthStateChange: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          signUp: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          signIn: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          signOut: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        },
        storage: {
          from: () => ({
            upload: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
            download: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
            list: () => ({ data: null, error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
          }),
        },
        _isConnected: false,
      };
      return supabaseInstance;
    }

    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      global: {
        fetch: crossFetch
      }
    };

    try {
      console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);
      supabaseInstance = createClient(supabaseUrl, SUPABASE_ANON_KEY, options);
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      throw error;
    }
  }
  
  return supabaseInstance;
}

/**
 * Test the Supabase connection
 * @returns {Promise<Object>} Connection test results
 */
async function testConnection() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        connected: false,
        error: 'Missing Supabase credentials',
        details: 'Please configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables'
      };
    }

    // Normalize URL for health check
    let supabaseUrl = SUPABASE_URL;
    
    // Fix URL format if it's not properly formatted
    if (!supabaseUrl.startsWith('http')) {
      if (supabaseUrl.includes('.supabase.co')) {
        // Just missing the protocol
        supabaseUrl = 'https://' + supabaseUrl;
      } else if (!supabaseUrl.includes('.')) {
        // Likely just the project reference
        supabaseUrl = `https://${supabaseUrl}.supabase.co`;
      }
    }
    
    // Remove trailing slash if present
    if (supabaseUrl.endsWith('/')) {
      supabaseUrl = supabaseUrl.slice(0, -1);
    }

    console.log(`Testing Supabase connection with URL: ${supabaseUrl}`);

    // Try direct health check first (most reliable)
    try {
      const healthUrl = `${supabaseUrl}/rest/v1/?apikey=${SUPABASE_ANON_KEY}`;
      console.log(`Health check URL: ${healthUrl}`);
      
      const response = await crossFetch(healthUrl, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        return {
          connected: true,
          source: 'Direct health check',
          role: 'anon'
        };
      }
      
      throw new Error(`Health check failed with status: ${response.status}`);
    } catch (directHealthError) {
      console.error('Direct health check failed:', directHealthError);
      
      // Try alternate method - database query
      try {
        const supabase = getClient();
        const { data, error } = await supabase.from('_realtime').select('id').limit(1);
        
        if (error) throw error;
        
        return {
          connected: true,
          source: 'Database query',
          role: 'anon'
        };
      } catch (queryError) {
        console.error('Database query failed:', queryError);
        
        // Try third method - auth check
        try {
          const supabase = getClient();
          const { data, error } = await supabase.auth.getSession();
          
          // Success even if no active session
          return {
            connected: true,
            source: 'Auth API check',
            role: 'anon',
            session: data?.session ? 'active' : 'none'
          };
        } catch (authError) {
          console.error('Auth check failed:', authError);
          
          // All methods failed
          return {
            connected: false,
            error: 'All connection attempts failed',
            details: 'Please check the Supabase URL and API key, and ensure the Supabase service is running.'
          };
        }
      }
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return {
      connected: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Connection error'
    };
  }
}

/**
 * Get the list of tables in the database
 * @returns {Promise<Object>} List of tables
 */
async function getTables() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { 
        tables: [],
        error: 'Missing Supabase credentials'
      };
    }

    const supabase = getClient();
    
    // Use system catalog tables to get table information
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      // Fallback using a different approach
      try {
        // Try to fetch a specific system view for tables
        const result = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
          
        if (result.error) throw result.error;
        return { 
          tables: result.data.map(t => t.tablename),
          source: 'pg_tables system view'
        };
      } catch (fallbackError) {
        return { 
          tables: [],
          error: fallbackError.message,
          details: DEBUG ? fallbackError.toString() : 'Error fetching tables'
        };
      }
    }
    
    return { 
      tables: Array.isArray(data) ? data : [],
      source: 'RPC get_tables'
    };
  } catch (error) {
    console.error('Error getting tables:', error);
    return { 
      tables: [],
      error: error.message,
      details: DEBUG ? error.toString() : 'Error fetching tables'
    };
  }
}

// Export the Supabase interface
module.exports = {
  supabase: getClient(),
  getClient,
  testConnection,
  getTables
};