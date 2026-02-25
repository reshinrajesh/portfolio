"use client";

import { motion } from "framer-motion";
import { Map, MapPin, Navigation, Calendar } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import("./Globe"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-secondary/5 rounded-full animate-pulse" />
});

import { TRIPS } from "@/lib/travel-data";

export default function TravelLog() {
    return (
        <section id="travel" className="py-24 relative overflow-hidden bg-secondary/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Header & Trips */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                    <Map size={24} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Travel Log
                                </h2>
                            </div>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Exploring the world, one city at a time. Collecting memories, not just commit hashes.
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.15
                                    }
                                }
                            }}
                        >
                            {TRIPS.map((trip) => (
                                <motion.div
                                    key={trip.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                                    }}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    className="group relative h-full bg-background border border-border/50 hover:border-orange-500/50 rounded-2xl p-6 transition-colors shadow-sm hover:shadow-orange-500/10"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                                            <MapPin size={20} />
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded flex items-center gap-1 group-hover:text-orange-400 transition-colors">
                                            <Calendar size={10} />
                                            {trip.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                                        {trip.place}
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                                        {trip.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {trip.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Add New Trip Placeholder */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" } }
                                }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-2xl h-full min-h-[200px] text-muted-foreground bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer group"
                            >
                                <div className="mb-4 p-4 rounded-full bg-secondary group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                                    <Navigation size={24} className="opacity-50 group-hover:opacity-100" />
                                </div>
                                <p className="font-medium group-hover:text-foreground transition-colors">Where to next?</p>
                                <p className="text-xs mt-1">Planning the next adventure...</p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column: Globe */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative hidden lg:block h-[600px] w-full"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Globe markers={TRIPS.map(t => ({ location: t.coordinates, size: 0.1 }))} />
                        </div>
                        {/* Optional overlay decoration */}
                        <div className="absolute bottom-10 left-10 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-border/50 max-w-xs">
                            <p className="text-sm font-medium"> Currently tracked</p>
                            <div className="flex gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-xs text-muted-foreground">Live location updates enabled</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
