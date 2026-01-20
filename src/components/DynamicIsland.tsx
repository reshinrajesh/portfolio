"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, X, Music } from "lucide-react";
import Link from "next/link";

export default function DynamicIsland() {
    const { data, isExpanded, setIsExpanded } = usePlayer();
    const [isHovered, setIsHovered] = useState(false);

    // Mock data for visualization if nothing is playing
    const displayData = (data && data.isPlaying) ? data : {
        isPlaying: true, // Force true for demo
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2734718e28d24227b9dc7491d43",
        songUrl: "#"
    };

    // if (!data || !data.isPlaying) return null; // Original logic disabled for demo

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex justify-center">
            <motion.div
                layout
                initial={{ borderRadius: 32, width: "auto", height: "auto" }}
                animate={{
                    width: isExpanded ? 350 : "auto",
                    height: isExpanded ? 180 : 40,
                    borderRadius: 32,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
                className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative cursor-pointer"
                onClick={() => !isExpanded && setIsExpanded(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full p-4 flex flex-col"
                        >
                            {/* Header / Close */}
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] text-white/50 uppercase tracking-widest pl-1">Now Playing</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(false);
                                    }}
                                    className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex gap-4 items-center flex-1">
                                {/* Album Art */}
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg shrink-0">
                                    <Image
                                        src={displayData.albumImageUrl || "/placeholder.png"}
                                        alt="Album Art"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info & Controls */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
                                    <div>
                                        <h4 className="text-white font-medium text-sm truncate">{displayData.title}</h4>
                                        <p className="text-white/50 text-xs truncate">{displayData.artist}</p>
                                    </div>

                                    {/* Progress Bar (Mock) */}
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-green-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "45%" }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} // Mock animation
                                        />
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-4 justify-center">
                                        <SkipBack size={18} className="text-white/70 hover:text-white fill-current" />
                                        <button onClick={(e) => e.stopPropagation()} className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
                                            {displayData.isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" />}
                                        </button>
                                        <SkipForward size={18} className="text-white/70 hover:text-white fill-current" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="compact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-3 h-full w-full max-w-[200px]"
                        >
                            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 animate-spin-slow" style={{ animationDuration: '4s' }}>
                                <Image
                                    src={displayData.albumImageUrl || "/placeholder.png"}
                                    alt="Mini Art"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                                <span className="text-white text-xs font-medium truncate max-w-[120px]">{displayData.title}</span>
                            </div>
                            <div className="flex gap-0.5 items-end h-3 ml-1">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.8,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                        className="w-0.5 bg-green-500 rounded-full"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
