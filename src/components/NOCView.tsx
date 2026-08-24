"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import StatusGlobe from "./StatusGlobe";
import DependencyGraph from "./DependencyGraph";
import DeploymentStream from "./DeploymentStream";
import { Clock, Activity, Shield, Server, Globe, Terminal, AlertTriangle } from "lucide-react";

export default function NOCView({ services, incidents }: { services: any[], incidents: any[] }) {
    const { data: session } = useSession();
    const isAdmin = !!session;
    const [logs, setLogs] = useState<string[]>([]);

    // Simulate real-time logs with actual status injection
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

        const outageLogs = [
            "[ERROR] Connection refused: Huly platform origin (521)",
            "[ERROR] Huly sync failed: GraphQL timeout",
            "[CRITICAL] App service 'huly' heartbeat missing",
        ];

        const interval = setInterval(() => {
            const hulyStatus = services.find(s => s.id === 'huly')?.status;
            let randomLog;
            
            // If Huly has an outage, 40% chance of showing an error log
            if (hulyStatus === 'outage' && Math.random() < 0.4) {
                randomLog = outageLogs[Math.floor(Math.random() * outageLogs.length)];
            } else {
                randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
            }

            const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
            setLogs(prev => [`${timestamp} ${randomLog}`, ...prev].slice(0, 20));
        }, 2000);

        return () => clearInterval(interval);
    }, [services]);

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
            <div className="bg-console-panel/50 p-4 rounded-xl border border-console-fg/5 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-bold text-console-fg">{time}</span>
                <span className="text-[10px] text-console-dim uppercase tracking-widest mt-1">{label}</span>
            </div>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    const allOperational = services.every(s => s.status === 'operational');

    return (
        <motion.div
            className="min-h-screen bg-console text-console-fg p-4 lg:p-6 font-mono text-sm overflow-hidden flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Top Bar - Clocks & Summary */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className={`col-span-2 md:col-span-2 lg:col-span-1 border p-4 rounded-xl flex items-center gap-4 transition-colors ${allOperational ? 'bg-primary/10 border-primary/20' : 'bg-console-down/10 border-console-down/20'}`}>
                    <div className={`p-3 rounded-full animate-pulse ${allOperational ? 'bg-primary/20' : 'bg-console-down/20'}`}>
                        <Activity className={allOperational ? 'text-primary' : 'text-console-down'} size={24} />
                    </div>
                    <div>
                        <h1 className={`font-bold text-lg tracking-tighter ${allOperational ? 'text-primary' : 'text-console-down'}`}>NOC LIVE</h1>
                        <p className={`text-[10px] uppercase ${allOperational ? 'text-primary/70' : 'text-console-down/70'}`}>{allOperational ? 'System Nominal' : 'Alert: Issues Detected'}</p>
                    </div>
                </div>

                <ClockWidget timezone="Europe/London" label="London (GMT)" />
                <ClockWidget timezone="Asia/Kolkata" label="IST (Local)" />
                <ClockWidget timezone="Asia/Qatar" label="AST (Doha)" />

                <div className="col-span-2 lg:col-span-2 bg-console-panel/50 border border-console-fg/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-console-dim uppercase">Active Incidents</span>
                        <div className={`text-2xl font-bold ${incidents.filter(i => i.status !== 'Resolved').length > 0 ? 'text-console-down' : 'text-console-fg'}`}>
                            {incidents.filter(i => i.status !== 'Resolved').length}
                        </div>
                    </div>
                    <div className="h-full w-px bg-console-fg/5 mx-4"></div>
                    <div>
                        <span className="text-[10px] text-console-dim uppercase">Global Uptime</span>
                        <div className="text-2xl font-bold text-console-ok">99.98%</div>
                    </div>
                    <div className="h-full w-px bg-console-fg/5 mx-4"></div>
                    <div className="text-right">
                        <span className="text-[10px] text-console-dim uppercase">Avg Latency</span>
                        <div className="text-2xl font-bold text-console-fg">42ms</div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Left Column: Graph & Services */}
                <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 bg-console-panel/30 border border-console-fg/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden">
                        <DependencyGraph serviceStatus={services.reduce((acc, s) => ({ ...acc, [s.id]: s.status }), {})} />
                    </div>
                </motion.div>

                {/* Middle Column: Globe Map (Big) */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-console-panel/30 border border-console-fg/5 rounded-3xl relative overflow-hidden min-h-[400px]">
                    <div className="absolute top-4 left-4 z-10">
                        <h3 className="text-xs font-bold text-console-dim uppercase tracking-widest">Global Traffic Map</h3>
                    </div>
                    <div className="absolute inset-0">
                        <StatusGlobe className="max-w-none w-full h-full m-0 absolute inset-0 opacity-100 mix-blend-normal top-0" />
                    </div>

                    {/* Overlay Stats on Map */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                        {['US-East', 'EU-West', 'AP-South'].map(region => (
                            <div key={region} className="bg-console/60 backdrop-blur-md p-2 rounded-lg border border-console-fg/10 text-center">
                                <div className="text-[10px] text-console-muted">{region}</div>
                                <div className="text-console-ok font-bold text-xs">Operational</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Logs, Deployments & Raw Metrics */}
                <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                    {/* Live Logs Terminal */}
                    <div className="h-[201px] bg-console border border-console-raise rounded-3xl p-4 font-mono text-xs overflow-hidden flex flex-col shrink-0">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-console-panel">
                            <Terminal size={14} className="text-console-dim" />
                            <span className="text-console-dim uppercase tracking-widest">System Events</span>
                        </div>
                        <div className="flex-1 overflow-y-hidden relative">
                            <div className="absolute inset-0 overflow-hidden flex flex-col justify-end">
                                <div className="space-y-1">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`truncate ${log.includes('WARN') ? 'text-console-warn' : (log.includes('ERROR') || log.includes('CRITICAL')) ? 'text-console-down' : 'text-console-muted'}`}
                                        >
                                            <span className="text-console-dim mr-2">{log.split(' ')[0]}</span>
                                            {log.substring(9)}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-console/20 pointer-events-none" style={{ backgroundSize: '100% 4px' }}></div>
                        </div>
                    </div>

                    {/* Deployment Stream */}
                    {!isAdmin ? (
                        <div className="flex-1 min-h-[171px] shrink-0">
                            <DeploymentStream />
                        </div>
                    ) : (
                        <div className="flex-1 min-h-[171px] shrink-0 bg-console border border-console-raise rounded-3xl overflow-hidden relative">
                            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-console/60 backdrop-blur-md px-2 py-1 rounded-lg border border-console-fg/10">
                                <Activity size={10} className="text-console-ok" />
                                <span className="text-[8px] text-console-muted font-bold uppercase tracking-widest">Live Grafana Stream</span>
                            </div>
                            <iframe
                                src="https://grafana.reshinrajesh.in?kiosk"
                                className="w-full h-full border-none opacity-80"
                                title="Grafana NOC Metrics"
                            />
                        </div>
                    )}

                    {/* Service Matrix */}
                    <div className=" bg-console-panel/30 border border-console-fg/5 rounded-3xl p-4 overflow-y-auto shrink-0 max-h-[300px]">
                        <h3 className="text-xs font-bold text-console-dim uppercase tracking-widest mb-4">Service Health Matrix</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center justify-between p-2 rounded-lg bg-console-fg/5 hover:bg-console-fg/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold ${service.status === 'operational' ? 'text-console-muted' : service.status === 'outage' ? 'text-console-down' : 'text-console-warn'}`}>
                                            {service.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 md:w-24 h-1 bg-console-raise rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-500 ${service.status === 'operational' ? 'bg-console-ok w-[99%]' : service.status === 'outage' ? 'bg-console-down w-[5%]' : 'bg-console-warn w-[70%]'}`}></div>
                                        </div>
                                        <span className={`font-mono text-[10px] ${service.status === 'operational' ? 'text-console-ok' : service.status === 'outage' ? 'text-console-down' : 'text-console-warn'}`}>
                                            {service.status === 'operational' ? service.uptime : service.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
