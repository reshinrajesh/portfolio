"use client";

import { motion } from "framer-motion";

interface BarChartProps {
    data: {
        label: string;
        value: number;
    }[];
    className?: string;
    barColor?: string;
}

export default function BarChart({ data, className, barColor = "bg-primary" }: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Prevent division by zero

    return (
        <div className={`flex items-end gap-2 h-40 w-full ${className}`}>
            {data.map((item, index) => {
                const heightPercentage = (item.value / maxValue) * 100;

                return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative h-full flex items-end">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercentage}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className={`w-full rounded-t-sm ${barColor} opacity-70 group-hover:opacity-100 transition-opacity relative min-h-[4px]`}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-border pointer-events-none z-10">
                                    {item.value} views
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate w-full text-center" title={item.label}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
