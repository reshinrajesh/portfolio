import { supabaseAdmin } from './supabase';
import { getHulyIssues, getHulyComments, createHulyIssue } from './huly';

import { revalidatePath } from 'next/cache';

export async function performHulySync(options: { mode?: 'push-only' | 'pull-only' | 'both' } = {}) {
    const { mode = 'both' } = options;
    const mainProjectId = process.env.HULY_PROJECT_ID;

    if (!mainProjectId) {
        throw new Error('Huly Project ID not configured');
    }

    const blogProjectId = process.env.HULY_BLOG_PROJECT_ID || mainProjectId;

    const syncResults = {
        blogs: { processed: 0, created: 0, updated: 0, pushed: 0 },
        skills: { processed: 0, created: 0, updated: 0, pushed: 0 },
        incidents: { processed: 0, created: 0, updated: 0, pushed: 0 }
    };

    // --- PUSH STEPS (Skip if pull-only) ---
    if (mode === 'both' || mode === 'push-only') {
        // 3. Push Unsynced Local Incidents TO Huly (Status Project)
        try {
            const { data: unsyncedIncidents } = await supabaseAdmin
                .from('status_incidents')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedIncidents && unsyncedIncidents.length > 0) {
                for (const localInc of unsyncedIncidents) {
                    try {
                        const hulyIssue = await createHulyIssue({
                            name: "Admin (Direct Sync)",
                            email: "admin@reshinrajesh.in",
                            subject: localInc.title,
                            message: localInc.description,
                            category: "INCIDENT",
                            labels: ["incident", "synced-from-local"],
                            projectId: mainProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('status_incidents')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', localInc.id);
                            
                            syncResults.incidents.pushed++;
                            
                            // Also sync any existing local updates as comments
                            if (localInc.updates && localInc.updates.length > 0) {
                                for (const upd of localInc.updates) {
                                    if (!upd.id.startsWith('huly-')) {
                                        const { createHulyComment } = await import('./huly');
                                        await createHulyComment(hulyIssue.id, `**Local Update History:** ${upd.status}\n\n${upd.message}`);
                                    }
                                }
                            }
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push incident ${localInc.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced incidents:', dbErr);
        }

        // 4. Push Unsynced Local Blogs TO Huly (Blog Project)
        try {
            const { data: unsyncedBlogs } = await supabaseAdmin
                .from('posts')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedBlogs && unsyncedBlogs.length > 0) {
                for (const blog of unsyncedBlogs) {
                    try {
                        const hulyIssue = await createHulyIssue({
                            name: "Admin (Direct Sync)",
                            email: "admin@reshinrajesh.in",
                            subject: blog.title,
                            message: blog.content,
                            category: "TASK",
                            labels: ["blog", "synced-from-local", blog.status.toLowerCase()],
                            projectId: blogProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('posts')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', blog.id);
                            
                            syncResults.blogs.pushed++;
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push blog ${blog.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced blogs:', dbErr);
        }

        // 5. Push Unsynced Local Skills TO Huly (Status/Main Project)
        try {
            const { data: unsyncedSkills } = await supabaseAdmin
                .from('skills')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedSkills && unsyncedSkills.length > 0) {
                for (const skill of unsyncedSkills) {
                    try {
                        const hulyIssue = await createHulyIssue({
                            name: "Admin",
                            email: "admin@reshinrajesh.in",
                            subject: skill.name,
                            message: `Skill: ${skill.name}`,
                            category: "TASK",
                            labels: [
                                "skill", 
                                "synced-from-local",
                                `icon:${skill.icon || 'Code'}`,
                                `color:${skill.color || '#3b82f6'}`,
                                `order:${skill.order || 0}`
                            ],
                            projectId: mainProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('skills')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', skill.id);
                            
                            syncResults.skills.pushed++;
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push skill ${skill.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced skills:', dbErr);
        }
    }

    // --- PULL STEPS (Skip if push-only) ---
    if (mode === 'both' || mode === 'pull-only') {
        // We need to pull from BOTH projects
        const projectIdsToSync: string[] = [mainProjectId];
        if (blogProjectId && blogProjectId !== mainProjectId) {
            projectIdsToSync.push(blogProjectId);
        }

        for (const targetPid of projectIdsToSync) {
            const hulyIssues = await getHulyIssues({ 
                projectId: targetPid,
                limit: 50 
            });

            for (const issue of hulyIssues) {
                try {
                    const labels = issue.labels?.map((l: any) => l.name.toLowerCase()) || [];
                    
                    if (labels.includes('skill')) {
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
                        const statusMapping: Record<string, string> = {
                            'DONE': 'Resolved',
                            'TODO': 'Investigating',
                            'IN_PROGRESS': 'Monitoring',
                            'CANCELLED': 'Resolved',
                            'BACKLOG': 'Identified'
                        };

                        const incidentData = {
                            title: issue.title,
                            description: issue.description || '',
                            status: statusMapping[issue.status] || 'Investigating',
                            date: issue.created_at || new Date().toISOString(),
                            huly_id: issue.id
                        };

                        const hulyComments = await getHulyComments(issue.id);
                        const hulyUpdates = hulyComments.map((c: any) => ({
                            id: `huly-${c.id}`,
                            status: 'Update',
                            message: c.text,
                            date: c.created_at
                        }));

                        const { data: existingInc } = await supabaseAdmin
                            .from('status_incidents')
                            .select('id, updates')
                            .eq('huly_id', issue.id)
                            .single();

                        if (existingInc) {
                            const localUpdates = (existingInc.updates as any[]) || [];
                            const mergedUpdates = [...localUpdates];
                            
                            for (const hUpd of hulyUpdates) {
                                const exists = mergedUpdates.find(u => u.id === hUpd.id);
                                if (!exists) {
                                    mergedUpdates.push(hUpd);
                                }
                            }

                            await supabaseAdmin.from('status_incidents').update({
                                ...incidentData,
                                updates: mergedUpdates
                            }).eq('huly_id', issue.id);
                            syncResults.incidents.updated++;
                        } else {
                            await supabaseAdmin.from('status_incidents').insert({
                                ...incidentData,
                                updates: hulyUpdates
                            });
                            syncResults.incidents.created++;
                        }
                        syncResults.incidents.processed++;

                    } else if (labels.includes('blog')) {
                        const isPublished = issue.status === 'DONE' || labels.includes('published');
                        const status = isPublished ? 'Published' : 'Draft';
                        const tags = issue.labels?.filter((l: any) => !l.name.includes(':') && l.name.toLowerCase() !== 'published' && l.name.toLowerCase() !== 'blog').map((l: any) => l.name) || [];

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
                    console.error(`Error syncing issue ${issue.id} from project ${targetPid}:`, err);

                }
            }
        }
    }

    revalidatePath('/blogs');
    revalidatePath('/status');
    revalidatePath('/');
    revalidatePath('/admin');

    return syncResults;
}
