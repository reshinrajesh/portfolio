"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Unlock, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function LabLock({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if already unlocked
    useEffect(() => {
        const isUnlocked = localStorage.getItem("lab_unlocked");
        if (isUnlocked === "true") {
            setUnlocked(true);
        }
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleTrigger = (e: React.MouseEvent) => {
        e.preventDefault();
        if (unlocked) {
            window.location.href = "https://demo.reshinrajesh.in";
        } else {
            setIsOpen(true);
        }
    };

    const logAttempt = async (attemptCode: string, status: 'SUCCESS' | 'FAILURE') => {
        try {
            await fetch('/api/lab/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: attemptCode, status })
            });
        } catch (e) {
            console.error("Failed to log attempt", e);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded password for now
        if (code.toLowerCase() === "admin" || code.toLowerCase() === "sudo open") {
            logAttempt(code, 'SUCCESS');
            localStorage.setItem("lab_unlocked", "true");
            setUnlocked(true);
            setIsOpen(false);
            window.location.href = "https://demo.reshinrajesh.in";
        } else {
            logAttempt(code, 'FAILURE');
            setError(true);
            setCode("");
            setTimeout(() => setError(false), 2000); // Reset error state
        }
    };

    return (
        <>
            <div onClick={handleTrigger} className="cursor-pointer">
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-black border border-green-500/30 rounded-lg shadow-2xl overflow-hidden font-mono"
                        >
                            {/* Terminal Header */}
                            <div className="bg-green-900/10 border-b border-green-500/20 p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-500 text-xs">
                                    <Terminal size={14} />
                                    <span>SECURE_GATEWAY_V1.0</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-green-500/50 hover:text-green-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Terminal Body */}
                            <div className="p-8 space-y-6 relative">
                                {/* Retro CRT Scanline Effect */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

                                <div className="text-center space-y-2 relative z-10">
                                    <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                        {error ? <Lock className="text-red-500" /> : <Lock className="text-green-500" />}
                                    </div>
                                    <h3 className="text-green-500 font-bold text-lg tracking-wider">AUTHENTICATION REQUIRED</h3>
                                    <p className="text-green-500/60 text-xs">Enter access code to proceed to Experimental Lab.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="relative z-10">
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">{">"}</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className={`w-full bg-black border ${error ? 'border-red-500 text-red-500 focus:ring-red-500/20' : 'border-green-500/30 text-green-500 focus:border-green-500 focus:ring-green-500/20'} rounded p-3 pl-8 outline-none focus:ring-2 transition-all placeholder:text-green-900`}
                                            placeholder="Type code..."
                                            autoComplete="off"
                                        />
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute -bottom-6 left-0 text-red-500 text-xs"
                                            >
                                                ACCESS_DENIED: Invalid credentials
                                            </motion.p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-6 bg-green-900/20 border border-green-500/30 text-green-500 p-2 rounded hover:bg-green-500 hover:text-black transition-all font-bold flex items-center justify-center gap-2 group"
                                    >
                                        <span>EXECUTE</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
