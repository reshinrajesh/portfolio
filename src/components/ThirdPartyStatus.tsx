"use client";

import { useState, useEffect } from "react";
import { ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Service {
    name: string;
    url: string;
    statusUrl: string;
}

const SERVICES: Service[] = [
    { name: "GitHub", url: "https://www.githubstatus.com/", statusUrl: "https://www.githubstatus.com/api/v2/status.json" },
    { name: "Vercel", url: "https://www.vercel-status.com/", statusUrl: "https://www.vercel-status.com/api/v2/status.json" },
    { name: "Huly", url: "https://huly.reshinrajesh.in", statusUrl: "https://huly.reshinrajesh.in" }
];

export default function ThirdPartyStatus() {
    const [statuses, setStatuses] = useState<Record<string, string>>({});

    useEffect(() => {
        SERVICES.forEach(async (service) => {
            try {
                const res = await fetch(service.statusUrl);
                const contentType = res.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    setStatuses(prev => ({
                        ...prev,
                        [service.name]: data.status.description || "Operational"
                    }));
                } else {
                    // Handle non-JSON responses (like Huly or Cloudflare errors)
                    if (res.ok) {
                        setStatuses(prev => ({ ...prev, [service.name]: "Operational" }));
                    } else if (res.status === 521 || res.status === 502 || res.status === 504) {
                        setStatuses(prev => ({ ...prev, [service.name]: "Outage" }));
                    } else {
                        setStatuses(prev => ({ ...prev, [service.name]: "Issues" }));
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch status for ${service.name}:`, error);
                setStatuses(prev => ({
                    ...prev,
                    [service.name]: "Outage"
                }));
            }
        });
    }, []);

    return (
        <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Upstream Providers</h3>
            <div className="space-y-3">
                {SERVICES.map(service => (
                    <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <a href={service.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium hover:text-primary transition-colors">
                            {service.name}
                            <ExternalLink size={12} className="opacity-50" />
                        </a>
                        <div className="flex items-center gap-2 text-xs font-bold">
                            {!statuses[service.name] ? (
                                <span className="text-zinc-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Checking...</span>
                            ) : statuses[service.name] === "All Systems Operational" || statuses[service.name] === "Operational" ? (
                                <span className="text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Operational</span>
                            ) : statuses[service.name] === "Outage" || statuses[service.name] === "Major Outage" ? (
                                <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> Outage</span>
                            ) : statuses[service.name] === "Unknown" ? (
                                <span className="text-zinc-500">Unknown</span>
                            ) : (
                                <span className="text-yellow-400 flex items-center gap-1"><XCircle size={12} /> Issues</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
