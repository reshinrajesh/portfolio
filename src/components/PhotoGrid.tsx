"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X, MapPin } from "lucide-react";

interface Photo {
    id: string;
    src: string;
    alt: string;
    location: string;
    caption?: string;
    width: number; // Aspect ratio helper
    height: number;
}

const PHOTOS: Photo[] = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2000&auto=format&fit=crop",
        alt: "Mumbai City Skyline",
        location: "Mumbai, India",
        width: 4, height: 3
    },
    {
        id: "2",
        src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop",
        alt: "Concert Crowd",
        location: "Coldplay, TBA",
        caption: "Dreaming of the lights",
        width: 3, height: 4
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1626621341139-e3271a20cd78?q=80&w=2000&auto=format&fit=crop",
        alt: "Manali Mountains",
        location: "Manali, Himachal",
        width: 4, height: 5
    },
    {
        id: "4",
        src: "https://images.unsplash.com/photo-1596367407372-96cb2910ce92?q=80&w=2000&auto=format&fit=crop",
        alt: "Kerala Backwaters",
        location: "Alleppey, Kerala",
        width: 3, height: 2
    },
    {
        id: "5",
        src: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop",
        alt: "Surfer at Sunset",
        location: "Gokarna, Karnataka",
        width: 3, height: 4
    },
    {
        id: "6",
        src: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2000&auto=format&fit=crop",
        alt: "Music Festival Vibes",
        location: "Sunburn, Goa",
        width: 4, height: 3
    },
];

export default function PhotoGrid() {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {PHOTOS.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
                    onClick={() => setSelectedPhoto(photo)}
                >
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={800} // Approximate base, object-cover handles the rest if needed, but masonry respects intrinsic ratio usually
                        className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="flex items-center gap-2 text-white/90 text-sm font-medium mb-1">
                                <MapPin size={14} className="text-primary" />
                                {photo.location}
                            </p>
                            {photo.caption && (
                                <p className="text-white/70 text-xs italic">"{photo.caption}"</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <X size={24} />
                    </button>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedPhoto.src}
                            alt={selectedPhoto.alt}
                            fill
                            className="object-contain"
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <span className="inline-block px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm">
                                {selectedPhoto.location}
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
