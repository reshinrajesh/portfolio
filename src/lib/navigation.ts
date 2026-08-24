/**
 * Every property below is served by this one Next app, split apart by
 * src/proxy.ts, which rewrites the path namespace per host: on blogs., "/x"
 * becomes "/blogs/x".
 *
 * That makes relative links in shared chrome actively wrong. A <Link href="/privacy">
 * in the Footer resolves to blogs.reshinrajesh.in/privacy on a blog page, which
 * the proxy rewrites to /blogs/privacy, which matches /blogs/[id] and 404s
 * looking for a post called "privacy".
 *
 * So anything that can render on more than one host links through here.
 */

export const SITE_DOMAIN = "reshinrajesh.in";

export type PropertyId = "www" | "blogs" | "gallery" | "bio" | "status";

interface Property {
    id: PropertyId;
    label: string;
    host: string;
}

export const PROPERTIES: Record<PropertyId, Property> = {
    www: { id: "www", label: "Home", host: SITE_DOMAIN },
    blogs: { id: "blogs", label: "Blogs", host: `blogs.${SITE_DOMAIN}` },
    gallery: { id: "gallery", label: "Gallery", host: `gallery.${SITE_DOMAIN}` },
    bio: { id: "bio", label: "Links", host: `bio.${SITE_DOMAIN}` },
    status: { id: "status", label: "Status", host: `status.${SITE_DOMAIN}` },
};

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

export interface NavItem {
    label: string;
    href: string;
    /** True when following this link leaves the current origin. */
    external?: boolean;
}

/**
 * The primary menu, resolved against whichever host is rendering it. Same items
 * everywhere, so the chrome no longer diverges between the portfolio and the blog.
 */
export function primaryNav(current: PropertyId): NavItem[] {
    const onHome = current === "www";

    return [
        { label: "Home", href: onHome ? "/" : propertyUrl("www"), external: !onHome },
        { label: "About", href: onHome ? "/#about" : propertyUrl("www", "/#about"), external: !onHome },
        { label: "Projects", href: onHome ? "/#projects" : propertyUrl("www", "/#projects"), external: !onHome },
        { label: "Blogs", href: current === "blogs" ? "/" : propertyUrl("blogs"), external: current !== "blogs" },
        { label: "Gallery", href: current === "gallery" ? "/" : propertyUrl("gallery"), external: current !== "gallery" },
        { label: "Contact", href: onHome ? "/#contact" : propertyUrl("www", "/#contact"), external: !onHome },
    ];
}
