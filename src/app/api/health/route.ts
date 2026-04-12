import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";

export async function GET() {
    const status = {
        main: "operational",
        blog: "operational",
        security: "operational",
        sentry: "operational"
    };

    // 1. Check Database (Supabase)
    try {
        const { error } = await supabase.from('site_content').select('count', { count: 'exact', head: true });
        if (error) throw error;
    } catch (e) {
        console.error("Health check error (DB):", e);
        status.blog = "degraded";
    }

    // 2. Check Sentry (Self-hosted)
    try {
        const sentryRes = await fetch("https://sentry.reshinrajesh.in", { signal: AbortSignal.timeout(3000) });
        if (!sentryRes.ok && sentryRes.status >= 500) {
            status.sentry = "degraded";
        }
    } catch (e) {
        status.sentry = "outage";
    }

    return NextResponse.json({
        status: (status.blog === "degraded" || status.sentry === "outage") ? "degraded" : "ok",
        timestamp: new Date().toISOString(),
        services: status
    });
}
