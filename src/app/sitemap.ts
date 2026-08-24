import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { propertyUrl } from '@/lib/navigation';

/**
 * One sitemap covers every property. The proxy skips paths containing a dot,
 * so /sitemap.xml is served unrewritten from all hosts, and cross-host entries
 * are legitimate here because the properties share an owner and a domain.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projectsRes, postsRes] = await Promise.all([
        supabase.from('projects').select('slug'),
        supabase.from('posts').select('id, updated_at').eq('status', 'Published'),
    ]);

    const now = new Date();

    const projectUrls: MetadataRoute.Sitemap = (projectsRes.data || []).map(
        (project: { slug: string }) => ({
            url: propertyUrl('www', `/projects/${project.slug}`),
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        }),
    );

    const postUrls: MetadataRoute.Sitemap = (postsRes.data || []).map(
        (post: { id: string; updated_at?: string }) => ({
            url: propertyUrl('blogs', `/${post.id}`),
            lastModified: post.updated_at ? new Date(post.updated_at) : now,
            changeFrequency: 'weekly',
            priority: 0.7,
        }),
    );

    return [
        { url: propertyUrl('www'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
        { url: propertyUrl('www', '/resume'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: propertyUrl('blogs'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: propertyUrl('gallery'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
        { url: propertyUrl('bio'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: propertyUrl('status'), lastModified: now, changeFrequency: 'daily', priority: 0.4 },
        { url: propertyUrl('www', '/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
        ...projectUrls,
        ...postUrls,
    ];
}
