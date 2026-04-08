import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";

export async function GET() {
    const status = {
        main: "operational",
        blog: "operational",
        security: "operational",
        huly: "operational"
    };

    // 1. Check Database (Supabase)
    try {
        const { error } = await supabase.from('site_content').select('count', { count: 'exact', head: true });
        if (error) throw error;
    } catch (e) {
        console.error("Health check error (DB):", e);
        status.blog = "degraded";
    }

    // 2. Check Huly (External & Direct)
    const HULY_URL = process.env.HULY_INSTANCE_URL || 'https://huly.reshinrajesh.in';
    const HULY_IP = process.env.HULY_ORIGIN_IP;
    
    let domainOk = false;
    let ipOk = false;

    // Check Cloudflare Domain
    try {
        const hulyRes = await fetch(HULY_URL, { signal: AbortSignal.timeout(3000) });
        domainOk = hulyRes.ok;
    } catch (e) {
        domainOk = false;
    }

    // Check Direct IP (if provided)
    if (HULY_IP) {
        try {
            const ipRes = await fetch(`http://${HULY_IP}`, { signal: AbortSignal.timeout(3000) });
            ipOk = ipRes.ok || ipRes.status === 404 || ipRes.status === 403;
        } catch (e) {
            ipOk = false;
        }
    } else {
        ipOk = domainOk;
    }

    if (!domainOk) {
        if (ipOk && HULY_IP) {
            status.huly = "degraded"; // Origin UP, Cloudflare DOWN
        } else {
            status.huly = "outage"; // Both DOWN
        }
    } else {
        status.huly = "operational";
    }

    return NextResponse.json({
        status: (status.blog === "degraded" || status.huly === "degraded") ? "degraded" : "ok",
        timestamp: new Date().toISOString(),
        services: status
    });
}
