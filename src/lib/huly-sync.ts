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
        incidents: { processed: 0, created: 0, updated: 0, pushed: 0 },
        projects: { processed: 0, created: 0, updated: 0, pushed: 0 },
        resume: { processed: 0, created: 0, updated: 0, pushed: 0 }
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

        // 6. Push Unsynced Local Projects TO Huly (Main Project)
        try {
            const { data: unsyncedProjects } = await supabaseAdmin
                .from('projects')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedProjects && unsyncedProjects.length > 0) {
                for (const project of unsyncedProjects) {
                    try {
                        const tagLabels = (project.tags || []).map((t: string) => `tag:${t}`);
                        const labels = [
                            "project", 
                            "synced-from-local",
                            `demo:${project.demoLink || ''}`,
                            `repo:${project.repoLink || ''}`,
                            `image:${project.image || ''}`,
                            `order:${project.order || 0}`,
                            ...tagLabels
                        ];

                        const hulyIssue = await createHulyIssue({
                            name: "Admin",
                            email: "admin@reshinrajesh.in",
                            subject: project.title,
                            message: project.description || '',
                            category: "TASK",
                            labels,
                            projectId: mainProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('projects')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', project.id);
                            
                            syncResults.projects.pushed++;
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push project ${project.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced projects:', dbErr);
        }

        // 7. Push Unsynced Local Resume Work TO Huly (Main Project)
        try {
            const { data: unsyncedWork } = await supabaseAdmin
                .from('resume_work')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedWork && unsyncedWork.length > 0) {
                for (const work of unsyncedWork) {
                    try {
                        const badgeLabels = (work.badges || []).map((t: string) => `badge:${t}`);
                        const labels = [
                            "resume-work", 
                            "synced-from-local",
                            `company:${work.company || ''}`,
                            `start:${work.start_date || ''}`,
                            `end:${work.end_date || ''}`,
                            `link:${work.link || ''}`,
                            `order:${work.order || 0}`,
                            ...badgeLabels
                        ];

                        const hulyIssue = await createHulyIssue({
                            name: "Admin",
                            email: "admin@reshinrajesh.in",
                            subject: work.title,
                            message: work.description || '',
                            category: "TASK",
                            labels,
                            projectId: mainProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('resume_work')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', work.id);
                            
                            syncResults.resume.pushed++;
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push resume work ${work.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced resume work:', dbErr);
        }

        // 8. Push Unsynced Local Resume Ed TO Huly (Main Project)
        try {
            const { data: unsyncedEdu } = await supabaseAdmin
                .from('resume_education')
                .select('*')
                .or('huly_id.is.null,huly_id.eq.""');

            if (unsyncedEdu && unsyncedEdu.length > 0) {
                for (const edu of unsyncedEdu) {
                    try {
                        const labels = [
                            "resume-education", 
                            "synced-from-local",
                            `school:${edu.school || ''}`,
                            `start:${edu.start_date || ''}`,
                            `end:${edu.end_date || ''}`,
                            `order:${edu.order || 0}`
                        ];

                        const hulyIssue = await createHulyIssue({
                            name: "Admin",
                            email: "admin@reshinrajesh.in",
                            subject: edu.degree,
                            message: edu.school || '',
                            category: "TASK",
                            labels,
                            projectId: mainProjectId
                        });

                        if (hulyIssue) {
                            await supabaseAdmin
                                .from('resume_education')
                                .update({ huly_id: hulyIssue.id })
                                .eq('id', edu.id);
                            
                            syncResults.resume.pushed++;
                        }
                    } catch (pushErr) {
                        console.error(`Failed to push resume edu ${edu.id} to Huly:`, pushErr);
                    }
                }
            }
        } catch (dbErr) {
            console.error('Error fetching unsynced resume edu:', dbErr);
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
                    const descLabels = (issue.description || '')
                        .match(/\[LABEL:\s*([^\]]+)\]/g)
                        ?.map((m: string) => m.replace(/\[LABEL:\s*([^\]]+)\]/i, '$1').toLowerCase()) || [];
                        
                    const nativeLabels = issue.labels?.map((l: any) => l.name.toLowerCase()) || [];
                    const allLabels = [...new Set([...nativeLabels, ...descLabels])];
                    
                    // We also mock the issue.labels structure for the loops below that expect `{name: string}`
                    issue.labels = allLabels.map(l => ({ name: l }));
                    
                    const labels = allLabels;
                    
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
                    } else if (labels.includes('project')) {
                        const tags = issue.labels?.filter((l: any) => l.name.startsWith('tag:')).map((l: any) => l.name.split(/:(.+)/)[1]) || [];
                        const demoLink = issue.labels?.find((l: any) => l.name.startsWith('demo:'))?.name.split(/:(.+)/)[1] || '';
                        const repoLink = issue.labels?.find((l: any) => l.name.startsWith('repo:'))?.name.split(/:(.+)/)[1] || '';
                        const image = issue.labels?.find((l: any) => l.name.startsWith('image:'))?.name.split(/:(.+)/)[1] || '';
                        const orderLabel = parseInt(issue.labels?.find((l: any) => l.name.startsWith('order:'))?.name.split(':')[1] || '0');
                        
                        const slug = issue.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                        const projectData = {
                            title: issue.title,
                            description: issue.description || '',
                            tags,
                            "demoLink": demoLink,
                            "repoLink": repoLink,
                            image,
                            order: orderLabel,
                            slug,
                            huly_id: issue.id
                        };

                        const { data: existingProject } = await supabaseAdmin
                            .from('projects')
                            .select('id')
                            .eq('huly_id', issue.id)
                            .single();

                        if (existingProject) {
                            await supabaseAdmin.from('projects').update(projectData).eq('huly_id', issue.id);
                            syncResults.projects.updated++;
                        } else {
                            await supabaseAdmin.from('projects').insert(projectData);
                            syncResults.projects.created++;
                        }
                        syncResults.projects.processed++;

                    } else if (labels.includes('resume-work')) {
                        const company = issue.labels?.find((l: any) => l.name.startsWith('company:'))?.name.split(/:(.+)/)[1] || 'Unknown Company';
                        const startDate = issue.labels?.find((l: any) => l.name.startsWith('start:'))?.name.split(/:(.+)/)[1] || '';
                        const endDate = issue.labels?.find((l: any) => l.name.startsWith('end:'))?.name.split(/:(.+)/)[1] || '';
                        const link = issue.labels?.find((l: any) => l.name.startsWith('link:'))?.name.split(/:(.+)/)[1] || '';
                        const badges = issue.labels?.filter((l: any) => l.name.startsWith('badge:')).map((l: any) => l.name.split(/:(.+)/)[1]) || [];
                        const orderLabel = parseInt(issue.labels?.find((l: any) => l.name.startsWith('order:'))?.name.split(':')[1] || '0');

                        const workData = {
                            title: issue.title,
                            company,
                            description: issue.description || '',
                            start_date: startDate,
                            end_date: endDate,
                            link,
                            badges,
                            order: orderLabel,
                            huly_id: issue.id
                        };

                        const { data: existingWork } = await supabaseAdmin
                            .from('resume_work')
                            .select('id')
                            .eq('huly_id', issue.id)
                            .single();

                        if (existingWork) {
                            await supabaseAdmin.from('resume_work').update(workData).eq('huly_id', issue.id);
                            syncResults.resume.updated++;
                        } else {
                            await supabaseAdmin.from('resume_work').insert(workData);
                            syncResults.resume.created++;
                        }
                        syncResults.resume.processed++;

                    } else if (labels.includes('resume-education')) {
                        const school = issue.labels?.find((l: any) => l.name.startsWith('school:'))?.name.split(/:(.+)/)[1] || 'Unknown School';
                        const startDate = issue.labels?.find((l: any) => l.name.startsWith('start:'))?.name.split(/:(.+)/)[1] || '';
                        const endDate = issue.labels?.find((l: any) => l.name.startsWith('end:'))?.name.split(/:(.+)/)[1] || '';
                        const orderLabel = parseInt(issue.labels?.find((l: any) => l.name.startsWith('order:'))?.name.split(':')[1] || '0');

                        const eduData = {
                            degree: issue.title,
                            school,
                            start_date: startDate,
                            end_date: endDate,
                            order: orderLabel,
                            huly_id: issue.id
                        };

                        const { data: existingEdu } = await supabaseAdmin
                            .from('resume_education')
                            .select('id')
                            .eq('huly_id', issue.id)
                            .single();

                        if (existingEdu) {
                            await supabaseAdmin.from('resume_education').update(eduData).eq('huly_id', issue.id);
                            syncResults.resume.updated++;
                        } else {
                            await supabaseAdmin.from('resume_education').insert(eduData);
                            syncResults.resume.created++;
                        }
                        syncResults.resume.processed++;

                    } else if (labels.includes('content')) {
                        // Title of issue is the key, e.g. "bio"
                        const contentKey = issue.title.toLowerCase();
                        const contentValue = issue.description || '';

                        const { data: existingContent } = await supabaseAdmin
                            .from('site_content')
                            .select('id')
                            .eq('key', contentKey)
                            .single();

                        if (existingContent) {
                            await supabaseAdmin.from('site_content').update({ value: contentValue }).eq('key', contentKey);
                        } else {
                            await supabaseAdmin.from('site_content').insert({ key: contentKey, value: contentValue });
                        }
                    }
                } catch (err) {
                    console.error(`Error syncing issue ${issue.id} from project ${targetPid}:`, err);

                }
            }
        }
    }

    revalidatePath('/blogs');
    revalidatePath('/status');
    revalidatePath('/projects');
    revalidatePath('/resume');
    revalidatePath('/');
    revalidatePath('/admin');

    return syncResults;
}
