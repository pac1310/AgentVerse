import { createClient } from '@supabase/supabase-js';

// Provide default fallback values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGFiYXNlLWpzLXYyLXRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjY2ODU2MiwiZXhwIjoxOTUyMjQ0NTYyfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcT-ZE3kjrYgk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);