import {
    faro,
    getWebInstrumentations,
    initializeFaro,
    type Faro,
    type MetaUser,
    type TransportItem,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

const COLLECTOR_URL = process.env.NEXT_PUBLIC_FARO_URL;
const APP_NAME = process.env.NEXT_PUBLIC_FARO_APP_NAME || "reshin-portfolio";

// Vercel exposes the commit SHA to the browser bundle, so a release in Grafana
// maps back to an exact deploy. Local dev has neither, hence the "dev" marker.
const APP_VERSION =
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
    "dev";

const APP_ENVIRONMENT =
    process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development";

// The env template ships with placeholders; treat those as "not configured"
// rather than firing beacons at a URL that will 404 on every page view.
const PLACEHOLDER_MARKERS = ["your-faro-collector-url", "<COLLECTOR_URL>"];

// Third-party scripts we embed but do not own. Their failures are not our signal.
const IGNORED_URLS: Array<string | RegExp> = [
    /googlesyndication\.com/,
    /doubleclick\.net/,
    /google-analytics\.com/,
    /\/_vercel\/(insights|speed-insights)/,
];

const IGNORED_ERRORS: Array<string | RegExp> = [
    /ResizeObserver loop/,
    /^Script error\.?$/,
    /adsbygoogle/i,
];

// Only our own origins get a `traceparent` header. Sending it to a third party
// whose CORS policy does not allow the header turns every such request into a
// failed preflight.
const TRACE_PROPAGATION_URLS: Array<string | RegExp> = [
    /^https:\/\/([a-z0-9-]+\.)*reshinrajesh\.in/,
    /^https:\/\/([a-z0-9-]+\.)*vercel\.app/,
];

// Auth material that regularly shows up in URLs (NextAuth callbacks, magic links).
const SENSITIVE_QUERY_PARAMS = [
    "code",
    "token",
    "access_token",
    "refresh_token",
    "state",
    "email",
    "callbackUrl",
];

let initialized = false;

// Every subdomain (admin., blogs., bio., gallery., status., demo.) is rewritten
// out of this single app by src/proxy.ts, so a browser pathname on its own is
// ambiguous - "/" is six different pages. The host is what disambiguates it.
const SITE_DOMAIN = "reshinrajesh.in";

function siteLabel(hostname: string): string {
    if (hostname === "localhost" || hostname.startsWith("127.")) {
        return "local";
    }

    if (!hostname.endsWith(SITE_DOMAIN)) {
        return hostname;
    }

    const subdomain = hostname.slice(0, -SITE_DOMAIN.length).replace(/\.$/, "");

    return subdomain === "" || subdomain === "www" ? "www" : subdomain;
}


function isConfigured(url: string | undefined): url is string {
    return Boolean(url?.trim()) && !PLACEHOLDER_MARKERS.some((marker) => url!.includes(marker));
}

function redactUrl(rawUrl: string): string {
    try {
        const url = new URL(rawUrl, window.location.origin);
        let redacted = false;

        for (const param of SENSITIVE_QUERY_PARAMS) {
            if (url.searchParams.has(param)) {
                url.searchParams.set(param, "[redacted]");
                redacted = true;
            }
        }

        return redacted ? url.toString() : rawUrl;
    } catch {
        return rawUrl;
    }
}

function beforeSend(item: TransportItem): TransportItem | null {
    const page = item.meta.page;

    if (!page?.url) {
        return item;
    }

    const url = redactUrl(page.url);

    return url === page.url
        ? item
        : { ...item, meta: { ...item.meta, page: { ...page, url } } };
}

/**
 * Initializes Faro once per page load. Safe to call repeatedly: React Strict
 * Mode runs effects twice in development and a second init would throw.
 */
export function initFaro(): Faro | undefined {
    if (typeof window === "undefined" || initialized || faro.api) {
        return undefined;
    }

    if (!isConfigured(COLLECTOR_URL)) {
        if (APP_ENVIRONMENT !== "production") {
            console.warn("[faro] NEXT_PUBLIC_FARO_URL is unset or still a placeholder — client telemetry disabled.");
        }
        return undefined;
    }

    initialized = true;

    try {
        return initializeFaro({
            url: COLLECTOR_URL,
            app: {
                name: APP_NAME,
                namespace: siteLabel(window.location.hostname),
                version: APP_VERSION,
                environment: APP_ENVIRONMENT,
            },
            ignoreUrls: IGNORED_URLS,
            ignoreErrors: IGNORED_ERRORS,
            sessionTracking: {
                enabled: true,
                persistent: true,
            },
            experimental: {
                trackNavigation: true,
            },
            beforeSend,
            instrumentations: [
                ...getWebInstrumentations({ captureConsole: true }),
                new TracingInstrumentation({
                    instrumentationOptions: {
                        propagateTraceHeaderCorsUrls: TRACE_PROPAGATION_URLS,
                    },
                }),
            ],
        });
    } catch (error) {
        initialized = false;
        // Observability must never be the thing that breaks the page.
        console.warn("[faro] initialization failed — continuing without client telemetry", error);
        return undefined;
    }
}

export function isFaroActive(): boolean {
    return Boolean(faro.api);
}

/**
 * Records a client-side route change as both a view and a page. The view name
 * is host-qualified because the subdomain, not the path, is what identifies the
 * section of the site.
 */
export function setFaroRoute(pathname: string): void {
    if (!faro.api) {
        return;
    }

    faro.api.setView({ name: `${siteLabel(window.location.hostname)}:${pathname}` });
    faro.api.setPage({ url: `${window.location.origin}${pathname}` });
}

/**
 * Attaches (or clears) the signed-in admin. The email is deliberately left out
 * of telemetry — the id and username are enough to correlate a session.
 */
export function setFaroUser(user: { id?: string | null; name?: string | null } | null): void {
    if (!faro.api) {
        return;
    }

    if (!user) {
        faro.api.resetUser();
        return;
    }

    const meta: MetaUser = {
        id: user.id ?? undefined,
        username: user.name ?? undefined,
        roles: "admin",
    };

    faro.api.setUser(meta);
}
