"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        mounted ? (
            <SessionProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                    themes={["light", "dark", "cyberpunk", "coffee"]}
                >
                    {children}
                </ThemeProvider>
            </SessionProvider>
        ) : (
            <>{children}</>
        )
    );
}
