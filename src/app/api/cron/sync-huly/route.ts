import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getHulyIssues } from '@/lib/huly';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const hulyProjectId = process.env.HULY_BLOG_PROJECT_ID || process.env.HULY_PROJECT_ID;
        
        if (!hulyProjectId) {
            return NextResponse.json({ error: 'Huly Project ID not configured' }, { status: 400 });
        }

        // 1. Fetch Issues from Huly
        const hulyIssues = await getHulyIssues({ 
            projectId: hulyProjectId,
            limit: 50 
        });

        const syncResults = {
            blogs: { processed: 0, created: 0, updated: 0 },
            skills: { processed: 0, created: 0, updated: 0 },
            incidents: { processed: 0, created: 0, updated: 0 }
        };

        // 2. Sync Items
        for (const issue of hulyIssues) {
            try {
                const labels = issue.labels?.map((l: any) => l.name.toLowerCase()) || [];
                
                if (labels.includes('skill')) {
                    // --- SYNC SKILL ---
                    const iconLabel = issue.labels?.find((l: any) => l.name.startsWith('icon:'))?.name.split(':')[1] || 'Code';
                    const colorLabel = issue.labels?.find((l: any) => l.name.startsWith('color:'))?.name.split(':')[1] || '#3b82f6';
                    const orderLabel = parseInt(issue.labels?.find((l: any) => l.name.startsWith('order:'))?.name.split(':')[1] || '0');

                    const skillData = {
                        name: issue.title,
                        icon: iconLabel,
                        color: colorLabel,
                        order: orderLabel,
                        huly_id: issue.id
                    };

                    const { data: existingSkill } = await supabaseAdmin
                        .from('skills')
                        .select('id')
                        .eq('huly_id', issue.id)
                        .single();

                    if (existingSkill) {
                        await supabaseAdmin.from('skills').update(skillData).eq('huly_id', issue.id);
                        syncResults.skills.updated++;
                    } else {
                        await supabaseAdmin.from('skills').insert(skillData);
                        syncResults.skills.created++;
                    }
                    syncResults.skills.processed++;
                } else if (labels.includes('incident') || labels.includes('alert')) {
                    // --- SYNC INCIDENT ---
                    const statusMapping: Record<string, string> = {
                        'DONE': 'Resolved',
                        'TODO': 'Identified',
                        'IN_PROGRESS': 'Investigating',
                        'CANCELLED': 'Resolved'
                    };

                    const incidentData = {
                        title: issue.title,
                        description: issue.description || '',
                        status: statusMapping[issue.status] || 'Identified',
                        date: issue.created_at || new Date().toISOString(),
                        huly_id: issue.id,
                        updates: [] // We could potentially pull comments as updates later
                    };

                    const { data: existingInc } = await supabaseAdmin
                        .from('status_incidents')
                        .select('id')
                        .eq('huly_id', issue.id)
                        .single();

                    if (existingInc) {
                        await supabaseAdmin.from('status_incidents').update(incidentData).eq('huly_id', issue.id);
                        syncResults.incidents.updated++;
                    } else {
                        await supabaseAdmin.from('status_incidents').insert(incidentData);
                        syncResults.incidents.created++;
                    }
                    syncResults.incidents.processed++;

                } else {
                    // --- SYNC BLOG ---
                    const isPublished = issue.status === 'DONE' || labels.includes('published');
                    const status = isPublished ? 'Published' : 'Draft';
                    const tags = issue.labels?.filter((l: any) => !l.name.includes(':') && l.name.toLowerCase() !== 'published').map((l: any) => l.name) || [];

                    const postData = {
                        title: issue.title,
                        content: issue.description || '',
                        status,
                        tags,
                        updated_at: issue.updated_at || new Date().toISOString(),
                        huly_id: issue.id, 
                    };

                    const { data: existingPost } = await supabaseAdmin
                        .from('posts')
                        .select('id')
                        .eq('huly_id', issue.id)
                        .single();

                    if (existingPost) {
                        await supabaseAdmin.from('posts').update(postData).eq('huly_id', issue.id);
                        syncResults.blogs.updated++;
                    } else {
                        await supabaseAdmin.from('posts').insert({
                            ...postData,
                            created_at: issue.created_at || new Date().toISOString(),
                            view_count: 0
                        });
                        syncResults.blogs.created++;
                    }
                    syncResults.blogs.processed++;
                }
            } catch (err) {
                console.error(`Error syncing issue ${issue.id}:`, err);
                Sentry.captureException(err, { extra: { huly_id: issue.id } });
            }
        }

        revalidatePath('/blogs');
        revalidatePath('/status');
        revalidatePath('/');
        revalidatePath('/admin');

        return NextResponse.json({ 
            success: true, 
            message: 'Huly sync completed',
            results: syncResults
        });

    } catch (error: any) {
        console.error('Huly Sync Error:', error);
        Sentry.captureException(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
