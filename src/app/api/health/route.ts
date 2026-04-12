import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";

export async function GET() {
    const status = {
        main: "operational",
        blog: "operational",
        security: "operational"
    };

    // 1. Check Database (Supabase)
    try {
        const { error } = await supabase.from('site_content').select('count', { count: 'exact', head: true });
        if (error) throw error;
    } catch (e) {
        console.error("Health check error (DB):", e);
        status.blog = "degraded";
    }

    return NextResponse.json({
        status: (status.blog === "degraded") ? "degraded" : "ok",
        timestamp: new Date().toISOString(),
        services: status
    });
}
