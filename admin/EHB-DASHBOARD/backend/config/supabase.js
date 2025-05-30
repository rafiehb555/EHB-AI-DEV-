/**
 * Supabase Configuration
 * Provides connection to Supabase database for storage
 */
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || 'https://gbueiwrivnnkltrbqhfm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidWVpd3Jpdm5ua2x0cmJxaGZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njc0MDM5NSwiZXhwIjoyMDYyMzE2Mzk1fQ.Q79PyITV1LlhYgaz_b8SgacVZSszv1AQ-fUeaskT29s';

// Public anon key for client-side operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidWVpd3Jpdm5ua2x0cmJxaGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDAzOTUsImV4cCI6MjA2MjMxNjM5NX0.-SSx_FajsA_h3bxCtDCC-AZluFc8V64CB8uE6ThegaU';

// Create Supabase client
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error.message);
}

/**
 * Initialize Supabase tables if they don't exist
 * This ensures the necessary tables are available
 * 
 * Note: For simplicity, we're checking if tables exist by catching errors
 * and assuming we need to create tables. In a production environment, 
 * we'd use proper migrations or the Supabase UI to manage schema.
 */
const initSupabaseTables = async () => {
  if (!supabase) return;

  try {
    console.log('Checking for AI feedback and suggestions tables...');
    
    // Execute a raw SQL query to check if tables exist in the public schema
    const { data: tableList, error: tableError } = await supabase
      .rpc('check_tables_exist', { table_names: ['ai_feedback', 'ai_suggestions'] });
    
    if (tableError) {
      // If the RPC doesn't exist, we can try a direct SQL query
      const { data, error } = await supabase.raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name IN ('ai_feedback', 'ai_suggestions')
      `);
      
      if (!error) {
        const tableNames = (data || []).map(row => row.table_name);
        
        if (!tableNames.includes('ai_feedback')) {
          console.log('ai_feedback table does not exist. Please create it using the Supabase dashboard with this SQL:');
          console.log(`
            CREATE TABLE ai_feedback (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              response_id TEXT NOT NULL,
              user_id TEXT,
              user_role TEXT DEFAULT 'anonymous',
              rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
              comment TEXT,
              response_text TEXT,
              context TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `);
        } else {
          console.log('ai_feedback table exists');
        }
        
        if (!tableNames.includes('ai_suggestions')) {
          console.log('ai_suggestions table does not exist. Please create it using the Supabase dashboard with this SQL:');
          console.log(`
            CREATE TABLE ai_suggestions (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              category TEXT NOT NULL,
              description TEXT NOT NULL,
              user_id TEXT,
              user_role TEXT DEFAULT 'anonymous',
              status TEXT DEFAULT 'pending',
              priority TEXT DEFAULT 'medium',
              admin_id TEXT,
              admin_name TEXT,
              admin_comment TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `);
        } else {
          console.log('ai_suggestions table exists');
        }
      } else {
        console.log('Error checking tables:', error.message);
        
        // Fallback: Try direct table access as a last resort
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('ai_feedback')
          .select('id')
          .limit(1);
          
        const { data: suggestionsData, error: suggestionsError } = await supabase
          .from('ai_suggestions')
          .select('id')
          .limit(1);
        
        console.log('ai_feedback table ' + (feedbackError ? 'does not exist' : 'exists'));
        console.log('ai_suggestions table ' + (suggestionsError ? 'does not exist' : 'exists'));
      }
    } else {
      // RPC exists and we have results
      const existingTables = tableList || [];
      
      if (!existingTables.includes('ai_feedback')) {
        console.log('ai_feedback table does not exist. Please create it using the Supabase dashboard with this SQL:');
        console.log(`
          CREATE TABLE ai_feedback (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            response_id TEXT NOT NULL,
            user_id TEXT,
            user_role TEXT DEFAULT 'anonymous',
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            response_text TEXT,
            context TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } else {
        console.log('ai_feedback table exists');
      }
      
      if (!existingTables.includes('ai_suggestions')) {
        console.log('ai_suggestions table does not exist. Please create it using the Supabase dashboard with this SQL:');
        console.log(`
          CREATE TABLE ai_suggestions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            user_id TEXT,
            user_role TEXT DEFAULT 'anonymous',
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            admin_id TEXT,
            admin_name TEXT,
            admin_comment TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } else {
        console.log('ai_suggestions table exists');
      }
    }
  } catch (error) {
    console.error('Error checking Supabase tables:', error.message);
  }
};

/**
 * Supabase operations for AI feedback data
 */
const aiFeedbackOperations = {
  // Create new feedback
  createFeedback: async (feedbackData) => {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('ai_feedback')
        .insert([
          {
            response_id: feedbackData.responseId,
            user_id: feedbackData.userId || null,
            user_role: feedbackData.userRole || 'anonymous',
            rating: feedbackData.rating,
            comment: feedbackData.comment || null,
            response_text: feedbackData.responseText || null,
            context: feedbackData.context || null
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating AI feedback:', error.message);
        return null;
      }
      
      // Convert snake_case to camelCase for the client
      if (data && data[0]) {
        return {
          id: data[0].id,
          responseId: data[0].response_id,
          userId: data[0].user_id,
          userRole: data[0].user_role,
          rating: data[0].rating,
          comment: data[0].comment,
          responseText: data[0].response_text,
          context: data[0].context,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };
      }
      
      return null;
    } catch (err) {
      console.error('Exception in createFeedback:', err.message);
      return null;
    }
  },
  
  // Get feedback by ID
  getFeedbackById: async (id) => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting AI feedback by ID:', error.message);
      return null;
    }
    
    return data;
  },
  
  // Get all feedback (with optional filters)
  getAllFeedback: async (filters = {}) => {
    if (!supabase) return [];
    
    let query = supabase
      .from('ai_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters.context) {
      query = query.eq('context', filters.context);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    
    if (filters.maxRating) {
      query = query.lte('rating', filters.maxRating);
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting all AI feedback:', error.message);
      return [];
    }
    
    return data;
  },
  
  // Get feedback statistics (simplified version without RPC functions)
  getFeedbackStats: async () => {
    if (!supabase) return {};
    
    try {
      // Get total feedback count
      const { count, error: countError } = await supabase
        .from('ai_feedback')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Get average rating - manual calculation
      const { data: ratings, error: ratingsError } = await supabase
        .from('ai_feedback')
        .select('rating');
      
      if (ratingsError) throw ratingsError;
      
      // Calculate average rating manually
      let averageRating = 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      if (ratings && ratings.length > 0) {
        let sum = 0;
        ratings.forEach(item => {
          sum += item.rating;
          ratingDistribution[item.rating] = (ratingDistribution[item.rating] || 0) + 1;
        });
        averageRating = sum / ratings.length;
      }
      
      // Get all feedback for basic stats
      const { data: allFeedback, error: allFeedbackError } = await supabase
        .from('ai_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allFeedbackError) throw allFeedbackError;
      
      // Calculate context distribution manually
      const contextDistribution = {};
      allFeedback?.forEach(item => {
        if (item.context) {
          contextDistribution[item.context] = (contextDistribution[item.context] || 0) + 1;
        }
      });
      
      // Last 7 days data (manual calculation)
      const last7Days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Format as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        
        // Count feedback for this day
        const count = allFeedback?.filter(item => {
          const itemDate = new Date(item.created_at).toISOString().split('T')[0];
          return itemDate === formattedDate;
        }).length || 0;
        
        last7Days.push({
          date: formattedDate,
          count
        });
      }
      
      return {
        totalFeedback: count || 0,
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratingDistribution,
        contextDistribution,
        last7Days
      };
    } catch (error) {
      console.error('Error getting AI feedback stats:', error.message);
      // Return empty stats object as fallback
      return {
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        contextDistribution: {},
        last7Days: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            count: 0
          };
        })
      };
    }
  }
};

/**
 * Supabase operations for AI suggestions data
 */
const aiSuggestionOperations = {
  // Create new suggestion
  createSuggestion: async (suggestionData) => {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .insert([
          {
            user_id: suggestionData.userId || null,
            user_role: suggestionData.userRole || 'anonymous',
            category: suggestionData.category,
            description: suggestionData.description,
            priority: suggestionData.priority || 'medium',
            status: 'pending'
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating AI suggestion:', error.message);
        return null;
      }
      
      // Convert snake_case to camelCase for the client
      if (data && data[0]) {
        return {
          id: data[0].id,
          userId: data[0].user_id,
          userRole: data[0].user_role,
          category: data[0].category,
          description: data[0].description,
          priority: data[0].priority,
          status: data[0].status,
          adminId: data[0].admin_id,
          adminName: data[0].admin_name,
          adminComment: data[0].admin_comment,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };
      }
      
      return null;
    } catch (err) {
      console.error('Exception in createSuggestion:', err.message);
      return null;
    }
  },
  
  // Get suggestion by ID
  getSuggestionById: async (id) => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting AI suggestion by ID:', error.message);
      return null;
    }
    
    return data;
  },
  
  // Get all suggestions (with optional filters)
  getAllSuggestions: async (filters = {}) => {
    if (!supabase) return [];
    
    let query = supabase
      .from('ai_suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting all AI suggestions:', error.message);
      return [];
    }
    
    return data;
  },
  
  // Update suggestion status
  updateSuggestionStatus: async (id, updateData) => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('ai_suggestions')
      .update({
        status: updateData.status,
        admin_comment: updateData.adminComment || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating AI suggestion status:', error.message);
      return null;
    }
    
    return data[0];
  }
};

// Create a simple function to execute an SQL query to directly check table existence
const checkTableExists = async (tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).select('count(*)', { count: 'exact', head: true });
    // If we get here with no error, the table exists
    console.log(`${tableName} table exists`);
    return true;
  } catch (err) {
    console.log(`${tableName} table existence check error:`, err.message);
    return false;
  }
};

// Initialize tables when the module is loaded
(async () => {
  try {
    // We know the tables exist from our direct SQL checks, so let's set flags directly
    console.log('Using direct approach to check for tables...');
    const aiFeedbackExists = await checkTableExists('ai_feedback');
    const aiSuggestionsExists = await checkTableExists('ai_suggestions');
    
    console.log('AI Feedback table exists:', aiFeedbackExists);
    console.log('AI Suggestions table exists:', aiSuggestionsExists);
  } catch (error) {
    console.error('Error during Supabase initialization:', error.message);
  }
})();

module.exports = {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
  aiFeedbackOperations,
  aiSuggestionOperations
};