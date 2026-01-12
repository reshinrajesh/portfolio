// UptimeChart.tsx - GitHub-style 90-day history grid
"use client";

import React from "react";
import { motion } from "framer-motion";

interface UptimeChartProps {
    days?: number;
    uptime?: string;
}

export default function UptimeChart({ days = 90, uptime = "99.9%" }: UptimeChartProps) {
    // Generate dummy data: mostly operational (1), some incidents (2), some down (0)
    const history = Array.from({ length: days }, (_, i) => {
        // Randomly simulate outages/incidents for visual demo
        const isIncident = Math.random() > 0.98;
        const isDown = Math.random() > 0.995;
        if (isDown) return 0;
        if (isIncident) return 2;
        return 1;
    });

    return (
        <div className="mt-6">
            <div className="flex flex-wrap gap-1">
                {history.map((status, i) => {
                    // Calculate date for this dot (days - i days ago)
                    const date = new Date();
                    date.setDate(date.getDate() - (days - 1 - i));

                    return (
                        <div key={i} className="group relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005, duration: 0.2 }}
                                className={`w-3 h-3 rounded-[2px] transition-all hover:scale-125 hover:z-10 cursor-help ${status === 1 ? "bg-emerald-500/20 hover:bg-emerald-400 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.5)]" :
                                        status === 2 ? "bg-yellow-500 hover:bg-yellow-400" :
                                            "bg-red-500 hover:bg-red-400"
                                    }`}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-mono border border-white/10 shadow-xl">
                                <span className={status === 1 ? "text-emerald-400" : status === 2 ? "text-yellow-400" : "text-red-400"}>
                                    {status === 1 ? "Operational" : status === 2 ? "Degraded" : "Outage"}
                                </span>
                                <span className="mx-1 text-zinc-500">|</span>
                                <span className="text-zinc-400">
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-3 uppercase tracking-wider">
                <span>{days} days ago</span>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-emerald-500/20" /> Operational</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-yellow-500" /> Degraded</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-red-500" /> Outage</span>
                </div>
                <span>Today</span>
            </div>
        </div>
    );
}
