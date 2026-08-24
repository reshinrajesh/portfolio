export type ServiceState = "operational" | "degraded" | "outage" | "maintenance";

interface StatePresentation {
    label: string;
    badge: string;
    dot: string;
}

/**
 * Single source of truth for how a service state is rendered. Previously each
 * call site re-derived this inline with a two-branch ternary, which silently
 * painted "maintenance" as an outage.
 */
export const SERVICE_STATE: Record<ServiceState, StatePresentation> = {
    operational: {
        label: "Operational",
        badge: "bg-console-ok/10 text-console-ok",
        dot: "bg-console-ok",
    },
    degraded: {
        label: "Degraded",
        badge: "bg-console-warn/10 text-console-warn",
        dot: "bg-console-warn",
    },
    outage: {
        label: "Outage",
        badge: "bg-console-down/10 text-console-down",
        dot: "bg-console-down",
    },
    maintenance: {
        label: "Maintenance",
        badge: "bg-console-info/10 text-console-info",
        dot: "bg-console-info",
    },
};

export function serviceState(status: string): StatePresentation {
    return SERVICE_STATE[status as ServiceState] ?? SERVICE_STATE.outage;
}
