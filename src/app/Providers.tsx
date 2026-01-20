"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { PlayerProvider } from "@/lib/PlayerContext";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <PlayerProvider>
            {mounted ? (
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                    themes={["light", "dark", "cyberpunk", "coffee"]}
                >
                    {children}
                </ThemeProvider>
            ) : (
                <>{children}</>
            )}
        </PlayerProvider>
    );
}
