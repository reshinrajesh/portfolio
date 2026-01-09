'use client';

import React, { useEffect, useState } from 'react';
import { Construction, FlaskConical, Terminal, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import DemoSignOut from './components/DemoSignOut';

// Lab Components
import SpotifyLab from './components/SpotifyLab';
import TravelLab from './components/TravelLab';
import Showcase3D from '@/components/ui/Showcase3D';
import ApiPlayground from './components/ApiPlayground';

export default function DemoPage() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for unlock key
        const isUnlocked = localStorage.getItem("lab_unlocked");
        if (isUnlocked === "true") {
            setAuthorized(true);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">INITIALIZING_SECURE_CONNECTION...</div>;
    }

    if (!authorized) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* CRT Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

                <div className="z-10 max-w-lg w-full border border-red-500/30 bg-red-950/10 p-8 rounded-lg shadow-2xl backdrop-blur-sm relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />

                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/50 animate-pulse">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-red-500 tracking-widest">ACCESS DENIED</h1>
                            <p className="text-red-400/70 text-sm">SECURE_LAB_PROTOCOL: AUTHORIZATION MISSING</p>
                        </div>

                        <div className="w-full bg-black/50 border border-red-500/20 p-4 rounded text-left text-xs space-y-2 text-red-400 font-mono">
                            <p>{">"} checking_credentials...</p>
                            <p>{">"} error: token_not_found</p>
                            <p>{">"} status: locked</p>
                            <p className="animate-pulse">{">"} action_required: return_to_base</p>
                        </div>

                        <Link
                            href="https://reshinrajesh.in"
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 rounded transition-all hover:scale-105 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                                <FlaskConical size={24} />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                                Reshin's Lab
                            </h1>
                        </div>
                        <p className="text-neutral-400 max-w-md">
                            Experimental features, UI concepts, and broken code.
                            Warning: Things here might explode. 💥
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <DemoSignOut />
                        <Link
                            href="https://reshinrajesh.in"
                            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm"
                        >
                            ← Exit to Reality
                        </Link>
                    </div>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">

                    {/* 1. Spotify 2.0 */}
                    <div className="group flex flex-col h-full">
                        <div className="flex-none flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Spotify Visualizer
                            </h2>
                            <span className="text-xs text-neutral-500 px-2 py-1 rounded border border-white/10">v2.0-beta</span>
                        </div>
                        <div className="flex-1">
                            <SpotifyLab />
                        </div>
                    </div>

                    {/* 2. API Playground */}
                    <div className="group flex flex-col h-full">
                        <div className="flex-none flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                API Console
                            </h2>
                            <span className="text-xs text-neutral-500 px-2 py-1 rounded border border-white/10">Utility</span>
                        </div>
                        <div className="flex-1">
                            <ApiPlayground />
                        </div>
                    </div>

                    {/* 3. 3D Showcase */}
                    <div className="group flex flex-col h-full">
                        <div className="flex-none flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                Glassmorphism 3D
                            </h2>
                            <span className="text-xs text-neutral-500 px-2 py-1 rounded border border-white/10">UI/UX</span>
                        </div>
                        <div className="flex-1">
                            <Showcase3D />
                        </div>
                    </div>

                    {/* 4. Travel Map */}
                    <div className="group flex flex-col h-full">
                        <div className="flex-none flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                World Tracker
                            </h2>
                            <span className="text-xs text-neutral-500 px-2 py-1 rounded border border-white/10">Concept</span>
                        </div>
                        <div className="flex-1">
                            <TravelLab />
                        </div>
                    </div>

                </div>

                <footer className="pt-12 border-t border-white/5 text-center text-white/20 text-sm">
                    Experiments running on Next.js 14 • Framer Motion • Tailwind CSS
                </footer>
            </div>
        </div>
    );
}
