"use client";

import { ThemeProvider } from "next-themes";
import FaroInitializer from "@/components/FaroInitializer";

// Themes the site used to offer. A visitor who picked one still has it in
// localStorage, and next-themes would keep applying a class nothing styles.
const RETIRED_THEMES = ["cyberpunk", "coffee"];

// Runs once when the client bundle evaluates, which is before next-themes
// reads storage. This used to live in an effect that also gated the whole tree
// behind a `mounted` flag -- that made React throw away the server-rendered
// DOM and mount it a second time, and delayed the theme class until after
// hydration, so the wrong theme flashed first.
if (typeof window !== "undefined") {
    try {
        if (RETIRED_THEMES.includes(localStorage.getItem("theme") ?? "")) {
            localStorage.setItem("theme", "dark");
        }

        // The old multi-vibe switcher is gone; drop its key so it stops being
        // read back by anything.
        localStorage.removeItem("site-vibe");
    } catch {
        // Storage can be unavailable (private windows, blocked site data).
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark"]}
        >
            <FaroInitializer />
            {children}
        </ThemeProvider>
    );
}
