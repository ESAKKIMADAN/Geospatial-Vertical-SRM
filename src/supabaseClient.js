import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yugdbcbdbiyqodhcioag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EbEz9YyN3_32yimV7hf99g_Wb9QpA23';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
