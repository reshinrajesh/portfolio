"use client";

import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Rocket, CheckCircle, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";

interface DeploymentEvent {
    id: string;
    type: 'commit' | 'deploy' | 'pr';
    message: string;
    author: string;
    timestamp: Date;
    status: 'success' | 'pending' | 'failed';
}

const MOCK_DATA: DeploymentEvent[] = [
    { id: '1', type: 'deploy', message: 'Production Deployment v2.4.0', author: 'vercel-bot', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'success' },
    { id: '2', type: 'commit', message: 'feat: Add NOC mode toggle', author: 'reshinrajesh', timestamp: new Date(Date.now() - 1000 * 60 * 15), status: 'success' },
    { id: '3', type: 'commit', message: 'fix: align status globe', author: 'reshinrajesh', timestamp: new Date(Date.now() - 1000 * 60 * 45), status: 'success' },
    { id: '4', type: 'pr', message: 'Merge pull request #128 from feature/noc-view', author: 'reshinrajesh', timestamp: new Date(Date.now() - 1000 * 60 * 60), status: 'success' },
    { id: '5', type: 'commit', message: 'chore: update framer-motion dependencies', author: 'reshinrajesh', timestamp: new Date(Date.now() - 1000 * 60 * 120), status: 'success' },
];

export default function DeploymentStream() {
    const [events, setEvents] = useState<DeploymentEvent[]>(MOCK_DATA);

    // Simulate incoming events
    useEffect(() => {
        const potentialMessages = [
            "feat: improve database indexing",
            "fix: mobile navigation bug",
            "chore: update README",
            "docs: add api documentation",
            "style: refactor css variables",
            "perf: optimize image loading"
        ];

        const interval = setInterval(() => {
            if (Math.random() > 0.7) return; // Only add sometimes

            const newEvent: DeploymentEvent = {
                id: crypto.randomUUID(),
                type: 'commit',
                message: potentialMessages[Math.floor(Math.random() * potentialMessages.length)],
                author: 'reshinrajesh',
                timestamp: new Date(),
                status: 'success'
            };

            setEvents(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: DeploymentEvent['type']) => {
        switch (type) {
            case 'deploy': return <Rocket size={14} className="text-purple-400" />;
            case 'pr': return <GitPullRequest size={14} className="text-blue-400" />;
            case 'commit': return <GitCommit size={14} className="text-zinc-400" />;
        }
    };

    return (
        <div className="h-full bg-zinc-900/30 border border-white/5 rounded-3xl p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Rocket size={14} />
                    Deployment Stream
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        layout
                        className="p-3 bg-black/40 border border-white/5 rounded-xl group hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                                {getIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${event.type === 'deploy' ? 'text-purple-400' : 'text-zinc-500'
                                        }`}>
                                        {event.type}
                                    </span>
                                    <span className="text-[10px] text-zinc-600 font-mono">
                                        {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-300 font-medium truncate leading-relaxed">
                                    {event.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-[8px] text-indigo-300 font-bold">
                                        RR
                                    </div>
                                    <span className="text-[10px] text-zinc-500">{event.author}</span>
                                    {event.status === 'success' && (
                                        <CheckCircle size={10} className="text-green-500 ml-auto opacity-50" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
