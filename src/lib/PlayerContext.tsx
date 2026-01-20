"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type SpotifyData = {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    albumImageUrl?: string;
    songUrl?: string;
};

interface PlayerContextType {
    data: SpotifyData | null;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    isLoading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<SpotifyData | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/spotify');
                if (res.ok) {
                    const spotifyData = await res.json();
                    setData(spotifyData);
                }
            } catch (error) {
                console.error("Error fetching Spotify data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <PlayerContext.Provider value={{ data, isExpanded, setIsExpanded, isLoading }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
