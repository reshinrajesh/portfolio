"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type VibeType = "developer" | "traveler";

interface VibeContextType {
    vibe: VibeType;
    toggleVibe: () => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: React.ReactNode }) {
    const [vibe, setVibe] = useState<VibeType>("developer");

    useEffect(() => {
        // Initialize from localStorage or default
        const savedVibe = localStorage.getItem("site-vibe") as VibeType;
        if (savedVibe) {
            setVibe(savedVibe);
            document.body.setAttribute("data-vibe", savedVibe);
        } else {
            document.body.setAttribute("data-vibe", "developer");
        }
    }, []);

    const toggleVibe = () => {
        const newVibe = vibe === "developer" ? "traveler" : "developer";
        setVibe(newVibe);
        localStorage.setItem("site-vibe", newVibe);
        document.body.setAttribute("data-vibe", newVibe);
    };

    return (
        <VibeContext.Provider value={{ vibe, toggleVibe }}>
            {children}
        </VibeContext.Provider>
    );
}

export function useVibe() {
    const context = useContext(VibeContext);
    if (context === undefined) {
        throw new Error("useVibe must be used within a VibeProvider");
    }
    return context;
}
