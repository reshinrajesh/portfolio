"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Music, Mic } from "lucide-react";

interface Event {
    id: string;
    name: string;
    type: "travel" | "concert" | "show" | "other";
    date: string;
    location: string;
    status: "confirmed" | "planning" | "dreaming";
}

const EVENTS: Event[] = [
    {
        id: "1",
        name: "Sunburn Arena NYE - Argy",
        type: "concert",
        date: "31st December 2025",
        location: "Bengaluru, India",
        status: "confirmed",
    },
    {
        id: "2",
        name: "Samay Raina - Still Alive and Unfiltered",
        type: "show",
        date: "17th January 2026",
        location: "Bengaluru, India",
        status: "confirmed",
    },
    {
        id: "3",
        name: "Hanumankind Home Run",
        type: "concert",
        date: "1st February 2026",
        location: "Bengaluru, India",
        status: "confirmed",
    },
];

export default function Events() {
    return (
        <section className="py-20 relative overflow-hidden" id="events">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                            Upcoming Events
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Where I'm going and what I'm seeing next.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                        >
                            <div className="absolute top-4 right-4">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full border ${event.status === "confirmed"
                                        ? "border-green-500/30 text-green-400 bg-green-500/10"
                                        : event.status === "planning"
                                            ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                                            : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                        }`}
                                >
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>

                            <div className="mb-4">
                                {event.type === "concert" ? (
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                                        <Music className="w-5 h-5" />
                                    </div>
                                ) : event.type === "show" ? (
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                                        <Mic className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
