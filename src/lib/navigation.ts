/**
 * The site is one property now.
 *
 * This module used to exist because five hosts shared one Next app and shared
 * chrome rendered on all of them, so a relative <Link href="/privacy"> resolved
 * against whichever subdomain was rendering it and 404'd. With only
 * reshinrajesh.in left, that hazard is gone, but the helpers stay: the social
 * card, the sitemap and the proxy all need absolute URLs, and RETIRED_HOSTS is
 * what keeps the dead subdomains from 404ing.
 */

export const SITE_DOMAIN = "reshinrajesh.in";

export type PropertyId = "www";

interface Property {
    id: PropertyId;
    label: string;
    host: string;
}

export const PROPERTIES: Record<PropertyId, Property> = {
    www: { id: "www", label: "Home", host: SITE_DOMAIN },
};

/**
 * Hosts the site used to serve and no longer does. The proxy sends these home
 * rather than letting them 404: the subdomains stay pointed at this app, and a
 * visitor with an old bookmark should land somewhere real.
 */
export const RETIRED_HOSTS = [
    "blogs.",
    "gallery.",
    "status.",
    "demo.",
    "admin.",
    "bio.",
] as const;

/** Absolute URL for a path on the site. */
export function propertyUrl(id: PropertyId = "www", path = "/"): string {
    const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

    return `https://${PROPERTIES[id].host}${suffix}`;
}
