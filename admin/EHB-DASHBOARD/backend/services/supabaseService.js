/**
 * Supabase Service
 * 
 * This service handles interactions with Supabase for the EHB Dashboard Backend.
 * It includes functions for:
 * - Database operations (CRUD)
 * - Authentication
 * - File storage
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
let supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Supabase features will be limited or unavailable.');
}

// Ensure URL is valid and has https:// prefix
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Create Supabase client with proper error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message);
  // Create a dummy client with stub methods to prevent crashes
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
      insert: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
      update: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
      delete: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
        list: () => ({ data: null, error: { message: 'Supabase client initialization failed' } }),
      }),
    },
  };
}

/**
 * Test the Supabase connection
 * @returns {Promise<Object>} Connection status
 */
const testConnection = async () => {
  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means the table doesn't exist, which is fine for a connection test
      console.error('Supabase connection test failed:', error);
      return { connected: false, error: error.message };
    }
    
    return { connected: true };
  } catch (error) {
    console.error('Supabase connection test error:', error.message);
    return { connected: false, error: error.message };
  }
};

/**
 * Get data from Supabase
 * @param {string} table - The table name
 * @param {Object} options - Query options (select, where, order, limit)
 * @returns {Promise<Object>} The query result with data and error properties
 */
const getData = async (table, options = {}) => {
  try {
    let query = supabase.from(table).select(options.select || '*');
    
    // Apply filters if provided
    if (options.where) {
      for (const [column, filter] of Object.entries(options.where)) {
        if (typeof filter === 'object' && filter !== null) {
          // Handle operators like eq, gt, lt, etc.
          const [operator, value] = Object.entries(filter)[0];
          query = query.filter(column, operator, value);
        } else {
          // Simple equality filter
          query = query.eq(column, filter);
        }
      }
    }
    
    // Apply ordering
    if (options.order) {
      query = query.order(options.order.column, { 
        ascending: options.order.ascending !== false 
      });
    }
    
    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Unexpected error fetching data from ${table}:`, error);
    return { data: null, error };
  }
};

/**
 * Insert data into Supabase
 * @param {string} table - The table name
 * @param {Object|Array} data - The data to insert
 * @param {Object} options - Options like returning, upsert
 * @returns {Promise<Object>} The insert result
 */
const insertData = async (table, data, options = {}) => {
  try {
    const query = supabase
      .from(table)
      .insert(data);
    
    if (options.returning !== false) {
      query.select();
    }
    
    if (options.upsert) {
      query.upsert();
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`Error inserting data into ${table}:`, error);
      return { data: null, error };
    }
    
    return { data: result, error: null };
  } catch (error) {
    console.error(`Unexpected error inserting data into ${table}:`, error);
    return { data: null, error };
  }
};

/**
 * Update data in Supabase
 * @param {string} table - The table name
 * @param {Object} data - The data to update
 * @param {Object} match - The match criteria
 * @param {Object} options - Options like returning
 * @returns {Promise<Object>} The update result
 */
const updateData = async (table, data, match, options = {}) => {
  try {
    let query = supabase
      .from(table)
      .update(data);
    
    // Apply match criteria
    if (typeof match === 'object' && match !== null) {
      for (const [column, value] of Object.entries(match)) {
        query = query.eq(column, value);
      }
    }
    
    if (options.returning !== false) {
      query.select();
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`Error updating data in ${table}:`, error);
      return { data: null, error };
    }
    
    return { data: result, error: null };
  } catch (error) {
    console.error(`Unexpected error updating data in ${table}:`, error);
    return { data: null, error };
  }
};

/**
 * Delete data from Supabase
 * @param {string} table - The table name
 * @param {Object} match - The match criteria
 * @param {Object} options - Options like returning
 * @returns {Promise<Object>} The delete result
 */
const deleteData = async (table, match, options = {}) => {
  try {
    let query = supabase
      .from(table)
      .delete();
    
    // Apply match criteria
    if (typeof match === 'object' && match !== null) {
      for (const [column, value] of Object.entries(match)) {
        query = query.eq(column, value);
      }
    }
    
    if (options.returning !== false) {
      query.select();
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error(`Error deleting data from ${table}:`, error);
      return { data: null, error };
    }
    
    return { data: result, error: null };
  } catch (error) {
    console.error(`Unexpected error deleting data from ${table}:`, error);
    return { data: null, error };
  }
};

/**
 * File storage operations
 */
const storage = {
  /**
   * Upload a file to Supabase storage
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The file path in the bucket
   * @param {File|Blob|Buffer} file - The file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} The upload result
   */
  upload: async (bucket, path, file, options = {}) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert !== false,
          contentType: options.contentType,
        });
      
      if (error) {
        console.error(`Error uploading file to ${bucket}/${path}:`, error);
        return { data: null, error };
      }
      
      const publicUrl = supabase.storage.from(bucket).getPublicUrl(path);
      return { 
        data: { 
          ...data,
          publicUrl: publicUrl.data.publicUrl
        }, 
        error: null 
      };
    } catch (error) {
      console.error(`Unexpected error uploading file to ${bucket}/${path}:`, error);
      return { data: null, error };
    }
  },
  
  /**
   * Get a file's public URL
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The file path in the bucket
   * @returns {string} The public URL
   */
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
  
  /**
   * Delete a file from storage
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The file path in the bucket
   * @returns {Promise<Object>} The delete result
   */
  delete: async (bucket, path) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        console.error(`Error deleting file from ${bucket}/${path}:`, error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`Unexpected error deleting file from ${bucket}/${path}:`, error);
      return { data: null, error };
    }
  },
  
  /**
   * List files in a bucket/folder
   * @param {string} bucket - The storage bucket name
   * @param {string} path - The folder path in the bucket
   * @param {Object} options - List options
   * @returns {Promise<Object>} The list result
   */
  list: async (bucket, path = '', options = {}) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .list(path, {
          limit: options.limit,
          offset: options.offset,
          sortBy: options.sortBy,
        });
      
      if (error) {
        console.error(`Error listing files in ${bucket}/${path}:`, error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`Unexpected error listing files in ${bucket}/${path}:`, error);
      return { data: null, error };
    }
  },
};

// Export the service functions
module.exports = {
  supabase,
  testConnection,
  getData,
  insertData,
  updateData,
  deleteData,
  storage,
};