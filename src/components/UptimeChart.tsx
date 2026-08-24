// UptimeChart.tsx - GitHub-style 90-day history grid
"use client";

import React from "react";
import { motion } from "framer-motion";

interface UptimeChartProps {
    days?: number;
    uptime?: string;
}

export default function UptimeChart({ days = 90, uptime = "99.9%" }: UptimeChartProps) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    // Generate dummy data: mostly operational (1), some incidents (2), some down (0)
    const history = React.useMemo(() => Array.from({ length: days }, (_, i) => {
        // Randomly simulate outages/incidents for visual demo
        const isIncident = Math.random() > 0.98;
        const isDown = Math.random() > 0.995;
        if (isDown) return 0;
        if (isIncident) return 2;
        return 1;
    }), [days]);

    return (
        <div className="mt-6">
            <div className="flex flex-wrap gap-1">
                {history.map((status, i) => {
                    // Calculate date for this dot (days - i days ago)
                    const date = new Date();
                    date.setDate(date.getDate() - (days - 1 - i));

                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005, duration: 0.2 }}
                                className={`w-3 h-3 rounded-[2px] transition-all duration-200 cursor-help ${isHovered ? "scale-125 z-10" : "scale-100 z-0"
                                    } ${status === 1 ? "bg-console-ok/20 hover:bg-console-ok" :
                                        status === 2 ? "bg-console-warn hover:bg-console-warn" :
                                            "bg-console-down hover:bg-console-down"
                                    } ${isHovered && status === 1 ? "shadow-[0_0_10px_rgba(52,211,153,0.5)]" : ""}`}
                            />
                            {/* Tooltip */}
                            {isHovered && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-console-raise text-xs text-console-fg rounded opacity-100 transition-opacity z-50 font-mono border border-console-fg/10 shadow-xl pointer-events-none">
                                    <span className={status === 1 ? "text-console-ok" : status === 2 ? "text-console-warn" : "text-console-down"}>
                                        {status === 1 ? "Operational" : status === 2 ? "Degraded" : "Outage"}
                                    </span>
                                    <span className="mx-1 text-console-dim">|</span>
                                    <span className="text-console-muted">
                                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center text-[10px] text-console-dim font-mono mt-3 uppercase tracking-wider">
                <span>{days} days ago</span>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-console-ok/20" /> Operational</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-console-warn" /> Degraded</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-console-down" /> Outage</span>
                </div>
                <span>Today</span>
            </div>
        </div>
    );
}
