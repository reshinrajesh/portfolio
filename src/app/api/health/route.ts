import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    const status = {
        main: "operational",
        blog: "operational",
        lab: "operational",
        api: "operational",
        security: "operational",
    };

    try {
        // 1. Check Database (Supabase)
        const { error } = await supabase.from('site_content').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("Supabase health check failed:", error);
            status.blog = "degraded"; // Blog relies on DB
            status.api = "degraded";  // API might rely on DB
        }
    } catch (e) {
        console.error("Health check error:", e);
        status.blog = "degraded";
        status.api = "degraded";
    }

    // 2. Check API / Main Site (Self)
    // If this code is running, the main server is technically up.
    // We could add more sophisticated checks here if needed.

    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        services: status
    });
}
