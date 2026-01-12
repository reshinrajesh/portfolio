"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Zap } from "lucide-react";

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

        // Draw gradient line
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "rgba(52, 211, 153, 0.5)"); // Emerald
        gradient.addColorStop(1, "rgba(52, 211, 153, 0)");

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
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.stroke();

    }, [data]);

    return (
        <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Real-time Latency</h3>
                        <p className="text-xs text-zinc-500">Global response time</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold font-mono text-white">{currentLatency}ms</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-green-400">
                        <Zap size={10} fill="currentColor" />
                        Live
                    </div>
                </div>
            </div>

            <div className="h-24 w-full bg-black/20 rounded-xl overflow-hidden border border-white/5 relative">
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
