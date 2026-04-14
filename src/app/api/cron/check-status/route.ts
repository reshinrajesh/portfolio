import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createHulyIssue, updateHulyIssueStatus } from '@/lib/huly';

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

    // 1. Check Database (Supabase)
    try {
        const { error } = await supabaseAdmin.from('site_content').select('count', { count: 'exact', head: true });
        if (error) throw error;
    } catch (e: any) {
        console.error("Cron Health check error (DB):", e);
        isDbDown = true;
        dbErrorDetails = e.message || String(e);
    }

    // 3. Fetch active incidents to manage them
    let activeIncidents: any[] = [];
    try {
        const { data, error } = await supabaseAdmin
            .from('status_incidents')
            .select('*')
            .in('status', ['investigating', 'identified'])
            .order('date', { ascending: false });
            
        if (error) throw error;
        activeIncidents = data || [];
    } catch (fetchError) {
        console.error("Failed to fetch active incidents during cron:", fetchError);
        return NextResponse.json({ status: "error", message: "Failed to check existing incidents" }, { status: 500 });
    }

    const dbIncident = activeIncidents.find(i => i.title.includes("Database"));

    const results: any = { db: isDbDown ? "down" : "up" };

    // 4. Manage DB Incidents
    if (isDbDown && !dbIncident) {
        try {
            // Create Huly Task for DB outage
            const hulyTask = await createHulyIssue({
                name: "System Monitor",
                email: "noreply@reshinrajesh.in",
                subject: "CRITICAL: Database Connection Failure",
                message: `Automated monitoring has detected a database outage.\n\nError Details: ${dbErrorDetails}`,
                category: 'ALERT',
                labels: ["incident", "alert", "auto-generated"]
            });

            await supabaseAdmin.from('status_incidents').insert({
                title: "Database Connection Issues Detected",
                description: "Our automated monitoring has detected connectivity issues with the primary database. We are currently investigating the cause.",
                status: "investigating",
                date: new Date().toISOString(),
                updates: [],
                huly_id: hulyTask?.id
            });
            results.db_action = "incident_created_with_huly";
        } catch (e) { console.error("Failed to create DB incident:", e); }
    } else if (!isDbDown && dbIncident) {
        try {
            // Auto-Resolve Huly Task
            if (dbIncident.huly_id) {
                await updateHulyIssueStatus(dbIncident.huly_id, 'DONE').catch(e => console.error("Huly resolve error:", e));
            }

            await supabaseAdmin.from('status_incidents').update({
                status: "resolved",
                updates: [...(dbIncident.updates || []), {
                    id: crypto.randomUUID(),
                    status: "resolved",
                    message: "Automated monitoring reports the database connectivity has been restored. Systems are operational.",
                    date: new Date().toISOString()
                }]
            }).eq('id', dbIncident.id);
            
            results.db_action = "incident_resolved";
        } catch (e) { console.error("Failed to resolve DB incident:", e); }
    }

    return NextResponse.json({
        status: isDbDown ? "down" : "up",
        results
    });
}
