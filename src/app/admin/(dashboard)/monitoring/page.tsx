"use client";

import { motion } from "framer-motion";
import { ExternalLink, RefreshCcw, Activity, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

const GRAFANA_URL = "https://grafana.reshinrajesh.in";

export default function MonitoringPage() {
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const handleRefresh = () => {
        setIsLoading(true);
        setLastRefresh(new Date());
        // Simple trick to reload iframe
        const iframe = document.getElementById('grafana-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Live Monitoring</h1>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-500 font-bold">Real-time Stream</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <ShieldCheck size={14} className="text-primary" />
                            <span>Cluster: aws-k8s-main</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 border border-border bg-card/50 hover:bg-card rounded-xl transition-all text-sm font-bold secondary-glow"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <a
                        href={GRAFANA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-all text-sm font-bold shadow-lg shadow-primary/20"
                    >
                        <ExternalLink size={16} />
                        Open Grafana
                    </a>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Cluster Health</span>
                        <Activity size={18} className="text-emerald-500" />
                    </div>
                    <div className="mt-4">
                        <div className="text-2xl font-bold tracking-tighter">Healthy</div>
                        <p className="text-xs text-muted-foreground">All nodes reporting nominal</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Active Ingress</span>
                        <Zap size={18} className="text-primary" />
                    </div>
                    <div className="mt-4">
                        <div className="text-2xl font-bold tracking-tighter">42 req/s</div>
                        <p className="text-xs text-muted-foreground">Current traffic volume</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">System Uptime</span>
                        <ShieldCheck size={18} className="text-blue-500" />
                    </div>
                    <div className="mt-4">
                        <div className="text-2xl font-bold tracking-tighter">99.99%</div>
                        <p className="text-xs text-muted-foreground">Last 30-day calculation</p>
                    </div>
                </motion.div>
            </div>

            {/* Grafana Iframe Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative w-full rounded-[2.5rem] border border-border bg-black/40 overflow-hidden shadow-2xl ring-1 ring-white/5 h-[700px]"
            >
                {/* Iframe Overlay (Scanning effect) */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan z-10 pointer-events-none" />
                
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-lg z-20">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Establishing Secure Connection...</p>
                    </div>
                )}

                <iframe
                    id="grafana-iframe"
                    src={`${GRAFANA_URL}?kiosk`}
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                    title="Grafana Dashboard"
                />
            </motion.div>

            {/* Footer / Status */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-black px-2">
                <span>Direct Feed from Infrastructure</span>
                <span>Last Refreshed: {lastRefresh.toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
