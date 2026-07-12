import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("No credentials in .env");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    const { data, error } = await supabase.from('guests').select('*').limit(1);
    if (error) {
      console.log("Error selecting from guests table:", error.message);
      if (error.message.includes("relation") || error.message.includes("does not exist")) {
        console.log("GUESTS_TABLE_DOES_NOT_EXIST");
      }
    } else {
      console.log("GUESTS_TABLE_EXISTS", data);
    }
  } catch (e) {
    console.log("Exception:", e.message);
  }
}
check();
