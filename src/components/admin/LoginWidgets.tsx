"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, ShieldAlert, Fingerprint, Mail, Key, Globe, Clock, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SystemStatusBadge() {
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

    useEffect(() => {
        fetch("/api/health")
            .then((res) => setIsHealthy(res.ok))
            .catch(() => setIsHealthy(false));
    }, []);

    if (isHealthy === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${isHealthy
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
        >
            <div className={`w-2 h-2 rounded-full ${isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span>{isHealthy ? "ALL SYSTEMS OPERATIONAL" : "SYSTEM DEGRADED"}</span>
        </motion.div>
    );
}

export function GreetingWithTime() {
    const [greeting, setGreeting] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const date = new Date();
            const hour = date.getHours();
            setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            if (hour < 5) setGreeting("Working late?");
            else if (hour < 12) setGreeting("Good Morning");
            else if (hour < 18) setGreeting("Good Afternoon");
            else setGreeting("Good Evening");
        };
        update();
        const timer = setInterval(update, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center space-y-1 mb-6">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-white/30 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white/90">
                {greeting}, Admin
            </h2>
        </div>
    );
}

export function CapsLockWarning({ isActive }: { isActive: boolean }) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 text-yellow-500"
                    title="Caps Lock is ON"
                >
                    <ShieldAlert className="w-5 h-5" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function IntruderCapture({ attempts }: { attempts: number }) {
    // Determine when to trigger capture (e.g., after 2 failed attempts)
    const shouldCapture = attempts >= 2;
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (shouldCapture) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        // In a real app, we would capture a frame here and send it to an API
                        console.log("INTRUDER DETECTED: Snapshot sequence initiated.");
                    }
                })
                .catch((err) => console.log("Camera access denied or n/a", err));
        }
    }, [shouldCapture]);

    return (
        <div className="hidden">
            <video ref={videoRef} autoPlay playsInline muted />
        </div>
    );
}

export function AdvancedAuthOptions() {
    return (
        <div className="grid grid-cols-2 gap-3 pt-2">
            <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium p-3 rounded-xl transition-colors border border-white/5"
                onClick={() => alert("Biometric/Passkey auth requires backend configuration.")}
            >
                <Fingerprint className="w-4 h-4" />
                <span>Passkey</span>
            </button>
            <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium p-3 rounded-xl transition-colors border border-white/5"
                onClick={() => alert("Magic Link sent to admin email (Simulation).")}
            >
                <Mail className="w-4 h-4" />
                <span>Magic Link</span>
            </button>
        </div>
    );
}
