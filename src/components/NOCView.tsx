"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import StatusGlobe from "./StatusGlobe";
import DependencyGraph from "./DependencyGraph";
import DeploymentStream from "./DeploymentStream";
import { Clock, Activity, Shield, Server, Globe, Terminal, AlertTriangle } from "lucide-react";

export default function NOCView({ services, incidents }: { services: any[], incidents: any[] }) {
    const [logs, setLogs] = useState<string[]>([]);

    // Simulate real-time logs
    useEffect(() => {
        const fakeLogs = [
            "[INFO] Health check passed for API Gateway (latency: 45ms)",
            "[INFO] Database cluster replication synced",
            "[DEBUG] Auth service refreshing tokens",
            "[INFO] CDN cache hit ratio: 94%",
            "[WARN] Slight latency spike in us-east-1 (120ms)",
            "[INFO] New user session started",
            "[SYSTEM] Backup routine completed successfully",
            "[INFO] Load Balancer re-routing traffic",
        ];

        const interval = setInterval(() => {
            const randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
            const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
            setLogs(prev => [`${timestamp} ${randomLog}`, ...prev].slice(0, 20));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const ClockWidget = ({ timezone, label }: { timezone: string, label: string }) => {
        const [time, setTime] = useState("");
        useEffect(() => {
            const tick = () => {
                setTime(new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour12: false }));
            };
            tick();
            const i = setInterval(tick, 1000);
            return () => clearInterval(i);
        }, [timezone]);

        return (
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-bold text-white">{time}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-mono text-sm overflow-hidden flex flex-col gap-4">
            {/* Top Bar - Clocks & Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="col-span-2 md:col-span-2 lg:col-span-1 bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-full animate-pulse">
                        <Activity className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-primary tracking-tighter">NOC LIVE</h1>
                        <p className="text-[10px] text-primary/70 uppercase">System Nominal</p>
                    </div>
                </div>

                <ClockWidget timezone="UTC" label="UTC (Universal)" />
                <ClockWidget timezone="Asia/Kolkata" label="IST (Local)" />
                <ClockWidget timezone="Asia/Qatar" label="AST (Doha)" />

                <div className="col-span-2 lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Active Incidents</span>
                        <div className="text-2xl font-bold text-white">{incidents.length}</div>
                    </div>
                    <div className="h-full w-px bg-white/5 mx-4"></div>
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Global Uptime</span>
                        <div className="text-2xl font-bold text-green-400">99.98%</div>
                    </div>
                    <div className="h-full w-px bg-white/5 mx-4"></div>
                    <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase">Avg Latency</span>
                        <div className="text-2xl font-bold text-white">42ms</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Left Column: Graph & Services */}
                <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden">
                        <DependencyGraph serviceStatus={services} />
                    </div>
                </div>

                {/* Middle Column: Globe Map (Big) */}
                <div className="lg:col-span-1 bg-zinc-900/30 border border-white/5 rounded-3xl relative overflow-hidden min-h-[400px]">
                    <div className="absolute top-4 left-4 z-10">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Traffic Map</h3>
                    </div>
                    <div className="absolute inset-0">
                        <StatusGlobe className="max-w-none w-full h-full m-0 absolute inset-0 opacity-100 mix-blend-normal top-0" />
                    </div>

                    {/* Overlay Stats on Map */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                        {['US-East', 'EU-West', 'AP-South'].map(region => (
                            <div key={region} className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-center">
                                <div className="text-[10px] text-zinc-400">{region}</div>
                                <div className="text-green-400 font-bold text-xs">Operational</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Logs, Deployments & Raw Metrics */}
                <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                    {/* Live Logs Terminal */}
                    <div className="h-[200px] bg-black border border-zinc-800 rounded-3xl p-4 font-mono text-xs overflow-hidden flex flex-col shrink-0">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-900">
                            <Terminal size={14} className="text-zinc-500" />
                            <span className="text-zinc-500 uppercase tracking-widest">System Events</span>
                        </div>
                        <div className="flex-1 overflow-y-hidden relative">
                            <div className="absolute inset-0 overflow-hidden flex flex-col justify-end">
                                <div className="space-y-1">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`truncate ${log.includes('WARN') ? 'text-yellow-500' : log.includes('ERROR') ? 'text-red-500' : 'text-zinc-400'}`}
                                        >
                                            <span className="text-zinc-600 mr-2">{log.split(' ')[0]}</span>
                                            {log.substring(9)}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" style={{ backgroundSize: '100% 4px' }}></div>
                        </div>
                    </div>

                    {/* Deployment Stream */}
                    <div className="flex-1 min-h-[250px] shrink-0">
                        <DeploymentStream />
                    </div>

                    {/* Service Matrix */}
                    <div className=" bg-zinc-900/30 border border-white/5 rounded-3xl p-4 overflow-y-auto shrink-0 max-h-[300px]">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Service Health Matrix</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-zinc-300">{service.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 md:w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[99%]"></div>
                                        </div>
                                        <span className="text-green-400 font-mono text-[10px]">{service.uptime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
