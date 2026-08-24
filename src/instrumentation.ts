import { SpanStatusCode, trace } from "@opentelemetry/api";
import { registerOTel } from "@vercel/otel";
import type { Instrumentation } from "next";

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "reshin-portfolio-backend";

const OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();

// `registerOTel` reads the exporter config from the standard OTLP env vars
// (endpoint, headers, protocol). With no endpoint there is nowhere to ship
// spans, so skip registration instead of instrumenting into the void.
const otelEnabled = Boolean(OTLP_ENDPOINT) && !OTLP_ENDPOINT!.includes("otlp-gateway-xxx");

export function register() {
    if (!otelEnabled) {
        console.warn("[otel] OTEL_EXPORTER_OTLP_ENDPOINT is unset or still a placeholder — backend tracing disabled.");
        return;
    }

    registerOTel({
        serviceName: SERVICE_NAME,
        attributes: {
            "service.namespace": "reshinrajesh.in",
            "service.version": process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
            "deployment.environment.name": process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
        },
        // Cloudflare proxies every request to Vercel, so the connecting peer is
        // always a Cloudflare edge IP. These headers carry the real visitor, and
        // the ray id is what ties a Grafana trace back to a Cloudflare log line.
        attributesFromHeaders: {
            "client.address": "cf-connecting-ip",
            "client.geo.country_iso_code": "cf-ipcountry",
            "cloudflare.ray_id": "cf-ray",
            "server.address": "host",
        },
    });
}

function header(headers: NodeJS.Dict<string | string[]>, name: string): string | undefined {
    const value = headers[name];

    return Array.isArray(value) ? value[0] : value;
}

// Server-side render/route/action errors that never reach the browser, so Faro
// would otherwise miss them entirely.
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
    if (!otelEnabled) {
        return;
    }

    const normalized = error instanceof Error ? error : new Error(String(error));

    const span = trace.getTracer(SERVICE_NAME).startSpan("next.request.error", {
        attributes: {
            "url.path": request.path,
            "http.request.method": request.method,
            "http.route": context.routePath,
            "next.router_kind": context.routerKind,
            "next.route_type": context.routeType,
            "next.render_source": context.renderSource,
            // Which subdomain failed, and the Cloudflare request it maps to.
            "server.address": header(request.headers, "host"),
            "cloudflare.ray_id": header(request.headers, "cf-ray"),
        },
    });

    span.recordException(normalized);
    span.setStatus({ code: SpanStatusCode.ERROR, message: normalized.message });
    span.end();
};
