import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Standard client for public/authenticated user interactions
export const supabase = supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null as any;

// Admin client for server-side logic that needs to bypass RLS (NOC, Auth management, etc.)
export const supabaseAdmin = supabaseUrl && (supabaseServiceKey || supabaseKey)
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null as any;
