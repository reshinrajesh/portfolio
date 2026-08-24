"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getIncidents } from "@/app/status/actions";

export default function StatusHistoryPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const data = await getIncidents();
                setIncidents(data);
            } catch (error) {
                console.error("Failed to fetch incidents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    // Group incidents by month
    const groupedIncidents = incidents.reduce((acc, incident) => {
        const date = new Date(incident.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(incident);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="min-h-screen bg-console text-console-fg font-sans selection:bg-console-ok/30">
            <div className="container mx-auto max-w-2xl px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-console-dim hover:text-console-fg transition-colors text-sm font-medium mb-8"
                    >
                        <ArrowLeft size={16} />
                        Back to Status
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Incident History</h1>
                    <p className="text-console-muted">Archive of past incidents and maintenance events.</p>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 rounded-2xl bg-console-fg/5 animate-pulse" />
                        ))}
                    </div>
                ) : Object.keys(groupedIncidents).length === 0 ? (
                    <div className="p-12 text-center border border-console-fg/5 rounded-3xl bg-console-fg/5">
                        <CheckCircle size={48} className="mx-auto mb-4 text-console-ok/50" />
                        <h3 className="text-lg font-bold mb-2">No Incidents Recorded</h3>
                        <p className="text-console-dim text-sm">Everything has been running smoothly.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {(Object.entries(groupedIncidents) as [string, any[]][]).map(([month, monthIncidents], groupIndex) => (
                            <motion.div
                                key={month}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: groupIndex * 0.1 }}
                            >
                                <h2 className="text-sm font-bold text-console-dim uppercase tracking-widest mb-6 sticky top-4 bg-console/80 backdrop-blur-md py-2 z-10">
                                    {month}
                                </h2>
                                <div className="space-y-8">
                                    {monthIncidents.map((incident: any) => (
                                        <div key={incident.id} className="relative pl-8 border-l-2 border-console-fg/10 group">
                                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-colors ${incident.status === 'Resolved' ? 'bg-console-panel border-console-ok group-hover:bg-console-ok' :
                                                incident.status === 'Investigating' ? 'bg-console-panel border-console-down group-hover:bg-console-down' :
                                                    'bg-console-panel border-console-warn group-hover:bg-console-warn'
                                                }`} />

                                            <div className="mb-2">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-console-fg group-hover:text-primary transition-colors">{incident.title}</h3>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-console-raise border font-black uppercase tracking-widest ${incident.status === 'Resolved' || incident.status === 'Completed'
                                                        ? 'text-console-ok border-console-ok/20'
                                                        : 'text-console-warn border-console-warn/20'
                                                        }`}>
                                                        {incident.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-console-dim mb-3 font-mono">
                                                    <Calendar size={12} />
                                                    {new Date(incident.date).toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <p className="text-console-muted text-base leading-relaxed bg-console-fg/5 p-4 rounded-2xl border border-console-fg/5">
                                                    {incident.description}
                                                </p>
                                            </div>

                                            {/* Updates preview (collapsed by default or simple list) */}
                                            {incident.updates && incident.updates.length > 0 && (
                                                <div className="mt-4 pl-4 border-l border-console-fg/5 space-y-3">
                                                    {incident.updates.map((update: any) => (
                                                        <div key={update.id} className="text-sm text-console-muted">
                                                            <span className="text-xs font-bold text-console-dim uppercase mr-2">
                                                                {update.status}
                                                            </span>
                                                            {update.message}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
