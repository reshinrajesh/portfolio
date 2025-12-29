'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane } from 'lucide-react';
import { useState } from 'react';

const LOCATIONS = [
    { id: 1, name: 'Mumbai, IN', x: 74, y: 44, status: 'visited' },
    { id: 2, name: 'Dubai, UAE', x: 68, y: 42, status: 'planned' },
    { id: 3, name: 'London, UK', x: 48, y: 25, status: 'wishlist' },
    { id: 4, name: 'Tokyo, JP', x: 88, y: 38, status: 'planned' },
];

export default function TravelLab() {
    const [locations, setLocations] = useState(LOCATIONS);
    const [activeId, setActiveId] = useState<number | null>(null);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newId = Date.now();
        setLocations(prev => [...prev, {
            id: newId,
            name: 'New Location',
            x,
            y,
            status: 'wishlist'
        }]);
        setActiveId(newId);
    };

    return (
        <div className="relative h-full min-h-[300px] bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden flex flex-col group">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                {/* Abstract Grid Map Background */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            <div className="relative z-10 p-6 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2 bg-white/5 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <Plane size={14} className="text-orange-500" />
                    <span className="text-xs font-mono text-orange-200">WORLD_TRACKER_V2</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    CLICK TO ADD PIN
                </div>
            </div>

            <div
                className="relative flex-1 w-full h-full mt-4 cursor-crosshair"
                onClick={handleMapClick}
            >
                {/* Render Points */}
                <AnimatePresence>
                    {locations.map((loc) => (
                        <motion.div
                            key={loc.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute cursor-pointer group/pin"
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                            onMouseEnter={(e) => { e.stopPropagation(); setActiveId(loc.id); }}
                            onMouseLeave={(e) => { e.stopPropagation(); setActiveId(null); }}
                            onClick={(e) => { e.stopPropagation(); /* Prevent adding new pin when clicking existing */ }}
                        >
                            <span className="relative flex h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loc.status === 'visited' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${loc.status === 'visited' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                            </span>

                            {activeId === loc.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max z-20"
                                >
                                    <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg border border-white/20 shadow-xl backdrop-blur-md">
                                        <p className="font-bold">{loc.name}</p>
                                        <p className="text-[10px] text-white/60 uppercase">{loc.status}</p>
                                    </div>
                                    <div className="w-2 h-2 bg-black/90 border-r border-b border-white/20 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Connection Lines (Cosmetic) - updated to only connect first few to avoid mess */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <path
                        d={`M${locations[0]?.x || 0}% ${locations[0]?.y || 0}% Q 50% 10% ${locations[1]?.x || 0}% ${locations[1]?.y || 0}%`}
                        fill="none"
                        stroke="orange"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                    />
                </svg>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs text-white/40 font-mono">
                    <span>PINS: {locations.length}</span>
                    <span>STATUS: INTERACTIVE</span>
                </div>
            </div>
        </div>
    );
}
