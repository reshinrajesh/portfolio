"use client";

import Globe from "@/components/Globe";
import { TRIPS } from "@/lib/travel-data";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MapPage() {
    const [selectedTrip, setSelectedTrip] = useState<typeof TRIPS[0] | null>(null);

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Travel Stats Overlay */}
            <div className="absolute top-6 right-6 z-20 hidden md:block">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Trips</p>
                    <p className="text-2xl font-bold text-white">{TRIPS.length} Locations</p>
                </div>
            </div>

            {/* Globe Container */}
            <div className="w-full max-w-[800px] aspect-square relative z-10">
                <Globe
                    markers={TRIPS.map(t => ({ location: t.coordinates, size: 0.1 }))}
                    className="w-full h-full"
                />
            </div>

            {/* Title / Overlay */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 text-center drop-shadow-2xl">
                    Travel Map
                </h1>
                <p className="text-white/60 text-center max-w-md px-4">
                    Exploring the world, one commit at a time.
                </p>
            </div>

            {/* Trip List / Selector (Optional, for interactivity) */}
            <div className="absolute left-6 bottom-10 z-20 hidden md:flex flex-col gap-2 pointer-events-auto">
                {TRIPS.map(trip => (
                    <motion.button
                        key={trip.id}
                        whileHover={{ x: 5 }}
                        className="text-left group"
                        onClick={() => setSelectedTrip(trip)}
                    >
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm w-[250px]">
                            <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-blue-200">{trip.place}</p>
                                <p className="text-xs text-white/40">{trip.date}</p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
