"use client";

import { motion, AnimatePresence } from "framer-motion";
import UptimeChart from "@/components/UptimeChart";
import StatusGlobe from "@/components/StatusGlobe";
import BrowserPing from "@/components/BrowserPing";
import LatencyGraph from "@/components/LatencyGraph";
import ThirdPartyStatus from "@/components/ThirdPartyStatus";
import { CheckCircle, Activity, Server, Shield, Globe, Terminal, Bell, Mail, X, Layers, Cpu, Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { getIncidents } from "@/app/status/actions";
import { serviceState, type ServiceState } from "@/lib/serviceStatus";

interface ServiceStatus {
    id: string;
    name: string;
    status: ServiceState;
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
        id: "huly",
        name: "Huly Platform",
        status: "operational",
        category: "Apps",
        icon: <Activity size={18} />,
        uptime: "99.5%"
    },
    // Infrastructure
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
                        // Allow updating to any valid status provided by the API
                        if (newStatus) {
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 50, damping: 20 }
        }
    };

    return (
        <div className="min-h-screen bg-console text-console-fg font-sans selection:bg-console-ok/30 overflow-x-hidden">
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
                            className="fixed bottom-6 right-6 z-[100] px-6 py-2 bg-console-fg/10 hover:bg-console-fg/20 border border-console-fg/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Exit NOC Mode
                        </button>
                        <NOCView services={services} incidents={incidents} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="standard-view"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="container mx-auto max-w-4xl px-6 py-24 relative z-10"
                    >
                        {/* Logo */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <Logo className="text-xl backdrop-blur-md bg-console/30 px-4 py-2 rounded-full border border-console-fg/5 inline-block" />
                        </motion.div>

                        {/* Header */}
                        <motion.div variants={itemVariants} className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <div className="relative z-50">
                                    <div className="flex items-center gap-3 text-4xl md:text-5xl font-black tracking-tighter mb-4 text-left">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-console-fg to-console-dim">
                                            System Status
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-console-ok opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-console-ok border border-console/50"></span>
                                    </span>
                                    <p className="text-console-muted text-sm font-medium">All systems operational</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setViewMode("noc")}
                                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-console-panel/50 hover:bg-console-raise border border-console-fg/10 rounded-full transition-all text-sm font-bold backdrop-blur-md uppercase tracking-wide text-console-muted hover:text-console-fg"
                                >
                                    <Activity size={16} />
                                    NOC Mode
                                </button>
                                <button
                                    onClick={() => setIsSubscribeOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-console-fg/5 hover:bg-console-fg/10 border border-console-fg/10 rounded-full transition-all text-sm font-bold backdrop-blur-md"
                                >
                                    <Bell size={16} />
                                    Subscribe to Updates
                                </button>
                            </div>
                        </motion.div>

                        {/* Metrics Summary */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                            <div className="p-6 rounded-3xl border border-console-fg/5 bg-console-panel/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-console-dim uppercase tracking-widest font-black">Current Status</span>
                                <div className="mt-2 text-console-ok font-bold flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    Operational
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-console-fg/5 bg-console-panel/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-console-dim uppercase tracking-widest font-black">Uptime (90d)</span>
                                <div className="mt-2 text-console-fg font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={99.98} decimals={2} suffix="%" />
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-console-fg/5 bg-console-panel/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-console-dim uppercase tracking-widest font-black">Avg Response</span>
                                <div className="mt-2 text-console-fg font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={18} suffix="ms" duration={1.5} />
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl border border-console-fg/5 bg-console-panel/50 backdrop-blur-xl flex flex-col justify-between">
                                <span className="text-[10px] text-console-dim uppercase tracking-widest font-black">Active Incidents</span>
                                <div className="mt-2 text-console-fg font-bold text-2xl tracking-tighter flex items-end">
                                    <CountingNumber value={incidents.filter(i => i.status !== 'Resolved').length} duration={1} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Network Tools */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            <BrowserPing />
                            <ThirdPartyStatus />
                            <div className="md:col-span-2 lg:col-span-1">
                                <LatencyGraph />
                            </div>
                        </motion.div>

                        {/* Categories */}
                        {Object.entries(groupedServices).map(([category, categoryServices]) => (
                            <motion.div key={category} variants={itemVariants} className="mb-12">
                                <h3 className="text-sm font-bold text-console-dim uppercase tracking-widest mb-6 pl-2 border-l-2 border-primary">
                                    {category}
                                </h3>
                                <div className="grid gap-4">
                                    {categoryServices.map((service) => (
                                        <motion.div
                                            key={service.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="p-6 rounded-2xl border border-console-fg/5 bg-console-panel/40 backdrop-blur-md hover:bg-console-panel/60 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className="p-3 rounded-xl bg-console-fg/5 text-console-muted group-hover:text-console-fg group-hover:bg-console-fg/10 transition-colors">
                                                        {service.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">{service.name}</h4>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${serviceState(service.status).badge}`}>
                                                            {serviceState(service.status).label}
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
                            </motion.div>
                        ))}

                        {/* Scheduled Maintenance */}
                        {incidents.filter(i => i.title.toLowerCase().includes('maintenance')).length > 0 ? (
                            <motion.div variants={itemVariants} className="mb-16 p-6 rounded-2xl border border-console-fg/5 bg-console-panel/40 backdrop-blur-md flex flex-col md:flex-row items-start gap-4">
                                <div className="p-2 bg-console-info/10 rounded-lg text-console-info mt-1 shrink-0">
                                    <CheckCircle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-console-fg">Recent Maintenance</h3>
                                    <p className="text-console-muted text-sm mt-1 mb-3 bg-console-fg/5 p-3 rounded-xl border border-console-fg/5">
                                        "{incidents.filter(i => i.title.toLowerCase().includes('maintenance'))[0].description}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-console-raise border font-black uppercase tracking-widest ${incidents.filter(i => i.title.toLowerCase().includes('maintenance'))[0].status === 'Completed' || incidents.filter(i => i.title.toLowerCase().includes('maintenance'))[0].status === 'Resolved' ? 'text-console-ok border-console-ok/20' : 'text-console-info border-console-info/20'}`}>
                                            {incidents.filter(i => i.title.toLowerCase().includes('maintenance'))[0].status}
                                        </span>
                                        <span className="text-xs text-console-dim font-mono">
                                            {new Date(incidents.filter(i => i.title.toLowerCase().includes('maintenance'))[0].date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants} className="mb-16 p-6 rounded-2xl border border-console-fg/5 bg-console-info/5 flex items-start gap-4">
                                <div className="p-2 bg-console-info/10 rounded-lg text-console-info mt-1">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-console-info">No Maintenance Scheduled</h3>
                                    <p className="text-console-muted text-sm mt-1 mb-2">
                                        All systems are fully operational. We'll post here when we have planned updates.
                                    </p>
                                    <span className="text-xs text-console-dim font-mono">Next update window: TBD</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Past Incidents */}
                        <motion.div variants={itemVariants} className="mt-24">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold">Incident History</h3>
                                <Link href="/history" className="text-sm text-console-dim hover:text-console-fg transition-colors">
                                    View Archive &rarr;
                                </Link>
                            </div>

                            <div className="space-y-12">
                                {incidents.slice(0, 3).map((incident) => (
                                    <div key={incident.id} className="relative pl-8 border-l-2 border-console-fg/10">
                                        {/* Main Incident Marker */}
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-console-panel border-2 border-console-dim shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

                                        <div className="mb-4">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h4 className="font-bold text-xl text-console-fg">{incident.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-console-raise text-console-muted border border-console-raise font-black uppercase tracking-widest ${incident.status === 'Resolved' || incident.status === 'Completed' ? 'text-console-ok border-console-ok/20' : 'text-console-warn border-console-warn/20'
                                                    }`}>
                                                    {incident.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-console-dim mb-3 font-medium">
                                                {new Date(incident.date).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-console-muted text-base leading-relaxed max-w-2xl bg-console-fg/5 p-4 rounded-2xl border border-console-fg/5 italic">
                                                "{incident.description}"
                                            </p>
                                        </div>

                                        {incident.updates && incident.updates.length > 0 && (
                                            <div className="mt-6 space-y-6 ml-2 border-l border-console-fg/10 pl-8 relative">
                                                {[...incident.updates].reverse().map((update: any) => (
                                                    <div key={update.id} className="relative">
                                                        <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-console" />
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-primary uppercase tracking-tighter">{update.status}</span>
                                                            {update.date && !isNaN(new Date(update.date).getTime()) && (
                                                                <span className="text-[10px] text-console-dim font-mono">• {new Date(update.date).toLocaleString()}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-console-muted leading-snug">{update.message}</p>
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
                            variants={itemVariants}
                            className="mt-24 pt-8 border-t border-console-fg/5 flex justify-between items-center text-xs text-console-dim"
                        >
                            <p></p>
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
                            className="absolute inset-0 bg-console/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-console-panel border border-console-fg/10 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsSubscribeOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-console-fg/5 rounded-full transition-colors text-console-dim hover:text-console-fg"
                            >
                                <X size={20} />
                            </button>

                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <Bell size={32} />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">Subscribe to Updates</h2>
                            <p className="text-console-muted mb-8 leading-relaxed">
                                Get real-time notifications when we detect issues or schedule maintenance.
                            </p>

                            {subscribeStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-console-ok/10 text-console-ok rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
                                    <p className="text-console-muted mb-6">We'll send updates to <span className="text-console-fg font-medium">{email}</span>.</p>
                                    <button
                                        onClick={() => setIsSubscribeOpen(false)}
                                        className="w-full bg-console-fg/5 hover:bg-console-fg/10 border border-console-fg/10 text-console-fg py-3 rounded-2xl font-bold transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-console-dim uppercase tracking-widest px-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-console-dim" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-console-fg/5 border border-console-fg/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-console-fg"
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
                                    <p className="text-center text-[10px] text-console-dim px-4">
                                        By subscribing, you agree to receive status update emails. You can unsubscribe at any time.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
