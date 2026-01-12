"use client";

import { useState } from "react";
import { Activity, Check, X, Wifi } from "lucide-react";

export default function BrowserPing() {
    const [status, setStatus] = useState<"idle" | "pinging" | "success" | "error">("idle");
    const [latency, setLatency] = useState<number | null>(null);

    const ping = async () => {
        setStatus("pinging");
        const start = performance.now();
        try {
            const res = await fetch("/api/health", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed");
            const end = performance.now();
            setLatency(Math.round(end - start));
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setLatency(null);
        }
    };

    return (
        <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Wifi size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Browser Ping</h3>
                    <p className="text-xs text-zinc-500">Check connectivity from your device</p>
                </div>
            </div>

            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5">
                <div className="text-sm font-mono text-zinc-300">
                    {status === "idle" && "Ready to check"}
                    {status === "pinging" && "Pinging..."}
                    {status === "success" && <span className="text-green-400">{latency}ms</span>}
                    {status === "error" && <span className="text-red-400">Connection Failed</span>}
                </div>
                <button
                    onClick={ping}
                    disabled={status === "pinging"}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors disabled:opacity-50"
                >
                    {status === "pinging" ? "..." : "Check Now"}
                </button>
            </div>
        </div>
    );
}
