import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    const url = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || url.searchParams.get('token');

    // Secure the route: only allow requests with the correct token
    if (token !== process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    let isDbDown = false;
    let dbErrorDetails = "";

    try {
        // 1. Check Database (Supabase)
        const { error } = await supabase.from('site_content').select('count', { count: 'exact', head: true });

        if (error) {
            console.error("Cron Health check failed (Supabase):", error);
            isDbDown = true;
            dbErrorDetails = error.message;
        }
    } catch (e: any) {
        console.error("Cron Health check error:", e);
        isDbDown = true;
        dbErrorDetails = e.message || String(e);
    }

    // 2. Check existing incidents to avoid spamming
    // We look for an incident that is currently 'investigating' or 'identified' related to DB downtime
    const { data: existingIncidents, error: fetchError } = await supabase
        .from('status_incidents')
        .select('*')
        .in('status', ['investigating', 'identified'])
        .order('date', { ascending: false })
        .limit(1);

    if (fetchError) {
        console.error("Failed to fetch existing incidents during cron:", fetchError);
        return NextResponse.json({ status: "error", message: "Failed to check existing incidents" }, { status: 500 });
    }

    const hasActiveIncident = existingIncidents && existingIncidents.length > 0;
    const activeIncident = hasActiveIncident ? existingIncidents[0] : null;

    if (isDbDown) {
        // If DB is down and there's NO active incident, create one
        if (!hasActiveIncident) {
            const newIncident = {
                title: "Database Connection Issues Detected",
                description: "Our automated monitoring has detected connectivity issues with the primary database. We are currently investigating the cause.",
                status: "investigating",
                date: new Date().toISOString(),
                updates: []
            };

            const { error: insertError } = await supabase
                .from('status_incidents')
                .insert([newIncident]);

            if (insertError) {
                console.error("Failed to auto-create incident:", insertError);
                return NextResponse.json({ status: "error", message: "Failed to create incident" }, { status: 500 });
            }

            return NextResponse.json({
                status: "down",
                message: "Downtime detected, new incident created.",
                details: dbErrorDetails
            });
        } else {
            // Already tracking it, do nothing or optionally add an update if it's been a while
            return NextResponse.json({
                status: "down",
                message: "Downtime detected, incident already active.",
                incidentId: activeIncident.id
            });
        }
    } else {
        // If DB is UP
        if (hasActiveIncident) {
            // If DB is up but we have an active incident open from earlier, auto-resolve it
            const resolutionUpdate = {
                id: crypto.randomUUID(),
                status: "resolved",
                message: "Automated monitoring reports the database connectivity has been restored. Systems are operational.",
                date: new Date().toISOString()
            };

            const updatedUpdates = [...(activeIncident.updates || []), resolutionUpdate];

            const { error: resolveError } = await supabase
                .from('status_incidents')
                .update({
                    status: "resolved",
                    updates: updatedUpdates
                })
                .eq('id', activeIncident.id);

            if (resolveError) {
                console.error("Failed to auto-resolve incident:", resolveError);
                return NextResponse.json({ status: "error", message: "Failed to resolve incident" }, { status: 500 });
            }

            return NextResponse.json({
                status: "up",
                message: "Services restored, incident auto-resolved.",
                incidentId: activeIncident.id
            });
        }

        // All good, no active incident
        return NextResponse.json({
            status: "up",
            message: "All systems operational."
        });
    }
}
