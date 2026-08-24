"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Zap } from "lucide-react";

const FALLBACK_OK = "#22c55e";

/** "#22c55e" -> "34, 197, 94". Returns null for anything not a 3/6-digit hex. */
function toRgbChannels(color: string): string | null {
    const hex = color.replace("#", "").trim();

    const expanded =
        hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
        return null;
    }

    const value = parseInt(expanded, 16);

    return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export default function LatencyGraph() {
    const [data, setData] = useState<number[]>(new Array(30).fill(0));
    const [currentLatency, setCurrentLatency] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const start = performance.now();
            try {
                await fetch("/api/health", { cache: "no-store" });
                const end = performance.now();
                const latency = Math.round(end - start);
                setCurrentLatency(latency);
                setData(prev => [...prev.slice(1), latency]);
            } catch (e) {
                // On error, push 0 or a high value? Let's push 0 to indicate drop
                setData(prev => [...prev.slice(1), 0]);
            }
        };

        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    // Draw graph
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const maxLatency = Math.max(200, ...data); // Fixed scale at least 200ms

        ctx.clearRect(0, 0, width, height);

        // Canvas cannot use Tailwind classes, so read the console token directly
        // rather than keeping a second, drifting copy of the same green here.
        const ok = getComputedStyle(document.documentElement)
            .getPropertyValue("--console-ok")
            .trim() || FALLBACK_OK;

        // addColorStop throws on anything it cannot parse, so build plain rgba
        // rather than handing it a color-mix() the canvas may reject.
        const channels = toRgbChannels(ok) ?? toRgbChannels(FALLBACK_OK)!;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `rgba(${channels}, 0.5)`);
        gradient.addColorStop(1, `rgba(${channels}, 0)`);

        ctx.beginPath();
        ctx.moveTo(0, height);

        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (val / maxLatency) * height * 0.8; // Use 80% height
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw stroke
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (val / maxLatency) * height * 0.8;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = ok;
        ctx.lineWidth = 2;
        ctx.stroke();

    }, [data]);

    return (
        <div className="p-6 rounded-2xl border border-console-fg/5 bg-console-panel/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-console-ok/10 text-console-ok">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Real-time Latency</h3>
                        <p className="text-xs text-console-dim">Global response time</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold font-mono text-console-fg">{currentLatency}ms</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-console-ok">
                        <Zap size={10} fill="currentColor" />
                        Live
                    </div>
                </div>
            </div>

            <div className="h-24 w-full bg-console/20 rounded-xl overflow-hidden border border-console-fg/5 relative">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={100}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
