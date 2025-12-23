"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LastFmWidget() {
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
                const res = await fetch('/api/lastfm');
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching Last.fm data", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (!data?.isPlaying) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <Music size={14} className="text-pink-500" />
                <span>Not Listening</span>
            </div>
        );
    }

    return (
        <Link
            href={data?.songUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 hover:border-pink-500/40 transition-all group max-w-xs"
        >
            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                {data.albumImageUrl ? (
                    <Image
                        src={data.albumImageUrl}
                        alt="Album Art"
                        fill
                        className="object-cover animate-spin-slow group-hover:scale-110 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-pink-500/20 flex items-center justify-center">
                        <Music size={16} className="text-pink-500" />
                    </div>
                )}

                {/* Equalizer overlay - Red/Pink themed */}
                <div className="absolute inset-0 flex items-end justify-center gap-[2px] bg-black/20 p-2">
                    <motion.div
                        animate={{ height: [4, 12, 6, 14, 8] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-1 bg-pink-500 rounded-full"
                    />
                    <motion.div
                        animate={{ height: [10, 6, 14, 8, 4] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-1 bg-pink-500 rounded-full"
                    />
                    <motion.div
                        animate={{ height: [6, 14, 8, 4, 10] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="w-1 bg-pink-500 rounded-full"
                    />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate group-hover:text-pink-400 transition-colors">
                    {data.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                    {data.artist}
                </p>
            </div>

            <div className="text-pink-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.586 14.124A1 1 0 0115 17a.997.997 0 01-.793-.386c-.958-1.288-2.67-1.99-4.707-1.99s-3.749.702-4.707 1.99A.997.997 0 014 17a.999.999 0 01-.793-1.614c1.33-1.787 3.75-2.762 6.293-2.762s4.963.975 6.293 2.762a.999.999 0 01-.207 1.341zm1.408-3.08a.996.996 0 01-1.353.284c-1.63-1.025-3.83-1.55-6.055-1.55-2.225 0-4.425.525-6.055 1.55a.996.996 0 11-1.058-1.688C4.502 10.457 7.15 9.878 9.5 9.878s4.998.579 6.848 1.458a1 1 0 01.352 1.354zm1.5-3.56a.998.998 0 01-1.32.32C15.65 8.5 13.5 8 11.5 8s-4.15.5-6.68 1.804a1 1 0 11-.908-1.776C6.73 6.49 9.3 5.922 11.5 5.922s4.77.568 7.68 2.198a1 1 0 01.32 1.32z" />
                </svg>
            </div>
        </Link>
    );
}
