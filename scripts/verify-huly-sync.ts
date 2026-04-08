import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    console.log("Verifying huly_id column presence...");
    
    // Check 'posts'
    const { data, error } = await supabase
        .from('posts')
        .select('huly_id')
        .limit(1);

    if (error) {
        console.error("❌ Column check failed for 'posts':", error.message);
    } else {
        console.log("✅ 'huly_id' column found in 'posts'");
    }

    // Check 'skills'
    const { error: skillError } = await supabase
        .from('skills')
        .select('huly_id')
        .limit(1);

    if (skillError) {
        console.error("❌ Column check failed for 'skills':", skillError.message);
    } else {
        console.log("✅ 'huly_id' column found in 'skills'");
    }
}

verify();
