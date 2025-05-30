const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://gbueiwrivnnkltrbqhfm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // shortened for safety
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // shortened for safety

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseAnonKey); // For client/user-side usage
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); // For admin-only access (server-side)

// Connection test function
const connectSupabase = async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;

    console.log("✅ Supabase connected successfully");
    return true;
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
    console.warn("⚠️ Proceeding with fallback or limited mode");
    return false;
  }
};

module.exports = {
  connectSupabase,
  supabase,
  supabaseAdmin,
};
