import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Ensure URL is provided and starts with http (to prevent "Invalid supabaseUrl" errors with empty or placeholder strings)
export const hasSupabase = Boolean(
  supabaseUrl && 
  supabaseUrl.trim().startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.trim() !== ''
);

export const supabase = hasSupabase ? createClient(supabaseUrl.trim(), supabaseAnonKey.trim()) : null;
