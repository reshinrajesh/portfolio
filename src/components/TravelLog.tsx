"use client";

import { motion } from "framer-motion";
import { Map, MapPin, Navigation, Calendar } from "lucide-react";
import Image from "next/image";

interface Trip {
    id: string;
    place: string;
    date: string;
    description: string;
    tags: string[];
    // photos: string[]; // Future: array of photo URLs
}

const TRIPS: Trip[] = [
    {
        id: "1",
        place: "Manali, Himachal Pradesh",
        date: "Dec 2024",
        description: "Snow-capped mountains, Old Manali vibes, and the best hot chocolate.",
        tags: ["Mountains", "Snow", "Trekking"],
    },
    {
        id: "2",
        place: "Kochi, Kerala",
        date: "Aug 2024",
        description: "Exploring the Fort Kochi streets and the Biennale art scene.",
        tags: ["Culture", "Art", "Beach"],
    },
    {
        id: "3",
        place: "Gokarna, Karnataka",
        date: "Feb 2024",
        description: "Beach trekking and sunset chasing at Kudle Beach.",
        tags: ["Beach", "Trek", "Relax"],
    },
];

export default function TravelLog() {
    return (
        <section id="travel" className="py-24 relative overflow-hidden bg-secondary/5">
            <div className="container mx-auto px-6">
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
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Exploring the world, one city at a time. Collecting memories, not just commit hashes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TRIPS.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-full bg-background border border-border/50 hover:border-orange-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-orange-500/10"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded flex items-center gap-1">
                                    <Calendar size={10} />
                                    {trip.date}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">
                                {trip.place}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-2xl h-full min-h-[200px] text-muted-foreground bg-secondary/5 hover:bg-secondary/10 transition-colors"
                    >
                        <div className="mb-4 p-4 rounded-full bg-secondary">
                            <Navigation size={24} className="opacity-50" />
                        </div>
                        <p className="font-medium">Where to next?</p>
                        <p className="text-xs mt-1">Planning the next adventure...</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
