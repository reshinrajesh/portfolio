import { MetadataRoute } from 'next';
import { propertyUrl } from '@/lib/navigation';

/**
 * One sitemap covers both properties. The proxy skips paths containing a dot,
 * so /sitemap.xml is served unrewritten from either host, and the cross-host
 * entry is legitimate because the properties share an owner and a domain.
 *
 * The site is two pages now, so there is nothing to query: the projects live
 * on the homepage rather than at their own URLs, and the blog is retired.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        { url: propertyUrl('www'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
        { url: propertyUrl('bio'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: propertyUrl('www', '/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];
}
