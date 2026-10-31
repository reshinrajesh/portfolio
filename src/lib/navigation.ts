/**
 * The site is two public properties served by one Next app and split apart by
 * src/proxy.ts, which rewrites the path namespace per host: on bio., "/" becomes
 * "/bio".
 *
 * That makes relative links in shared chrome actively wrong. A <Link href="/privacy">
 * in the footer resolves to bio.reshinrajesh.in/privacy on the links page, which
 * the proxy rewrites to /bio/privacy, which does not exist.
 *
 * So anything that can render on more than one host links through here.
 */

export const SITE_DOMAIN = "reshinrajesh.in";

export type PropertyId = "www" | "bio";

interface Property {
    id: PropertyId;
    label: string;
    host: string;
}

export const PROPERTIES: Record<PropertyId, Property> = {
    www: { id: "www", label: "Home", host: SITE_DOMAIN },
    bio: { id: "bio", label: "Links", host: `bio.${SITE_DOMAIN}` },
};

/**
 * Hosts the site used to serve and no longer does. The proxy sends these home
 * rather than letting them 404: the subdomains stay pointed at this app, and a
 * visitor with an old bookmark should land somewhere real.
 */
export const RETIRED_HOSTS = ["blogs.", "gallery.", "status.", "demo.", "admin."] as const;

/** Absolute URL for a path on one of the properties. */
export function propertyUrl(id: PropertyId, path = "/"): string {
    const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

    return `https://${PROPERTIES[id].host}${suffix}`;
}

/** Which property a host belongs to. Falls back to www for previews and localhost. */
export function propertyFromHost(host: string | null | undefined): PropertyId {
    if (!host) {
        return "www";
    }

    const hostname = host.split(":")[0].toLowerCase();

    for (const property of Object.values(PROPERTIES)) {
        if (property.id !== "www" && hostname === property.host) {
            return property.id;
        }
    }

    return "www";
}
