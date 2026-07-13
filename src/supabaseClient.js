// Supabase client initialization wrapper
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mkcxpxicqlqojxlizuwk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rY3hweGljcWxxb2p4bGl6dXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDYzNzksImV4cCI6MjA5ODYyMjM3OX0.O1m4d9trj3tbq7tOjbjwpQw3oO5rgRVxq2TBRitgJg4';

let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn(
    'Supabase credentials not configured yet or still set to placeholder values. ' +
    'The application will fall back to using the local mock database storage.'
  );
}

export { supabase };
