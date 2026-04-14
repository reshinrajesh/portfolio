import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
    console.warn("WARNING: SUPABASE_URL is missing during build time!");
}

// Standard client for public/authenticated user interactions
export const supabase = supabaseUrl 
    ? createClient(supabaseUrl, supabaseKey || "dummy")
    : { from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }), order: () => ({ data: [] }) }) }) } as any;

// Admin client for server-side logic that needs to bypass RLS (NOC, Auth management, etc.)
export const supabaseAdmin = supabaseUrl 
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseKey || "dummy", {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : { from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }), order: () => ({ data: [] }), or: () => ({ data: [] }) }), insert: () => ({}), update: () => ({}) }) } as any;
