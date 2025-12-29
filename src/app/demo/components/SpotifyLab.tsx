'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music, Disc, SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpotifyLab() {
    const [data, setData] = useState<{
        isPlaying: boolean;
        title?: string;
        artist?: string;
        albumImageUrl?: string;
        songUrl?: string;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/spotify');
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching Spotify data", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Mock state for demo purposes if nothing is playing
    const displayData = data?.isPlaying ? data : {
        isPlaying: true,
        title: "Midnight City",
        artist: "M83",
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273295c52c9748641904a4313df",
        songUrl: "#"
    };

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-black border border-white/10 p-6 h-full min-h-[300px] flex flex-col justify-between">
            {/* Background Blur */}
            <div
                className="absolute inset-0 opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
                style={{
                    backgroundImage: `url(${displayData.albumImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            <div className="relative z-10 flex justify-between items-start">
                <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                    <Music size={20} />
                </div>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 20, 10] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-1 bg-green-500 rounded-full"
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center mt-6">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl shadow-green-900/50 border-4 border-white/5"
                >
                    <Image
                        src={displayData.albumImageUrl || '/placeholder.png'}
                        alt="Album Art"
                        fill
                        className={`object-cover ${data?.isPlaying ? 'animate-spin-slow' : ''}`}
                        style={{ animationDuration: '10s' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <Link href={displayData.songUrl || '#'} target="_blank">
                            <Play fill="white" className="w-10 h-10 text-white" />
                        </Link>
                    </div>
                </motion.div>

                <div className="text-center mt-6 space-y-1">
                    <h3 className="text-xl font-bold text-white truncate max-w-[200px]">
                        {displayData.title}
                    </h3>
                    <p className="text-sm text-white/50">{displayData.artist}</p>
                </div>
            </div>

            <div className="relative z-10 flex justify-center items-center gap-6 mt-6">
                <SkipBack className="w-6 h-6 text-white/30 hover:text-white transition-colors cursor-pointer" />
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-green-500/30">
                    {data?.isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} className="ml-1" />}
                </div>
                <SkipForward className="w-6 h-6 text-white/30 hover:text-white transition-colors cursor-pointer" />
            </div>
        </div>
    );
}
