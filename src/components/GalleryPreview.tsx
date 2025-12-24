"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";

const PREVIEW_PHOTOS = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=800&auto=format&fit=crop",
        alt: "Mumbai",
        className: "col-span-2 row-span-2"
    },
    {
        id: "2",
        src: "https://images.unsplash.com/photo-1626621341139-e3271a20cd78?q=80&w=800&auto=format&fit=crop",
        alt: "Manali",
        className: "col-span-1 row-span-1"
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop",
        alt: "Concert",
        className: "col-span-1 row-span-1"
    }
];

export default function GalleryPreview() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Text Side */}
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500">
                                    <Camera size={24} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Captured Moments
                                </h2>
                            </div>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Beyond the code, I'm out there chasing sunsets, mountains, and concert lights.
                                Photography is how I freeze the chaos of life into something permanent.
                            </p>

                            <Link href="https://gallery.reshinrajesh.in">
                                <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                                    View Full Gallery
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Image Grid Side */}
                    <div className="md:w-1/2 w-full">
                        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[400px]">
                            {PREVIEW_PHOTOS.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative rounded-2xl overflow-hidden ${photo.className}`}
                                >
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
