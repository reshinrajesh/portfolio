/**
 * The domain, written down once.
 *
 * It used to be written down three times -- as SITE_DOMAIN in lib/navigation,
 * again as a private copy in lib/faro, and a third time as an OpenTelemetry
 * namespace in instrumentation -- plus twice more as the contact address, in
 * content/profile and lib/socials, and once more hardcoded into the
 * `metadataBase` in app/layout. A rename meant finding seven files, and the
 * sitemap, the social card and the trace-propagation allowlist each had their
 * own chance to be left behind.
 *
 * Changing the line below is now the entire code-side move from one domain to
 * another. Everything else derives from it.
 */

export const SITE_DOMAIN = "reshinrajesh.in";

/**
 * The mailbox the site publishes. The local part is stable across domains, so
 * only the host half moves.
 */
export const CONTACT_EMAIL = `connect@${SITE_DOMAIN}`;

/**
 * Matches `https://` origins belonging to the site, at the apex or on any
 * subdomain. Faro uses it to decide which requests may carry a `traceparent`
 * header -- sending one to a third party whose CORS policy rejects the header
 * turns every such request into a failed preflight.
 *
 * Built here rather than written out at the call site because the dots have to
 * be escaped twice over: once for the regex, and once more to survive the
 * string literal carrying it. A single backslash silently collapses to a bare
 * `.`, which matches any character, and a lookalike host would then be treated
 * as ours.
 */
export function siteOriginPattern(): RegExp {
    const host = SITE_DOMAIN.replace(/\./g, String.raw`\.`);

    return new RegExp(String.raw`^https://([a-z0-9-]+\.)*` + host);
}
