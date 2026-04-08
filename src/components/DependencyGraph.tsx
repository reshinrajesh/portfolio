"use client";

import { motion } from "framer-motion";
import { Server, Database, Globe, Layers, Wifi, Shield, ArrowRight, Activity } from "lucide-react";
import React from 'react';

// Define the node structure
interface GraphNode {
    id: string;
    label: string;
    icon: React.ReactNode;
    status: 'operational' | 'degraded' | 'outage' | 'maintenance';
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
}

interface GraphEdge {
    from: string;
    to: string;
}

const NODES: GraphNode[] = [
    { id: 'client', label: 'User Client', icon: <Globe size={20} />, status: 'operational', x: 10, y: 50 },
    { id: 'cdn', label: 'Edge CDN', icon: <Wifi size={20} />, status: 'operational', x: 30, y: 50 },
    { id: 'frontend', label: 'Main Site', icon: <Layers size={20} />, status: 'operational', x: 50, y: 30 },
    { id: 'api', label: 'API Gateway', icon: <Server size={20} />, status: 'operational', x: 50, y: 70 },
    { id: 'huly', label: 'Huly Platform', icon: <Activity size={20} />, status: 'operational', x: 70, y: 30 },
    { id: 'db', label: 'Primary DB', icon: <Database size={20} />, status: 'operational', x: 85, y: 65 },
];

const EDGES: GraphEdge[] = [
    { from: 'client', to: 'cdn' },
    { from: 'cdn', to: 'frontend' },
    { from: 'cdn', to: 'api' },
    { from: 'frontend', to: 'huly' },
    { from: 'api', to: 'db' },
    { from: 'huly', to: 'db' },
];

export default function DependencyGraph({ serviceStatus }: { serviceStatus?: any }) {
    // Helper to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-500 border-green-500/50 bg-green-500/10';
            case 'degraded': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
            case 'outage': return 'text-red-500 border-red-500/50 bg-red-500/10';
            default: return 'text-zinc-500 border-zinc-500/50 bg-zinc-500/10';
        }
    };

    // Helper to get edge color based on source node status
    const getEdgeColor = (sourceId: string) => {
        if (!serviceStatus) return '#22c55e';
        const nodeStatus = serviceStatus[sourceId] || 'operational';
        return nodeStatus === 'outage' ? '#ef4444' : '#22c55e';
    };

    // Map initial nodes to live status if available
    const liveNodes = NODES.map(node => {
        if (serviceStatus && serviceStatus[node.id]) {
            return { ...node, status: serviceStatus[node.id] };
        }
        // Specific mapping for some nodes if IDs don't match exactly
        if (node.id === 'frontend' && serviceStatus?.main) return { ...node, status: serviceStatus.main };
        if (node.id === 'db' && serviceStatus?.db) return { ...node, status: serviceStatus.db };
        
        return node;
    });

    return (
        <div className="w-full h-[400px] bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-white" />
                ))}
            </div>

            <h3 className="absolute top-6 left-6 text-xs font-bold text-zinc-500 uppercase tracking-widest z-10">System Architecture</h3>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
            </svg>

            {/* SVG Overlay for Connections */}
            <div className="absolute inset-0 w-full h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full pointer-events-none">
                    {EDGES.map((edge, i) => {
                        const source = liveNodes.find(n => n.id === edge.from)!;
                        const target = liveNodes.find(n => n.id === edge.to)!;
                        return (
                            <React.Fragment key={i}>
                                <line
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"
                                />
                                <motion.circle r="1" fill={getEdgeColor(edge.from)}>
                                    <animateMotion
                                        dur={`${1.5 + (i * 0.2)}s`}
                                        repeatCount="indefinite"
                                        path={`M${source.x},${source.y} L${target.x},${target.y}`}
                                    />
                                </motion.circle>
                            </React.Fragment>
                        );
                    })}
                </svg>
            </div>

            {/* Nodes */}
            {liveNodes.map((node, index) => (
                <motion.div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group cursor-pointer`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className={`p-3 rounded-xl border backdrop-blur-md transition-all duration-300 relative ${getStatusColor(node.status)} group-hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                        {node.icon}

                        {/* Status Dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${node.status === 'operational' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${node.status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                    </div>

                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-sm">
                        {node.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
