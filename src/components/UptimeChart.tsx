// UptimeChart.tsx - Bar code style status history
"use client";

import React from "react";
import { motion } from "framer-motion";

interface UptimeChartProps {
    days?: number;
    uptime?: string; // e.g. "99.9%"
}

export default function UptimeChart({ days = 60, uptime = "99.9%" }: UptimeChartProps) {
    // Generate dummy data: mostly operational (1), some incidents (2), some down (0)
    // For this demo, strictly 1s to look "Operational"
    const history = Array.from({ length: days }, (_, i) => {
        // Simulate a random incident 15 days ago for variety, if desired
        // if (i === days - 15) return 2; 
        return 1;
    });

    return (
        <div className="mt-4">
            {/* Bars container */}
            <div className="flex gap-[3px] h-8 items-end mb-2">
                {history.map((status, i) => (
                    <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.01, duration: 0.2 }}
                        className={`flex-1 rounded-full h-full ${status === 1 ? "bg-emerald-500" :
                                status === 2 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                        title={`Day ${i + 1}: ${status === 1 ? 'Operational' : 'Incident'}`}
                    />
                ))}
            </div>

            {/* Footer labels */}
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>{days} days ago</span>
                <span className="text-zinc-400 font-bold">{uptime} uptime</span>
                <span>Today</span>
            </div>
        </div>
    );
}
