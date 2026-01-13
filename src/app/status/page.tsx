"use client";

import { motion, AnimatePresence } from "framer-motion";
import UptimeChart from "@/components/UptimeChart";
import StatusGlobe from "@/components/StatusGlobe";
import BrowserPing from "@/components/BrowserPing";
import LatencyGraph from "@/components/LatencyGraph";
import ThirdPartyStatus from "@/components/ThirdPartyStatus";
import { CheckCircle, Activity, Server, Shield, Globe, Terminal, Bell, Mail, X, Layers, Cpu, Radio, ChevronDown, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { getIncidents } from "@/app/status/actions";

interface ServiceStatus {
    id: string;
    name: string;
    status: "operational" | "degraded" | "outage" | "maintenance";
    category: "Core" | "Apps" | "Infrastructure";
    icon: React.ReactNode;
    uptime: string;
}

const INITIAL_SERVICES: ServiceStatus[] = [
    // Core
    {
        id: "main",
        name: "Main Portfolio",
        status: "operational",
        category: "Core",
        icon: <Globe size={18} />,
        uptime: "99.9%"
    },
    {
        id: "api",
        name: "Res.AI API Gateway",
        status: "operational",
        category: "Core",
        icon: <Server size={18} />,
        uptime: "99.95%"
    },
    // Apps
    {
        id: "blog",
        name: "Blog Engine",
        status: "operational",
        category: "Apps",
        icon: <Layers size={18} />,
        uptime: "100%"
    },
    {
        id: "chat",
        name: "AI Chat System",
        status: "operational",
        category: "Apps",
        icon: <Radio size={18} />,
        uptime: "99.8%"
    },
    // Infrastructure
    {
        id: "lab",
        name: "Experimental Lab",
        status: "operational",
        category: "Infrastructure",
        icon: <Terminal size={18} />,
        uptime: "98.5%"
    },
    {
        id: "security",
        name: "Security Systems",
        status: "operational",
        category: "Infrastructure",
        icon: <Shield size={18} />,
        uptime: "100%"
    },
    {
        id: "db",
        name: "Database Clusters",
        status: "operational",
        category: "Infrastructure",
        icon: <Cpu size={18} />,
        uptime: "99.99%"
    }
];

import NOCView from "@/components/NOCView";
import CountingNumber from "@/components/CountingNumber";

export default function StatusPage() {
    const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"standard" | "noc">("standard");
    const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success">("idle");
    const [email, setEmail] = useState("");

    const handleSubscribe = async () => {
        if (!email) return;
        setSubscribeStatus("loading");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubscribeStatus("success");
        setEmail("");
    };

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

    const groupedServices = {
        Core: services.filter(s => s.category === "Core"),
        Apps: services.filter(s => s.category === "Apps"),
        Infrastructure: services.filter(s => s.category === "Infrastructure")
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
            {/* Background Map Effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <StatusGlobe />
            </div>

            <AnimatePresence mode="wait">
                {viewMode === "noc" ? (
                    <motion.div
                        key="noc-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="relative z-10"
                    >
                        <button
                            onClick={() => setViewMode("standard")}
                            className="fixed bottom-6 right-6 z-[100] px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Exit NOC Mode
                        </button>
                        <NOCView services={services} incidents={incidents} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="standard-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="container mx-auto max-w-4xl px-6 py-24 relative z-10 transition-all duration-1000"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <Logo className="text-xl backdrop-blur-md bg-black/30 px-4 py-2 rounded-full border border-white/5 inline-block" />
                        </motion.div>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                        >
                            {/* ... Header Content ... */}
                            <div>
                                <div className="relative z-50">
                                    <button
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        className="flex items-center gap-3 text-4xl md:text-5xl font-black tracking-tighter mb-4 group text-left"
                                    >
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 group-hover:to-white transition-all">
                                            System Status
                                        </span>
                                        <ChevronDown
                                            size={32}
                                            className={`text-zinc-500 group-hover:text-white transition-all duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isStatusDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-14 left-0 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 backdrop-blur-xl"
                                            >
                                                <button
                                                    onClick={() => setIsStatusDropdownOpen(false)}
                                                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/10 text-white font-bold text-sm"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                    Main Dashboard
                                                    <Check className="ml-auto text-white/50" size={14} />
                                                </button>

                                                <a
                                                    href="https://res2.statuspage.io/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-blue-500 transition-colors" />
                                                    Atlassian Status
                                                    <ExternalLink className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                                                </a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-black/50"></span>
                                    </span>
                                    <p className="text-zinc-400 text-sm font-medium">All systems operational</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setViewMode("noc")}
                                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md uppercase tracking-wide text-zinc-400 hover:text-white"
                                >
                                    <Activity size={16} />
                                    NOC Mode
                                </button>
                                <button
                                    onClick={() => setIsSubscribeOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md"
                                >
                                    <Bell size={16} />
                                    Subscribe to Updates
                                </button>
                            </div>
                        </motion.div>

                        {/* Metrics Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                        >
                            <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Current Status</span>
                                <div className="mt-2 text-green-400 font-bold flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    Operational
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Uptime (90d)</span>
                                <div className="mt-2 text-white font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={99.98} decimals={2} suffix="%" />
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Avg Response</span>
                                <div className="mt-2 text-white font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={124} suffix="ms" duration={1.5} />
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Active Incidents</span>
                                <div className="mt-2 text-white font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={incidents.filter(i => i.status !== 'Resolved').length} duration={1} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Network Tools */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                        >
                            <BrowserPing />
                            <ThirdPartyStatus />
                            <div className="md:col-span-2 lg:col-span-1">
                                <LatencyGraph />
                            </div>
                        </motion.div>

                        {/* Categories */}
                        {Object.entries(groupedServices).map(([category, categoryServices], catIndex) => (
                            <div key={category} className="mb-12">
                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (catIndex * 0.1) }}
                                    className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 pl-2 border-l-2 border-primary"
                                >
                                    {category}
                                </motion.h3>
                                <div className="grid gap-4">
                                    {categoryServices.map((service, index) => (
                                        <motion.div
                                            key={service.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (index * 0.05), type: "spring", stiffness: 100, damping: 15 }}
                                            className="p-6 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/60 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className="p-3 rounded-xl bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                                                        {service.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">{service.name}</h4>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${service.status === 'operational' ? 'bg-green-500/10 text-green-400' :
                                                            service.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                                            }`}>
                                                            {service.status === 'operational' ? 'Operational' : service.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 w-full md:max-w-md">
                                                    <UptimeChart uptime={service.uptime} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Scheduled Maintenance */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-16 p-6 rounded-2xl border border-white/5 bg-blue-500/5 flex items-start gap-4"
                        >
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-blue-400">No Maintenance Scheduled</h3>
                                <p className="text-zinc-400 text-sm mt-1 mb-2">
                                    All systems are fully operational. We'll post here when we have planned updates.
                                </p>
                                <span className="text-xs text-zinc-500 font-mono">Next update window: TBD</span>
                            </div>
                        </motion.div>

                        {/* Past Incidents */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-24"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold">Incident History</h3>
                                <Link href="/history" className="text-sm text-zinc-500 hover:text-white transition-colors">
                                    View Archive &rarr;
                                </Link>
                            </div>

                            <div className="space-y-12">
                                {incidents.slice(0, 3).map((incident) => (
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
                            transition={{ delay: 0.8 }}
                            className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-zinc-600"
                        >
                            <p>Powered by Res.AI Status Engine</p>
                            <p>Last check: {lastUpdated.toLocaleTimeString()}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

                            {subscribeStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
                                    <p className="text-zinc-400 mb-6">We'll send updates to <span className="text-white font-medium">{email}</span>.</p>
                                    <button
                                        onClick={() => setIsSubscribeOpen(false)}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-2xl font-bold transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-white"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={subscribeStatus === 'loading' || !email}
                                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {subscribeStatus === 'loading' ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Subscribing...
                                            </>
                                        ) : (
                                            "Subscribe Now"
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-zinc-600 px-4">
                                        By subscribing, you agree to receive status update emails. You can unsubscribe at any time.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
