import { MetadataRoute } from 'next';
import { propertyUrl } from '@/lib/navigation';

/**
 * Two URLs, because that is the whole site: the homepage carries the projects
 * and the work history inline rather than giving either its own route, and
 * every other property has been retired.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        { url: propertyUrl('www'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
        { url: propertyUrl('www', '/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];
}
