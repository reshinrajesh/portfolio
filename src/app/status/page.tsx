"use client";

import { motion, AnimatePresence } from "framer-motion";
import UptimeChart from "@/components/UptimeChart";
import { CheckCircle, Activity, Server, Shield, Globe, Terminal, Bell, Mail, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { getIncidents } from "@/app/status/actions";

interface ServiceStatus {
    id: string;
    name: string;
    status: "operational" | "degraded" | "outage" | "maintenance";
    icon: React.ReactNode;
    uptime: string;
}

const INITIAL_SERVICES: ServiceStatus[] = [
    {
        id: "main",
        name: "Main Portfolio",
        status: "operational",
        icon: <Globe size={18} />,
        uptime: "99.9%"
    },
    {
        id: "blog",
        name: "Blog Engine",
        status: "operational",
        icon: <Activity size={18} />,
        uptime: "100%"
    },
    {
        id: "lab",
        name: "Experimental Lab",
        status: "operational",
        icon: <Terminal size={18} />,
        uptime: "98.5%"
    },
    {
        id: "api",
        name: "Res.AI Chat API",
        status: "operational",
        icon: <Server size={18} />,
        uptime: "99.8%"
    },
    {
        id: "security",
        name: "Security Systems",
        status: "operational",
        icon: <Shield size={18} />,
        uptime: "100%"
    }
];

export default function StatusPage() {
    const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

    const allOperational = services.every(s => s.status === "operational");

    useEffect(() => {
        // Fetch incidents
        const fetchIncidents = async () => {
            const data = await getIncidents();
            setIncidents(data);
        };

        // Function to fetch status (Fire and Forget)
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/health");
                if (!res.ok) return;
                const data = await res.json();

                if (data.services) {
                    setServices(prev => prev.map(s => {
                        const newStatus = data.services[s.id];
                        // Only update if we have a valid status for this service ID
                        if (newStatus && (newStatus === "operational" || newStatus === "degraded")) {
                            return { ...s, status: newStatus };
                        }
                        return s;
                    }));
                }
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Failed to fetch status:", error);
            }
        };

        // Initial fetch
        fetchStatus();
        fetchIncidents();

        // Poll every 60 seconds (60000 ms)
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
            <div className="container mx-auto max-w-2xl px-6 py-24">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Logo className="text-xl" />
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <p className="text-zinc-500 text-sm">Real-time monitoring active</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSubscribeOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
                    >
                        <Bell size={16} />
                        Subscribe
                    </button>
                </motion.div>

                {/* Overall Status Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`mb-12 p-6 rounded-2xl border ${allOperational
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-yellow-500/5 border-yellow-500/20"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${allOperational ? "bg-green-500 text-black" : "bg-yellow-500 text-black"}`}>
                            {allOperational ? <CheckCircle size={24} /> : <Activity size={24} />}
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${allOperational ? "text-green-400" : "text-yellow-400"}`}>
                                {allOperational ? "All Systems Operational" : "System Issues Detected"}
                            </h2>
                            <p className="text-zinc-400 text-sm mt-1">
                                All services are running normally. No incidents reported today.
                            </p>
                        </div>
                    </div>
                </motion.div>
                {/* Metrics Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                >
                    <div className="p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Overall Uptime</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-4xl font-bold text-white tracking-tighter">99.98%</h3>
                            <span className="text-emerald-500 text-xs font-medium">Last 90 days</span>
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Response Time</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-4xl font-bold text-white tracking-tighter">124ms</h3>
                            <span className="text-emerald-500 text-xs font-medium">Global Avg</span>
                        </div>
                    </div>
                </motion.div>

                {/* Services List */}
                <div className="space-y-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.05) }}
                            className="p-5 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-zinc-400">{service.icon}</div>
                                    <span className="font-medium text-lg">{service.name}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${service.status === "operational" ? "bg-green-500/10 text-green-400" :
                                    service.status === "degraded" ? "bg-yellow-500/10 text-yellow-400" :
                                        "bg-red-500/10 text-red-400"
                                    }`}>
                                    {service.status === "operational" ? "Operational" : service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                </div>
                            </div>

                            {/* History Graph */}
                            <UptimeChart uptime={service.uptime} />
                        </motion.div>
                    ))}
                </div>

                {/* Past Incidents */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16"
                >
                    <h3 className="text-xl font-bold mb-6">Past Incidents</h3>
                    <div className="space-y-12">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="relative pl-8 border-l-2 border-white/10">
                                {/* Main Incident Marker */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

                                <div className="mb-4">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h4 className="font-bold text-xl text-white">{incident.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-black uppercase tracking-widest ${incident.status === 'Resolved' || incident.status === 'Completed' ? 'text-green-500 border-green-500/20' : 'text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {incident.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mb-3 font-medium">
                                        {new Date(incident.date).toLocaleDateString(undefined, {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-zinc-300 text-base leading-relaxed max-w-2xl bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                                        "{incident.description}"
                                    </p>
                                </div>

                                {/* Nested Updates Timeline */}
                                {incident.updates && incident.updates.length > 0 && (
                                    <div className="mt-6 space-y-6 ml-2 border-l border-white/10 pl-8 relative">
                                        {[...incident.updates].reverse().map((update: any) => (
                                            <div key={update.id} className="relative">
                                                <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-black" />
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-primary uppercase tracking-tighter">{update.status}</span>
                                                    <span className="text-[10px] text-zinc-500 font-mono">• {new Date(update.date).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-zinc-400 leading-snug">{update.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-zinc-600"
                >
                    <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
                </motion.div>
            </div>

            {/* Subscribe Modal */}
            <AnimatePresence>
                {isSubscribeOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSubscribeOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsSubscribeOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <Bell size={32} />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">Subscribe to Updates</h2>
                            <p className="text-zinc-400 mb-8 leading-relaxed">
                                Get real-time notifications when we detect issues or schedule maintenance.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white"
                                        />
                                    </div>
                                </div>
                                <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    Subscribe Now
                                </button>
                                <p className="text-center text-[10px] text-zinc-600 px-4">
                                    By subscribing, you agree to receive status update emails. You can unsubscribe at any time.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
